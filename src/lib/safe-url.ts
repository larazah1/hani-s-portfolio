// Render-time guards for URLs that come from the database. Input validation
// already only accepts http(s)/mailto links, but rows can also arrive through
// seed/import scripts, so every link rendered from data passes through here
// too. A `javascript:` or `data:` URL in an href, src, or iframe would run
// script in the site's origin; these return undefined for anything else.

const LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/** For <a href>: http(s), mailto, tel, or a same-site path like "/about". */
export function safeHref(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const value = url.trim();
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    return LINK_PROTOCOLS.has(new URL(value).protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

/** For <img src> and <iframe src>: absolute https only, or a same-site path. */
export function safeMediaSrc(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const value = url.trim();
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    return new URL(value).protocol === "https:" ? value : undefined;
  } catch {
    return undefined;
  }
}

/**
 * For the preview iframe, which runs the framed page with scripts and its own
 * origin (sandbox allow-scripts + allow-same-origin). That is only safe for a
 * page on another site, so this accepts https URLs on other hosts only.
 */
export function safeFrameSrc(url: string | null | undefined): string | undefined {
  const value = safeMediaSrc(url);
  if (!value || value.startsWith("/")) return undefined;
  if (typeof window !== "undefined" && new URL(value).origin === window.location.origin) {
    return undefined;
  }
  return value;
}
