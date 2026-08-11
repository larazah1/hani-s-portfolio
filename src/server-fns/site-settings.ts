import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { safeString, safeUrl } from "@/lib/text-validation";
import { requireAdmin } from "./require-admin";
import { logActivity } from "./collection-helpers";

const updateSchema = z.object({
  siteName: safeString(200, 1),
  siteNameAr: safeString(200, 1),
  siteDescription: safeString(500, 1),
  siteDescriptionAr: safeString(500, 1),
  logoUrl: safeUrl().optional(),
  faviconUrl: safeUrl().optional(),
  defaultMetaTitle: safeString(300, 1),
  defaultMetaTitleAr: safeString(300, 1),
  defaultMetaDescription: safeString(500, 1),
  defaultMetaDescriptionAr: safeString(500, 1),
  ogImageUrl: safeUrl().optional(),
  footerDescription: safeString(1000, 1),
  footerDescriptionAr: safeString(1000, 1),
  copyrightText: safeString(300, 1),
  copyrightTextAr: safeString(300, 1),
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
    if (!row) throw new Error("سجل إعدادات الموقع غير موجود.");
    await logActivity(admin.id, "updated", "site_settings", null, "Updated website settings");
    return row;
  });
