"use client"

import React, { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { BrandPanel } from "@/components/auth/brand-panel"

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const mode = searchParams.get("mode") || "forgot"
  const verificationToken = searchParams.get("token") || ""
  const maskedContact = searchParams.get("contact") || ""

  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true)
      return
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleVerify = useCallback(
    async (otpCode: string) => {
      if (isLoading) return
      setIsLoading(true)
      setError("")

      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: otpCode, verificationToken }),
        })

        const result = await res.json()

        if (!res.ok) {
          setError(result.message || "Invalid code")
          setCode("")
          return
        }

        // Route based on mode
        switch (mode) {
          case "forgot":
            router.push(`/reset-password?token=${result.resetToken}`)
            break
          case "2fa":
            if (result.user?.workspaces?.length > 1) {
              router.push("/workspace")
            } else {
              router.push("/")
            }
            break
          case "invite":
            router.push(`/invite/${verificationToken}`)
            break
          default:
            router.push("/")
        }
      } catch {
        setError("Verification failed. Please try again.")
        setCode("")
      } finally {
        setIsLoading(false)
      }
    },
    [mode, verificationToken, router]
  )

  // Auto-submit when all digits entered
  useEffect(() => {
    if (code.length === 6 && !isLoading) {
      handleVerify(code)
    }
  }, [code, handleVerify, isLoading])

  const handleResend = async () => {
    if (isResending) return
    setIsResending(true)
    setCountdown(60)
    setCanResend(false)
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: maskedContact,
          channel: "email",
        }),
      })
    } finally {
      setIsResending(false)
    }
  }

  const titles: Record<string, string> = {
    forgot: "Enter verification code",
    "2fa": "Two-factor authentication",
    invite: "Verify your email",
  }

  const descriptions: Record<string, string> = {
    forgot: `We sent a 6-digit code to ${maskedContact || "your email"}`,
    "2fa": "Enter the code from your authentication method",
    invite: `We sent a 6-digit code to ${maskedContact || "your email"}`,
  }

  return (
    <>
      <BrandPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {titles[mode] || titles.forgot}
            </h2>
            <p className="text-muted-foreground">
              {descriptions[mode] || descriptions.forgot}
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-in fade-in">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {"Didn't receive code? "}
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-primary hover:underline font-medium disabled:opacity-50"
                >
                  Resend code
                </button>
              ) : (
                <span>Resend in {countdown}s</span>
              )}
            </p>
          </div>

          <Button
            className="w-full h-11"
            disabled={code.length < 6 || isLoading}
            onClick={() => handleVerify(code)}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Verify →"
            )}
          </Button>
        </div>
      </div>
    </>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
