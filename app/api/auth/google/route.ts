import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  IS_DEMO,
  DEMO_USER,
  DEMO_EMAIL,
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
  // In demo mode, Google login uses demo credentials
  if (IS_DEMO) {
    const response = NextResponse.json({ user: DEMO_USER, isDemo: true })
    response.headers.append("Set-Cookie", createCookieHeader(ACCESS_TOKEN_COOKIE, DEMO_ACCESS_TOKEN, DEMO_SESSION_MAX_AGE))
    response.headers.append("Set-Cookie", createCookieHeader(REFRESH_TOKEN_COOKIE, DEMO_REFRESH_TOKEN, DEMO_SESSION_MAX_AGE))
    response.headers.append("Set-Cookie", createCookieHeader(DEMO_SESSION_COOKIE, "true", DEMO_SESSION_MAX_AGE))
    return response
  }

  try {
    const { idToken } = await request.json()
    const result = await authApi.loginWithGoogle(idToken)

    if (result.requires2FA) {
      return NextResponse.json({
        requires2FA: true,
        verificationToken: result.verificationToken,
        user: { email: result.user.email },
      })
    }

    const response = NextResponse.json({ user: result.user })
    response.headers.append("Set-Cookie", createCookieHeader(ACCESS_TOKEN_COOKIE, result.accessToken, ACCESS_TOKEN_MAX_AGE))
    response.headers.append("Set-Cookie", createCookieHeader(REFRESH_TOKEN_COOKIE, result.refreshToken, REFRESH_TOKEN_MAX_AGE))
    return response
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500
    const message = status === 401 ? "Invalid credentials" : "Google login failed"
    return NextResponse.json({ message }, { status })
  }
}
