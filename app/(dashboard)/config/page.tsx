"use client"

import { useState } from "react"
import {
  Globe,
  Palette,
  Tags,
  ToggleLeft,
  Calendar,
  DollarSign,
  Clock,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Info,
  Upload,
  Sun,
  Moon,
  Monitor,
  Languages,
  Hash,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

/* ─── Data ─────────────────────────────────────────────── */

const terminologyConfig = [
  { key: "employee", label: "Employee Term", description: "How team members are referred to", value: "Employee", options: ["Employee", "Staff", "Team Member", "Associate", "Worker"] },
  { key: "department", label: "Department Term", description: "Organizational unit naming", value: "Department", options: ["Department", "Division", "Unit", "Team", "Section"] },
  { key: "manager", label: "Manager Term", description: "Leadership role label", value: "Manager", options: ["Manager", "Supervisor", "Lead", "Head", "Director"] },
  { key: "customer", label: "Customer Term", description: "External party naming", value: "Customer", options: ["Customer", "Client", "Partner", "Account", "Member"] },
  { key: "invoice", label: "Invoice Term", description: "Billing document naming", value: "Invoice", options: ["Invoice", "Bill", "Statement", "Receipt", "Memo"] },
]

const featureFlags = [
  { key: "multi_currency", label: "Multi-Currency Support", description: "Enable transactions in multiple currencies with real-time conversion", enabled: true, category: "Financial" },
  { key: "workflow_approval", label: "Workflow Approvals", description: "Require approval workflows for sensitive transactions", enabled: true, category: "Process" },
  { key: "audit_logging", label: "Audit Logging", description: "Track all user actions and data changes for compliance", enabled: true, category: "Security" },
  { key: "api_access", label: "API Access", description: "Allow external API integrations and webhooks", enabled: false, category: "Integration" },
  { key: "custom_fields", label: "Custom Fields", description: "Enable custom field definitions on entities", enabled: true, category: "Data" },
  { key: "document_esign", label: "E-Signatures", description: "Electronic document signing via DocuSign/HelloSign", enabled: false, category: "Process" },
  { key: "sso_integration", label: "SSO Integration", description: "Single sign-on via SAML 2.0 or OIDC", enabled: true, category: "Security" },
  { key: "mobile_app", label: "Mobile App Access", description: "Enable native mobile application access", enabled: false, category: "Integration" },
]

const localeOptions = {
  languages: ["English (US)", "English (UK)", "Bahasa Indonesia", "Chinese (Simplified)", "Japanese"],
  currencies: ["USD — US Dollar", "EUR — Euro", "GBP — British Pound", "IDR — Indonesian Rupiah", "JPY — Japanese Yen", "CNY — Chinese Yuan", "SGD — Singapore Dollar"],
  timezones: ["UTC (±00:00)", "Asia/Jakarta (GMT+7)", "Asia/Singapore (GMT+8)", "America/New_York (GMT-5)", "Europe/London (GMT+0)", "Asia/Tokyo (GMT+9)"],
  dateFormats: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD.MM.YYYY"],
  fiscalYears: ["January — December", "April — March", "July — June", "October — September"],
}

/* ─── Shared Field Wrapper ─────────────────────────────── */

function FormField({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div>
        <Label className="text-[13px] font-medium text-foreground">{label}</Label>
        {description && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────── */

export default function ConfigPage() {
  const [terminology, setTerminology] = useState(
    Object.fromEntries(terminologyConfig.map((t) => [t.key, t.value]))
  )
  const [features, setFeatures] = useState(
    Object.fromEntries(featureFlags.map((f) => [f.key, f.enabled]))
  )
  const [locale, setLocale] = useState({
    language: "English (US)",
    currency: "USD — US Dollar",
    timezone: "Asia/Jakarta (GMT+7)",
    dateFormat: "DD/MM/YYYY",
    fiscalYear: "January — December",
  })
  const [customTerms, setCustomTerms] = useState<{ key: string; label: string }[]>([])
  const [newTermKey, setNewTermKey] = useState("")
  const [newTermLabel, setNewTermLabel] = useState("")

  const addCustomTerm = () => {
    if (newTermKey.trim() && newTermLabel.trim()) {
      setCustomTerms((prev) => [...prev, { key: newTermKey.trim(), label: newTermLabel.trim() }])
      setNewTermKey("")
      setNewTermLabel("")
    }
  }

  const removeCustomTerm = (index: number) => {
    setCustomTerms((prev) => prev.filter((_, i) => i !== index))
  }

  const enabledCount = Object.values(features).filter(Boolean).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Configuration Engine
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Customize terminology, localization, and feature toggles without code changes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <RotateCcw className="size-3.5 mr-1.5" />
            Reset
          </Button>
          <Button
            size="sm"
            className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="size-3.5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="terminology" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            {[
              { value: "terminology", icon: Tags, label: "Terminology" },
              { value: "localization", icon: Globe, label: "Localization" },
              { value: "features", icon: ToggleLeft, label: "Feature Flags" },
              { value: "branding", icon: Palette, label: "Branding" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none"
              >
                <tab.icon className="size-3.5 mr-1.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ═══ Terminology Tab ═══ */}
        <TabsContent value="terminology" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Organization Terminology
              </CardTitle>
              <CardDescription className="text-[12px] text-muted-foreground">
                Customize labels to match your organization&apos;s language. Changes apply across all modules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {terminologyConfig.map((term) => (
                  <FormField key={term.key} label={term.label} description={term.description}>
                    <Select
                      value={terminology[term.key]}
                      onValueChange={(value) =>
                        setTerminology((prev) => ({ ...prev, [term.key]: value }))
                      }
                    >
                      <SelectTrigger className="h-10 bg-background border-input text-[13px] text-foreground cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {term.options.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Terms */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Custom Terms
              </CardTitle>
              <CardDescription className="text-[12px] text-muted-foreground">
                Define additional terminology mappings for your organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing custom terms */}
              {customTerms.length > 0 && (
                <div className="space-y-2">
                  {customTerms.map((term, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50"
                    >
                      <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 text-primary">
                        <Hash className="size-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-foreground">{term.label}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{term.key}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeCustomTerm(index)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-[12px] text-muted-foreground">Term Key</Label>
                  <Input
                    value={newTermKey}
                    onChange={(e) => setNewTermKey(e.target.value)}
                    placeholder="e.g., project"
                    className="h-10 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground/50 font-mono"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-[12px] text-muted-foreground">Display Label</Label>
                  <Input
                    value={newTermLabel}
                    onChange={(e) => setNewTermLabel(e.target.value)}
                    placeholder="e.g., Project"
                    className="h-10 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
                  onClick={addCustomTerm}
                >
                  <Plus className="size-3.5 mr-1.5" />
                  Add
                </Button>
              </div>

              {/* Empty state */}
              {customTerms.length === 0 && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/30 border border-dashed border-border/50">
                  <Info className="size-3.5 text-muted-foreground/50 shrink-0" />
                  <p className="text-[12px] text-muted-foreground/70">
                    No custom terms defined yet. Add your first custom terminology mapping above.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ Localization Tab ═══ */}
        <TabsContent value="localization" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground flex items-center gap-2">
                    <Languages className="size-4 text-muted-foreground" />
                    Language & Region
                  </CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground mt-1">
                    Set your preferred language, timezone, and regional formats
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <FormField label="Primary Language" description="Interface language for all users">
                  <Select
                    value={locale.language}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="h-10 bg-background border-input text-[13px] text-foreground cursor-pointer">
                      <Globe className="size-3.5 mr-2 text-muted-foreground shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {localeOptions.languages.map((lang) => (
                        <SelectItem
                          key={lang}
                          value={lang}
                          className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        >
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Timezone" description="Determines how dates and times are displayed">
                  <Select
                    value={locale.timezone}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger className="h-10 bg-background border-input text-[13px] text-foreground cursor-pointer">
                      <Clock className="size-3.5 mr-2 text-muted-foreground shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {localeOptions.timezones.map((tz) => (
                        <SelectItem
                          key={tz}
                          value={tz}
                          className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        >
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Date Format" description="How dates are formatted across the app">
                  <Select
                    value={locale.dateFormat}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger className="h-10 bg-background border-input text-[13px] text-foreground cursor-pointer">
                      <Calendar className="size-3.5 mr-2 text-muted-foreground shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {localeOptions.dateFormats.map((fmt) => (
                        <SelectItem
                          key={fmt}
                          value={fmt}
                          className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        >
                          {fmt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <DollarSign className="size-4 text-muted-foreground" />
                  Financial Settings
                </CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground mt-1">
                  Configure currency, fiscal year, and number formatting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <FormField label="Base Currency" description="Primary currency for all financial reports">
                  <Select
                    value={locale.currency}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="h-10 bg-background border-input text-[13px] text-foreground cursor-pointer">
                      <DollarSign className="size-3.5 mr-2 text-muted-foreground shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {localeOptions.currencies.map((cur) => (
                        <SelectItem
                          key={cur}
                          value={cur}
                          className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        >
                          {cur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Fiscal Year" description="Accounting period for financial reporting">
                  <Select
                    value={locale.fiscalYear}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, fiscalYear: value }))}
                  >
                    <SelectTrigger className="h-10 bg-background border-input text-[13px] text-foreground cursor-pointer">
                      <Calendar className="size-3.5 mr-2 text-muted-foreground shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {localeOptions.fiscalYears.map((fy) => (
                        <SelectItem
                          key={fy}
                          value={fy}
                          className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        >
                          {fy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <div className="space-y-1.5">
                  <Label className="text-[13px] font-medium text-foreground">Number Format</Label>
                  <p className="text-[11px] text-muted-foreground">Preview based on your locale settings</p>
                  <div className="flex items-center gap-3 mt-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-muted-foreground">Number:</span>
                      <Badge variant="secondary" className="font-mono text-[12px] bg-background border-border">
                        1,234.56
                      </Badge>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-muted-foreground">Currency:</span>
                      <Badge variant="secondary" className="font-mono text-[12px] bg-background border-border">
                        $1,234.56
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ═══ Feature Flags Tab ═══ */}
        <TabsContent value="features" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-foreground">
                    Feature Toggles
                  </CardTitle>
                  <CardDescription className="text-[12px] text-muted-foreground">
                    Enable or disable features for this tenant. Changes take effect immediately.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-[11px] bg-primary/10 text-primary border-0">
                  {enabledCount}/{featureFlags.length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {featureFlags.map((flag) => (
                  <div
                    key={flag.key}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-transparent hover:border-border/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                       <div className={`flex items-center justify-center size-9 rounded-lg transition-colors ${
                         features[flag.key] ? "bg-primary/10 text-primary" : "bg-muted border border-border/50 text-muted-foreground"
                       }`}>
                          {features[flag.key] ? <ToggleLeft className="size-5 rotate-180" /> : <ToggleLeft className="size-5 text-muted-foreground/50" />}
                       </div>
                       <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={flag.key} className="text-[13px] font-medium text-foreground cursor-pointer">
                              {flag.label}
                            </Label>
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border/50 text-muted-foreground/60 font-normal hidden sm:inline-flex">
                              {flag.category}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {flag.description}
                          </p>
                       </div>
                    </div>
                    <Switch
                      id={flag.key}
                      checked={features[flag.key]}
                      onCheckedChange={(checked) =>
                        setFeatures((prev) => ({ ...prev, [flag.key]: checked }))
                      }
                      className="data-[state=checked]:bg-primary cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ Branding Tab ═══ */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-foreground">
                  Brand Identity
                </CardTitle>
                <CardDescription className="text-[12px] text-muted-foreground">
                  Customize the platform appearance for your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <FormField label="Organization Name" description="Displayed in the sidebar header and emails">
                  <Input
                    defaultValue="Aurora Reforged"
                    className="h-10 bg-background border-input text-[13px] text-foreground"
                  />
                </FormField>

                <FormField label="Tagline" description="Shown on login page and marketing materials">
                  <Input
                    defaultValue="One Platform. Infinite Configurations."
                    className="h-10 bg-background border-input text-[13px] text-foreground"
                  />
                </FormField>

                <div className="space-y-1.5">
                  <Label className="text-[13px] font-medium text-foreground">Logo</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Recommended: 512×512px, PNG or SVG
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center justify-center size-16 rounded-lg bg-muted/50 border-2 border-dashed border-border">
                      <Palette className="size-6 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
                      >
                        <Upload className="size-3.5 mr-1.5" />
                        Upload Logo
                      </Button>
                      <p className="text-[10px] text-muted-foreground/50">Max file size: 2MB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Color Theme
                </CardTitle>
                <CardDescription className="text-[12px] text-muted-foreground">
                  Define your brand colors for the interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-5 grid-cols-2">
                  <FormField label="Primary Color">
                    <div className="flex items-center gap-2">
                      <label className="size-10 rounded-lg bg-primary border border-border cursor-pointer shrink-0 hover:ring-2 hover:ring-primary/30 transition-all">
                        <input type="color" className="sr-only" defaultValue="#FAFAFA" />
                      </label>
                      <Input
                        defaultValue="#FAFAFA"
                        className="h-10 bg-background border-input text-[13px] text-foreground font-mono uppercase"
                      />
                    </div>
                  </FormField>
                  <FormField label="Accent Color">
                    <div className="flex items-center gap-2">
                      <label className="size-10 rounded-lg bg-muted border border-border cursor-pointer shrink-0 hover:ring-2 hover:ring-primary/30 transition-all">
                        <input type="color" className="sr-only" defaultValue="#3F3F46" />
                      </label>
                      <Input
                        defaultValue="#3F3F46"
                        className="h-10 bg-background border-input text-[13px] text-foreground font-mono uppercase"
                      />
                    </div>
                  </FormField>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-1.5">
                  <Label className="text-[13px] font-medium text-foreground">Theme Mode</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Default appearance for new users
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      { value: "dark", label: "Dark", icon: Moon, active: true },
                      { value: "light", label: "Light", icon: Sun, active: false },
                      { value: "system", label: "System", icon: Monitor, active: false },
                    ].map((mode) => (
                      <Button
                        key={mode.value}
                        variant="outline"
                        size="sm"
                        className={`h-10 border-border gap-1.5 ${
                          mode.active
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <mode.icon className="size-3.5" />
                        {mode.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
