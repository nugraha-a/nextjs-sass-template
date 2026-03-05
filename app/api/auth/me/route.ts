import { NextRequest, NextResponse } from "next/server"
import { DEMO_USER, isDemoToken } from "@/lib/api/demo-data"
import { ACCESS_TOKEN_COOKIE, DEMO_SESSION_COOKIE, verifySignedValue } from "@/lib/api/cookies"
import { authApi } from "@/lib/api/auth"

/**
 * GET /api/auth/me
 * BFF proxy for fetching current user profile.
 * SECURITY (L3): Keeps backend URL hidden from client bundle.
 */
export async function GET(request: NextRequest) {
    // Check for access token passed via header (from auth-context refresh flow)
    const headerToken = request.headers.get("x-access-token")

    // Or from signed cookie
    const rawCookie = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
    const cookieToken = rawCookie ? verifySignedValue(rawCookie) : null

    const accessToken = headerToken || cookieToken

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Demo session: return demo user
    const rawDemo = request.cookies.get(DEMO_SESSION_COOKIE)?.value
    const isDemoSession = rawDemo ? verifySignedValue(rawDemo) === "true" : false
    if (isDemoSession && isDemoToken(accessToken)) {
        return NextResponse.json(DEMO_USER)
    }

    try {
        const user = await authApi.getMe(accessToken)
        return NextResponse.json(user)
    } catch (error: unknown) {
        const status = (error as { status?: number }).status || 500
        const message = status === 401 ? "Unauthorized" : "Failed to fetch user"
        return NextResponse.json({ message }, { status })
    }
}
