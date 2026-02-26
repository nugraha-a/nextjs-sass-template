import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { IS_DEMO } from "@/lib/api/demo-data"
import { authApi } from "@/lib/api/auth"
import type { OtpChannel } from "@/lib/api/types"

const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, "Identifier is required").max(255),
  channel: z.enum(["email", "sms"]),
})

export async function POST(request: NextRequest) {
  if (IS_DEMO) {
    return NextResponse.json({
      verificationToken: "demo-verification-token",
      maskedContact: "d***@company.com",
      channel: "email" as OtpChannel,
    })
  }

  try {
    const body = await request.json()

    // ─── Input validation ───
    const parsed = forgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { identifier, channel } = parsed.data
    const result = await authApi.forgotPassword(identifier, channel)

    return NextResponse.json({
      verificationToken: result.verificationToken,
      maskedContact: result.maskedContact,
      channel: result.channel,
    })
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500
    // Don't reveal whether the email/phone exists — always return generic message
    return NextResponse.json({ message: "If an account exists, a code has been sent." }, { status: status === 404 ? 200 : status })
  }
}
