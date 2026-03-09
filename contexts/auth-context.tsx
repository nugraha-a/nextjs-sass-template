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
  fetchConfigAction,
  checkAuthAction,
  loginAction as serverLoginAction,
  loginWithGoogleAction,
  logoutAction,
  verifyOtpAction,
  switchWorkspaceAction,
  getAccessTokenAction,
} from "@/actions/auth-actions"
import type { AuthActionResult } from "@/actions/auth-actions"

/**
 * SECURITY: Demo mode is determined by:
 * 1. Server: fetchConfigAction() → { demoEnabled: true/false }
 * 2. Session: Login response → { isDemo: true } via Server Action
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

interface LoginResponse {
  requires2FA?: boolean
  verificationToken?: string
  user?: User
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
      const config = await fetchConfigAction()
      setDemoAvailable(config.demoEnabled)
    } catch {
      // Config unavailable — demo not available
    }
  }

  const checkAuth = async () => {
    try {
      const result = await checkAuthAction()

      if (result.authenticated && result.user) {
        if (result.isDemo) {
          setIsDemo(true)
          setState({
            user: result.user,
            workspace: DEMO_ACTIVE_WORKSPACE,
            isAuthenticated: true,
            isLoading: false,
            requires2FA: false,
          })
          return
        }

        setState({
          user: result.user,
          workspace: null,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
        })
        return
      }
    } catch {
      // Not authenticated — fail secure
    }
    setState((s) => ({ ...s, isLoading: false }))
  }

  // ─── Login ───
  const login = useCallback(
    async (email: string, password: string): Promise<LoginResponse> => {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const result = await serverLoginAction(undefined, formData)

      if (!result.success) {
        throw new Error(result.error || "Login failed")
      }

      if (result.requires2FA) {
        setState((s) => ({ ...s, requires2FA: true }))
        return {
          requires2FA: true,
          verificationToken: result.verificationToken,
        }
      }

      if (result.isDemo) {
        setIsDemo(true)
        setState({
          user: result.user || DEMO_USER_FALLBACK,
          workspace: DEMO_ACTIVE_WORKSPACE,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
        })
        return { user: result.user }
      }

      setState({
        user: result.user || null,
        workspace: null,
        isAuthenticated: true,
        isLoading: false,
        requires2FA: false,
      })

      return { user: result.user }
    },
    []
  )

  const loginWithGoogleCb = useCallback(
    async (idToken: string): Promise<LoginResponse> => {
      const result = await loginWithGoogleAction(idToken)

      if (!result.success) {
        throw new Error(result.error || "Google login failed")
      }

      if (result.requires2FA) {
        setState((s) => ({ ...s, requires2FA: true }))
        return { requires2FA: true, verificationToken: result.verificationToken }
      }

      if (result.isDemo) {
        setIsDemo(true)
        setState({
          user: result.user || DEMO_USER_FALLBACK,
          workspace: DEMO_ACTIVE_WORKSPACE,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
        })
        return { user: result.user }
      }

      setState({
        user: result.user || null,
        workspace: null,
        isAuthenticated: true,
        isLoading: false,
        requires2FA: false,
      })

      return { user: result.user }
    },
    []
  )

  const logout = useCallback(async () => {
    await logoutAction()
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
      const formData = new FormData()
      formData.append("code", code)
      formData.append("verificationToken", verificationToken)

      const result = await verifyOtpAction(undefined, formData)

      if (!result.success) {
        throw new Error(result.error || "Verification failed")
      }

      if (result.isDemo) {
        setIsDemo(true)
        setState({
          user: result.user || DEMO_USER_FALLBACK,
          workspace: DEMO_ACTIVE_WORKSPACE,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
        })
        return
      }

      setState({
        user: result.user || null,
        workspace: null,
        isAuthenticated: true,
        isLoading: false,
        requires2FA: false,
      })
    },
    []
  )

  const switchWorkspaceCb = useCallback(
    async (workspaceId: string) => {
      if (isDemo) {
        const ws = DEMO_WORKSPACES.find((w) => w.id === workspaceId) || DEMO_ACTIVE_WORKSPACE
        await switchWorkspaceAction(workspaceId)
        setState((s) => ({ ...s, workspace: ws }))
        router.push("/")
        return
      }

      const result = await switchWorkspaceAction(workspaceId)

      if (result.workspace) {
        setState((s) => ({ ...s, workspace: result.workspace! }))
      }

      router.push("/")
    },
    [router, isDemo]
  )

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      return await getAccessTokenAction()
    } catch {
      return null
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithGoogle: loginWithGoogleCb,
        logout,
        verify2FA,
        switchWorkspace: switchWorkspaceCb,
        getAccessToken,
        isDemo,
        demoAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
