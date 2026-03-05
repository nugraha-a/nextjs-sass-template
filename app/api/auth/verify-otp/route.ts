import { NextRequest, NextResponse } from "next/server"
import {
  DEMO_USER,
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
  verifySignedValue,
} from "@/lib/api/cookies"
import { checkRateLimit, getClientId, OTP_LIMIT } from "@/lib/api/rate-limit"

export async function POST(request: NextRequest) {
  // ─── Rate limiting ───
  const clientId = getClientId(request)
  const rl = checkRateLimit(`otp:${clientId}`, OTP_LIMIT)
  if (!rl.allowed) {
    return NextResponse.json(
      { message: "Too many verification attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    )
  }

  const rawDemo = request.cookies.get(DEMO_SESSION_COOKIE)?.value
  const isDemoSession = rawDemo ? verifySignedValue(rawDemo) === "true" : false

  if (isDemoSession) {
    // In demo mode, any code works. Return success based on context.
    const body = await request.json()
    if (body.verificationToken?.startsWith?.("demo")) {
      const demoAt = generateDemoAccessToken()
      const demoRt = generateDemoRefreshToken()
      const response = NextResponse.json({ user: DEMO_USER, isDemo: true })
      response.headers.append("Set-Cookie", createCookieHeader(ACCESS_TOKEN_COOKIE, demoAt, DEMO_SESSION_MAX_AGE))
      response.headers.append("Set-Cookie", createCookieHeader(REFRESH_TOKEN_COOKIE, demoRt, DEMO_SESSION_MAX_AGE))
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
    // SECURITY: Sanitize error — never leak raw backend error body to client
    const message = status === 400 ? "Invalid verification code" : "Verification failed"
    return NextResponse.json({ message }, { status })
  }
}
