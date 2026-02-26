"use client"

import { useState, useRef } from "react"
import { Settings, Monitor, Moon, Sun, PanelLeft, PanelLeftClose, Columns2, Type, Palette, RotateCcw, Maximize2, Minimize2, LayoutGrid, Layers, Paintbrush, Upload, ImageIcon, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useThemeSettings, type ColorScheme, type FontFamily, type FontSize, type SidebarMode, type SidebarTheme, type ContentMode, type ContentView } from "@/contexts/theme-settings-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const colorSchemes: { value: ColorScheme; label: string; preview: string }[] = [
  { value: "default", label: "Default", preview: "bg-[#023047]" },
  { value: "neutral", label: "Neutral", preview: "bg-[#42526D]" },
  { value: "sky", label: "Sky", preview: "bg-[#0EA5E9]" },
  { value: "navy", label: "Navy", preview: "bg-[#023047]" },
  { value: "blue", label: "Blue", preview: "bg-[#007AFF]" },
  { value: "cyan", label: "Cyan", preview: "bg-[#219EBC]" },
  { value: "yellow", label: "Yellow", preview: "bg-[#F59E0B]" },
  { value: "orange", label: "Orange", preview: "bg-[#FB8500]" },
]

const fontFamilies: { value: FontFamily; label: string }[] = [
  { value: "open-sans", label: "Open Sans" },
  { value: "jakarta", label: "Jakarta Sans" },
  { value: "inter", label: "Inter (Default)" },
  { value: "geist", label: "Geist" },
]

const fontSizes: { value: FontSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
]

