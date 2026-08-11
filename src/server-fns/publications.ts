import { createServerFn } from "@tanstack/react-start";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { publications, sections } from "@/db/schema";
import { safeDoi, safeString, safeUrl } from "@/lib/text-validation";
import { requireAdmin } from "./require-admin";
import { logActivity } from "./collection-helpers";

const PUBLICATION_TYPES = [
  "Journal Article",
  "Scientific Book",
  "Conference Paper",
  "Report",
  "Other",
] as const;

const insertSchema = z.object({
  title: safeString(500).min(1),
  titleAr: safeString(500).min(1),
  authors: safeString(500).min(1),
  journal: safeString(300).min(1),
  year: z.number().int().min(1900).max(2100),
  type: z.enum(PUBLICATION_TYPES),
  area: safeString(200).min(1),
  areaAr: safeString(200).optional(),
  doi: safeDoi().optional(),
  url: safeUrl().optional(),
  summary: safeString(5000).optional(),
  featured: z.boolean().optional().default(false),
  status: z.enum(["draft", "published"]).optional().default("draft"),
});
const updateSchema = insertSchema.partial().and(z.object({ id: z.string().uuid() }));
const idSchema = z.object({ id: z.string().uuid() });

async function scrubSectionReferences(deletedId: string) {
  const rows = await db
    .select({ id: sections.id, config: sections.config })
    .from(sections)
    .where(eq(sections.type, "publications-carousel"));
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

export const listPublications = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  return db.select().from(publications).orderBy(asc(publications.sortOrder));
});

export const getPublication = createServerFn({ method: "GET" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    const [row] = await db.select().from(publications).where(eq(publications.id, data.id)).limit(1);
    return row ?? null;
  });

export const createPublication = createServerFn({ method: "POST" })
  .validator(insertSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [row0] = await db
      .select({ maxOrder: sql<number>`coalesce(max(${publications.sortOrder}), -1)` })
      .from(publications);
    const [row] = await db
      .insert(publications)
      .values({ ...data, sortOrder: (row0?.maxOrder ?? -1) + 1 })
      .returning();
    if (!row) throw new Error("Failed to create.");
    await logActivity(admin.id, "created", "publication", row.id, row.title);
    return row;
  });

export const updatePublication = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const { id, ...fields } = data;
    const [row] = await db
      .update(publications)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(publications.id, id))
      .returning();
    if (!row) throw new Error("Not found.");
    await logActivity(admin.id, "updated", "publication", id, row.title);
    return row;
  });

export const deletePublication = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [row] = await db.delete(publications).where(eq(publications.id, data.id)).returning();
    if (row) {
      await logActivity(admin.id, "deleted", "publication", data.id, row.title);
      await scrubSectionReferences(data.id);
    }
    return { ok: true } as const;
  });

export const duplicatePublication = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [original] = await db
      .select()
      .from(publications)
      .where(eq(publications.id, data.id))
      .limit(1);
    if (!original) throw new Error("Not found.");
    const [row0] = await db
      .select({ maxOrder: sql<number>`coalesce(max(${publications.sortOrder}), -1)` })
      .from(publications);
    const [row] = await db
      .insert(publications)
      .values({
        title: `${original.title} (Copy)`,
        titleAr: `${original.titleAr} (نسخة)`,
        authors: original.authors,
        journal: original.journal,
        year: original.year,
        type: original.type,
        area: original.area,
        areaAr: original.areaAr,
        doi: original.doi,
        url: original.url,
        summary: original.summary,
        featured: false,
        status: "draft" as const,
        sortOrder: (row0?.maxOrder ?? -1) + 1,
      })
      .returning();
    if (!row) throw new Error("Failed to duplicate.");
    await logActivity(admin.id, "created", "publication", row.id, row.title);
    return row;
  });
