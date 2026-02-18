"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { BrandPanel } from "@/components/auth/brand-panel"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordStrength } from "@/components/auth/password-strength"
import { GoogleSSOButton } from "@/components/auth/google-sso-button"

const inviteSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/\d/, "Must contain a number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type InviteFormData = z.infer<typeof inviteSchema>

interface InviteInfo {
  workspaceName: string
  role: string
  email: string
}

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "", password: "", confirmPassword: "" },
  })

  const password = form.watch("password")

  useEffect(() => {
    loadInviteInfo()
  }, [token])

  const loadInviteInfo = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
      const res = await fetch(`${API_BASE}/invites/${token}`)
      if (res.ok) {
        const info = await res.json()
        setInviteInfo(info)
      }
    } catch {
      // Invite may be invalid or expired
    } finally {
      setPageLoading(false)
    }
  }

  const onSubmit = async (data: InviteFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
      const res = await fetch(`${API_BASE}/invites/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          password: data.password,
        }),
      })

      if (!res.ok) {
        const result = await res.json()
        setError(result.message || "Failed to accept invite")
        return
      }

      router.push("/login?invite=accepted")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <BrandPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              You&apos;ve been invited!
            </h2>
            {inviteInfo ? (
              <p className="text-muted-foreground">
                Join &ldquo;{inviteInfo.workspaceName}&rdquo; as {inviteInfo.role}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Set up your account to accept the invitation
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        autoComplete="name"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Set Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <PasswordStrength password={password} />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              <GoogleSSOButton disabled={isLoading}>
                Join with Google
              </GoogleSSOButton>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Accept & Join →"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
