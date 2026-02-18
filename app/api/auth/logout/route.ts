import { NextRequest, NextResponse } from "next/server"
import { IS_DEMO } from "@/lib/api/demo-data"
import { authApi } from "@/lib/api/auth"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  WORKSPACE_COOKIE,
  deleteCookieHeader,
} from "@/lib/api/cookies"

export async function POST(request: NextRequest) {
  try {
    if (!IS_DEMO) {
      const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {})
      }
    }

    const response = NextResponse.json({ success: true })
    response.headers.append("Set-Cookie", deleteCookieHeader(ACCESS_TOKEN_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(REFRESH_TOKEN_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(WORKSPACE_COOKIE))
    return response
  } catch {
    const response = NextResponse.json({ success: true })
    response.headers.append("Set-Cookie", deleteCookieHeader(ACCESS_TOKEN_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(REFRESH_TOKEN_COOKIE))
    response.headers.append("Set-Cookie", deleteCookieHeader(WORKSPACE_COOKIE))
    return response
  }
}
