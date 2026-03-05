import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  IS_DEMO,
  DEMO_USER,
  DEMO_EMAIL,
  generateDemoAccessToken,
  generateDemoRefreshToken,
} from "@/lib/api/demo-data"
import { authApi } from "@/lib/api/auth"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  DEMO_SESSION_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  DEMO_SESSION_MAX_AGE,
  createCookieHeader,
} from "@/lib/api/cookies"
import { checkRateLimit, getClientId, LOGIN_LIMIT } from "@/lib/api/rate-limit"

const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z.string().min(1, "Password is required").max(128),
})

export async function POST(request: NextRequest) {
  // ─── Rate limiting ───
  const clientId = getClientId(request)
  const rl = checkRateLimit(`login:${clientId}`, LOGIN_LIMIT)
  if (!rl.allowed) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    )
  }

  try {
    const body = await request.json()

    // ─── Input validation ───
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    // ─── Demo mode: controlled login with specific email only ───
    if (IS_DEMO && email === DEMO_EMAIL) {
      const demoAt = generateDemoAccessToken()
      const demoRt = generateDemoRefreshToken()
      const response = NextResponse.json({
        user: DEMO_USER,
        isDemo: true,
      })
      // Set auth cookies with shorter TTL for demo
      response.headers.append("Set-Cookie", createCookieHeader(ACCESS_TOKEN_COOKIE, demoAt, DEMO_SESSION_MAX_AGE))
      response.headers.append("Set-Cookie", createCookieHeader(REFRESH_TOKEN_COOKIE, demoRt, DEMO_SESSION_MAX_AGE))
      // Set demo session marker cookie
      response.headers.append("Set-Cookie", createCookieHeader(DEMO_SESSION_COOKIE, "true", DEMO_SESSION_MAX_AGE))
      return response
    }

    // ─── Normal login flow ───
    const result = await authApi.login(email, password)

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
    const message = status === 401 ? "Invalid credentials" : "Login failed"
    return NextResponse.json({ message }, { status })
  }
}
