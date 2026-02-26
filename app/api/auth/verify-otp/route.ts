import { NextRequest, NextResponse } from "next/server"
import {
  DEMO_USER,
  DEMO_ACCESS_TOKEN,
  DEMO_REFRESH_TOKEN,
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
} from "@/lib/api/cookies"

export async function POST(request: NextRequest) {
  const isDemoSession = request.cookies.get(DEMO_SESSION_COOKIE)?.value === "true"

  if (isDemoSession) {
    // In demo mode, any code works. Return success based on context.
    const body = await request.json()
    if (body.verificationToken?.startsWith?.("demo")) {
      const response = NextResponse.json({ user: DEMO_USER, isDemo: true })
      response.headers.append("Set-Cookie", createCookieHeader(ACCESS_TOKEN_COOKIE, DEMO_ACCESS_TOKEN, DEMO_SESSION_MAX_AGE))
      response.headers.append("Set-Cookie", createCookieHeader(REFRESH_TOKEN_COOKIE, DEMO_REFRESH_TOKEN, DEMO_SESSION_MAX_AGE))
      response.headers.append("Set-Cookie", createCookieHeader(DEMO_SESSION_COOKIE, "true", DEMO_SESSION_MAX_AGE))
      return response
    }
    return NextResponse.json({ resetToken: "demo-reset-token" })
  }

  try {
    const { code, verificationToken } = await request.json()
    const result = await authApi.verifyOtp(code, verificationToken)

    if (result.accessToken && result.refreshToken) {
      const response = NextResponse.json({ user: result.user })
      response.headers.append("Set-Cookie", createCookieHeader(ACCESS_TOKEN_COOKIE, result.accessToken, ACCESS_TOKEN_MAX_AGE))
      response.headers.append("Set-Cookie", createCookieHeader(REFRESH_TOKEN_COOKIE, result.refreshToken, REFRESH_TOKEN_MAX_AGE))
      return response
    }

    return NextResponse.json({ resetToken: result.resetToken })
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500
    const body = (error as { body?: unknown }).body || { message: "Verification failed" }
    return NextResponse.json(body, { status })
  }
}
