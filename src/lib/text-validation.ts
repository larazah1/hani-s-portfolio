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

const UNSAFE_CHARS_MESSAGE =
  "Contains characters that aren't allowed (< > ` \\ |). / يحتوي على أحرف غير مسموح بها.";

/** Max lengths shared by the forms (client) and the validators (server). */
export const EMAIL_MAX = 320;
export const PASSWORD_MIN = 10;
/** Caps the work PBKDF2 does per request; long passphrases still fit. */
export const PASSWORD_MAX = 256;
/** Caps list inputs like "reorder these ids" so one request can't be huge. */
export const ID_LIST_MAX = 1000;

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

/**
 * One line of text (names, subjects, labels): same rules as `safeString`,
 * plus no line breaks, so it can't add lines to an email header or log.
 */
export function safeLine(maxLength: number, minLength = 0) {
  return safeString(maxLength, minLength).refine((v) => !/[\r\n]/.test(v), {
    message: "Must be a single line.",
  });
}

/** An email address: trimmed, lowercased, at most EMAIL_MAX characters. */
export function safeEmail() {
  return z
    .string()
    .trim()
    .max(EMAIL_MAX, `Must be ${EMAIL_MAX} characters or fewer.`)
    .email("Must be a valid email address.")
    .transform((v) => v.toLowerCase());
}

/** A password to check at login (no minimum: old passwords must still work). */
export function loginPassword() {
  return z.string().min(1).max(PASSWORD_MAX, `Must be ${PASSWORD_MAX} characters or fewer.`);
}

/** A new password being set. */
export function newPassword() {
  return z
    .string()
    .min(PASSWORD_MIN, `يجب أن تتكون كلمة المرور من ${PASSWORD_MIN} أحرف على الأقل.`)
    .max(PASSWORD_MAX, `يجب ألا تزيد كلمة المرور عن ${PASSWORD_MAX} حرفًا.`);
}

/** A list of row ids, e.g. the new order after drag-and-drop. */
export function uuidList() {
  return z.array(z.string().uuid()).max(ID_LIST_MAX);
}

/**
 * Client-side pre-check for a whole form: the first key whose string value
 * isn't safe text, or null. Mirrors the server rule so people see which field
 * is wrong before sending.
 */
export function findUnsafeField(values: Record<string, unknown>): string | null {
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string" && value !== "" && !isSafeText(value)) return key;
  }
  return null;
}

/** Arabic message for the admin forms when `findUnsafeField` finds a field. */
export function unsafeFieldMessage(field: string): string {
  return `الحقل «${field}» يحتوي على أحرف غير مسموح بها (< > \` \\ |).`;
}

/**
 * Wraps a Zod schema as a server-function validator whose error message is
 * readable ("field: reason") instead of a JSON dump of every Zod issue. The
 * admin forms show this message as-is.
 */
export function validateWith<T extends z.ZodTypeAny>(schema: T) {
  return (input: z.input<T>): z.output<T> => {
    const result = schema.safeParse(input);
    if (result.success) return result.data;
    const issue = result.error.issues[0];
    const field = issue?.path.join(".");
    throw new Error(field ? `«${field}»: ${issue?.message}` : (issue?.message ?? "Invalid input."));
  };
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
