import { NextRequest, NextResponse } from "next/server"
import { IS_DEMO } from "@/lib/api/demo-data"
import { ACCESS_TOKEN_COOKIE } from "@/lib/api/cookies"

/**
 * GET /api/auth/token
 * Returns authentication status ONLY — never exposes the raw token.
 * The BFF proxy pattern keeps tokens server-side.
 *
 * SECURITY: Previously this endpoint returned the raw access token from
 * the HttpOnly cookie, which completely defeated HttpOnly protection
 * and enabled XSS → token theft attacks.
 */
export async function GET(request: NextRequest) {
  if (IS_DEMO) {
    return NextResponse.json({ authenticated: true })
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true })
}
