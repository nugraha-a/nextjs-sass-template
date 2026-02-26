import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { IS_DEMO } from "@/lib/api/demo-data"
import { authApi } from "@/lib/api/auth"

const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required").max(500),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
})

export async function POST(request: NextRequest) {
  if (IS_DEMO) {
    return NextResponse.json({ success: true })
  }

  try {
    const body = await request.json()

    // ─── Input validation ───
    const parsed = resetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { resetToken, newPassword } = parsed.data
    await authApi.resetPassword(resetToken, newPassword)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500
    // Sanitize: don't leak internal error details
    const message = status === 400 ? "Invalid or expired reset token" : "Reset failed"
    return NextResponse.json({ message }, { status })
  }
}
