import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { profile } from "@/db/schema";
import { safePath, safePhone, safeString } from "@/lib/text-validation";
import { requireAdmin } from "./require-admin";
import { logActivity } from "./collection-helpers";

const updateSchema = z.object({
  name: safeString(200).min(1),
  nameAr: safeString(200).min(1),
  credentials: safeString(200).min(1),
  credentialsAr: safeString(200).min(1),
  title: safeString(300).min(1),
  titleAr: safeString(300).min(1),
  tagline: safeString(500).min(1),
  taglineAr: safeString(500).min(1),
  location: safeString(200).min(1),
  locationAr: safeString(200).min(1),
  email: z.string().trim().max(200).email(),
  phone: safePhone(),
  primaryCtaLabel: safeString(100).min(1),
  primaryCtaLabelAr: safeString(100).min(1),
  primaryCtaTo: safePath(),
  secondaryCtaLabel: safeString(100).min(1),
  secondaryCtaLabelAr: safeString(100).min(1),
  secondaryCtaTo: safePath(),
});

export const getProfile = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  requireAdmin(context);
  const [row] = await db.select().from(profile).where(eq(profile.id, 1)).limit(1);
  return row ?? null;
});

export const updateProfile = createServerFn({ method: "POST" })
  .validator(updateSchema)
  .handler(async ({ data, context }) => {
    const admin = requireAdmin(context);
    const [row] = await db
      .update(profile)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profile.id, 1))
      .returning();
    if (!row) throw new Error("Profile row missing.");
    await logActivity(admin.id, "updated", "profile", null, "Updated profile & hero");
    return row;
  });
