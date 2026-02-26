import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
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

const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z.string().min(1, "Password is required").max(128),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Demo mode: accept any credentials
    if (IS_DEMO) {
      const response = NextResponse.json({ user: { ...DEMO_USER, email: body.email || DEMO_USER.email } })
      response.headers.append("Set-Cookie", createCookieHeader(ACCESS_TOKEN_COOKIE, DEMO_ACCESS_TOKEN, ACCESS_TOKEN_MAX_AGE))
      response.headers.append("Set-Cookie", createCookieHeader(REFRESH_TOKEN_COOKIE, DEMO_REFRESH_TOKEN, REFRESH_TOKEN_MAX_AGE))
      return response
    }

    // ─── Input validation ───
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data
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
    // Sanitize: don't leak internal error details to client
    const message = status === 401 ? "Invalid credentials" : "Login failed"
    return NextResponse.json({ message }, { status })
  }
}
