import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { admins } from "@/db/schema";
import { hashPassword, sha256Hex, verifyPassword } from "@/lib/security";
import { safeToken } from "@/lib/text-validation";
import { createAdminSession, destroyAdminSession } from "@/lib/session.server";

const FAILED_ATTEMPT_LIMIT = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const GENERIC_LOGIN_ERROR = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
const GENERIC_INVITE_ERROR = "رابط الإعداد هذا غير صالح أو منتهي الصلاحية.";

type Result = { ok: true } | { ok: false; error: string };

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false),
});

export const login = createServerFn({ method: "POST" })
  .validator(loginSchema)
  .handler(async ({ data }): Promise<Result> => {
    const email = data.email.toLowerCase();
    const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

    // Same generic error for "doesn't exist", "not active yet", "wrong
    // password" — never reveal which case it was (no user enumeration).
    if (!admin || admin.status !== "active") {
      return { ok: false, error: GENERIC_LOGIN_ERROR };
    }

    if (admin.lockedUntil && admin.lockedUntil.getTime() > Date.now()) {
      return { ok: false, error: "محاولات فاشلة كثيرة جدًا. الرجاء المحاولة مرة أخرى بعد دقائق." };
    }

    const passwordOk =
      admin.passwordHash != null && (await verifyPassword(data.password, admin.passwordHash));

    if (!passwordOk) {
      const failedAttempts = admin.failedAttempts + 1;
      const lockedUntil =
        failedAttempts >= FAILED_ATTEMPT_LIMIT ? new Date(Date.now() + LOCKOUT_MS) : null;
      await db
        .update(admins)
        .set({ failedAttempts, lockedUntil, updatedAt: new Date() })
        .where(eq(admins.id, admin.id));
      return { ok: false, error: GENERIC_LOGIN_ERROR };
    }

    await db
      .update(admins)
      .set({ failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(admins.id, admin.id));
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
  password: z.string().min(10, "يجب أن تتكون كلمة المرور من 10 أحرف على الأقل."),
});

/** Used both for first-time account setup and for peer-assisted password resets. */
export const acceptInvite = createServerFn({ method: "POST" })
  .validator(acceptInviteSchema)
  .handler(async ({ data }): Promise<Result> => {
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

