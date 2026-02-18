"use client"

import React, { useState } from "react"
import {
  ShieldCheck,
  Smartphone,
  KeyRound,
  Monitor,
  LogOut,
  Unlink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordStrength } from "@/components/auth/password-strength"

const mockSessions = [
  { id: "1", device: "Chrome", os: "Windows 11", location: "Bandung, ID", lastActive: "Now", isCurrent: true },
  { id: "2", device: "Safari", os: "macOS 14", location: "Jakarta, ID", lastActive: "1 hour ago", isCurrent: false },
  { id: "3", device: "Firefox", os: "Ubuntu 22", location: "Surabaya, ID", lastActive: "3 days ago", isCurrent: false },
]

export default function SecurityPage() {
  const [has2FA, setHas2FA] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground">
          Protect your account
        </p>
      </div>

      {/* 2FA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-sm">
                {has2FA ? "2FA is enabled" : "2FA is disabled"}
              </p>
              <p className="text-xs text-muted-foreground">
                {has2FA
                  ? "Your account is protected with two-factor authentication"
                  : "Enable to require a verification code on each login"
                }
              </p>
            </div>
            <Switch
              checked={has2FA}
              onCheckedChange={setHas2FA}
            />
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Password
          </CardTitle>
          <CardDescription>
            Update your password regularly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Change Password</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and choose a new one
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <PasswordInput placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <PasswordInput
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <PasswordStrength password={newPassword} />
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <PasswordInput placeholder="••••••••" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPasswordOpen(false)}>Cancel</Button>
                <Button onClick={() => setPasswordOpen(false)}>Update Password →</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Devices currently signed in
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Revoke All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between py-3 border-b last:border-0 border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-muted-foreground">
                    {session.device === "Chrome" && <Monitor className="h-5 w-5" />}
                    {session.device === "Safari" && <Monitor className="h-5 w-5" />}
                    {session.device === "Firefox" && <Monitor className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {session.device} — {session.os}
                      </span>
                      {session.isCurrent && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {session.location} · {session.lastActive}
                    </p>
                  </div>
                </div>

                {!session.isCurrent && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Unlink className="h-5 w-5" />
            Connected Accounts
          </CardTitle>
          <CardDescription>
            External services linked to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Google</p>
                <p className="text-xs text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Connect</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
