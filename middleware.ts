import { NextRequest, NextResponse } from "next/server"

/**
 * SECURITY: Demo mode uses DEMO_MODE (server-side only, not NEXT_PUBLIC_).
 * Middleware NEVER bypasses security for demo — headers + CSRF always active.
 * Demo users go through normal auth flow with controlled credentials.
 */

const IS_PRODUCTION = process.env.NODE_ENV === "production"

const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password", "/invite"]
const PARTIAL_AUTH_PATHS = ["/verify"]
const AUTH_ONLY_PATHS = ["/workspace"]
const API_AUTH_PREFIX = "/api/auth"
const API_CONFIG_PREFIX = "/api/config"

// ─── Security Headers ───
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-DNS-Prefetch-Control": "off",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  ...(IS_PRODUCTION
    ? { "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload" }
    : {}),
}

// CSP policy — strict but functional for Next.js
const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.googleusercontent.com",
  "connect-src 'self' https://accounts.google.com https://apis.google.com",
  "frame-src https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ")

// ─── CSRF Origin Validation ───
function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")
  const host = request.headers.get("host")

  if (!host) return false

  // For same-origin requests without Origin header (e.g. form submits from same page)
  if (!origin && !referer) return false

  const allowedHost = host.split(":")[0] // strip port

  if (origin) {
    try {
      const originHost = new URL(origin).hostname
      return originHost === allowedHost || originHost === "localhost"
    } catch {
      return false
    }
  }

  if (referer) {
    try {
      const refererHost = new URL(referer).hostname
      return refererHost === allowedHost || refererHost === "localhost"
    } catch {
      return false
    }
  }

  return false
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }
  response.headers.set("Content-Security-Policy", CSP_POLICY)
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  // ─── CSRF: Validate origin for state-changing requests ───
  const isStateChanging = ["POST", "PUT", "PATCH", "DELETE"].includes(method)
  if (isStateChanging && !pathname.startsWith("/_next")) {
    if (!isValidOrigin(request)) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: "CSRF validation failed: invalid origin" },
          { status: 403 }
        )
      )
    }
  }

  const accessToken = request.cookies.get("at")?.value

  // Always pass through API auth & config routes
  if (pathname.startsWith(API_AUTH_PREFIX) || pathname.startsWith(API_CONFIG_PREFIX)) {
    return applySecurityHeaders(NextResponse.next())
  }

  // Public paths — redirect to dashboard if already authenticated
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    if (accessToken) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL("/", request.url))
      )
    }
    return applySecurityHeaders(NextResponse.next())
  }

  // Partial auth paths (OTP verification)
  if (PARTIAL_AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return applySecurityHeaders(NextResponse.next())
  }

  // Auth-only paths (workspace selector)
  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    if (!accessToken) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL("/login", request.url))
      )
    }
    return applySecurityHeaders(NextResponse.next())
  }

  // Dashboard routes — require auth (both normal and demo sessions)
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return applySecurityHeaders(NextResponse.redirect(loginUrl))
  }

  return applySecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icon.png (icons)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|public/).*)",
  ],
}
