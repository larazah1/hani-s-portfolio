import { createServerFn } from "@tanstack/react-start";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { logActivity } from "./collection-helpers";
import { requireAdmin } from "./require-admin";

const submitContactMessageSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(300),
  message: z.string().trim().min(1).max(5000),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator(submitContactMessageSchema)
  .handler(async ({ data }) => {
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
  .validator(setMessageStatusSchema)
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
  .validator(deleteMessageSchema)
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
