import "@tanstack/react-start/server-only";

import { clearSession, getSession, updateSession } from "@tanstack/react-start/server";

type AdminSessionData = { adminId: string };

const SESSION_NAME = "zahran_admin_session";
// A single constant maxAge is used for every session config call (create,
// read, clear). h3's session expiry check re-validates `maxAge` on every
// read against the session's original createdAt — if create and read used
// different maxAge values, a "remember me" session could be incorrectly
// treated as expired by a later read that used the shorter default. Keeping
// this one constant everywhere avoids that mismatch entirely.
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days (hard cap)

function sessionSecret(): string {
  const secret = process.env["SESSION_SECRET"];
  if (!secret) {
    throw new Error("SESSION_SECRET is not set. Copy .env.example to .env.local and fill it in.");
  }
  return secret;
}

// `CookieSerializeOptions.expires` is typed as `Date` (no `| undefined`) even
// though the underlying serializer treats an explicit `undefined` as "omit
// this attribute" at runtime — that's exactly what we need below to cancel
// out the library's own computed `expires`, so the mismatch is bridged with
// a narrow, deliberate cast rather than fighting the upstream type.
const NO_EXPIRES = { expires: undefined } as unknown as { expires: Date };

function sessionConfig(options: { persistCookie: boolean }) {
  return {
    password: sessionSecret(),
    name: SESSION_NAME,
    maxAge: SESSION_MAX_AGE_SECONDS,
    // "Remember me" unchecked: make the cookie a browser session cookie
    // (dropped on browser close) instead of a persistent one, by forcing
    // `expires` back off after the library's own default computation. The
    // sealed token itself is still capped at SESSION_MAX_AGE_SECONDS either
    // way, so this only affects browser-side persistence, not validation.
    ...(options.persistCookie ? {} : { cookie: NO_EXPIRES }),
  };
}

export async function createAdminSession(adminId: string, rememberMe: boolean): Promise<void> {
  await updateSession<AdminSessionData>(sessionConfig({ persistCookie: rememberMe }), {
    adminId,
  });
}

export async function getAdminSessionAdminId(): Promise<string | null> {
  const session = await getSession<AdminSessionData>(sessionConfig({ persistCookie: true }));
  return session.data.adminId ?? null;
}

export async function destroyAdminSession(): Promise<void> {
  await clearSession(sessionConfig({ persistCookie: true }));
}
