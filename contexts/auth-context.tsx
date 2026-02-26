"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"
import { useRouter } from "next/navigation"
import type { User, Workspace } from "@/lib/api/types"

/**
 * SECURITY: Demo mode is determined by:
 * 1. Server: GET /api/config → { demoEnabled: true/false }
 * 2. Session: Login response → { isDemo: true } + `dm` cookie marker
 *
 * The client NEVER reads DEMO_MODE env var directly (it's server-side only).
 */

// ─── Demo mock data (client-side only, for UI) ───
const DEMO_USER_FALLBACK: User = {
  id: "demo-user-001",
  email: "demo@company.com",
  name: "Demo User",
  avatarUrl: undefined,
  has2FA: false,
  workspaces: [],
}

const DEMO_WORKSPACES: Workspace[] = [
  {
    id: "ws-acme",
    name: "Acme Corporation",
    slug: "acme",
    memberCount: 24,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "ws-yayasan",
    name: "Yayasan Al Ma'soem",
    slug: "yayasan",
    memberCount: 48,
    createdAt: "2024-03-01T00:00:00Z",
  },
]

const DEMO_ACTIVE_WORKSPACE = DEMO_WORKSPACES[0]

interface AuthState {
  user: User | null
  workspace: Workspace | null
  isAuthenticated: boolean
  isLoading: boolean
  requires2FA: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<LoginResponse>
  loginWithGoogle: (idToken: string) => Promise<LoginResponse>
  logout: () => Promise<void>
  verify2FA: (code: string, verificationToken: string) => Promise<void>
  switchWorkspace: (workspaceId: string) => Promise<void>
  getAccessToken: () => Promise<string | null>
  isDemo: boolean
  demoAvailable: boolean
}

interface LoginResponse {
  requires2FA?: boolean
  verificationToken?: string
  user?: User
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [state, setState] = useState<AuthState>({
    user: null,
    workspace: null,
    isAuthenticated: false,
    isLoading: true,
    requires2FA: false,
  })

  // Whether demo mode is available on the server
  const [demoAvailable, setDemoAvailable] = useState(false)
  // Whether the current session is a demo session
  const [isDemo, setIsDemo] = useState(false)

  // Fetch config and check auth on mount
  useEffect(() => {
    fetchConfig()
    checkAuth()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config")
      if (res.ok) {
        const { demoEnabled } = await res.json()
        setDemoAvailable(demoEnabled)
      }
    } catch {
      // Config unavailable — demo not available
    }
  }

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/token")
      if (res.ok) {
        const { authenticated, isDemo: isDemoSession } = await res.json()
        if (authenticated) {
          if (isDemoSession) {
            // Restore demo session
            setIsDemo(true)
            setState({
              user: DEMO_USER_FALLBACK,
              workspace: DEMO_ACTIVE_WORKSPACE,
              isAuthenticated: true,
              isLoading: false,
              requires2FA: false,
            })
            return
          }

          // Normal session — refresh to keep alive
          const refreshRes = await fetch("/api/auth/refresh", { method: "POST" })
          if (refreshRes.ok) {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
            const meRes = await fetch(`${API_BASE}/auth/me`, {
              credentials: "include",
            })
            if (meRes.ok) {
              const user = await meRes.json()
              setState({
                user,
                workspace: null,
                isAuthenticated: true,
                isLoading: false,
                requires2FA: false,
              })
              return
            }
          }
        }
      }
    } catch {
      // Not authenticated — fail secure
    }
    setState((s) => ({ ...s, isLoading: false }))
  }

  // ─── Login ───
  const login = useCallback(
    async (email: string, _password: string): Promise<LoginResponse> => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: _password }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Login failed")
      }

      const data = await res.json()

      if (data.requires2FA) {
        setState((s) => ({ ...s, requires2FA: true }))
        return {
          requires2FA: true,
          verificationToken: data.verificationToken,
        }
      }

      // Check if this was a demo login
      if (data.isDemo) {
        setIsDemo(true)
        setState({
          user: data.user,
          workspace: DEMO_ACTIVE_WORKSPACE,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
        })
        return { user: data.user }
      }

      setState({
        user: data.user,
        workspace: null,
        isAuthenticated: true,
        isLoading: false,
        requires2FA: false,
      })

      return { user: data.user }
    },
    []
  )

  const loginWithGoogle = useCallback(
    async (idToken: string): Promise<LoginResponse> => {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Google login failed")
      }

      const data = await res.json()

      if (data.requires2FA) {
        setState((s) => ({ ...s, requires2FA: true }))
        return { requires2FA: true, verificationToken: data.verificationToken }
      }

      if (data.isDemo) {
        setIsDemo(true)
        setState({
          user: data.user,
          workspace: DEMO_ACTIVE_WORKSPACE,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
        })
        return { user: data.user }
      }

      setState({
        user: data.user,
        workspace: null,
        isAuthenticated: true,
        isLoading: false,
        requires2FA: false,
      })

      return { user: data.user }
    },
    []
  )

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setIsDemo(false)
    setState({
      user: null,
      workspace: null,
      isAuthenticated: false,
      isLoading: false,
      requires2FA: false,
    })
    router.push("/login")
  }, [router])

  const verify2FA = useCallback(
    async (code: string, verificationToken: string) => {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, verificationToken }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Verification failed")
      }

      const data = await res.json()

      if (data.isDemo) {
        setIsDemo(true)
        setState({
          user: data.user,
          workspace: DEMO_ACTIVE_WORKSPACE,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
        })
        return
      }

      setState({
        user: data.user,
        workspace: null,
        isAuthenticated: true,
        isLoading: false,
        requires2FA: false,
      })
    },
    []
  )

  const switchWorkspace = useCallback(
    async (workspaceId: string) => {
      if (isDemo) {
        const ws = DEMO_WORKSPACES.find((w) => w.id === workspaceId) || DEMO_ACTIVE_WORKSPACE
        await fetch("/api/auth/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workspaceId }),
        })
        setState((s) => ({ ...s, workspace: ws }))
        router.push("/")
        return
      }

      const token = await getAccessToken()
      if (!token) return

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
      await fetch(`${API_BASE}/workspaces/${workspaceId}/switch`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      await fetch("/api/auth/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      })

      const wsRes = await fetch(`${API_BASE}/workspaces/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (wsRes.ok) {
        const workspace = await wsRes.json()
        setState((s) => ({ ...s, workspace }))
      }

      router.push("/")
    },
    [router, isDemo]
  )

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const refreshRes = await fetch("/api/auth/refresh", { method: "POST" })
      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json()
        return accessToken
      }
    } catch {
      // Token unavailable — fail secure
    }
    return null
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithGoogle,
        logout,
        verify2FA,
        switchWorkspace,
        getAccessToken,
        isDemo,
        demoAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
