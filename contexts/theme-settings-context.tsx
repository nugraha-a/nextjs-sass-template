"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"

export type SidebarMode = "normal" | "compact" | "offcanvas"
export type ContentMode = "compact" | "full"
export type FontFamily = "geist" | "inter" | "system"
export type FontSize = "small" | "medium" | "large"
export type ColorScheme = "zinc" | "slate" | "neutral" | "blue" | "green" | "orange" | "rose"

interface ThemeSettings {
  sidebarMode: SidebarMode
  themeMode: "light" | "dark" | "system"
  colorScheme: ColorScheme
  fontFamily: FontFamily
  fontSize: FontSize
  contentMode: ContentMode
}

interface ThemeSettingsContextType extends ThemeSettings {
  setSidebarMode: (mode: SidebarMode) => void
  setThemeMode: (mode: "light" | "dark" | "system") => void
  setColorScheme: (scheme: ColorScheme) => void
  setFontFamily: (family: FontFamily) => void
  setFontSize: (size: FontSize) => void
  setContentMode: (mode: ContentMode) => void
  resetToDefaults: () => void
}

const defaultSettings: ThemeSettings = {
  sidebarMode: "normal",
  themeMode: "system",
  colorScheme: "zinc",
  fontFamily: "geist",
  fontSize: "medium",
  contentMode: "full",
}

const ThemeSettingsContext = createContext<ThemeSettingsContextType | null>(null)

export function useThemeSettings() {
  const context = useContext(ThemeSettingsContext)
  if (!context) {
    throw new Error("useThemeSettings must be used within a ThemeSettingsProvider")
  }
  return context
}

const STORAGE_KEY = "aurora-theme-settings"

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
        setSettings({ ...defaultSettings, ...parsed })
        if (parsed.themeMode) {
          setTheme(parsed.themeMode)
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
    
    // Apply content mode
    root.setAttribute("data-content-mode", settings.contentMode)
    
  }, [mounted, settings])

  const setSidebarMode = useCallback((mode: SidebarMode) => {
    setSettings(prev => {
      const newSettings = { ...prev, sidebarMode: mode }
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
        setThemeMode,
        setColorScheme,
        setFontFamily,
        setFontSize,
        setContentMode,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  )
}
