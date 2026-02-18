"use client"

import React, { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password: string
  className?: string
}

const requirements = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
  { label: "Special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const score = useMemo(
    () => requirements.filter((r) => r.test(password)).length,
    [password]
  )

  const label = password.length === 0 ? "" : score <= 1 ? "Weak" : score <= 2 ? "Fair" : score <= 3 ? "Strong" : "Very Strong"
  const color = score <= 1 ? "bg-destructive" : score <= 2 ? "bg-amber-500" : score <= 3 ? "bg-green-500" : "bg-emerald-500"

  if (!password) return null

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength bar */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < score ? color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>

      {/* Requirements checklist */}
      <div className="space-y-1.5">
        {requirements.map((req) => {
          const met = req.test(password)
          return (
            <div key={req.label} className="flex items-center gap-2">
              {met ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-xs",
                  met ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {req.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
