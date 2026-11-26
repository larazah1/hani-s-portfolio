import "@tanstack/react-start/server-only";

import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { eq, lt, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { rateLimits } from "@/db/schema";
import { sha256Hex } from "@/lib/security";

// Fixed-window rate limiting stored in Postgres, so the count is shared by
// every server instance (in-memory counters reset per serverless instance and
// would barely slow an attacker down). One upsert per hit, atomic in Postgres:
// it either starts a new window or adds one to the current one.

export type RateLimitRule = {
  /** What is being limited, e.g. "login-ip". Part of the stored key. */
  scope: string;
  /** Hits allowed per window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
};

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

const ALLOWED: RateLimitResult = { allowed: true, retryAfterSeconds: 0 };

/** Keys store a hash of the identifier (IP, email), never the raw value. */
async function keyFor(rule: RateLimitRule, identifier: string): Promise<string> {
  return `${rule.scope}:${await sha256Hex(identifier.trim().toLowerCase())}`;
}

/** SQL condition: the stored row's window has already ended. */
function windowExpired(windowSeconds: number) {
  return sql`${rateLimits.windowStart} <= now() - (${windowSeconds}::int * interval '1 second')`;
}

function retryAfter(windowStart: Date, windowSeconds: number): number {
  const ends = windowStart.getTime() + windowSeconds * 1000;
  return Math.max(1, Math.ceil((ends - Date.now()) / 1000));
}

/**
 * Counts one hit and says whether it is within the limit. If the database
 * call fails (e.g. the rate_limits migration hasn't been run yet), this
 * allows the request and logs the error: per-account lockout still applies
 * to logins, and a limiter outage shouldn't lock every admin out.
 */
export async function hitRateLimit(
  rule: RateLimitRule,
  identifier: string,
): Promise<RateLimitResult> {
  try {
    const key = await keyFor(rule, identifier);
    const expired = windowExpired(rule.windowSeconds);
    const [row] = await db
      .insert(rateLimits)
      .values({ key, count: 1, windowStart: sql`now()` })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: {
          count: sql`case when ${expired} then 1 else ${rateLimits.count} + 1 end`,
          windowStart: sql`case when ${expired} then now() else ${rateLimits.windowStart} end`,
        },
      })
      .returning({ count: rateLimits.count, windowStart: rateLimits.windowStart });

    // Occasionally sweep rows whose window ended long ago.
    if (Math.random() < 0.01) {
      await db
        .delete(rateLimits)
        .where(lt(rateLimits.windowStart, sql`now() - interval '1 day'`))
        .catch(() => {});
    }

    if (!row || row.count <= rule.limit) return ALLOWED;
    return { allowed: false, retryAfterSeconds: retryAfter(row.windowStart, rule.windowSeconds) };
  } catch (error) {
    console.error(`Rate limiter unavailable (${rule.scope}); allowing request.`, error);
    return ALLOWED;
  }
}

/** Says whether the limit is already used up, without counting a hit. */
export async function checkRateLimit(
  rule: RateLimitRule,
  identifier: string,
): Promise<RateLimitResult> {
  try {
    const key = await keyFor(rule, identifier);
    const [row] = await db
      .select({ count: rateLimits.count, windowStart: rateLimits.windowStart })
      .from(rateLimits)
      .where(eq(rateLimits.key, key))
      .limit(1);
    if (!row) return ALLOWED;
    const ended = row.windowStart.getTime() + rule.windowSeconds * 1000 <= Date.now();
    if (ended || row.count < rule.limit) return ALLOWED;
    return { allowed: false, retryAfterSeconds: retryAfter(row.windowStart, rule.windowSeconds) };
  } catch (error) {
    console.error(`Rate limiter unavailable (${rule.scope}); allowing request.`, error);
    return ALLOWED;
  }
}

/** Clears a counter, e.g. the per-email failure count after a good login. */
export async function resetRateLimit(rule: RateLimitRule, identifier: string): Promise<void> {
  try {
    await db.delete(rateLimits).where(eq(rateLimits.key, await keyFor(rule, identifier)));
  } catch (error) {
    console.error(`Rate limiter unavailable (${rule.scope}); could not reset.`, error);
  }
}

/**
 * The visitor's IP, read only from the header the hosting platform itself
 * sets (and overwrites if the client sent one). Headers from other platforms
 * are ignored, since there the client can forge them:
 * - Vercel: x-real-ip
 * - Cloudflare Workers: cf-connecting-ip
 * - anything else (e.g. Node behind nginx): first x-forwarded-for entry,
 *   then the socket address. If the app is exposed with no proxy in front,
 *   x-forwarded-for can be forged; the per-account login limit still holds.
 */
export function clientIp(): string {
  const onVercel = Boolean(process.env["VERCEL"]);
  const onCloudflare =
    typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
  const fromPlatform = onVercel
    ? getRequestHeader("x-real-ip")
    : onCloudflare
      ? getRequestHeader("cf-connecting-ip")
      : getRequestHeader("x-forwarded-for")?.split(",", 1)[0];
  const ip = fromPlatform?.trim() || getRequestIP() || "unknown";
  return ip.slice(0, 100);
}
