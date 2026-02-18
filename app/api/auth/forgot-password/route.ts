import { NextRequest, NextResponse } from "next/server"
import { IS_DEMO } from "@/lib/api/demo-data"
import { authApi } from "@/lib/api/auth"
import type { OtpChannel } from "@/lib/api/types"

export async function POST(request: NextRequest) {
  if (IS_DEMO) {
    return NextResponse.json({
      verificationToken: "demo-verification-token",
      maskedContact: "d***@company.com",
      channel: "email" as OtpChannel,
    })
  }

  try {
    const { identifier, channel } = (await request.json()) as {
      identifier: string
      channel: OtpChannel
    }

    const result = await authApi.forgotPassword(identifier, channel)

    return NextResponse.json({
      verificationToken: result.verificationToken,
      maskedContact: result.maskedContact,
      channel: result.channel,
    })
  } catch (error: unknown) {
    const status = (error as { status?: number }).status || 500
    const body = (error as { body?: unknown }).body || { message: "Request failed" }
    return NextResponse.json(body, { status })
  }
}
