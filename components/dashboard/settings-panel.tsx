"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SettingsPanel() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(true)

  return (
    <Card className="border border-zinc-800/50 bg-zinc-900/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium tracking-tight text-zinc-100">
          Settings
        </CardTitle>
        <CardDescription className="text-xs text-zinc-500 mt-0.5">
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800/50 p-0.5 rounded-md h-8">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-100 text-zinc-500 rounded-sm text-xs font-medium transition-colors duration-150 h-7"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-100 text-zinc-500 rounded-sm text-xs font-medium transition-colors duration-150 h-7"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-100 text-zinc-500 rounded-sm text-xs font-medium transition-colors duration-150 h-7"
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="firstName"
                  className="text-xs font-medium text-zinc-400"
                >
                  First name
                </Label>
                <Input
                  id="firstName"
                  defaultValue="John"
                  className="h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-1 focus:ring-zinc-700 transition-colors duration-150"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="lastName"
                  className="text-xs font-medium text-zinc-400"
                >
                  Last name
                </Label>
                <Input
                  id="lastName"
                  defaultValue="Doe"
                  className="h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-1 focus:ring-zinc-700 transition-colors duration-150"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-zinc-400"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="john@email.com"
                className="h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-1 focus:ring-zinc-700 transition-colors duration-150"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="bio"
                className="text-xs font-medium text-zinc-400"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                defaultValue="Product designer at Acme Inc. Passionate about creating beautiful interfaces."
                className="min-h-20 text-xs bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-1 focus:ring-zinc-700 transition-colors duration-150 resize-none"
              />
              <p className="text-[10px] text-zinc-600">
                Brief description for your profile. Maximum 200 characters.
              </p>
            </div>
            <Separator className="bg-zinc-800/50" />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors duration-150"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-7 px-3 text-xs bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors duration-150"
              >
                Save changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-md border border-zinc-800/50 p-3 hover:bg-zinc-800/30 transition-colors duration-150">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-zinc-100">
                  Email notifications
                </Label>
                <p className="text-[11px] text-zinc-500">
                  Receive email updates about your account activity
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                className="data-[state=checked]:bg-zinc-100"
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-zinc-800/50 p-3 hover:bg-zinc-800/30 transition-colors duration-150">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-zinc-100">
                  Push notifications
                </Label>
                <p className="text-[11px] text-zinc-500">
                  Receive push notifications on your device
                </p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                className="data-[state=checked]:bg-zinc-100"
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-zinc-800/50 p-3 hover:bg-zinc-800/30 transition-colors duration-150">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-zinc-100">
                  Marketing emails
                </Label>
                <p className="text-[11px] text-zinc-500">
                  Receive emails about new products and features
                </p>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
                className="data-[state=checked]:bg-zinc-100"
              />
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-400">
                  Language
                </Label>
                <Select defaultValue="en">
                  <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-zinc-700">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="en" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">English</SelectItem>
                    <SelectItem value="es" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">Spanish</SelectItem>
                    <SelectItem value="fr" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">French</SelectItem>
                    <SelectItem value="de" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">German</SelectItem>
                    <SelectItem value="ja" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-400">
                  Timezone
                </Label>
                <Select defaultValue="pst">
                  <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-zinc-700">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="pst" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">Pacific Time (PST)</SelectItem>
                    <SelectItem value="mst" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">Mountain Time (MST)</SelectItem>
                    <SelectItem value="cst" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">Central Time (CST)</SelectItem>
                    <SelectItem value="est" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">Eastern Time (EST)</SelectItem>
                    <SelectItem value="utc" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-400">
                Date format
              </Label>
              <Select defaultValue="mdy">
                <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-zinc-700">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="mdy" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd" className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs">YYYY/MM/DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator className="bg-zinc-800/50" />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors duration-150"
              >
                Reset to defaults
              </Button>
              <Button
                size="sm"
                className="h-7 px-3 text-xs bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors duration-150"
              >
                Save preferences
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
