import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { pages, sections } from "@/db/schema";
import { SECTION_TYPES } from "@/lib/section-types";
import { safeJsonRecord, safePath, safeString } from "@/lib/text-validation";
import { requireAdmin } from "./require-admin";
import { logActivity } from "./collection-helpers";

const idSchema = z.object({ id: z.string().uuid() });

export const listPages = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  return db.select().from(pages).orderBy(asc(pages.sortOrder));
});

export const listPublicPages = createServerFn({ method: "GET" }).handler(async () => {
  return db
    .select({
      path: pages.path,
      title: pages.title,
      titleAr: pages.titleAr,
      navLabel: pages.navLabel,
      navLabelAr: pages.navLabelAr,
    })
    .from(pages)
    .where(eq(pages.showInNav, true))
    .orderBy(asc(pages.sortOrder));
});

export const getPageForEdit = createServerFn({ method: "GET" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    const [page] = await db.select().from(pages).where(eq(pages.id, data.id)).limit(1);
    if (!page) return null;
    const pageSections = await db
      .select()
      .from(sections)
      .where(eq(sections.pageId, data.id))
      .orderBy(asc(sections.sortOrder));
    return { page, sections: pageSections };
  });

const updatePageSchema = z.object({
  id: z.string().uuid(),
  path: safePath().optional(),
  title: safeString(200, 1).optional(),
  titleAr: safeString(200, 1).optional(),
  navLabel: safeString(100).optional(),
  navLabelAr: safeString(100).optional(),
  showInNav: z.boolean().optional(),
  metaTitle: safeString(300).optional(),
  metaTitleAr: safeString(300).optional(),
  metaDescription: safeString(500).optional(),
  metaDescriptionAr: safeString(500).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const updatePage = createServerFn({ method: "POST" })
  .validator(updatePageSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const { id, ...fields } = data;
    const [existing] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
    if (!existing) throw new Error("العنصر غير موجود.");
    if (existing.isCore && fields.path && fields.path !== existing.path) {
      throw new Error("لا يمكن تغيير مسار الصفحات الأساسية.");
    }
    const [row] = await db
      .update(pages)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    if (!row) throw new Error("العنصر غير موجود.");
    await logActivity(admin.id, "updated", "page", id, row.title);
    return row;
  });

export const deletePage = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [existing] = await db.select().from(pages).where(eq(pages.id, data.id)).limit(1);
    if (!existing) return { ok: true } as const;
    if (existing.isCore) throw new Error("لا يمكن حذف الصفحات الأساسية.");
    await db.delete(pages).where(eq(pages.id, data.id));
    await logActivity(admin.id, "deleted", "page", data.id, existing.title);
    return { ok: true } as const;
  });

const sectionTypeSchema = z.enum(SECTION_TYPES);

const addSectionSchema = z.object({
  pageId: z.string().uuid(),
  type: sectionTypeSchema,
});

export const addSection = createServerFn({ method: "POST" })
  .validator(addSectionSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const existing = await db
      .select({ sortOrder: sections.sortOrder })
      .from(sections)
      .where(eq(sections.pageId, data.pageId));
    const maxOrder = existing.reduce((max, s) => Math.max(max, s.sortOrder), -1);
    const [row] = await db
      .insert(sections)
      .values({ pageId: data.pageId, type: data.type, config: {}, sortOrder: maxOrder + 1 })
      .returning();
    if (!row) throw new Error("فشلت إضافة القسم.");
    await logActivity(admin.id, "created", "section", row.id, `Added ${data.type} section`);
    return row;
  });

const updateSectionSchema = z.object({
  id: z.string().uuid(),
  eyebrow: safeString(200).optional(),
  eyebrowAr: safeString(200).optional(),
  title: safeString(200).optional(),
  titleAr: safeString(200).optional(),
  config: safeJsonRecord().optional(),
  visible: z.boolean().optional(),
});

export const updateSection = createServerFn({ method: "POST" })
  .validator(updateSectionSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const { id, ...fields } = data;
    const [row] = await db
      .update(sections)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(sections.id, id))
      .returning();
    if (!row) throw new Error("العنصر غير موجود.");
    await logActivity(admin.id, "updated", "section", id, `Updated ${row.type} section`);
    return row;
  });

export const deleteSection = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [row] = await db.delete(sections).where(eq(sections.id, data.id)).returning();
    if (row) {
      await logActivity(admin.id, "deleted", "section", data.id, `Deleted ${row.type} section`);
    }
    return { ok: true } as const;
  });

const reorderSectionsSchema = z.object({
  pageId: z.string().uuid(),
  orderedIds: z.array(z.string().uuid()),
});

export const reorderSections = createServerFn({ method: "POST" })
  .validator(reorderSectionsSchema)
  .handler(async ({ data, context }) => {
    requireAdmin(context);
    await db.transaction(async (tx) => {
      for (const [index, id] of data.orderedIds.entries()) {
        await tx.update(sections).set({ sortOrder: index }).where(eq(sections.id, id));
      }
    });
    return { ok: true } as const;
  });
