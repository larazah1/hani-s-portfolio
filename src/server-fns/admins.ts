import { createServerFn } from "@tanstack/react-start";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { admins } from "@/db/schema";
import { generateToken, sha256Hex } from "@/lib/security";
import { requireAdmin } from "./require-admin";

const SETUP_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const listAdmins = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  return db
    .select({
      id: admins.id,
      email: admins.email,
      status: admins.status,
      lastLoginAt: admins.lastLoginAt,
      createdAt: admins.createdAt,
      invitedBy: admins.invitedBy,
    })
    .from(admins)
    .orderBy(admins.createdAt);
});

type InviteResult = { ok: true; setupPath: string } | { ok: false; error: string };

const inviteAdminSchema = z.object({ email: z.string().trim().email() });

export const inviteAdmin = createServerFn({ method: "POST" })
  .validator(inviteAdminSchema)
  .handler(async ({ data, context }): Promise<InviteResult> => {
    const current = requireAdmin(context);
    const email = data.email.toLowerCase();

    const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    if (existing && existing.status !== "pending") {
      return { ok: false, error: "An admin with this email already exists." };
    }

    const token = generateToken();
    const setupTokenHash = await sha256Hex(token);
    const setupTokenExpiresAt = new Date(Date.now() + SETUP_TOKEN_TTL_MS);

    if (existing) {
      await db
        .update(admins)
        .set({ setupTokenHash, setupTokenExpiresAt, updatedAt: new Date() })
        .where(eq(admins.id, existing.id));
    } else {
      await db.insert(admins).values({
        email,
        status: "pending",
        setupTokenHash,
        setupTokenExpiresAt,
        invitedBy: current.id,
      });
    }

    return { ok: true, setupPath: `/admin/setup?token=${token}` };
  });

type Result = { ok: true } | { ok: false; error: string };

const setAdminStatusSchema = z.object({
  adminId: z.string().uuid(),
  status: z.enum(["active", "disabled"]),
});

export const setAdminStatus = createServerFn({ method: "POST" })
  .validator(setAdminStatusSchema)
  .handler(async ({ data, context }): Promise<Result> => {
    const current = requireAdmin(context);

    const [target] = await db.select().from(admins).where(eq(admins.id, data.adminId)).limit(1);
    if (!target || target.status === "pending") {
      return { ok: false, error: "Admin not found or hasn't completed setup yet." };
    }

    if (data.status === "disabled") {
      if (data.adminId === current.id) {
        return { ok: false, error: "You cannot disable your own account." };
      }
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(admins)
        .where(eq(admins.status, "active"));
      if ((row?.count ?? 0) <= 1) {
        return { ok: false, error: "Cannot disable the last remaining active admin." };
      }
    }

    await db
      .update(admins)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(admins.id, data.adminId));
    return { ok: true };
  });

const resetAdminPasswordSchema = z.object({ adminId: z.string().uuid() });

export const resetAdminPassword = createServerFn({ method: "POST" })
  .validator(resetAdminPasswordSchema)
  .handler(async ({ data, context }): Promise<InviteResult> => {
    requireAdmin(context);

    const [target] = await db.select().from(admins).where(eq(admins.id, data.adminId)).limit(1);
    if (!target) return { ok: false, error: "Admin not found." };

    const token = generateToken();
    const setupTokenHash = await sha256Hex(token);
    const setupTokenExpiresAt = new Date(Date.now() + SETUP_TOKEN_TTL_MS);
    await db
      .update(admins)
      .set({ setupTokenHash, setupTokenExpiresAt, updatedAt: new Date() })
      .where(eq(admins.id, data.adminId));

    return { ok: true, setupPath: `/admin/setup?token=${token}` };
  });
