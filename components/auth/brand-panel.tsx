"use client"

import React from "react"

/**
 * Brand panel for auth pages.
 * Left side: gradient background using --primary, logo, tagline.
 * Adapts to active color scheme.
 */
export function BrandPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
      {/* Gradient background using primary color */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, var(--primary), color-mix(in oklch, var(--primary) 60%, black))`,
        }}
      />

      {/* Geometric pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="auth-pattern"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 60 M -15 45 L 45 -15 M 15 75 L 75 15"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-pattern)" />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-white px-12 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="24" height="24" rx="4" fill="white" fillOpacity="0.9" />
            <path d="M12 12h8v8h-8z" fill="currentColor" style={{ color: "var(--primary)" }} />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Enterprise Management
          </h1>
          <p className="text-lg text-white/80 max-w-sm">
            Secure, scalable, and intelligent platform for modern organizations
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-white/60" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  )
}
