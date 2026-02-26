"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
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
  colorScheme: "blue",
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

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Migrate old color scheme names to new ones
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
        const needsMigration = parsed.colorScheme && migrationMap[parsed.colorScheme]
        if (needsMigration) {
          parsed.colorScheme = migrationMap[parsed.colorScheme]
        }
        setSettings({ ...defaultSettings, ...parsed })
        if (parsed.themeMode) {
          setTheme(parsed.themeMode)
        }
        // Persist migrated settings
        if (needsMigration) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultSettings, ...parsed }))
        }
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, [setTheme])

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: ThemeSettings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
  }, [])

  // Apply settings to document
  useEffect(() => {
    if (!mounted) return

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
