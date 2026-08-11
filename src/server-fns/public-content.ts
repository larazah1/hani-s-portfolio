import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import {
  activities,
  careerEntries,
  collaborations,
  educationEntries,
  expertiseItems,
  interests,
  languagesList,
  mediaItems,
  memberships,
  pageViewCounts,
  pages,
  profile,
  publications,
  recommendations,
  researchSpecialties,
  sections,
  siteSettings,
  socialLinks,
  stats,
} from "@/db/schema";

export const getSiteChrome = createServerFn({ method: "GET" }).handler(async () => {
  const [profileRow] = await db.select().from(profile).where(eq(profile.id, 1)).limit(1);
  const [settingsRow] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  const navPages = await db
    .select({
      path: pages.path,
      title: pages.title,
      titleAr: pages.titleAr,
      navLabel: pages.navLabel,
      navLabelAr: pages.navLabelAr,
    })
    .from(pages)
    .where(and(eq(pages.showInNav, true), eq(pages.status, "published")))
    .orderBy(asc(pages.sortOrder));
  const socialLinkRows = await db
    .select({ label: socialLinks.label, url: socialLinks.url })
    .from(socialLinks)
    .orderBy(asc(socialLinks.sortOrder));

  if (!profileRow || !settingsRow) {
    throw new Error("Site is not fully set up yet (missing profile or settings row).");
  }

  return { profile: profileRow, settings: settingsRow, navPages, socialLinks: socialLinkRows };
});

const LIST_BLOCK_TABLES = {
  researchSpecialties,
  activities,
  languagesList,
  interests,
} as const;

async function resolveSectionData(section: typeof sections.$inferSelect) {
  const config = section.config ?? {};

  switch (section.type) {
    case "hero":
    case "contact-block":
    case "recommendation-form":
      return null;

    case "summary": {
      const [currentRole] = await db
        .select()
        .from(careerEntries)
        .orderBy(asc(careerEntries.sortOrder))
        .limit(1);
      return { currentRole: currentRole ?? null };
    }

    case "rich-text":
      return null;

    case "stats-row":
      return db.select().from(stats).orderBy(asc(stats.sortOrder));

    case "career-timeline": {
      const career = await db.select().from(careerEntries).orderBy(asc(careerEntries.sortOrder));
      const showCollaborations = config["showCollaborations"] !== false;
      const collabRows = showCollaborations
        ? await db.select().from(collaborations).orderBy(asc(collaborations.sortOrder))
        : [];
      return { career, collaborations: collabRows };
    }

    case "experience-timeline":
      return db.select().from(careerEntries).orderBy(asc(careerEntries.sortOrder));

    case "expertise-grid":
      return db.select().from(expertiseItems).orderBy(asc(expertiseItems.sortOrder));

    case "education-grid":
      return db.select().from(educationEntries).orderBy(asc(educationEntries.sortOrder));

    case "memberships-list":
      return db.select().from(memberships).orderBy(asc(memberships.sortOrder));

    case "list-block": {
      const collectionName = (config["collection"] as string) ?? "researchSpecialties";
      const table =
        LIST_BLOCK_TABLES[collectionName as keyof typeof LIST_BLOCK_TABLES] ?? researchSpecialties;
      return db.select().from(table).orderBy(asc(table.sortOrder));
    }

    case "publications-carousel": {
      const itemIds = Array.isArray(config["itemIds"]) ? (config["itemIds"] as string[]) : [];
      if (itemIds.length > 0) {
        const rows = await db.select().from(publications).where(inArray(publications.id, itemIds));
        const byId = new Map(rows.map((r) => [r.id, r]));
        return itemIds.map((id) => byId.get(id)).filter((r) => r !== undefined);
      }
      return db
        .select()
        .from(publications)
        .where(and(eq(publications.featured, true), eq(publications.status, "published")))
        .orderBy(asc(publications.sortOrder));
    }

    case "media-carousel": {
      const itemIds = Array.isArray(config["itemIds"]) ? (config["itemIds"] as string[]) : [];
      if (itemIds.length > 0) {
        const rows = await db.select().from(mediaItems).where(inArray(mediaItems.id, itemIds));
        const byId = new Map(rows.map((r) => [r.id, r]));
        return itemIds.map((id) => byId.get(id)).filter((r) => r !== undefined);
      }
      return db
        .select()
        .from(mediaItems)
        .where(and(eq(mediaItems.featured, true), eq(mediaItems.status, "published")))
        .orderBy(asc(mediaItems.sortOrder));
    }

    case "recommendations-grid": {
      const itemIds = Array.isArray(config["itemIds"]) ? (config["itemIds"] as string[]) : [];
      if (itemIds.length > 0) {
        const rows = await db
          .select()
          .from(recommendations)
          .where(inArray(recommendations.id, itemIds));
        const byId = new Map(rows.map((r) => [r.id, r]));
        return itemIds.map((id) => byId.get(id)).filter((r) => r !== undefined);
      }
      // Unlike the publications/media carousels, there's no separate "full
      // list" page for recommendations — this carousel is the only place
      // they're ever shown, so every published one belongs here regardless
      // of `featured` (that flag would otherwise silently hide approved
      // public submissions, since new submissions never start out featured).
      return db
        .select()
        .from(recommendations)
        .where(eq(recommendations.status, "published"))
        .orderBy(asc(recommendations.sortOrder));
    }

    case "publications-full-list":
      return db
        .select()
        .from(publications)
        .where(eq(publications.status, "published"))
        .orderBy(asc(publications.sortOrder));

    case "media-full-grid":
      return db
        .select()
        .from(mediaItems)
        .where(eq(mediaItems.status, "published"))
        .orderBy(asc(mediaItems.sortOrder));

    default:
      return null;
  }
}

export const getPageByPath = createServerFn({ method: "GET" })
  .validator(z.object({ path: z.string() }))
  .handler(async ({ data }) => {
    const [page] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.path, data.path), eq(pages.status, "published")))
      .limit(1);
    if (!page) return null;

    await db
      .insert(pageViewCounts)
      .values({ path: data.path, count: 1 })
      .onConflictDoUpdate({
        target: pageViewCounts.path,
        set: { count: sql`${pageViewCounts.count} + 1`, updatedAt: new Date() },
      });

    const rawSections = await db
      .select()
      .from(sections)
      .where(and(eq(sections.pageId, page.id), eq(sections.visible, true)))
      .orderBy(asc(sections.sortOrder));

    const resolvedSections = await Promise.all(
      rawSections.map(async (section) => ({
        ...section,
        data: await resolveSectionData(section),
      })),
    );

    const [profileRow] = await db.select().from(profile).where(eq(profile.id, 1)).limit(1);
    const socialLinkRows = await db
      .select({ label: socialLinks.label, url: socialLinks.url })
      .from(socialLinks)
      .orderBy(asc(socialLinks.sortOrder));

    return {
      page,
      sections: resolvedSections,
      profile: profileRow ?? null,
      socialLinks: socialLinkRows,
    };
  });