export function ThemeSettingsPanel() {
  const {
    sidebarMode,
    sidebarTheme,
    themeMode,
    colorScheme,
    fontFamily,
    fontSize,
    contentMode,
    contentView,
    radius,
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
  } = useThemeSettings()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150 cursor-pointer"
        >
          <Settings className="size-4" />
          <span className="sr-only">Theme Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[320px] sm:w-[360px] bg-background border-border overflow-y-auto p-0 flex flex-col h-full">
        <div className="p-6 border-b border-border shrink-0">
          <SheetHeader className="p-0">
            <SheetTitle className="text-foreground flex items-center gap-2 text-base font-semibold">
              <Settings className="size-4" />
              Theme Settings
            </SheetTitle>
            <SheetDescription className="text-muted-foreground text-xs mt-1">
              Customize the appearance and layout of your dashboard
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sidebar Settings */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <PanelLeft className="size-4 text-muted-foreground" />
              <Label className="text-[11px] font-medium text-foreground uppercase tracking-wider">
                Sidebar Mode
              </Label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <SidebarModeButton
                mode="normal"
                currentMode={sidebarMode}
                onClick={() => setSidebarMode("normal")}
                icon={<PanelLeft className="size-4" />}
                label="Normal"
              />
              <SidebarModeButton
                mode="compact"
                currentMode={sidebarMode}
                onClick={() => setSidebarMode("compact")}
                icon={<PanelLeftClose className="size-4" />}
                label="Compact"
              />
              <SidebarModeButton
                mode="offcanvas"
                currentMode={sidebarMode}
                onClick={() => setSidebarMode("offcanvas")}
                icon={<Columns2 className="size-4" />}
                label="Offcanvas"
              />
            </div>
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
              {sidebarMode === "normal" && "Full sidebar with text labels visible"}
              {sidebarMode === "compact" && "Collapsed sidebar showing only icons"}
              {sidebarMode === "offcanvas" && "Hidden sidebar with floating icon trigger"}
            </p>
          </div>

          <Separator className="bg-border" />

          {/* Sidebar Theme */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Paintbrush className="size-4 text-muted-foreground" />
              <Label className="text-[11px] font-medium text-foreground uppercase tracking-wider">
                Sidebar Theme
              </Label>
            </div>
            {themeMode === "dark" || (themeMode === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
              <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                Sidebar theme is locked to Default in dark mode
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <SidebarThemeButton
                    theme="default"
                    currentTheme={sidebarTheme}
                    onClick={() => setSidebarTheme("default")}
                    label="Default"
                  />
                  <SidebarThemeButton
                    theme="dark"
                    currentTheme={sidebarTheme}
                    onClick={() => setSidebarTheme("dark")}
                    label="Dark"
                  />
                  <SidebarThemeButton
                    theme="brand"
                    currentTheme={sidebarTheme}
                    onClick={() => setSidebarTheme("brand")}
                    label="Brand"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <SidebarThemeButton
                    theme="image"
                    currentTheme={sidebarTheme}
                    onClick={() => setSidebarTheme("image")}
                    label="Image"
                  />
                  <SidebarThemeButton
                    theme="aurora"
                    currentTheme={sidebarTheme}
                    onClick={() => setSidebarTheme("aurora")}
                    label="Aurora"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                  {sidebarTheme === "default" && "Standard sidebar following global theme"}
                  {sidebarTheme === "dark" && "Always dark, harmonized with color scheme"}
                  {sidebarTheme === "brand" && "Solid primary color background"}
                  {sidebarTheme === "image" && "Custom background with a tinted overlay. Choose from Unsplash Default or upload your own image (Darker images recommended, Max size: 2MB)."}
                  {sidebarTheme === "aurora" && "Gradient mesh with color accents"}
                </p>
                {sidebarTheme === "image" && (
                  <SidebarImageSection />
                )}
              </>
            )}
          </div>

          <Separator className="bg-border" />

          {/* Theme Mode */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Monitor className="size-4 text-muted-foreground" />
              <Label className="text-[11px] font-medium text-foreground uppercase tracking-wider">
                Theme Mode
              </Label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <ThemeModeButton
                mode="light"
                currentMode={themeMode}
                onClick={() => setThemeMode("light")}
                icon={<Sun className="size-4" />}
                label="Light"
              />
              <ThemeModeButton
                mode="dark"
                currentMode={themeMode}
                onClick={() => setThemeMode("dark")}
                icon={<Moon className="size-4" />}
                label="Dark"
              />
              <ThemeModeButton
                mode="system"
                currentMode={themeMode}
                onClick={() => setThemeMode("system")}
                icon={<Monitor className="size-4" />}
                label="System"
              />
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Color Scheme */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-muted-foreground" />
              <Label className="text-[11px] font-medium text-foreground uppercase tracking-wider">
                Color Scheme
              </Label>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {colorSchemes.map((scheme) => (
                <ColorSchemeButton
                  key={scheme.value}
                  scheme={scheme}
                  isSelected={colorScheme === scheme.value}
                  onClick={() => setColorScheme(scheme.value)}
                />
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Typography */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Type className="size-4 text-muted-foreground" />
              <Label className="text-[11px] font-medium text-foreground uppercase tracking-wider">
                Typography
              </Label>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Font Family</Label>
                  <span className="text-[9px] text-muted-foreground/50">{fontFamilies.find(f => f.value === fontFamily)?.label}</span>
                </div>
                <Select value={fontFamily} onValueChange={(value) => setFontFamily(value as FontFamily)}>
                  <SelectTrigger className="h-10 w-full text-xs bg-transparent border-input text-foreground focus:ring-ring hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {fontFamilies.map((font) => (
                      <SelectItem
                        key={font.value}
                        value={font.value}
                        className="text-foreground focus:bg-accent focus:text-accent-foreground text-xs"
                      >
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Font Size</Label>
                  <span className="text-[9px] text-muted-foreground/50">{fontSizes.find(f => f.value === fontSize)?.label}</span>
                </div>
                <Select value={fontSize} onValueChange={(value) => setFontSize(value as FontSize)}>
                  <SelectTrigger className="h-10 w-full text-xs bg-transparent border-input text-foreground focus:ring-ring hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {fontSizes.map((size) => (
                      <SelectItem
                        key={size.value}
                        value={size.value}
                        className="text-foreground focus:bg-accent focus:text-accent-foreground text-xs"
                      >
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Content Mode */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Maximize2 className="size-4 text-muted-foreground" />
              <Label className="text-[11px] font-medium text-foreground uppercase tracking-wider">
                Content Width
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ContentModeButton
                mode="compact"
                currentMode={contentMode}
                onClick={() => setContentMode("compact")}
                icon={<Minimize2 className="size-4" />}
                label="Compact"
                description="Max-width container"
              />
              <ContentModeButton
                mode="full"
                currentMode={contentMode}
                onClick={() => setContentMode("full")}
                icon={<Maximize2 className="size-4" />}
                label="Full Width"
                description="Edge-to-edge"
              />
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Layout & Spacing */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-4 text-muted-foreground" />
              <Label className="text-[11px] font-medium text-foreground uppercase tracking-wider">
                Layout & Spacing
              </Label>
            </div>

            {/* Content View Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Content View</Label>
                <span className="text-[9px] text-muted-foreground/50">{contentView === 'carded' ? 'Carded' : 'Boxed'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ContentViewButton
                  view="carded"
                  currentView={contentView}
                  onClick={() => setContentView("carded")}
                  label="Carded"
                  description="Floating cards"
                />
                <ContentViewButton
                  view="boxed"
                  currentView={contentView}
                  onClick={() => setContentView("boxed")}
                  label="Boxed"
                  description="Connected grid"
                />
              </div>
            </div>

            {/* Border Radius Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Border Radius</Label>
                <span className="text-[9px] text-muted-foreground/50">{radius.toFixed(1)} rem</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground/40">
                <span>Sharp</span>
                <span>Rounded</span>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Reset */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="w-full h-9 text-xs border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150 cursor-pointer"
          >
            <RotateCcw className="size-3 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const DEFAULT_UNSPLASH_URL = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80"
const BRIGHTNESS_LABELS = { bright: "Bright", medium: "Medium", dark: "Dark" } as const

/** Analyze average brightness of an image file using Canvas */
function analyzeImageBrightness(file: File): Promise<"bright" | "medium" | "dark"> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      // Use small canvas for performance (max 100px wide)
      const scale = Math.min(1, 100 / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)

      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, w, h)

      const imageData = ctx.getImageData(0, 0, w, h)
      const data = imageData.data
      let totalLuminance = 0
      let pixelCount = 0

      // Sample every 4th pixel for speed
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        // Relative luminance (perceptual)
        totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b
        pixelCount++
      }

      const avgBrightness = totalLuminance / pixelCount
      URL.revokeObjectURL(img.src)

      if (avgBrightness > 160) resolve("bright")
      else if (avgBrightness > 80) resolve("medium")
      else resolve("dark")
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      resolve("medium") // fallback
    }
    img.src = URL.createObjectURL(file)
  })
}

function SidebarImageSection() {
  const {
    sidebarImageUrl, setSidebarImageUrl,
    sidebarImageBrightness, setSidebarImageBrightness,
  } = useThemeSettings()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingPreview, setPendingPreview] = useState<string | null>(null)
  const [pendingBrightness, setPendingBrightness] = useState<"bright" | "medium" | "dark" | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const currentImage = sidebarImageUrl || DEFAULT_UNSPLASH_URL
  const isCustom = !!sidebarImageUrl
  const displayBrightness = pendingBrightness || sidebarImageBrightness || "dark"

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP formats are allowed")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 2MB")
      return
    }

    // Analyze brightness
    const brightness = await analyzeImageBrightness(file)

    setPendingFile(file)
    setPendingPreview(URL.createObjectURL(file))
    setPendingBrightness(brightness)

    // Reset input so re-selecting same file works
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleConfirm = async () => {
    if (!pendingFile) return
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", pendingFile)

      const headers: HeadersInit = {}
      if (sidebarImageUrl) {
        headers["x-old-image"] = sidebarImageUrl
      }

      const res = await fetch("/api/sidebar-image", {
        method: "POST",
        headers,
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Upload failed")
      }

      const { url } = await res.json()
      setSidebarImageUrl(url)
      setSidebarImageBrightness(pendingBrightness)
      toast.success("Sidebar image updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview)
      setPendingFile(null)
      setPendingPreview(null)
      setPendingBrightness(null)
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview)
    setPendingFile(null)
    setPendingPreview(null)
    setPendingBrightness(null)
  }

  const handleReset = async () => {
    if (!sidebarImageUrl) return

    try {
      await fetch("/api/sidebar-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sidebarImageUrl }),
      })
    } catch {
      // Silently continue — file may not exist
    }

    setSidebarImageUrl(null)
    setSidebarImageBrightness(null)
    toast.success("Reset to default image")
  }

  return (
    <div className="mt-2 space-y-2 rounded-md border border-border bg-secondary/30 p-2.5">
      <div className="flex items-center gap-1.5">
        <ImageIcon className="size-3.5 text-muted-foreground" />
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Background Image
        </span>
      </div>

      {/* Current / Pending preview */}
      <div className="relative overflow-hidden rounded-md border border-border aspect-[16/9] bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pendingPreview || currentImage}
          alt="Sidebar background"
          className="w-full h-full object-cover"
        />
        {pendingPreview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-[10px] font-medium text-white bg-black/50 px-2 py-0.5 rounded">
              Preview
            </span>
          </div>
        )}
        {!pendingPreview && isCustom && (
          <div className="absolute top-1 right-1">
            <span className="text-[9px] font-medium text-white bg-primary/80 px-1.5 py-0.5 rounded">
              Custom
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {pendingPreview ? (
        <div className="flex gap-1.5">
          <button
            onClick={handleConfirm}
            disabled={isUploading}
            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Check className="size-3" />
            {isUploading ? "Uploading..." : "Confirm"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium py-1.5 rounded-md border border-border hover:bg-secondary disabled:opacity-50 transition-colors cursor-pointer"
          >
            <X className="size-3" />
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-medium py-1.5 rounded-md border border-border hover:bg-secondary transition-colors cursor-pointer"
          >
            <Upload className="size-3" />
            Upload Image
          </button>
          {isCustom && (
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1 text-[10px] font-medium py-1.5 px-2 rounded-md border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

function SidebarModeButton({
  mode,
  currentMode,
  onClick,
  icon,
  label,
}: {
  mode: SidebarMode
  currentMode: SidebarMode
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-md border transition-all duration-150 min-h-[60px] cursor-pointer",
        currentMode === mode
          ? "border-primary bg-secondary text-foreground"
          : "border-border text-muted-foreground hover:border-border/80 hover:bg-secondary/50 hover:text-foreground/80"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

function SidebarThemeButton({
  theme,
  currentTheme,
  onClick,
  label,
}: {
  theme: SidebarTheme
  currentTheme: SidebarTheme
  onClick: () => void
  label: string
}) {
  const previewStyles: Record<SidebarTheme, string> = {
    default: "bg-sidebar border border-sidebar-border",
    dark: "bg-zinc-900 border border-zinc-700",
    brand: "bg-primary border border-primary",
    image: "border border-slate-600 bg-cover bg-center",
    aurora: "bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900 border border-indigo-700/50",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-md border transition-all duration-150 min-h-[60px] cursor-pointer",
        currentTheme === theme
          ? "border-primary bg-secondary text-foreground"
          : "border-border text-muted-foreground hover:border-border/80 hover:bg-secondary/50 hover:text-foreground/80"
      )}
    >
      <div
        className={cn("w-8 h-5 rounded-sm", previewStyles[theme])}
        style={theme === "image" ? {
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1519681393784-d120267933ba?w=100&q=60")`,
        } : undefined}
      />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

function ThemeModeButton({
  mode,
  currentMode,
  onClick,
  icon,
  label,
}: {
  mode: "light" | "dark" | "system"
  currentMode: string
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-md border transition-all duration-150 min-h-[60px] cursor-pointer",
        currentMode === mode
          ? "border-primary bg-secondary text-foreground"
          : "border-border text-muted-foreground hover:border-border/80 hover:bg-secondary/50 hover:text-foreground/80"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

function ColorSchemeButton({
  scheme,
  isSelected,
  onClick,
}: {
  scheme: { value: ColorScheme; label: string; preview: string }
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 py-2 px-1.5 rounded-md border transition-all duration-150 min-h-[52px] cursor-pointer",
        isSelected
          ? "border-primary bg-secondary"
          : "border-border hover:border-border/80 hover:bg-secondary/50"
      )}
    >
      <div className={cn("size-5 rounded-full", scheme.preview)} />
      <span className="text-[9px] text-muted-foreground font-medium">{scheme.label}</span>
    </button>
  )
}

function ContentModeButton({
  mode,
  currentMode,
  onClick,
  icon,
  label,
  description,
}: {
  mode: ContentMode
  currentMode: ContentMode
  onClick: () => void
  icon: React.ReactNode
  label: string
  description: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-md border transition-all duration-150 min-h-[68px] cursor-pointer",
        currentMode === mode
          ? "border-primary bg-secondary text-foreground"
          : "border-border text-muted-foreground hover:border-border/80 hover:bg-secondary/50 hover:text-foreground/80"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
      <span className="text-[9px] text-muted-foreground/70">{description}</span>
    </button>
  )
}

function ContentViewButton({
  view,
  currentView,
  onClick,
  label,
  description,
}: {
  view: ContentView
  currentView: ContentView
  onClick: () => void
  label: string
  description: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-md border transition-all duration-150 min-h-[68px] cursor-pointer",
        currentView === view
          ? "border-primary bg-secondary text-foreground"
          : "border-border text-muted-foreground hover:border-border/80 hover:bg-secondary/50 hover:text-foreground/80"
      )}
    >
      {view === "carded" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-current">
          <rect x="2" y="2" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="2" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2" y="13" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="13" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-current">
          <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      )}
      <span className="text-[10px] font-medium">{label}</span>
      <span className="text-[9px] text-muted-foreground/70">{description}</span>
    </button>
  )
}
