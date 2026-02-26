"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { BrandPanel } from "@/components/auth/brand-panel"
import { PasswordInput } from "@/components/auth/password-input"
import { GoogleSSOButton } from "@/components/auth/google-sso-button"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { demoAvailable } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Pre-fill demo credentials when demoAvailable becomes true (client-side only)
  React.useEffect(() => {
    if (demoAvailable) {
      setEmail("demo@company.com")
      setPassword("demo1234")
    }
  }, [demoAvailable])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Login failed")
      }

      const data = await res.json()

      if (data.requires2FA) {
        router.push(`/verify?mode=2fa&token=${data.verificationToken}`)
        return
      }

      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (demoAvailable) {
      // In demo mode, Google login goes through demo flow
      setIsLoading(true)
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: "demo" }),
        })
        if (res.ok) {
          router.push("/")
          return
        }
      } catch {
        // fall through
      } finally {
        setIsLoading(false)
      }
    }
    setError("Google SSO requires a configured OAuth client")
  }

  return (
    <>
      <BrandPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-xl"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="4" width="24" height="24" rx="4" fill="white" fillOpacity="0.9" />
                <path d="M12 12h8v8h-8z" fill="currentColor" style={{ color: "var(--primary)" }} />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to your account
            </p>
          </div>

          {/* Demo mode banner — rendered client-side only to avoid hydration mismatch */}
          {demoAvailable && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-primary">
              <strong>Demo Mode</strong> — Use <code>demo@company.com</code> to sign in.
            </div>
          )}

          {/* Google SSO */}
          <GoogleSSOButton onClick={handleGoogleLogin} disabled={isLoading} />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="user@company.com"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(c) => setRemember(!!c)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In →"
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
