import { NextRequest, NextResponse } from "next/server"
import { IS_DEMO, DEMO_ACCESS_TOKEN } from "@/lib/api/demo-data"
import { ACCESS_TOKEN_COOKIE } from "@/lib/api/cookies"

/**
 * GET /api/auth/token
 * Returns the access token from HttpOnly cookie.
 * In demo mode, always returns a fake token.
 */
export async function GET(request: NextRequest) {
  if (IS_DEMO) {
    return NextResponse.json({ accessToken: DEMO_ACCESS_TOKEN })
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  return NextResponse.json({ accessToken })
}
