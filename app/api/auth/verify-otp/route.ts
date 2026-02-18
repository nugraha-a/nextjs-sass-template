import { NextRequest, NextResponse } from "next/server"
import {
  IS_DEMO,
  DEMO_USER,
  DEMO_ACCESS_TOKEN,
  DEMO_REFRESH_TOKEN,
} from "@/lib/api/demo-data"
import { authApi } from "@/lib/api/auth"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  createCookieHeader,
} from "@/lib/api/cookies"

export async function POST(request: NextRequest) {
  if (IS_DEMO) {
    // In demo mode, any code works. Return success based on context.
    const body = await request.json()
    // If verificationToken starts with "demo", simulate 2FA success
    if (body.verificationToken?.startsWith?.("demo")) {
      const response = NextResponse.json({ user: DEMO_USER })
      response.headers.append("Set-Cookie", createCookieHeader(ACCESS_TOKEN_COOKIE, DEMO_ACCESS_TOKEN, ACCESS_TOKEN_MAX_AGE))
      response.headers.append("Set-Cookie", createCookieHeader(REFRESH_TOKEN_COOKIE, DEMO_REFRESH_TOKEN, REFRESH_TOKEN_MAX_AGE))
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
