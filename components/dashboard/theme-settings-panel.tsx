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
            <div className="grid grid-cols-4 gap-1.5">
              {colorSchemes.slice(0, 4).map((scheme) => (
                <ColorSchemeButton
                  key={scheme.value}
                  scheme={scheme}
                  isSelected={colorScheme === scheme.value}
                  onClick={() => setColorScheme(scheme.value)}
                />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {colorSchemes.slice(4).map((scheme) => (
                <ColorSchemeButton
                  key={scheme.value}
                  scheme={scheme}
                  isSelected={colorScheme === scheme.value}
                  onClick={() => setColorScheme(scheme.value)}
                />
              ))}
              {/* Empty placeholder to fill the 4th column */}
              <div className="hidden" />
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
                  <SelectTrigger className="h-10 w-full text-xs bg-transparent border-input text-foreground focus:ring-ring hover:bg-accent hover:text-accent-foreground transition-colors">
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
                  <SelectTrigger className="h-10 w-full text-xs bg-transparent border-input text-foreground focus:ring-ring hover:bg-accent hover:text-accent-foreground transition-colors">
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

          {/* Reset */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="w-full h-9 text-xs border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
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
        "flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-md border transition-all duration-150 min-h-[60px]",
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
        "flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-md border transition-all duration-150 min-h-[60px]",
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
        "flex flex-col items-center justify-center gap-1.5 py-2 px-1.5 rounded-md border transition-all duration-150 min-h-[52px]",
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
        "flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-md border transition-all duration-150 min-h-[68px]",
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
