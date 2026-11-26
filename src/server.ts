import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

// Sent with every response (pages, server functions, error pages).
// - CSP: no plugins (<object>/<embed>), no <base> hijacking, forms may only
//   post to this site, and only this site may frame its pages (stops
//   clickjacking). script-src isn't restricted because the framework's
//   hydration uses inline scripts; React's escaping is what prevents XSS.
// - nosniff: browsers won't run an uploaded/served file as a different type.
const isProduction = process.env["NODE_ENV"] === "production";
const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": [
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    ...(isProduction ? ["upgrade-insecure-requests"] : []),
  ].join("; "),
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  ...(isProduction ? { "Strict-Transport-Security": "max-age=31536000" } : {}),
};

function withSecurityHeaders(request: Request, response: Response): Response {
  // Rebuild the response: headers on some responses are immutable.
  const out = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!out.headers.has(name)) out.headers.set(name, value);
  }
  if (new URL(request.url).pathname.startsWith("/admin")) {
    // Admin pages hold private data: don't cache them or index them.
    out.headers.set("Cache-Control", "no-store");
    out.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return out;
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// The public website is a separate app (zahran-portal); this app is only the
// admin panel. When PUBLIC_SITE_URL is set (e.g. https://example.com), page
// requests outside /admin are sent there, so this app's own copy of the
// public pages is never served or indexed. Server functions, built assets
// and files (anything with an extension) are left alone. Unset (local dev):
// no redirect.
function publicSiteRedirect(request: Request): Response | null {
  const target = process.env["PUBLIC_SITE_URL"];
  if (!target || (request.method !== "GET" && request.method !== "HEAD")) return null;
  const url = new URL(request.url);
  const path = url.pathname;
  if (
    path === "/admin" ||
    path.startsWith("/admin/") ||
    path.startsWith("/_serverFn") ||
    path.startsWith("/assets/") ||
    /\.[a-z0-9]+$/i.test(path)
  ) {
    return null;
  }
  let site: URL;
  try {
    site = new URL(target);
  } catch {
    console.error("PUBLIC_SITE_URL is not a valid URL; not redirecting.");
    return null;
  }
  if (site.host === url.host) return null; // never redirect to itself
  // Temporary (307), so browsers don't cache it if the setup changes.
  return Response.redirect(new URL(path + url.search, site).toString(), 307);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const redirect = publicSiteRedirect(request);
      if (redirect) return withSecurityHeaders(request, redirect);
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withSecurityHeaders(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return withSecurityHeaders(
        request,
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
