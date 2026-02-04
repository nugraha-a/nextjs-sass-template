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
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Configuration Engine
          </h1>
          <p className="text-[13px] text-zinc-500 mt-1">
            Customize terminology, localization, and feature toggles without code changes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          >
            <RotateCcw className="size-3.5 mr-1.5" />
            Reset
          </Button>
          <Button
            size="sm"
            className="h-8 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          >
            <Save className="size-3.5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="terminology" className="space-y-6">
        <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1 h-10">
          <TabsTrigger
            value="terminology"
            className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
          >
            <Tags className="size-3.5 mr-1.5" />
            Terminology
          </TabsTrigger>
          <TabsTrigger
            value="localization"
            className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
          >
            <Globe className="size-3.5 mr-1.5" />
            Localization
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
          >
            <ToggleLeft className="size-3.5 mr-1.5" />
            Feature Flags
          </TabsTrigger>
          <TabsTrigger
            value="branding"
            className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
          >
            <Palette className="size-3.5 mr-1.5" />
            Branding
          </TabsTrigger>
        </TabsList>

        {/* Terminology Tab */}
        <TabsContent value="terminology" className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-100">
                Organization Terminology
              </CardTitle>
              <CardDescription className="text-[12px] text-zinc-500">
                Customize labels to match your organization's language. Changes apply across all modules.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {terminologyConfig.map((term) => (
                  <div key={term.key} className="space-y-2">
                    <Label className="text-[12px] text-zinc-500">{term.label}</Label>
                    <Select
                      value={terminology[term.key]}
                      onValueChange={(value) =>
                        setTerminology((prev) => ({ ...prev, [term.key]: value }))
                      }
                    >
                      <SelectTrigger className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        {term.options.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="text-[13px] text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <Separator className="bg-zinc-800/50" />

              <div className="space-y-2">
                <Label className="text-[12px] text-zinc-500">Custom Terms</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Term key (e.g., project)"
                      className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100 placeholder:text-zinc-600"
                    />
                    <Input
                      placeholder="Display label"
                      className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100 placeholder:text-zinc-600"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-100"
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
            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                  <Globe className="size-4" />
                  Language & Region
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[12px] text-zinc-500">Primary Language</Label>
                  <Select
                    value={locale.language}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {localeOptions.languages.map((lang) => (
                        <SelectItem
                          key={lang}
                          value={lang}
                          className="text-[13px] text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
                        >
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-zinc-500">Timezone</Label>
                  <Select
                    value={locale.timezone}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100">
                      <Clock className="size-3.5 mr-2 text-zinc-600" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {localeOptions.timezones.map((tz) => (
                        <SelectItem
                          key={tz}
                          value={tz}
                          className="text-[13px] text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
                        >
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-zinc-500">Date Format</Label>
                  <Select
                    value={locale.dateFormat}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100">
                      <Calendar className="size-3.5 mr-2 text-zinc-600" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {localeOptions.dateFormats.map((fmt) => (
                        <SelectItem
                          key={fmt}
                          value={fmt}
                          className="text-[13px] text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
                        >
                          {fmt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Financial Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[12px] text-zinc-500">Base Currency</Label>
                  <Select
                    value={locale.currency}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {localeOptions.currencies.map((cur) => (
                        <SelectItem
                          key={cur}
                          value={cur}
                          className="text-[13px] text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
                        >
                          {cur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-zinc-500">Fiscal Year</Label>
                  <Select
                    value={locale.fiscalYear}
                    onValueChange={(value) => setLocale((prev) => ({ ...prev, fiscalYear: value }))}
                  >
                    <SelectTrigger className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {localeOptions.fiscalYears.map((fy) => (
                        <SelectItem
                          key={fy}
                          value={fy}
                          className="text-[13px] text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
                        >
                          {fy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-zinc-500">Number Format</Label>
                  <div className="flex items-center gap-4 text-[13px] text-zinc-400">
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-0">
                      1,234.56
                    </Badge>
                    <span className="text-zinc-600">Based on locale settings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Flags Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-100">
                Feature Toggles
              </CardTitle>
              <CardDescription className="text-[12px] text-zinc-500">
                Enable or disable features for this tenant. Changes take effect immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {featureFlags.map((feature) => (
                  <div
                    key={feature.key}
                    className="flex items-center justify-between py-3 border-b border-zinc-800/50 last:border-0"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-zinc-100">
                          {feature.label}
                        </span>
                        {features[feature.key] ? (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-zinc-800 text-zinc-500 border-0 text-[10px]">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-[12px] text-zinc-500">{feature.description}</p>
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
            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-zinc-100">
                  Brand Identity
                </CardTitle>
                <CardDescription className="text-[12px] text-zinc-500">
                  Customize the platform appearance for your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[12px] text-zinc-500">Organization Name</Label>
                  <Input
                    defaultValue="Aurora Reforged"
                    className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-zinc-500">Tagline</Label>
                  <Input
                    defaultValue="One Platform. Infinite Configurations."
                    className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-zinc-500">Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-16 rounded-lg bg-zinc-800 border border-zinc-700/50">
                      <Palette className="size-6 text-zinc-500" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-100"
                    >
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-zinc-100">
                  Color Theme
                </CardTitle>
                <CardDescription className="text-[12px] text-zinc-500">
                  Define your brand colors for the interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[12px] text-zinc-500">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-md bg-zinc-100 border border-zinc-200" />
                      <Input
                        defaultValue="#FAFAFA"
                        className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100 font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] text-zinc-500">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-md bg-zinc-700 border border-zinc-600" />
                      <Input
                        defaultValue="#3F3F46"
                        className="h-9 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100 font-mono"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] text-zinc-500">Theme Mode</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 border-zinc-700 bg-zinc-800 text-zinc-100"
                    >
                      Dark
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 border-zinc-800 bg-transparent text-zinc-500"
                    >
                      Light
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 border-zinc-800 bg-transparent text-zinc-500"
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
