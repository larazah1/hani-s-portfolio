import { createServerFn } from "@tanstack/react-start";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { safeEmail, safeLine, safeString, validateWith } from "@/lib/text-validation";
import { clientIp, hitRateLimit, type RateLimitRule } from "@/lib/rate-limit.server";
import { logActivity } from "./collection-helpers";
import { requireAdmin } from "./require-admin";

/** Public form: a few messages per visitor per hour is plenty for real people. */
const CONTACT_IP: RateLimitRule = { scope: "contact-ip", limit: 5, windowSeconds: 60 * 60 };

const submitContactMessageSchema = z.object({
  name: safeLine(200, 1),
  email: safeEmail(),
  subject: safeLine(300, 1),
  message: safeString(5000, 1),
  /** Hidden "website" field: people leave it empty, spam bots fill it in. */
  website: z.string().max(500).optional(),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator(validateWith(submitContactMessageSchema))
  .handler(async ({ data: { website, ...data } }) => {
    // Spam bot: report success, store nothing.
    if (website) return { ok: true } as const;
    const limit = await hitRateLimit(CONTACT_IP, clientIp());
    if (!limit.allowed) throw new Error("Too many messages. Please try again later.");
    await db.insert(contactMessages).values(data);
    return { ok: true } as const;
  });

export const listContactMessages = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    requireAdmin(context);
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  },
);

export const getUnreadMessageCount = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    requireAdmin(context);
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactMessages)
      .where(eq(contactMessages.status, "unread"));
    return row?.count ?? 0;
  },
);

const setMessageStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["unread", "read"]),
});

export const setMessageStatus = createServerFn({ method: "POST" })
  .validator(validateWith(setMessageStatusSchema))
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    await db
      .update(contactMessages)
      .set({ status: data.status })
      .where(eq(contactMessages.id, data.id));
    return { ok: true } as const;
  });

const deleteMessageSchema = z.object({ id: z.string().uuid() });

export const deleteContactMessage = createServerFn({ method: "POST" })
  .validator(validateWith(deleteMessageSchema))
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [row] = await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, data.id))
      .returning();
    if (row) {
      await logActivity(admin.id, "deleted", "contact-message", row.id, `Message from ${row.name}`);
    }
    return { ok: true } as const;
  });
