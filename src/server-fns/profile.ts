import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { profile } from "@/db/schema";
import { requireAdmin } from "./require-admin";
import { logActivity } from "./collection-helpers";

const updateSchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().min(1),
  credentials: z.string().min(1),
  credentialsAr: z.string().min(1),
  title: z.string().min(1),
  titleAr: z.string().min(1),
  tagline: z.string().min(1),
  taglineAr: z.string().min(1),
  location: z.string().min(1),
  locationAr: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  primaryCtaLabelAr: z.string().min(1),
  primaryCtaTo: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  secondaryCtaLabelAr: z.string().min(1),
  secondaryCtaTo: z.string().min(1),
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
