import { NextRequest, NextResponse } from "next/server"
import { ACCESS_TOKEN_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/api/cookies"

/**
 * GET /api/auth/token
 * Returns authentication status and demo flag — never exposes the raw token.
 * The BFF proxy pattern keeps tokens server-side.
 */
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const isDemoSession = request.cookies.get(DEMO_SESSION_COOKIE)?.value === "true"

  if (!accessToken) {
    return NextResponse.json({ authenticated: false, isDemo: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true, isDemo: isDemoSession })
}
