import { NextRequest, NextResponse } from "next/server"
import { IS_DEMO } from "@/lib/api/demo-data"
import { authApi } from "@/lib/api/auth"

export async function POST(request: NextRequest) {
  if (IS_DEMO) {
    return NextResponse.json({ success: true })
  }

  try {
    const { resetToken, newPassword } = await request.json()
    await authApi.resetPassword(resetToken, newPassword)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500
    const body = (error as { body?: unknown }).body || { message: "Reset failed" }
    return NextResponse.json(body, { status })
  }
}
