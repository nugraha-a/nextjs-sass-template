import { NextRequest, NextResponse } from "next/server"

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password", "/invite"]
const PARTIAL_AUTH_PATHS = ["/verify"]
const AUTH_ONLY_PATHS = ["/workspace"]
const API_AUTH_PREFIX = "/api/auth"

export function middleware(request: NextRequest) {
  // Demo mode: bypass ALL route protection
  if (IS_DEMO) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("at")?.value
  const workspaceCookie = request.cookies.get("ws")?.value

  // Always pass through API auth routes
  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next()
  }

  // Public paths — redirect to dashboard if already authenticated
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Partial auth paths (OTP verification)
  if (PARTIAL_AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Auth-only paths (workspace selector)
  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  // Dashboard routes — require auth + workspace
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated but no workspace selected, redirect to workspace selector
  if (!workspaceCookie && pathname !== "/") {
    // Allow the root path so we don't get infinite redirects
    // The workspace selector page will handle the flow
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - _next/image (image optimization)
     * - favicon.ico, icon.png (icons)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|public/).*)",
  ],
}
