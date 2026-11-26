import "@tanstack/react-start/server-only";

import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

// Admin login session, stored in one encrypted, HttpOnly cookie.
//
// TanStack Start 1.169 removed its built-in getSession/updateSession/
// clearSession helpers, so the session is sealed here with Web Crypto:
// AES-256-GCM (encrypts and authenticates) with a key derived from
// SESSION_SECRET. A cookie that was tampered with, sealed with another
// secret, or older than SESSION_MAX_AGE_SECONDS reads as "no session".

type AdminSessionData = { adminId: string; createdAt: number };

const SESSION_NAME = "zahran_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days (hard cap)

function sessionSecret(): string {
  const secret = process.env["SESSION_SECRET"];
  if (!secret) {
    throw new Error("SESSION_SECRET is not set. Copy .env.example to .env.local and fill it in.");
  }
  return secret;
}

let keyPromise: Promise<CryptoKey> | undefined;
let keyFor: string | undefined;

function sessionKey(): Promise<CryptoKey> {
  const secret = sessionSecret();
  if (!keyPromise || keyFor !== secret) {
    keyFor = secret;
    keyPromise = (async () => {
      const raw = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        "HKDF",
        false,
        ["deriveKey"],
      );
      return crypto.subtle.deriveKey(
        {
          name: "HKDF",
          hash: "SHA-256",
          salt: new TextEncoder().encode(SESSION_NAME),
          info: new TextEncoder().encode("admin-session-v1"),
        },
        raw,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"],
      );
    })();
  }
  return keyPromise;
}

const toB64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromB64Url = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function seal(data: AdminSessionData): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await sessionKey(),
    new TextEncoder().encode(JSON.stringify(data)),
  );
  return `${toB64Url(iv)}.${toB64Url(new Uint8Array(cipher))}`;
}

async function unseal(token: string): Promise<AdminSessionData | null> {
  try {
    const [iv, body] = token.split(".");
    if (!iv || !body) return null;
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromB64Url(iv) },
      await sessionKey(),
      fromB64Url(body),
    );
    const data = JSON.parse(new TextDecoder().decode(plain)) as Partial<AdminSessionData>;
    if (typeof data.adminId !== "string" || typeof data.createdAt !== "number") return null;
    if (Date.now() - data.createdAt > SESSION_MAX_AGE_SECONDS * 1000) return null;
    return { adminId: data.adminId, createdAt: data.createdAt };
  } catch {
    return null;
  }
}

const baseCookie = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env["NODE_ENV"] === "production",
};

/**
 * "Remember me" checked: a persistent cookie for up to 30 days.
 * Unchecked: a browser-session cookie (dropped when the browser closes); the
 * sealed token is still capped at 30 days either way.
 */
export async function createAdminSession(adminId: string, rememberMe: boolean): Promise<void> {
  const token = await seal({ adminId, createdAt: Date.now() });
  setCookie(SESSION_NAME, token, {
    ...baseCookie,
    ...(rememberMe ? { maxAge: SESSION_MAX_AGE_SECONDS } : {}),
  });
}

export async function getAdminSessionAdminId(): Promise<string | null> {
  const token = getCookie(SESSION_NAME);
  if (!token) return null;
  const data = await unseal(token);
  return data?.adminId ?? null;
}

export async function destroyAdminSession(): Promise<void> {
  deleteCookie(SESSION_NAME, { path: "/" });
}
