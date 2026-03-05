/**
 * Cookie configuration constants for auth tokens.
 * Shared across all BFF proxy routes.
 */

import crypto from "crypto"

// ─── M1: Production startup guard for placeholder secrets ───
const COOKIE_SECRET = process.env.AUTH_COOKIE_SECRET || ""
const IS_PRODUCTION = process.env.NODE_ENV === "production"

if (IS_PRODUCTION && (!COOKIE_SECRET || COOKIE_SECRET === "change-me-to-a-random-32-char-string")) {
  throw new Error(
    "SECURITY: AUTH_COOKIE_SECRET is not set or is using placeholder value. " +
    "Set a strong random secret in production."
  )
}

if (IS_PRODUCTION && process.env.GOOGLE_CLIENT_SECRET === "your-google-client-secret") {
  throw new Error(
    "SECURITY: GOOGLE_CLIENT_SECRET is using placeholder value. " +
    "Set a real secret in production."
  )
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
}

export const ACCESS_TOKEN_COOKIE = "at"
export const REFRESH_TOKEN_COOKIE = "rt"
export const WORKSPACE_COOKIE = "ws"
export const DEMO_SESSION_COOKIE = "dm"

export const ACCESS_TOKEN_MAX_AGE = 15 * 60 // 15 minutes
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 // 7 days
export const DEMO_SESSION_MAX_AGE = 60 * 60 // 1 hour — shorter TTL for demo

const EFFECTIVE_SECRET = COOKIE_SECRET || "dev-only-fallback-secret-not-for-production"

export function createCookieHeader(
  name: string,
  value: string,
  maxAge: number
): string {
  // SECURITY: HMAC-sign cookie values to prevent forgery
  const signedValue = signValue(value)
  const parts = [
    `${name}=${encodeURIComponent(signedValue)}`,
    `HttpOnly`,
    `Path=${name === REFRESH_TOKEN_COOKIE ? "/api/auth" : "/"}`,
    `Max-Age=${maxAge}`,
    `SameSite=${name === REFRESH_TOKEN_COOKIE ? "Strict" : "Lax"}`,
  ]
  if (IS_PRODUCTION) {
    parts.push("Secure")
  }
  return parts.join("; ")
}

export function deleteCookieHeader(name: string): string {
  const parts = [
    `${name}=`,
    "HttpOnly",
    `Path=${name === REFRESH_TOKEN_COOKIE ? "/api/auth" : "/"}`,
    "Max-Age=0",
    "SameSite=Lax",
  ]
  if (IS_PRODUCTION) {
    parts.push("Secure")
  }
  return parts.join("; ")
}

// ─── M3: HMAC cookie signing ───

function signValue(value: string): string {
  const signature = crypto
    .createHmac("sha256", EFFECTIVE_SECRET)
    .update(value)
    .digest("base64url")
  return `${value}.${signature}`
}

/**
 * Verify and extract the original value from a signed cookie.
 * Returns null if signature is invalid.
 */
export function verifySignedValue(signedValue: string): string | null {
  const lastDot = signedValue.lastIndexOf(".")
  if (lastDot === -1) return null

  const value = signedValue.substring(0, lastDot)
  const signature = signedValue.substring(lastDot + 1)

  const expected = crypto
    .createHmac("sha256", EFFECTIVE_SECRET)
    .update(value)
    .digest("base64url")

  // Timing-safe comparison to prevent timing attacks
  if (signature.length !== expected.length) return null
  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expected)
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null

  return value
}
