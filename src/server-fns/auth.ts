import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { admins } from "@/db/schema";
import { hashPassword, sha256Hex, verifyPassword } from "@/lib/security";
import {
  loginPassword,
  newPassword,
  safeEmail,
  safeToken,
  validateWith,
} from "@/lib/text-validation";
import { createAdminSession, destroyAdminSession } from "@/lib/session.server";
import {
  checkRateLimit,
  clientIp,
  hitRateLimit,
  resetRateLimit,
  type RateLimitRule,
} from "@/lib/rate-limit.server";

const FAILED_ATTEMPT_LIMIT = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const GENERIC_LOGIN_ERROR = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
const GENERIC_INVITE_ERROR = "رابط الإعداد هذا غير صالح أو منتهي الصلاحية.";

// Three layers against password guessing, each covering a gap in the others:
// - LOGIN_IP: every login attempt from one IP, whatever the email. Stops one
//   client from trying many accounts.
// - LOGIN_EMAIL: failed attempts for one email, from any IP, including emails
//   that don't exist (so the "too many attempts" reply can't reveal which
//   emails are real). Stops guessing one account from many IPs.
// - The account lockout columns on `admins` (failedAttempts / lockedUntil).
const LOGIN_IP: RateLimitRule = { scope: "login-ip", limit: 20, windowSeconds: 15 * 60 };
const LOGIN_EMAIL: RateLimitRule = {
  scope: "login-email",
  limit: FAILED_ATTEMPT_LIMIT,
  windowSeconds: LOCKOUT_MS / 1000,
};
const INVITE_IP: RateLimitRule = { scope: "invite-ip", limit: 10, windowSeconds: 15 * 60 };

type Result = { ok: true } | { ok: false; error: string };

function tooManyAttempts(retryAfterSeconds: number): Result {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return {
    ok: false,
    error: `محاولات كثيرة جدًا. الرجاء المحاولة مرة أخرى بعد ${minutes} دقيقة.`,
  };
}

// Checked against when the email has no usable account, so a wrong email
// takes as long as a wrong password and response time doesn't reveal which
// emails belong to admins. Made once per server instance.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword("timing-equaliser-not-a-real-password"));

const loginSchema = z.object({
  email: safeEmail(),
  password: loginPassword(),
  rememberMe: z.boolean().optional().default(false),
});

export const login = createServerFn({ method: "POST" })
  .validator(validateWith(loginSchema))
  .handler(async ({ data }): Promise<Result> => {
    const email = data.email;

    const ipLimit = await hitRateLimit(LOGIN_IP, clientIp());
    if (!ipLimit.allowed) return tooManyAttempts(ipLimit.retryAfterSeconds);

    const emailLimit = await checkRateLimit(LOGIN_EMAIL, email);
    if (!emailLimit.allowed) return tooManyAttempts(emailLimit.retryAfterSeconds);

    const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

    // Same generic error for "doesn't exist", "not active yet", "wrong
    // password" — never reveal which case it was (no user enumeration).
    if (!admin || admin.status !== "active" || admin.passwordHash == null) {
      await verifyPassword(data.password, await getDummyHash());
      await hitRateLimit(LOGIN_EMAIL, email);
      return { ok: false, error: GENERIC_LOGIN_ERROR };
    }

    if (admin.lockedUntil && admin.lockedUntil.getTime() > Date.now()) {
      return tooManyAttempts((admin.lockedUntil.getTime() - Date.now()) / 1000);
    }

    const passwordOk = await verifyPassword(data.password, admin.passwordHash);

    if (!passwordOk) {
      const failedAttempts = admin.failedAttempts + 1;
      const lockedUntil =
        failedAttempts >= FAILED_ATTEMPT_LIMIT ? new Date(Date.now() + LOCKOUT_MS) : null;
      await db
        .update(admins)
        .set({ failedAttempts, lockedUntil, updatedAt: new Date() })
        .where(eq(admins.id, admin.id));
      await hitRateLimit(LOGIN_EMAIL, email);
      return { ok: false, error: GENERIC_LOGIN_ERROR };
    }

    await db
      .update(admins)
      .set({ failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(admins.id, admin.id));
    await resetRateLimit(LOGIN_EMAIL, email);
    await createAdminSession(admin.id, data.rememberMe);

    return { ok: true };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  await destroyAdminSession();
  return { ok: true } as const;
});

export const getCurrentAdmin = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  return context.admin;
});

const acceptInviteSchema = z.object({
  token: safeToken(),
  password: newPassword(),
});

/** Used both for first-time account setup and for peer-assisted password resets. */
export const acceptInvite = createServerFn({ method: "POST" })
  .validator(validateWith(acceptInviteSchema))
  .handler(async ({ data }): Promise<Result> => {
    const ipLimit = await hitRateLimit(INVITE_IP, clientIp());
    if (!ipLimit.allowed) return tooManyAttempts(ipLimit.retryAfterSeconds);

    const tokenHash = await sha256Hex(data.token);
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.setupTokenHash, tokenHash))
      .limit(1);

    if (
      !admin ||
      admin.status === "disabled" ||
      !admin.setupTokenExpiresAt ||
      admin.setupTokenExpiresAt.getTime() < Date.now()
    ) {
      return { ok: false, error: GENERIC_INVITE_ERROR };
    }

    const passwordHash = await hashPassword(data.password);
    await db
      .update(admins)
      .set({
        passwordHash,
        status: "active",
        setupTokenHash: null,
        setupTokenExpiresAt: null,
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(admins.id, admin.id));

    await createAdminSession(admin.id, false);
    return { ok: true };
  });
