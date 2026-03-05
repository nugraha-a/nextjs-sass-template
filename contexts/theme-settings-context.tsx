"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useTheme } from "next-themes"

export type SidebarMode = "normal" | "compact" | "offcanvas"
export type SidebarTheme = "default" | "dark" | "brand" | "image" | "aurora"
export type ContentMode = "compact" | "full"
export type ContentView = "carded" | "boxed"
export type FontFamily = "geist" | "inter" | "jakarta" | "open-sans" | "system"
export type FontSize = "small" | "medium" | "large"
export type ColorScheme = "default" | "neutral" | "sky" | "navy" | "blue" | "cyan" | "yellow" | "orange"
export type ImageBrightness = "bright" | "medium" | "dark"

interface ThemeSettings {
  sidebarMode: SidebarMode
  sidebarTheme: SidebarTheme
  themeMode: "light" | "dark" | "system"
  colorScheme: ColorScheme
  fontFamily: FontFamily
  fontSize: FontSize
  contentMode: ContentMode
  contentView: ContentView
  radius: number
  sidebarImageUrl: string | null
  sidebarImageBrightness: ImageBrightness | null
}

interface ThemeSettingsContextType extends ThemeSettings {
  setSidebarMode: (mode: SidebarMode) => void
  setSidebarTheme: (theme: SidebarTheme) => void
  setThemeMode: (mode: "light" | "dark" | "system") => void
  setColorScheme: (scheme: ColorScheme) => void
  setFontFamily: (family: FontFamily) => void
  setFontSize: (size: FontSize) => void
  setContentMode: (mode: ContentMode) => void
  setContentView: (view: ContentView) => void
  setRadius: (radius: number) => void
  setSidebarImageUrl: (url: string | null) => void
  setSidebarImageBrightness: (brightness: ImageBrightness | null) => void
  resetToDefaults: () => void
}

const defaultSettings: ThemeSettings = {
  sidebarMode: "normal",
  sidebarTheme: "brand",
  themeMode: "light",
  colorScheme: "navy",
  fontFamily: "geist",
  fontSize: "small",
  contentMode: "full",
  contentView: "carded",
  radius: 0.5,
  sidebarImageUrl: null,
  sidebarImageBrightness: null,
}

const ThemeSettingsContext = createContext<ThemeSettingsContextType | null>(null)

export function useThemeSettings() {
  const context = useContext(ThemeSettingsContext)
  if (!context) {
    throw new Error("useThemeSettings must be used within a ThemeSettingsProvider")
  }
  return context
}

const STORAGE_KEY = "next-sass-theme-settings"

const migrationMap: Record<string, ColorScheme> = {
  carbon: "neutral",
  slate: "sky",
  teal: "cyan",
  gold: "yellow",
  amber: "orange",
  indigo: "blue",
  crimson: "neutral",
  zinc: "neutral",
  rose: "neutral",
  green: "yellow",
}

/**
 * SECURITY: Valid value whitelists — prevents localStorage poisoning.
 * Any value not in these sets falls back to defaultSettings.
 */
const validValues: Record<string, readonly string[]> = {
  themeMode: ["light", "dark", "system"],
  colorScheme: ["default", "neutral", "sky", "navy", "blue", "cyan", "yellow", "orange"],
  fontSize: ["small", "medium", "large"],
  fontFamily: ["geist", "inter", "jakarta", "open-sans", "system"],
  sidebarMode: ["normal", "compact", "offcanvas"],
  sidebarTheme: ["default", "dark", "brand", "image", "aurora"],
  contentMode: ["compact", "full"],
  contentView: ["carded", "boxed"],
  sidebarImageBrightness: ["bright", "medium", "dark"],
}

function sanitizeValue<T extends string>(key: string, value: unknown, fallback: T): T {
  if (typeof value !== "string") return fallback
  return (validValues[key]?.includes(value) ? value : fallback) as T
}

function sanitizeRadius(value: unknown): number {
  const num = typeof value === "number" ? value : parseFloat(String(value))
  if (isNaN(num) || num < 0 || num > 2) return defaultSettings.radius
  return num
}

function sanitizeUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null
  try { new URL(value); return value.replace(/["\\]/g, "") } catch { return null }
}

/**
 * Read and validate settings from localStorage synchronously.
 * Runs as a lazy initializer for useState — prevents flicker
 * by ensuring the very first render already has correct, sanitized values.
 */
function loadInitialSettings(): ThemeSettings {
  if (typeof window === "undefined") return defaultSettings
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultSettings
    const parsed = JSON.parse(stored)

    // Migrate old color schemes
    if (parsed.colorScheme && migrationMap[parsed.colorScheme]) {
      parsed.colorScheme = migrationMap[parsed.colorScheme]
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultSettings, ...parsed }))
    }

    // Validate every field against allowed values
    return {
      sidebarMode: sanitizeValue("sidebarMode", parsed.sidebarMode, defaultSettings.sidebarMode),
      sidebarTheme: sanitizeValue("sidebarTheme", parsed.sidebarTheme, defaultSettings.sidebarTheme),
      themeMode: sanitizeValue("themeMode", parsed.themeMode, defaultSettings.themeMode) as "light" | "dark" | "system",
      colorScheme: sanitizeValue("colorScheme", parsed.colorScheme, defaultSettings.colorScheme),
      fontFamily: sanitizeValue("fontFamily", parsed.fontFamily, defaultSettings.fontFamily),
      fontSize: sanitizeValue("fontSize", parsed.fontSize, defaultSettings.fontSize),
      contentMode: sanitizeValue("contentMode", parsed.contentMode, defaultSettings.contentMode),
      contentView: sanitizeValue("contentView", parsed.contentView, defaultSettings.contentView),
      radius: sanitizeRadius(parsed.radius),
      sidebarImageUrl: sanitizeUrl(parsed.sidebarImageUrl),
      sidebarImageBrightness: parsed.sidebarImageBrightness
        ? sanitizeValue("sidebarImageBrightness", parsed.sidebarImageBrightness, "dark") as ImageBrightness
        : null,
    }
  } catch {
    return defaultSettings
  }
}

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // Synchronous localStorage read — prevents flicker on first render
  const [settings, setSettings] = useState<ThemeSettings>(loadInitialSettings)
  // Skip the first DOM-applying effect — the <head> blocking script already handled it
  const isInitialHydration = useRef(true)

  useEffect(() => {
    setMounted(true)
    // Sync next-themes with our stored themeMode
    if (settings.themeMode) {
      setTheme(settings.themeMode)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: ThemeSettings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
  }, [])

  // Apply settings to document
  useEffect(() => {
    if (!mounted) return

    // Skip first run — the blocking <head> script already applied these
    if (isInitialHydration.current) {
      isInitialHydration.current = false
      return
    }

    const root = document.documentElement
    const body = document.body

    // Apply font size
    root.setAttribute("data-font-size", settings.fontSize)

    // Apply font family
    root.setAttribute("data-font-family", settings.fontFamily)

    // Apply color scheme - set on both root and body for CSS targeting
    root.setAttribute("data-color-scheme", settings.colorScheme)
    body.setAttribute("data-color-scheme", settings.colorScheme)

    // Apply sidebar mode
    root.setAttribute("data-sidebar-mode", settings.sidebarMode)

    // Apply sidebar theme — force "default" in dark mode
    const isDark = resolvedTheme === "dark"
    root.setAttribute("data-sidebar-theme", isDark ? "default" : settings.sidebarTheme)

    // Apply content mode
    root.setAttribute("data-content-mode", settings.contentMode)

    // Apply content view (carded/boxed)
    root.setAttribute("data-content-view", settings.contentView)

    // Apply border radius CSS variable
    root.style.setProperty("--radius", `${settings.radius}rem`)

    // Apply sidebar background image CSS variable
    const sidebarImgUrl = settings.sidebarImageUrl
      || "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80"
    root.style.setProperty("--sidebar-bg-image", `url("${sidebarImgUrl}")`)

    // Apply sidebar image brightness for adaptive gradient
    root.setAttribute("data-sidebar-image-brightness", settings.sidebarImageBrightness || "dark")

  }, [mounted, settings, resolvedTheme])

  const setSidebarMode = useCallback((mode: SidebarMode) => {
    setSettings(prev => {
      const newSettings = { ...prev, sidebarMode: mode }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  const setSidebarTheme = useCallback((theme: SidebarTheme) => {
    setSettings(prev => {
      const newSettings = { ...prev, sidebarTheme: theme }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  const setThemeMode = useCallback((mode: "light" | "dark" | "system") => {
    setTheme(mode)
    setSettings(prev => {
      const newSettings = { ...prev, themeMode: mode }
      saveSettings(newSettings)
      return newSettings
    })
  }, [setTheme, saveSettings])

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setSettings(prev => {
      const newSettings = { ...prev, colorScheme: scheme }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  const setFontFamily = useCallback((family: FontFamily) => {
    setSettings(prev => {
      const newSettings = { ...prev, fontFamily: family }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  const setFontSize = useCallback((size: FontSize) => {
    setSettings(prev => {
      const newSettings = { ...prev, fontSize: size }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  const setContentMode = useCallback((mode: ContentMode) => {
    setSettings(prev => {
      const newSettings = { ...prev, contentMode: mode }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  const setContentView = useCallback((view: ContentView) => {
    setSettings(prev => {
      const newSettings = { ...prev, contentView: view }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  const setRadius = useCallback((radius: number) => {
    setSettings(prev => {
      const newSettings = { ...prev, radius }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  const setSidebarImageUrl = useCallback((url: string | null) => {
    setSettings(prev => {
      const newSettings = { ...prev, sidebarImageUrl: url }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  const setSidebarImageBrightness = useCallback((brightness: ImageBrightness | null) => {
    setSettings(prev => {
      const newSettings = { ...prev, sidebarImageBrightness: brightness }
      saveSettings(newSettings)
      return newSettings
    })
  }, [saveSettings])

  const resetToDefaults = useCallback(() => {
    // Delete sidebar image file from disk if one exists
    const currentImageUrl = settings.sidebarImageUrl
    if (currentImageUrl && currentImageUrl.startsWith("/uploads/sidebar/")) {
      fetch("/api/sidebar-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: currentImageUrl }),
      }).catch(() => { })
    }

    setSettings(defaultSettings)
    setTheme(defaultSettings.themeMode)
    saveSettings(defaultSettings)
  }, [setTheme, saveSettings, settings.sidebarImageUrl])


  // Sync theme mode with next-themes
  useEffect(() => {
    if (mounted && theme && theme !== settings.themeMode) {
      setSettings(prev => ({ ...prev, themeMode: theme as "light" | "dark" | "system" }))
    }
  }, [mounted, theme, settings.themeMode])

  return (
    <ThemeSettingsContext.Provider
      value={{
        ...settings,
        setSidebarMode,
        setSidebarTheme,
        setThemeMode,
        setColorScheme,
        setFontFamily,
        setFontSize,
        setContentMode,
        setContentView,
        setRadius,
        setSidebarImageUrl,
        setSidebarImageBrightness,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  )
}
