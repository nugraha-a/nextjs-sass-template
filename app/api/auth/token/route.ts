import { NextRequest, NextResponse } from "next/server"
import { ACCESS_TOKEN_COOKIE, DEMO_SESSION_COOKIE, verifySignedValue } from "@/lib/api/cookies"

/**
 * GET /api/auth/token
 * Returns authentication status and demo flag — never exposes the raw token.
 * The BFF proxy pattern keeps tokens server-side.
 */
export async function GET(request: NextRequest) {
  const rawToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const accessToken = rawToken ? verifySignedValue(rawToken) : null
  const rawDemo = request.cookies.get(DEMO_SESSION_COOKIE)?.value
  const isDemoSession = rawDemo ? verifySignedValue(rawDemo) === "true" : false

  if (!accessToken) {
    return NextResponse.json({ authenticated: false, isDemo: false })
  }

  return NextResponse.json({ authenticated: true, isDemo: isDemoSession })
}
