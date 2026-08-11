import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "./require-admin";
import { logActivity } from "./collection-helpers";

const updateSchema = z.object({
  siteName: z.string().min(1),
  siteNameAr: z.string().min(1),
  siteDescription: z.string().min(1),
  siteDescriptionAr: z.string().min(1),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  defaultMetaTitle: z.string().min(1),
  defaultMetaTitleAr: z.string().min(1),
  defaultMetaDescription: z.string().min(1),
  defaultMetaDescriptionAr: z.string().min(1),
  ogImageUrl: z.string().optional(),
  footerDescription: z.string().min(1),
  footerDescriptionAr: z.string().min(1),
  copyrightText: z.string().min(1),
  copyrightTextAr: z.string().min(1),
});

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  return row ?? null;
});

export const updateSiteSettings = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [row] = await db
      .update(siteSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(siteSettings.id, 1))
      .returning();
    if (!row) throw new Error("Site settings row missing.");
    await logActivity(admin.id, "updated", "site_settings", null, "Updated website settings");
    return row;
  });
