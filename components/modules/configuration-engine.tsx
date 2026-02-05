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

const terminologyConfig = [
  { key: "employee", label: "Employee Term", value: "Employee", options: ["Employee", "Staff", "Team Member", "Associate", "Worker"] },
  { key: "department", label: "Department Term", value: "Department", options: ["Department", "Division", "Unit", "Team", "Section"] },
  { key: "manager", label: "Manager Term", value: "Manager", options: ["Manager", "Supervisor", "Lead", "Head", "Director"] },
  { key: "customer", label: "Customer Term", value: "Customer", options: ["Customer", "Client", "Partner", "Account", "Member"] },
  { key: "invoice", label: "Invoice Term", value: "Invoice", options: ["Invoice", "Bill", "Statement", "Receipt", "Memo"] },
]

const featureFlags = [
  { key: "multi_currency", label: "Multi-Currency Support", description: "Enable transactions in multiple currencies", enabled: true },
  { key: "workflow_approval", label: "Workflow Approvals", description: "Require approval workflows for transactions", enabled: true },
  { key: "audit_logging", label: "Audit Logging", description: "Track all user actions and changes", enabled: true },
  { key: "api_access", label: "API Access", description: "Allow external API integrations", enabled: false },
  { key: "custom_fields", label: "Custom Fields", description: "Enable custom field definitions", enabled: true },
  { key: "document_esign", label: "E-Signatures", description: "Enable electronic document signing", enabled: false },
  { key: "sso_integration", label: "SSO Integration", description: "Single sign-on via SAML/OIDC", enabled: true },
  { key: "mobile_app", label: "Mobile App Access", description: "Enable mobile application access", enabled: false },
]

const localeOptions = {
  languages: ["English (US)", "English (UK)", "Bahasa Indonesia", "Chinese (Simplified)", "Japanese"],
  currencies: ["USD", "EUR", "GBP", "IDR", "JPY", "CNY", "SGD"],
  timezones: ["UTC", "Asia/Jakarta", "Asia/Singapore", "America/New_York", "Europe/London", "Asia/Tokyo"],
  dateFormats: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD.MM.YYYY"],
  fiscalYears: ["January - December", "April - March", "July - June", "October - September"],
}

