import { NextRequest, NextResponse } from "next/server"
import {
  generateDemoAccessToken,
  generateDemoRefreshToken,
} from "@/lib/api/demo-data"
import { authApi } from "@/lib/api/auth"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_MAX_AGE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  createCookieHeader,
  deleteCookieHeader,
  verifySignedValue,
} from "@/lib/api/cookies"

export async function POST(request: NextRequest) {
  const rawDemo = request.cookies.get(DEMO_SESSION_COOKIE)?.value
  const isDemoSession = rawDemo ? verifySignedValue(rawDemo) === "true" : false

  // Demo session: generate fresh demo tokens with short TTL
  if (isDemoSession) {
    const demoAt = generateDemoAccessToken()
    const demoRt = generateDemoRefreshToken()
    const response = NextResponse.json({ accessToken: demoAt })
    response.headers.append("Set-Cookie", createCookieHeader(ACCESS_TOKEN_COOKIE, demoAt, DEMO_SESSION_MAX_AGE))
    response.headers.append("Set-Cookie", createCookieHeader(REFRESH_TOKEN_COOKIE, demoRt, DEMO_SESSION_MAX_AGE))
    return response
  }

  try {
    const rawRefresh = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value
    const refreshToken = rawRefresh ? verifySignedValue(rawRefresh) : null

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 })
    }

    const result = await authApi.refreshToken(refreshToken)

    const response = NextResponse.json({ accessToken: result.accessToken })
    response.headers.append("Set-Cookie", createCookieHeader(ACCESS_TOKEN_COOKIE, result.accessToken, ACCESS_TOKEN_MAX_AGE))
    response.headers.append("Set-Cookie", createCookieHeader(REFRESH_TOKEN_COOKIE, result.refreshToken, REFRESH_TOKEN_MAX_AGE))
    return response
  } catch {
    const response = NextResponse.json({ message: "Session expired" }, { status: 401 })
    response.headers.append("Set-Cookie", deleteCookieHeader(ACCESS_TOKEN_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(REFRESH_TOKEN_COOKIE))
    return response
  }
}
