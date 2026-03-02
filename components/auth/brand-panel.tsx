"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    alt: "Modern office workspace",
  },
  {
    src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
    alt: "Team collaboration",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    alt: "Data analytics dashboard",
  },
]

const INTERVAL_MS = 5000

/**
 * Brand panel for auth pages.
 * Full-bleed image fade slider with gradient overlay, logo, and tagline.
 */
export function BrandPanel() {
  const [active, setActive] = useState(0)

  const next = useCallback(
    () => setActive((i) => (i + 1) % SLIDES.length),
    []
  )

  useEffect(() => {
    const id = setInterval(next, INTERVAL_MS)
    return () => clearInterval(id)
  }, [next])

  return (
    <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
      {/* Image slides */}
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          sizes="50vw"
          priority={i === 0}
          className="object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}

      {/* Gradient overlay using --primary */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklch, var(--primary) 85%, transparent), color-mix(in oklch, var(--primary) 55%, black))`,
        }}
      />

      {/* Geometric pattern overlay */}
      <svg
        className="absolute inset-0 z-2 w-full h-full opacity-[0.06]"
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

        {/* Slide indicators */}
        <div className="flex gap-2 mt-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className="group relative h-2 rounded-full transition-all duration-500 cursor-pointer"
              style={{ width: i === active ? "2rem" : "0.5rem" }}
            >
              <span
                className="absolute inset-0 rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: i === active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
