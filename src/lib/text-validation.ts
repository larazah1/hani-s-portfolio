import { z } from "zod";

// Character allowlists for every free-text field across the public site and
// admin panel. SQL injection itself is already structurally impossible here
// (every query goes through Drizzle's parameterized query builder — see the
// audit in project notes), so this isn't what makes queries safe. It's a
// deliberate extra layer requested on top of that.
//
// This allows every Unicode letter/mark/number/punctuation/symbol (any
// script — Arabic included, with its own digits, decimal separator, and
// punctuation, not just Latin) plus whitespace, and rejects only control
// characters, invisible "format" characters (used for homograph/spoofing
// tricks), and a small explicit blocklist of characters associated with
// injection/templating attacks that would otherwise slip through the broad
// punctuation/symbol categories (backtick, backslash, angle brackets, pipe).
// An earlier version hand-picked individual punctuation marks instead of
// using the Unicode categories, which is exactly what silently broke on
// legitimate Arabic text (the Arabic decimal separator "٫" isn't a "number"
// or "letter" by Unicode's own classification, and wasn't in the hand-picked
// list) — categories are what to reach for instead of enumerating symbols.
const BROAD_ALLOWED_PATTERN = /^[\p{L}\p{M}\p{N}\p{P}\p{S}\s]*$/u;
const DANGEROUS_CHARS_PATTERN = /[`\\<>|]/;

export function isSafeText(value: string): boolean {
  return BROAD_ALLOWED_PATTERN.test(value) && !DANGEROUS_CHARS_PATTERN.test(value);
}

const PATH_PATTERN = /^\/[a-z0-9-]*$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]*$/;
const DOI_PATTERN = /^10\.\d{4,9}\/[A-Za-z0-9.\-_:;()/]+$/;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const UNSAFE_CHARS_MESSAGE = "Contains characters that aren't allowed.";

/**
 * Free text (names, titles, bios, messages) — English or Arabic, any length
 * up to `maxLength`. Pass `minLength` for required fields (default 0, i.e.
 * optional) — `.min()`/`.max()` have to happen before `.refine()` here since
 * `.refine()` returns a `ZodEffects` that no longer exposes `.min()` for
 * callers to chain on afterward.
 */
export function safeString(maxLength: number, minLength = 0) {
  return z
    .string()
    .trim()
    .min(minLength, "This field is required.")
    .max(maxLength, `Must be ${maxLength} characters or fewer.`)
    .refine(isSafeText, { message: UNSAFE_CHARS_MESSAGE });
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}

/**
 * A fully-qualified URL (logo/thumbnail/social/article links, etc). Blank
 * is always allowed too — these fields are optional in every form that uses
 * them, and the forms send `""` rather than omitting the key when empty.
 */
export function safeUrl(maxLength = 2048) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .refine((v) => v === "" || isValidUrl(v), { message: "Must be a valid URL." });
}

/** A DOI, e.g. 10.1000/xyz123. Blank is allowed (DOI is optional). */
export function safeDoi(maxLength = 200) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .refine((v) => v === "" || DOI_PATTERN.test(v), {
      message: "Must be a valid DOI (e.g. 10.1000/xyz123).",
    });
}

/** An internal site path, e.g. /about or /publications. */
export function safePath(maxLength = 200) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .regex(PATH_PATTERN, "Path must start with / and use lowercase letters, numbers, and dashes.");
}

/** A phone number: digits, spaces, parentheses, dashes, optional leading +. */
export function safePhone(maxLength = 40) {
  return z.string().trim().max(maxLength).regex(PHONE_PATTERN, "Must be a valid phone number.");
}

/** A one-time setup/reset token — our own tokens are always base64url. */
export function safeToken(maxLength = 200) {
  return z.string().trim().max(maxLength).regex(TOKEN_PATTERN, "Invalid token.");
}

/**
 * Recursively finds the first string value inside an arbitrary JSON value
 * that isn't a UUID and isn't safe text, returning a dotted path to it (or
 * null if everything's clean). Used for jsonb `config` blobs (section
 * config) whose shape varies by section type but which can hold free text
 * (e.g. a "summary" section's paragraph list).
 */
export function findUnsafeJsonText(value: unknown, path: string[] = []): string | null {
  if (typeof value === "string") {
    if (value === "" || UUID_PATTERN.test(value) || isSafeText(value)) return null;
    return path.join(".") || "value";
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const bad = findUnsafeJsonText(value[i], [...path, String(i)]);
      if (bad) return bad;
    }
    return null;
  }
  if (value !== null && typeof value === "object") {
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      const bad = findUnsafeJsonText(v, [...path, key]);
      if (bad) return bad;
    }
    return null;
  }
  return null;
}

/** A jsonb record (like a section's `config`) with every string leaf checked. */
export function safeJsonRecord() {
  return z.record(z.string(), z.unknown()).superRefine((config, ctx) => {
    const badPath = findUnsafeJsonText(config);
    if (badPath) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Contains characters that aren't allowed (near "${badPath}").`,
      });
    }
  });
}
