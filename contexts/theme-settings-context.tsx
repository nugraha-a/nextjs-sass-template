"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"

export type SidebarMode = "normal" | "compact" | "offcanvas"
export type SidebarTheme = "default" | "dark" | "brand" | "image" | "aurora"
export type ContentMode = "compact" | "full"
export type ContentView = "carded" | "boxed"
export type FontFamily = "geist" | "inter" | "jakarta" | "open-sans" | "system"
export type FontSize = "small" | "medium" | "large"
export type ColorScheme = "carbon" | "slate" | "navy" | "blue" | "indigo" | "teal" | "green" | "amber" | "crimson"

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
  resetToDefaults: () => void
}

const defaultSettings: ThemeSettings = {
  sidebarMode: "normal",
  sidebarTheme: "brand",
  themeMode: "light",
  colorScheme: "indigo",
  fontFamily: "geist",
  fontSize: "small",
  contentMode: "full",
  contentView: "carded",
  radius: 0.5,
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
  const { setTheme, theme } = useTheme()
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
          zinc: "carbon",
          neutral: "slate",
          orange: "teal",
          rose: "crimson",
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

    // Apply sidebar theme
    root.setAttribute("data-sidebar-theme", settings.sidebarTheme)
    
    // Apply content mode
    root.setAttribute("data-content-mode", settings.contentMode)

    // Apply content view (carded/boxed)
    root.setAttribute("data-content-view", settings.contentView)

    // Apply border radius CSS variable
    root.style.setProperty("--radius", `${settings.radius}rem`)
    
  }, [mounted, settings])

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

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings)
    setTheme(defaultSettings.themeMode)
    saveSettings(defaultSettings)
  }, [setTheme, saveSettings])

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
        resetToDefaults,
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  )
}
