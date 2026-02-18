/**
 * Cookie configuration constants for auth tokens.
 * Shared across all BFF proxy routes.
 */

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
}

export const ACCESS_TOKEN_COOKIE = "at"
export const REFRESH_TOKEN_COOKIE = "rt"
export const WORKSPACE_COOKIE = "ws"

export const ACCESS_TOKEN_MAX_AGE = 15 * 60 // 15 minutes
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

export function createCookieHeader(
  name: string,
  value: string,
  maxAge: number
): string {
  const parts = [
    `${name}=${value}`,
    `HttpOnly`,
    `Path=${name === REFRESH_TOKEN_COOKIE ? "/api/auth" : "/"}`,
    `Max-Age=${maxAge}`,
    `SameSite=${name === REFRESH_TOKEN_COOKIE ? "Strict" : "Lax"}`,
  ]
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure")
  }
  return parts.join("; ")
}

export function deleteCookieHeader(name: string): string {
  return `${name}=; HttpOnly; Path=${name === REFRESH_TOKEN_COOKIE ? "/api/auth" : "/"}; Max-Age=0; SameSite=Lax`
}
