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
import {
  IS_DEMO,
  DEMO_USER,
  DEMO_WORKSPACES,
  DEMO_ACTIVE_WORKSPACE,
} from "@/lib/api/demo-data"

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
    user: IS_DEMO ? DEMO_USER : null,
    workspace: IS_DEMO ? DEMO_ACTIVE_WORKSPACE : null,
    isAuthenticated: IS_DEMO,
    isLoading: !IS_DEMO,
    requires2FA: false,
  })

  // Check authentication status on mount (skip in demo)
  useEffect(() => {
    if (IS_DEMO) return
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/token")
      if (res.ok) {
        const { accessToken } = await res.json()
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
        const meRes = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
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
    } catch {
      // Not authenticated
    }
    setState((s) => ({ ...s, isLoading: false }))
  }

  // ─── Demo login: accept anything ───
  const login = useCallback(
    async (email: string, _password: string): Promise<LoginResponse> => {
      if (IS_DEMO) {
        const demoUser = { ...DEMO_USER, email }
        setState({
          user: demoUser,
          workspace: DEMO_ACTIVE_WORKSPACE,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
        })
        return { user: demoUser }
      }

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
      if (IS_DEMO) {
        setState({
          user: DEMO_USER,
          workspace: DEMO_ACTIVE_WORKSPACE,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
        })
        return { user: DEMO_USER }
      }

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
    if (!IS_DEMO) {
      await fetch("/api/auth/logout", { method: "POST" })
    }
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
      if (IS_DEMO) {
        setState({
          user: DEMO_USER,
          workspace: DEMO_ACTIVE_WORKSPACE,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
        })
        return
      }

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
      if (IS_DEMO) {
        const ws = DEMO_WORKSPACES.find((w) => w.id === workspaceId) || DEMO_ACTIVE_WORKSPACE
        document.cookie = `ws=${workspaceId};path=/;max-age=31536000;samesite=lax`
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

      document.cookie = `ws=${workspaceId};path=/;max-age=31536000;samesite=lax`

      const wsRes = await fetch(`${API_BASE}/workspaces/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (wsRes.ok) {
        const workspace = await wsRes.json()
        setState((s) => ({ ...s, workspace }))
      }

      router.push("/")
    },
    [router]
  )

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (IS_DEMO) return "demo.access.token"

    try {
      const res = await fetch("/api/auth/token")
      if (res.ok) {
        const { accessToken } = await res.json()
        return accessToken
      }

      const refreshRes = await fetch("/api/auth/refresh", { method: "POST" })
      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json()
        return accessToken
      }
    } catch {
      // Token unavailable
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
        isDemo: IS_DEMO,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
