// One-time migration of src/content/site.ts into the database, plus the 5
// core pages and the sections that reconstruct today's exact homepage/page
// layouts. Safe to run once against an empty database; NOT meant to be
// re-run against a database an admin has since edited (it will refuse to
// run if the `pages` table already has rows — see the guard below).
//
// Usage: npm run db:seed  (runs seed-admins.ts first, then this)
// Or directly: tsx --env-file=.env.local scripts/seed-content.ts

import { db } from "../src/db/client";
import * as schema from "../src/db/schema";
import {
  activities,
  career,
  collaborations,
  education,
  expertise,
  interests,
  languages,
  media,
  memberships,
  profile,
  publicationAreaAr,
  publications,
  recommendations,
  researchSpecialties,
  socialLinks,
  stats,
  summary,
  biography,
} from "../src/content/site";

async function main() {
  const [existingPage] = await db.select({ id: schema.pages.id }).from(schema.pages).limit(1);
  if (existingPage) {
    console.error(
      "Refusing to run: `pages` already has data. This script is a one-time migration, " +
        "not safe to re-run against a database that's since been edited through the admin " +
        "panel (it would duplicate content). If you really want a fresh seed, wipe the " +
        "database first.",
    );
    process.exit(1);
  }

  console.log("Seeding profile...");
  await db.insert(schema.profile).values({
    id: 1,
    name: profile.name,
    nameAr: profile.nameAr,
    credentials: profile.credentials,
    credentialsAr: profile.credentialsAr,
    title: profile.title,
    titleAr: profile.titleAr,
    tagline: profile.tagline,
    taglineAr: profile.taglineAr,
    location: profile.location,
    locationAr: profile.locationAr,
    email: profile.email,
    phone: profile.phone,
    primaryCtaLabel: profile.primaryCta.label,
    primaryCtaLabelAr: profile.primaryCta.labelAr,
    primaryCtaTo: profile.primaryCta.to,
    secondaryCtaLabel: profile.secondaryCta.label,
    secondaryCtaLabelAr: profile.secondaryCta.labelAr,
    secondaryCtaTo: profile.secondaryCta.to,
  });

  console.log("Seeding site settings...");
  await db.insert(schema.siteSettings).values({
    id: 1,
    siteName: profile.name,
    siteNameAr: profile.nameAr,
    siteDescription: profile.tagline,
    siteDescriptionAr: profile.taglineAr,
    defaultMetaTitle: "Dr. Hani Mahmoud Zahran",
    defaultMetaTitleAr: "د. هاني محمود زهران",
    defaultMetaDescription:
      "Professional portfolio of Dr. Hani Mahmoud Zahran, applied geophysics and seismology.",
    defaultMetaDescriptionAr:
      "الموقع المهني للدكتور هاني محمود زهران، الجيوفيزياء التطبيقية وعلم الزلازل.",
    footerDescription: "Geophysicist & Seismologist",
    footerDescriptionAr: "جيوفيزيائي وعالم زلازل",
    copyrightText: "All rights reserved.",
    copyrightTextAr: "جميع الحقوق محفوظة.",
  });

  console.log("Seeding stats...");
  await db
    .insert(schema.stats)
    .values(
      stats.map((s, i) => ({ label: s.label, labelAr: s.labelAr, value: s.value, sortOrder: i })),
    );

  console.log("Seeding career entries...");
  await db.insert(schema.careerEntries).values(
    career.map((c, i) => ({
      position: c.position,
      positionAr: c.positionAr,
      organization: c.organization,
      organizationAr: c.organizationAr,
      startLabel: c.start,
      endLabel: c.end,
      description: c.description ?? null,
      descriptionAr: c.descriptionAr ?? null,
      sortOrder: i,
    })),
  );

  console.log("Seeding collaborations...");
  await db.insert(schema.collaborations).values(
    collaborations.map((c, i) => ({
      position: c.position,
      positionAr: c.positionAr,
      organization: c.organization,
      organizationAr: c.organizationAr,
      startLabel: c.start,
      endLabel: c.end,
      description: c.description ?? null,
      descriptionAr: c.descriptionAr ?? null,
      sortOrder: i,
    })),
  );

  console.log("Seeding expertise...");
  await db
    .insert(schema.expertiseItems)
    .values(expertise.map((e, i) => ({ en: e.en, ar: e.ar, sortOrder: i })));

  console.log("Seeding education...");
  await db.insert(schema.educationEntries).values(
    education.map((e, i) => ({
      degree: e.degree,
      degreeAr: e.degreeAr,
      field: e.field,
      fieldAr: e.fieldAr,
      university: e.university,
      universityAr: e.universityAr,
      location: e.location,
      locationAr: e.locationAr,
      year: e.year,
      description: e.description ?? null,
      descriptionAr: e.descriptionAr ?? null,
      sortOrder: i,
    })),
  );

  console.log("Seeding research specialties...");
  await db
    .insert(schema.researchSpecialties)
    .values(researchSpecialties.map((r, i) => ({ en: r.en, ar: r.ar, sortOrder: i })));

  console.log("Seeding memberships...");
  await db.insert(schema.memberships).values(
    memberships.map((m, i) => ({
      title: m.title,
      titleAr: m.titleAr,
      period: m.period ?? null,
      sortOrder: i,
    })),
  );

  console.log("Seeding activities...");
  await db
    .insert(schema.activities)
    .values(activities.map((a, i) => ({ en: a.en, ar: a.ar, sortOrder: i })));

  console.log("Seeding languages...");
  await db
    .insert(schema.languagesList)
    .values(languages.map((l, i) => ({ en: l.en, ar: l.ar, sortOrder: i })));

  console.log("Seeding interests...");
  await db
    .insert(schema.interests)
    .values(interests.map((it, i) => ({ en: it.en, ar: it.ar, sortOrder: i })));

  console.log("Seeding social links...");
  await db
    .insert(schema.socialLinks)
    .values(socialLinks.map((s, i) => ({ label: s.label, url: s.url, sortOrder: i })));

  console.log(`Seeding ${publications.length} publications...`);
  const insertedPublications = await db
    .insert(schema.publications)
    .values(
      publications.map((p, i) => ({
        title: p.title,
        titleAr: p.titleAr,
        authors: p.authors,
        journal: p.journal,
        year: p.year,
        type: p.type,
        area: p.area,
        areaAr: publicationAreaAr[p.area] ?? null,
        doi: p.doi ?? null,
        url: p.url ?? null,
        summary: p.summary ?? null,
        featured: p.featured ?? false,
        status: "published" as const,
        sortOrder: i,
      })),
    )
    .returning({ id: schema.publications.id });
  // Postgres preserves VALUES order in a multi-row INSERT...RETURNING, so
  // zipping by index against the source array is safe and gives us a
  // legacy-id -> new-uuid map for the homepage carousel's itemIds below.
  const publicationIdMap = new Map(publications.map((p, i) => [p.id, insertedPublications[i]?.id]));

  console.log(`Seeding ${media.length} media items...`);
  const insertedMedia = await db
    .insert(schema.mediaItems)
    .values(
      media.map((m, i) => ({
        title: m.title,
        titleAr: m.titleAr ?? null,
        source: m.source,
        dateLabel: m.date,
        type: m.type,
        description: m.description ?? null,
        videoUrl: m.videoUrl ?? null,
        articleUrl: m.articleUrl ?? null,
        thumbnail: m.thumbnail ?? null,
        featured: m.featured ?? false,
        status: "published" as const,
        sortOrder: i,
      })),
    )
    .returning({ id: schema.mediaItems.id });
  const mediaIdMap = new Map(media.map((m, i) => [m.id, insertedMedia[i]?.id]));

  console.log(`Seeding ${recommendations.length} recommendations...`);
  const insertedRecommendations = await db
    .insert(schema.recommendations)
    .values(
      recommendations.map((r, i) => ({
        name: r.name,
        position: r.position,
        organization: r.organization,
        body: r.text,
        dateLabel: r.date ?? null,
        featured: r.featured ?? false,
        status: "published" as const,
        sortOrder: i,
      })),
    )
    .returning({ id: schema.recommendations.id });
  const recommendationIdMap = new Map(
    recommendations.map((r, i) => [r.id, insertedRecommendations[i]?.id]),
  );

  const featuredPublicationIds = publications
    .filter((p) => p.featured)
    .map((p) => publicationIdMap.get(p.id))
    .filter((id): id is string => Boolean(id));
  const featuredMediaIds = media
    .filter((m) => m.featured)
    .map((m) => mediaIdMap.get(m.id))
    .filter((id): id is string => Boolean(id));
  const featuredRecommendationIds = recommendations
    .filter((r) => r.featured)
    .slice(0, 3)
    .map((r) => recommendationIdMap.get(r.id))
    .filter((id): id is string => Boolean(id));

  console.log("Seeding pages & sections...");

  async function seedPage(input: {
    path: string;
    title: string;
    titleAr: string;
    navLabel: string;
    navLabelAr: string;
    sortOrder: number;
    metaTitle: string;
    metaDescription: string;
    sectionRows: Array<{
      type: (typeof schema.sectionTypeEnum.enumValues)[number];
      config?: Record<string, unknown>;
    }>;
  }) {
    const [page] = await db
      .insert(schema.pages)
      .values({
        path: input.path,
        title: input.title,
        titleAr: input.titleAr,
        navLabel: input.navLabel,
        navLabelAr: input.navLabelAr,
        showInNav: true,
        isCore: true,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        status: "published",
        sortOrder: input.sortOrder,
      })
      .returning({ id: schema.pages.id });
    if (!page) throw new Error(`Failed to insert page ${input.path}`);

    if (input.sectionRows.length > 0) {
      await db.insert(schema.sections).values(
        input.sectionRows.map((s, i) => ({
          pageId: page.id,
          type: s.type,
          config: s.config ?? {},
          visible: true,
          sortOrder: i,
        })),
      );
    }
  }

  await seedPage({
    path: "/",
    title: "Home",
    titleAr: "الرئيسية",
    navLabel: "Home",
    navLabelAr: "الرئيسية",
    sortOrder: 0,
    metaTitle: "Dr. Hani Mahmoud Zahran — Geophysicist & Seismologist",
    metaDescription:
      "Portfolio of Dr. Hani Mahmoud Zahran: research in seismology, seismic hazard assessment, volcanology and disaster risk reduction.",
    sectionRows: [
      { type: "hero" },
      { type: "summary", config: { contentEn: summary } },
      { type: "stats-row" },
      { type: "career-timeline", config: { showCollaborations: true } },
      { type: "expertise-grid" },
      { type: "publications-carousel", config: { itemIds: featuredPublicationIds } },
      { type: "media-carousel", config: { itemIds: featuredMediaIds } },
      { type: "recommendations-grid", config: { itemIds: featuredRecommendationIds } },
    ],
  });

  await seedPage({
    path: "/about",
    title: "About Me",
    titleAr: "نبذة عني",
    navLabel: "About Me",
    navLabelAr: "نبذة عني",
    sortOrder: 1,
    metaTitle: "About — Dr. Hani Mahmoud Zahran",
    metaDescription:
      "Biography, education, experience, research specialties, memberships and scientific activities of Dr. Hani Mahmoud Zahran.",
    sectionRows: [
      { type: "rich-text", config: { contentEn: biography } },
      { type: "education-grid" },
      { type: "experience-timeline" },
      { type: "list-block", config: { collection: "researchSpecialties" } },
      { type: "memberships-list" },
      { type: "list-block", config: { collection: "activities" } },
      { type: "list-block", config: { collection: "languagesList" } },
      { type: "list-block", config: { collection: "interests" } },
    ],
  });

  await seedPage({
    path: "/publications",
    title: "Publications",
    titleAr: "المنشورات",
    navLabel: "Publications",
    navLabelAr: "المنشورات",
    sortOrder: 2,
    metaTitle: "Publications — Dr. Hani Mahmoud Zahran",
    metaDescription:
      "Research, studies and scientific contributions spanning geophysics, seismology, seismic hazards and geological sciences by Dr. Hani Mahmoud Zahran.",
    sectionRows: [{ type: "publications-full-list" }],
  });

  await seedPage({
    path: "/interviews",
    title: "Interviews & Articles",
    titleAr: "لقاءات ومقالات",
    navLabel: "Interviews & Articles",
    navLabelAr: "لقاءات ومقالات",
    sortOrder: 3,
    metaTitle: "Interviews & Articles — Dr. Hani Mahmoud Zahran",
    metaDescription:
      "Media appearances, interviews, video features and articles by and about Dr. Hani Mahmoud Zahran.",
    sectionRows: [{ type: "media-full-grid" }],
  });

  await seedPage({
    path: "/contact",
    title: "Contact",
    titleAr: "تواصل",
    navLabel: "Contact",
    navLabelAr: "تواصل",
    sortOrder: 4,
    metaTitle: "Contact — Dr. Hani Mahmoud Zahran",
    metaDescription:
      "Get in touch with Dr. Hani Mahmoud Zahran for research collaboration, advisory work or speaking engagements.",
    sectionRows: [{ type: "contact-block" }],
  });

  console.log("\nSeed complete.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
