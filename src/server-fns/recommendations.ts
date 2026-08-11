import { createServerFn } from "@tanstack/react-start";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { recommendations, sections } from "@/db/schema";
import { safeString } from "@/lib/text-validation";
import { requireAdmin } from "./require-admin";
import { logActivity } from "./collection-helpers";

const insertSchema = z.object({
  name: safeString(200).min(1),
  position: safeString(200).min(1),
  organization: safeString(200).optional().default(""),
  body: safeString(5000).min(1),
  dateLabel: safeString(100).optional(),
  featured: z.boolean().optional().default(false),
  status: z.enum(["draft", "published"]).optional().default("draft"),
});
const updateSchema = insertSchema.partial().and(z.object({ id: z.string().uuid() }));
const idSchema = z.object({ id: z.string().uuid() });

async function scrubSectionReferences(deletedId: string) {
  const rows = await db
    .select({ id: sections.id, config: sections.config })
    .from(sections)
    .where(eq(sections.type, "recommendations-grid"));
  for (const row of rows) {
    const config = row.config as { itemIds?: string[] };
    if (config.itemIds?.includes(deletedId)) {
      await db
        .update(sections)
        .set({ config: { ...config, itemIds: config.itemIds.filter((id) => id !== deletedId) } })
        .where(eq(sections.id, row.id));
    }
  }
}

export const listRecommendations = createServerFn({ method: "GET" }).handler(
  async ({ context }) => {
    requireAdmin(context);
    return db.select().from(recommendations).orderBy(asc(recommendations.sortOrder));
  },
);

export const getRecommendation = createServerFn({ method: "GET" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    const [row] = await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.id, data.id))
      .limit(1);
    return row ?? null;
  });

export const createRecommendation = createServerFn({ method: "POST" })
  .validator(insertSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [row0] = await db
      .select({ maxOrder: sql<number>`coalesce(max(${recommendations.sortOrder}), -1)` })
      .from(recommendations);
    const [row] = await db
      .insert(recommendations)
      .values({ ...data, sortOrder: (row0?.maxOrder ?? -1) + 1 })
      .returning();
    if (!row) throw new Error("Failed to create.");
    await logActivity(admin.id, "created", "recommendation", row.id, row.name);
    return row;
  });

export const updateRecommendation = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const { id, ...fields } = data;
    const [row] = await db
      .update(recommendations)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(recommendations.id, id))
      .returning();
    if (!row) throw new Error("Not found.");
    await logActivity(admin.id, "updated", "recommendation", id, row.name);
    return row;
  });

export const deleteRecommendation = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [row] = await db
      .delete(recommendations)
      .where(eq(recommendations.id, data.id))
      .returning();
    if (row) {
      await logActivity(admin.id, "deleted", "recommendation", data.id, row.name);
      await scrubSectionReferences(data.id);
    }
    return { ok: true } as const;
  });

export const reorderRecommendations = createServerFn({ method: "POST" })
  .validator(z.object({ orderedIds: z.array(z.string().uuid()) }))
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    await db.transaction(async (tx) => {
      for (const [index, id] of data.orderedIds.entries()) {
        await tx
          .update(recommendations)
          .set({ sortOrder: index })
          .where(eq(recommendations.id, id));
      }
    });
    return { ok: true } as const;
  });
