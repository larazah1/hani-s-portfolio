// Idempotent import of the publications and media from the public site repo
// (see scripts/public-content-data.ts). Safe to run against the live database:
// it only INSERTs items whose title isn't already there (new items go to the
// end of the list), and only fills a missing interview thumbnail. It never
// overwrites or deletes anything an admin has edited.
//
// Usage: npm run db:import-public
// Or directly: tsx --env-file=.env.local scripts/import-public-content.ts

import { and, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "../src/db/client";
import * as schema from "../src/db/schema";
import { importedMedia, importedPublications, interviewThumbnails } from "./public-content-data";

const norm = (s: string) => s.trim().replace(/\s+/g, " ");

async function main() {
  // Publications
  const existingPubs = await db
    .select({ title: schema.publications.title })
    .from(schema.publications);
  const pubTitles = new Set(existingPubs.map((r) => norm(r.title)));
  const [pubMax] = await db
    .select({ max: sql<number>`coalesce(max(${schema.publications.sortOrder}), -1)` })
    .from(schema.publications);
  const newPubs = importedPublications.filter((p) => !pubTitles.has(norm(p.title)));
  if (newPubs.length > 0) {
    await db.insert(schema.publications).values(
      newPubs.map((p, i) => ({
        ...p,
        status: "published" as const,
        sortOrder: Number(pubMax?.max ?? -1) + 1 + i,
      })),
    );
  }
  console.log(
    `Publications: ${newPubs.length} inserted, ${importedPublications.length - newPubs.length} already present.`,
  );

  // Media
  const existingMedia = await db.select({ title: schema.mediaItems.title }).from(schema.mediaItems);
  const mediaTitles = new Set(existingMedia.map((r) => norm(r.title)));
  const [mediaMax] = await db
    .select({ max: sql<number>`coalesce(max(${schema.mediaItems.sortOrder}), -1)` })
    .from(schema.mediaItems);
  const newMedia = importedMedia.filter((m) => !mediaTitles.has(norm(m.title)));
  if (newMedia.length > 0) {
    await db.insert(schema.mediaItems).values(
      newMedia.map((m, i) => ({
        ...m,
        status: "published" as const,
        sortOrder: Number(mediaMax?.max ?? -1) + 1 + i,
      })),
    );
  }
  console.log(
    `Media: ${newMedia.length} inserted, ${importedMedia.length - newMedia.length} already present.`,
  );

  // Interview thumbnails: fill only where the admin hasn't set one.
  let filled = 0;
  for (const { videoUrl, thumbnail } of interviewThumbnails) {
    const rows = await db
      .update(schema.mediaItems)
      .set({ thumbnail, updatedAt: new Date() })
      .where(
        and(
          eq(schema.mediaItems.videoUrl, videoUrl),
          or(isNull(schema.mediaItems.thumbnail), eq(schema.mediaItems.thumbnail, "")),
        ),
      )
      .returning({ id: schema.mediaItems.id });
    filled += rows.length;
  }
  console.log(`Interview thumbnails: ${filled} filled.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
