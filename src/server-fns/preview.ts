// Decides whether a linked page can be shown inside the preview overlay.
// Many news sites forbid being framed (X-Frame-Options / CSP frame-ancestors);
// for those the overlay shows a summary card instead of a broken frame.
import { createServerFn } from "@tanstack/react-start";
import { and, eq, or } from "drizzle-orm";
import { db } from "@/db/client";
import { mediaItems, publications } from "@/db/schema";

function framingAllowed(headers: Headers) {
  if (headers.get("x-frame-options")) return false;
  const csp = headers.get("content-security-policy") ?? "";
  const fa = /frame-ancestors([^;]*)/i.exec(csp)?.[1]?.trim();
  return !fa || fa === "*";
}

export const checkEmbeddable = createServerFn({ method: "GET" })
  .validator((url: unknown) => {
    if (typeof url !== "string" || !/^https:\/\//.test(url) || url.length > 2000) {
      throw new Error("Invalid URL");
    }
    return url;
  })
  .handler(async ({ data: url }) => {
    // Only check links that are actually published on the site, so this can't
    // be used to make the server fetch arbitrary addresses.
    const inMedia = await db
      .select({ id: mediaItems.id })
      .from(mediaItems)
      .where(
        and(
          eq(mediaItems.status, "published"),
          or(eq(mediaItems.videoUrl, url), eq(mediaItems.articleUrl, url)),
        ),
      )
      .limit(1);
    const doi = url.startsWith("https://doi.org/") ? url.slice("https://doi.org/".length) : null;
    const known = inMedia.length
      ? inMedia
      : await db
          .select({ id: publications.id })
          .from(publications)
          .where(
            and(
              eq(publications.status, "published"),
              doi
                ? or(eq(publications.url, url), eq(publications.doi, doi))
                : eq(publications.url, url),
            ),
          )
          .limit(1);
    if (!known.length) return false;

    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(5000),
        headers: { "user-agent": "Mozilla/5.0 (compatible; link-preview)" },
      });
      void res.body?.cancel();
      return res.ok && framingAllowed(res.headers);
    } catch {
      return false;
    }
  });
