"use client"

import { Settings, Monitor, Moon, Sun, PanelLeft, PanelLeftClose, Columns2, Type, Palette, RotateCcw, Maximize2, Minimize2 } from "lucide-react"
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
import { useThemeSettings, type ColorScheme, type FontFamily, type FontSize, type SidebarMode, type ContentMode } from "@/contexts/theme-settings-context"
import { cn } from "@/lib/utils"

const colorSchemes: { value: ColorScheme; label: string; preview: string }[] = [
  { value: "zinc", label: "Zinc", preview: "bg-zinc-500" },
  { value: "slate", label: "Slate", preview: "bg-slate-500" },
  { value: "neutral", label: "Neutral", preview: "bg-neutral-500" },
  { value: "blue", label: "Blue", preview: "bg-blue-500" },
  { value: "green", label: "Green", preview: "bg-emerald-500" },
  { value: "orange", label: "Orange", preview: "bg-orange-500" },
  { value: "rose", label: "Rose", preview: "bg-rose-500" },
]

const fontFamilies: { value: FontFamily; label: string }[] = [
  { value: "geist", label: "Geist" },
  { value: "inter", label: "Inter" },
  { value: "system", label: "System Default" },
]

const fontSizes: { value: FontSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
]

export function ThemeSettingsPanel() {
  const {
    sidebarMode,
    themeMode,
    colorScheme,
    fontFamily,
    fontSize,
    contentMode,
    setSidebarMode,
    setThemeMode,
    setColorScheme,
    setFontFamily,
    setFontSize,
    setContentMode,
    resetToDefaults,
  } = useThemeSettings()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
        >
          <Settings className="size-4" />
          <span className="sr-only">Theme Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[340px] sm:w-[400px] bg-background border-border overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-foreground flex items-center gap-2">
            <Settings className="size-4" />
            Theme Settings
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-xs">
            Customize the appearance and layout of your dashboard
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Sidebar Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PanelLeft className="size-4 text-muted-foreground" />
              <Label className="text-xs font-medium text-foreground uppercase tracking-wider">
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
            <p className="text-[10px] text-muted-foreground/70">
              {sidebarMode === "normal" && "Full sidebar with text labels visible"}
              {sidebarMode === "compact" && "Collapsed sidebar showing only icons"}
              {sidebarMode === "offcanvas" && "Hidden sidebar with floating icon trigger"}
            </p>
          </div>

          <Separator className="bg-border" />

          {/* Theme Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Monitor className="size-4 text-muted-foreground" />
              <Label className="text-xs font-medium text-foreground uppercase tracking-wider">
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
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-muted-foreground" />
              <Label className="text-xs font-medium text-foreground uppercase tracking-wider">
                Color Scheme
              </Label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.value}
                  onClick={() => setColorScheme(scheme.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2 rounded-md border transition-all duration-150",
                    colorScheme === scheme.value
                      ? "border-primary bg-secondary"
                      : "border-border hover:border-border/80 hover:bg-secondary/50"
                  )}
                >
                  <div className={cn("size-6 rounded-full", scheme.preview)} />
                  <span className="text-[10px] text-muted-foreground">{scheme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Typography */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="size-4 text-muted-foreground" />
              <Label className="text-xs font-medium text-foreground uppercase tracking-wider">
                Typography
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground">Font Family</Label>
                <Select value={fontFamily} onValueChange={(value) => setFontFamily(value as FontFamily)}>
                  <SelectTrigger className="h-8 text-xs bg-secondary border-border text-foreground focus:ring-ring">
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
                <Label className="text-[10px] text-muted-foreground">Font Size</Label>
                <Select value={fontSize} onValueChange={(value) => setFontSize(value as FontSize)}>
                  <SelectTrigger className="h-8 text-xs bg-secondary border-border text-foreground focus:ring-ring">
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
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Maximize2 className="size-4 text-muted-foreground" />
              <Label className="text-xs font-medium text-foreground uppercase tracking-wider">
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
                description="Centered, max-width container"
              />
              <ContentModeButton
                mode="full"
                currentMode={contentMode}
                onClick={() => setContentMode("full")}
                icon={<Maximize2 className="size-4" />}
                label="Full Width"
                description="Edge-to-edge content"
              />
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Reset */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="w-full h-8 text-xs border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
          >
            <RotateCcw className="size-3 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
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
        "flex flex-col items-center gap-1.5 p-3 rounded-md border transition-all duration-150",
        currentMode === mode
          ? "border-primary bg-secondary text-foreground"
          : "border-border text-muted-foreground hover:border-border/80 hover:bg-secondary/50 hover:text-foreground/80"
      )}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
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
        "flex flex-col items-center gap-1.5 p-3 rounded-md border transition-all duration-150",
        currentMode === mode
          ? "border-primary bg-secondary text-foreground"
          : "border-border text-muted-foreground hover:border-border/80 hover:bg-secondary/50 hover:text-foreground/80"
      )}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
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
        "flex flex-col items-center gap-1 p-3 rounded-md border transition-all duration-150",
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
