import { createServerFn } from "@tanstack/react-start";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { mediaItems, sections } from "@/db/schema";
import { safeString, safeUrl } from "@/lib/text-validation";
import { requireAdmin } from "./require-admin";
import { logActivity } from "./collection-helpers";

const MEDIA_TYPES = ["Interview", "Article", "Video", "News Feature", "Other"] as const;

const insertSchema = z.object({
  title: safeString(500).min(1),
  titleAr: safeString(500).optional(),
  source: safeString(200).min(1),
  dateLabel: safeString(100).min(1),
  type: z.enum(MEDIA_TYPES),
  description: safeString(5000).optional(),
  videoUrl: safeUrl().optional(),
  articleUrl: safeUrl().optional(),
  thumbnail: safeUrl().optional(),
  featured: z.boolean().optional().default(false),
  status: z.enum(["draft", "published"]).optional().default("draft"),
});
const updateSchema = insertSchema.partial().and(z.object({ id: z.string().uuid() }));
const idSchema = z.object({ id: z.string().uuid() });

async function scrubSectionReferences(deletedId: string) {
  const rows = await db
    .select({ id: sections.id, config: sections.config })
    .from(sections)
    .where(eq(sections.type, "media-carousel"));
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

export const listMedia = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  return db.select().from(mediaItems).orderBy(asc(mediaItems.sortOrder));
});

export const getMediaItem = createServerFn({ method: "GET" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    const [row] = await db.select().from(mediaItems).where(eq(mediaItems.id, data.id)).limit(1);
    return row ?? null;
  });

export const createMediaItem = createServerFn({ method: "POST" })
  .validator(insertSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [row0] = await db
      .select({ maxOrder: sql<number>`coalesce(max(${mediaItems.sortOrder}), -1)` })
      .from(mediaItems);
    const [row] = await db
      .insert(mediaItems)
      .values({ ...data, sortOrder: (row0?.maxOrder ?? -1) + 1 })
      .returning();
    if (!row) throw new Error("Failed to create.");
    await logActivity(admin.id, "created", "media_item", row.id, row.title);
    return row;
  });

export const updateMediaItem = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const { id, ...fields } = data;
    const [row] = await db
      .update(mediaItems)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(mediaItems.id, id))
      .returning();
    if (!row) throw new Error("Not found.");
    await logActivity(admin.id, "updated", "media_item", id, row.title);
    return row;
  });

export const deleteMediaItem = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [row] = await db.delete(mediaItems).where(eq(mediaItems.id, data.id)).returning();
    if (row) {
      await logActivity(admin.id, "deleted", "media_item", data.id, row.title);
      await scrubSectionReferences(data.id);
    }
    return { ok: true } as const;
  });

export const duplicateMediaItem = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [original] = await db
      .select()
      .from(mediaItems)
      .where(eq(mediaItems.id, data.id))
      .limit(1);
    if (!original) throw new Error("Not found.");
    const [row0] = await db
      .select({ maxOrder: sql<number>`coalesce(max(${mediaItems.sortOrder}), -1)` })
      .from(mediaItems);
    const [row] = await db
      .insert(mediaItems)
      .values({
        title: `${original.title} (Copy)`,
        titleAr: original.titleAr,
        source: original.source,
        dateLabel: original.dateLabel,
        type: original.type,
        description: original.description,
        videoUrl: original.videoUrl,
        articleUrl: original.articleUrl,
        thumbnail: original.thumbnail,
        featured: false,
        status: "draft" as const,
        sortOrder: (row0?.maxOrder ?? -1) + 1,
      })
      .returning();
    if (!row) throw new Error("Failed to duplicate.");
    await logActivity(admin.id, "created", "media_item", row.id, row.title);
    return row;
  });