export function ConfigurationEngine() {
  const [terminology, setTerminology] = useState(
    Object.fromEntries(terminologyConfig.map((t) => [t.key, t.value]))
  )
  const [features, setFeatures] = useState(
    Object.fromEntries(featureFlags.map((f) => [f.key, f.enabled]))
  )
  const [locale, setLocale] = useState({
    language: "English (US)",
    currency: "USD",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    fiscalYear: "January - December",
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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

      <Tabs defaultValue="terminology" className="space-y-6">
        <TabsList className="bg-muted border border-border p-1 h-10">
          <TabsTrigger
            value="terminology"
            className="text-[13px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Tags className="size-3.5 mr-1.5" />
            Terminology
          </TabsTrigger>
          <TabsTrigger
            value="localization"
            className="text-[13px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Globe className="size-3.5 mr-1.5" />
            Localization
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="text-[13px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <ToggleLeft className="size-3.5 mr-1.5" />
            Feature Flags
          </TabsTrigger>
          <TabsTrigger
            value="branding"
            className="text-[13px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Palette className="size-3.5 mr-1.5" />
            Branding
          </TabsTrigger>
        </TabsList>

        {/* Terminology Tab */}
        <TabsContent value="terminology" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-card-foreground">
                Organization Terminology
              </CardTitle>
              <CardDescription className="text-[12px] text-muted-foreground">
                Customize labels to match your organization's language. Changes apply across all modules.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {terminologyConfig.map((term) => (
                  <div key={term.key} className="space-y-2">
                    <Label className="text-[12px] text-muted-foreground">{term.label}</Label>
                    <Select
                      value={terminology[term.key]}
                      onValueChange={(value) =>
                        setTerminology((prev) => ({ ...prev, [term.key]: value }))
                      }
                    >
                      <SelectTrigger className="h-9 bg-background border-input text-[13px] text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {term.options.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <Separator className="bg-border" />

              <div className="space-y-2">
                <Label className="text-[12px] text-muted-foreground">Custom Terms</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Term key (e.g., project)"
                      className="h-9 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                    <Input
                      placeholder="Display label"
                      className="h-9 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-border bg-transparent text-muted-foreground hover:text-foreground"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <Globe className="size-4" />
                  Language & Region
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[12px] text-muted-foreground">Primary Language</Label>
                  <Select
                    value={locale.language}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="h-9 bg-background border-input text-[13px] text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {localeOptions.languages.map((lang) => (
                        <SelectItem
                          key={lang}
                          value={lang}
                          className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-muted-foreground">Timezone</Label>
                  <Select
                    value={locale.timezone}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger className="h-9 bg-background border-input text-[13px] text-foreground">
                      <Clock className="size-3.5 mr-2 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {localeOptions.timezones.map((tz) => (
                        <SelectItem
                          key={tz}
                          value={tz}
                          className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-muted-foreground">Date Format</Label>
                  <Select
                    value={locale.dateFormat}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger className="h-9 bg-background border-input text-[13px] text-foreground">
                      <Calendar className="size-3.5 mr-2 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {localeOptions.dateFormats.map((fmt) => (
                        <SelectItem
                          key={fmt}
                          value={fmt}
                          className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {fmt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Financial Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[12px] text-muted-foreground">Base Currency</Label>
                  <Select
                    value={locale.currency}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="h-9 bg-background border-input text-[13px] text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {localeOptions.currencies.map((cur) => (
                        <SelectItem
                          key={cur}
                          value={cur}
                          className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {cur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-muted-foreground">Fiscal Year</Label>
                  <Select
                    value={locale.fiscalYear}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, fiscalYear: value }))}
                  >
                    <SelectTrigger className="h-9 bg-background border-input text-[13px] text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {localeOptions.fiscalYears.map((fy) => (
                        <SelectItem
                          key={fy}
                          value={fy}
                          className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {fy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-muted-foreground">Number Format</Label>
                  <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                    <Badge variant="secondary" className="bg-secondary text-muted-foreground border-border">
                      1,234.56
                    </Badge>
                    <span className="text-muted-foreground/70">Based on locale settings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Flags Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground">
                Feature Toggles
              </CardTitle>
              <CardDescription className="text-[12px] text-muted-foreground">
                Enable or disable features for this tenant. Changes take effect immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {featureFlags.map((feature) => (
                  <div
                    key={feature.key}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-foreground">
                          {feature.label}
                        </span>
                        {features[feature.key] ? (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-[10px]">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-[12px] text-muted-foreground">{feature.description}</p>
                    </div>
                    <Switch
                      checked={features[feature.key]}
                      onCheckedChange={(checked) =>
                        setFeatures((prev) => ({ ...prev, [feature.key]: checked }))
                      }
                      className="data-[state=checked]:bg-zinc-100"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[12px] text-muted-foreground">Organization Name</Label>
                  <Input
                    defaultValue="Aurora Reforged"
                    className="h-9 bg-background border-input text-[13px] text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-muted-foreground">Tagline</Label>
                  <Input
                    defaultValue="One Platform. Infinite Configurations."
                    className="h-9 bg-background border-input text-[13px] text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-muted-foreground">Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-16 rounded-lg bg-secondary border border-border">
                      <Palette className="size-6 text-muted-foreground" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground"
                    >
                      Upload Logo
                    </Button>
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
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[12px] text-muted-foreground">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-md bg-secondary border border-border" />
                      <Input
                        defaultValue="#FAFAFA"
                        className="h-9 bg-background border-input text-[13px] text-foreground font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] text-muted-foreground">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-md bg-muted border border-border" />
                      <Input
                        defaultValue="#3F3F46"
                        className="h-9 bg-background border-input text-[13px] text-foreground font-mono"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-muted-foreground">Theme Mode</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 border-border bg-secondary text-foreground"
                    >
                      Dark
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 border-border bg-transparent text-muted-foreground"
                    >
                      Light
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 border-border bg-transparent text-muted-foreground"
                    >
                      System
                    </Button>
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
