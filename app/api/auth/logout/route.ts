import { NextRequest, NextResponse } from "next/server"
import { authApi } from "@/lib/api/auth"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  WORKSPACE_COOKIE,
  DEMO_SESSION_COOKIE,
  deleteCookieHeader,
  verifySignedValue,
} from "@/lib/api/cookies"

export async function POST(request: NextRequest) {
  try {
    const rawDemo = request.cookies.get(DEMO_SESSION_COOKIE)?.value
    const isDemoSession = rawDemo ? verifySignedValue(rawDemo) === "true" : false

    if (!isDemoSession) {
      const rawRefresh = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value
      const refreshToken = rawRefresh ? verifySignedValue(rawRefresh) : null
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => { })
      }
    }

    const response = NextResponse.json({ success: true })
    response.headers.append("Set-Cookie", deleteCookieHeader(ACCESS_TOKEN_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(REFRESH_TOKEN_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(WORKSPACE_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(DEMO_SESSION_COOKIE))
    return response
  } catch {
    const response = NextResponse.json({ success: true })
    response.headers.append("Set-Cookie", deleteCookieHeader(ACCESS_TOKEN_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(REFRESH_TOKEN_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(WORKSPACE_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(DEMO_SESSION_COOKIE))
    return response
  }
}
