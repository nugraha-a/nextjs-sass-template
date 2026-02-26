"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, ChevronRight, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface WorkspaceItem {
  id: string
  name: string
  memberCount: number
  role: string
}

const DEMO_WORKSPACES_FALLBACK = [
  { id: "ws-acme", name: "Acme Corporation", memberCount: 24, role: "Admin" },
  { id: "ws-yayasan", name: "Yayasan Al Ma'soem", memberCount: 48, role: "Admin" },
]

export default function WorkspacePage() {
  const router = useRouter()
  const { logout, switchWorkspace, isDemo } = useAuth()
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selecting, setSelecting] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isBusy = selecting !== null || isLoggingOut

  useEffect(() => {
    loadWorkspaces()
  }, [])

  const loadWorkspaces = async () => {
    if (isDemo) {
      setWorkspaces(DEMO_WORKSPACES_FALLBACK)
      setIsLoading(false)
      return
    }

    try {
      const tokenRes = await fetch("/api/auth/token")
      if (!tokenRes.ok) {
        router.push("/login")
        return
      }
      const { accessToken } = await tokenRes.json()

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
      const res = await fetch(`${API_BASE}/workspaces`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (res.ok) {
        const data = await res.json()
        setWorkspaces(data)

        if (data.length === 1) {
          await handleSelect(data[0].id)
        }
      }
    } catch {
      // Error loading workspaces
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = async (workspaceId: string) => {
    if (isBusy) return
    setSelecting(workspaceId)
    await switchWorkspace(workspaceId)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    await logout()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (workspaces.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold">No workspaces</h2>
          <p className="text-muted-foreground">
            You don&apos;t have access to any workspaces yet.
          </p>
          <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[480px] space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Choose a workspace
          </h2>
          <p className="text-muted-foreground">
            Select where you want to work
          </p>
        </div>

        {isDemo && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-primary text-center">
            <strong>Demo Mode</strong> — Choose any workspace
          </div>
        )}

        <div className="rounded-xl border border-border overflow-hidden">
          {workspaces.map((ws, i) => (
            <button
              key={ws.id}
              onClick={() => handleSelect(ws.id)}
              disabled={isBusy}
              className={`
                w-full flex items-center gap-4 px-5 py-4 text-left
                hover:bg-accent transition-colors disabled:opacity-50
                ${i < workspaces.length - 1 ? "border-b border-border" : ""}
                ${selecting === ws.id ? "bg-accent" : ""}
              `}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{ws.name}</div>
                <div className="text-sm text-muted-foreground">
                  {ws.memberCount} members · {ws.role}
                </div>
              </div>
              {selecting === ws.id ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Signed in · {" "}
          <button
            onClick={handleLogout}
            disabled={isBusy}
            className="text-primary hover:underline disabled:opacity-50"
          >
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  )
}
