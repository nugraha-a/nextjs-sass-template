import { NextResponse } from "next/server"
import { IS_DEMO } from "@/lib/api/demo-data"

/**
 * GET /api/config
 * Public endpoint returning non-sensitive app configuration.
 * Client calls this to know if "Try Demo" button should appear on login page.
 *
 * SECURITY: Only exposes whether demo mode is available, no secrets.
 */
export async function GET() {
    return NextResponse.json({
        demoEnabled: IS_DEMO,
    })
}
