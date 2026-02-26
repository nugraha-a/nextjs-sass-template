import { NextRequest, NextResponse } from "next/server"
import { IS_DEMO } from "@/lib/api/demo-data"
import { ACCESS_TOKEN_COOKIE, WORKSPACE_COOKIE } from "@/lib/api/cookies"

/**
 * POST /api/auth/workspace
 * Sets the workspace cookie securely via server-side Set-Cookie.
 * This replaces the client-side document.cookie approach which
 * could not set HttpOnly or Secure flags.
 */
export async function POST(request: NextRequest) {
    try {
        const { workspaceId } = await request.json()

        if (!workspaceId || typeof workspaceId !== "string") {
            return NextResponse.json(
                { error: "Invalid workspace ID" },
                { status: 400 }
            )
        }

        // Sanitize: only allow alphanumeric, hyphens, underscores
        if (!/^[a-zA-Z0-9_-]+$/.test(workspaceId)) {
            return NextResponse.json(
                { error: "Invalid workspace ID format" },
                { status: 400 }
            )
        }

        // Auth check (skip in demo mode)
        if (!IS_DEMO) {
            const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
            if (!accessToken) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }
        }

        const isProduction = process.env.NODE_ENV === "production"

        const cookieParts = [
            `${WORKSPACE_COOKIE}=${workspaceId}`,
            "HttpOnly",
            "Path=/",
            "Max-Age=31536000", // 1 year
            "SameSite=Lax",
        ]
        if (isProduction) {
            cookieParts.push("Secure")
        }

        const response = NextResponse.json({ success: true })
        response.headers.append("Set-Cookie", cookieParts.join("; "))
        return response
    } catch {
        return NextResponse.json(
            { error: "Failed to set workspace" },
            { status: 500 }
        )
    }
}
