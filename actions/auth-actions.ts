"use server"

import { cookies, headers } from "next/headers"
import { z } from "zod"
import { authApi } from "@/lib/api/auth"
import {
    IS_DEMO,
    DEMO_USER,
    DEMO_EMAIL,
    DEMO_WORKSPACES,
    DEMO_ACTIVE_WORKSPACE,
    generateDemoAccessToken,
    generateDemoRefreshToken,
    isDemoToken,
} from "@/lib/api/demo-data"
import {
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    WORKSPACE_COOKIE,
    DEMO_SESSION_COOKIE,
    ACCESS_TOKEN_MAX_AGE,
    REFRESH_TOKEN_MAX_AGE,
    DEMO_SESSION_MAX_AGE,
    createCookieHeader,
    deleteCookieHeader,
    verifySignedValue,
} from "@/lib/api/cookies"
import {
    checkRateLimit,
    LOGIN_LIMIT,
    OTP_LIMIT,
    FORGOT_PASSWORD_LIMIT,
} from "@/lib/api/rate-limit"
import type { User, Workspace, OtpChannel } from "@/lib/api/types"

// ─── Helpers ───────────────────────────────────────


async function getClientIdFromHeaders(): Promise<string> {
    const h = await headers()
    const forwarded = h.get("x-forwarded-for")
    if (forwarded) return forwarded.split(",")[0].trim()
    const realIp = h.get("x-real-ip")
    if (realIp) return realIp
    return "unknown"
}

async function setCookie(header: string) {
    const cookieStore = await cookies()
    // Parse the Set-Cookie header and use cookies().set()
    const parts = header.split(";").map((p) => p.trim())
    const [nameValue, ...attrs] = parts
    const eqIdx = nameValue.indexOf("=")
    const name = nameValue.substring(0, eqIdx)
    const value = decodeURIComponent(nameValue.substring(eqIdx + 1))

    const options: Record<string, unknown> = {}
    for (const attr of attrs) {
        const lower = attr.toLowerCase()
        if (lower === "httponly") options.httpOnly = true
        else if (lower === "secure") options.secure = true
        else if (lower.startsWith("path=")) options.path = attr.split("=")[1]
        else if (lower.startsWith("max-age=")) options.maxAge = parseInt(attr.split("=")[1], 10)
        else if (lower.startsWith("samesite=")) options.sameSite = attr.split("=")[1].toLowerCase() as "lax" | "strict" | "none"
    }

    cookieStore.set(name, value, options)
}

async function deleteCookie(name: string) {
    const cookieStore = await cookies()
    cookieStore.delete(name)
}

async function getCookieValue(name: string): Promise<string | null> {
    const cookieStore = await cookies()
    const raw = cookieStore.get(name)?.value
    if (!raw) return null
    return verifySignedValue(raw)
}

// ─── Response Types ────────────────────────────────

export interface AuthActionResult {
    success: boolean
    error?: string
    user?: User
    requires2FA?: boolean
    verificationToken?: string
    isDemo?: boolean
}

export interface ForgotPasswordResult {
    success: boolean
    error?: string
    verificationToken?: string
    maskedContact?: string
    channel?: OtpChannel
}

export interface VerifyOtpResult {
    success: boolean
    error?: string
    user?: User
    resetToken?: string
    isDemo?: boolean
}

export interface ResetPasswordResult {
    success: boolean
    error?: string
}

export interface ConfigResult {
    demoEnabled: boolean
}

export interface CheckAuthResult {
    authenticated: boolean
    user: User | null
    isDemo: boolean
}

export interface WorkspaceListResult {
    success: boolean
    workspaces: Array<{ id: string; name: string; memberCount: number; role?: string }>
    error?: string
}

export interface InviteInfoResult {
    success: boolean
    workspaceName?: string
    role?: string
    email?: string
}

// ─── Schemas ───────────────────────────────────────

const loginSchema = z.object({
    email: z.string().email("Invalid email format").max(255),
    password: z.string().min(1, "Password is required").max(128),
})

const googleLoginSchema = z.object({
    idToken: z.string().min(1, "ID token is required").max(4096),
})

const forgotPasswordSchema = z.object({
    identifier: z.string().min(1, "Identifier is required").max(255),
    channel: z.enum(["email", "sms"]),
})

const resetPasswordSchema = z.object({
    resetToken: z.string().min(1, "Reset token is required").max(500),
    newPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
})

// ─── Actions ───────────────────────────────────────

/** Fetch app config (demo mode flag) */
export async function fetchConfigAction(): Promise<ConfigResult> {
    return { demoEnabled: IS_DEMO }
}

/** Login with email + password */
export async function loginAction(
    _prevState: AuthActionResult | undefined,
    formData: FormData
): Promise<AuthActionResult> {
    const clientId = await getClientIdFromHeaders()
    const rl = checkRateLimit(`login:${clientId}`, LOGIN_LIMIT)
    if (!rl.allowed) {
        return { success: false, error: "Too many login attempts. Please try again later." }
    }

    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })
    if (!parsed.success) {
        return { success: false, error: "Invalid email or password format." }
    }

    const { email, password } = parsed.data

    try {
        // Demo mode
        if (IS_DEMO && email === DEMO_EMAIL) {
            const demoAt = generateDemoAccessToken()
            const demoRt = generateDemoRefreshToken()
            await setCookie(createCookieHeader(ACCESS_TOKEN_COOKIE, demoAt, DEMO_SESSION_MAX_AGE))
            await setCookie(createCookieHeader(REFRESH_TOKEN_COOKIE, demoRt, DEMO_SESSION_MAX_AGE))
            await setCookie(createCookieHeader(DEMO_SESSION_COOKIE, "true", DEMO_SESSION_MAX_AGE))
            return { success: true, user: DEMO_USER, isDemo: true }
        }

        // Normal login
        const result = await authApi.login(email, password)

        if (result.requires2FA) {
            return {
                success: true,
                requires2FA: true,
                verificationToken: result.verificationToken,
            }
        }

        await setCookie(createCookieHeader(ACCESS_TOKEN_COOKIE, result.accessToken, ACCESS_TOKEN_MAX_AGE))
        await setCookie(createCookieHeader(REFRESH_TOKEN_COOKIE, result.refreshToken, REFRESH_TOKEN_MAX_AGE))
        return { success: true, user: result.user }
    } catch (error: unknown) {
        const status = (error as { status?: number }).status || 500
        const message = status === 401 ? "Invalid credentials" : "Login failed"
        return { success: false, error: message }
    }
}

/** Login with Google ID token */
export async function loginWithGoogleAction(idToken: string): Promise<AuthActionResult> {
    const clientId = await getClientIdFromHeaders()
    const rl = checkRateLimit(`google:${clientId}`, LOGIN_LIMIT)
    if (!rl.allowed) {
        return { success: false, error: "Too many login attempts. Please try again later." }
    }

    const parsed = googleLoginSchema.safeParse({ idToken })
    if (!parsed.success) {
        return { success: false, error: "Invalid token." }
    }

    try {
        if (IS_DEMO) {
            const demoAt = generateDemoAccessToken()
            const demoRt = generateDemoRefreshToken()
            await setCookie(createCookieHeader(ACCESS_TOKEN_COOKIE, demoAt, DEMO_SESSION_MAX_AGE))
            await setCookie(createCookieHeader(REFRESH_TOKEN_COOKIE, demoRt, DEMO_SESSION_MAX_AGE))
            await setCookie(createCookieHeader(DEMO_SESSION_COOKIE, "true", DEMO_SESSION_MAX_AGE))
            return { success: true, user: DEMO_USER, isDemo: true }
        }

        const result = await authApi.loginWithGoogle(parsed.data.idToken)

        if (result.requires2FA) {
            return {
                success: true,
                requires2FA: true,
                verificationToken: result.verificationToken,
            }
        }

        await setCookie(createCookieHeader(ACCESS_TOKEN_COOKIE, result.accessToken, ACCESS_TOKEN_MAX_AGE))
        await setCookie(createCookieHeader(REFRESH_TOKEN_COOKIE, result.refreshToken, REFRESH_TOKEN_MAX_AGE))
        return { success: true, user: result.user }
    } catch (error: unknown) {
        const status = (error as { status?: number }).status || 500
        const message = status === 401 ? "Invalid credentials" : "Google login failed"
        return { success: false, error: message }
    }
}

/** Logout — clear all auth cookies */
export async function logoutAction(): Promise<void> {
    const isDemoSession = (await getCookieValue(DEMO_SESSION_COOKIE)) === "true"

    if (!isDemoSession) {
        const refreshToken = await getCookieValue(REFRESH_TOKEN_COOKIE)
        if (refreshToken) {
            await authApi.logout(refreshToken).catch(() => { })
        }
    }

    await deleteCookie(ACCESS_TOKEN_COOKIE)
    await deleteCookie(REFRESH_TOKEN_COOKIE)
    await deleteCookie(WORKSPACE_COOKIE)
    await deleteCookie(DEMO_SESSION_COOKIE)
}

/** Check auth status + refresh tokens + get user */
export async function checkAuthAction(): Promise<CheckAuthResult> {
    const accessToken = await getCookieValue(ACCESS_TOKEN_COOKIE)
    const isDemoSession = (await getCookieValue(DEMO_SESSION_COOKIE)) === "true"

    if (!accessToken) {
        return { authenticated: false, user: null, isDemo: false }
    }

    // Demo session
    if (isDemoSession && isDemoToken(accessToken)) {
        return { authenticated: true, user: DEMO_USER, isDemo: true }
    }

    // Normal session — refresh and get user
    try {
        const refreshToken = await getCookieValue(REFRESH_TOKEN_COOKIE)
        if (!refreshToken) {
            return { authenticated: false, user: null, isDemo: false }
        }

        const refreshResult = await authApi.refreshToken(refreshToken)
        await setCookie(createCookieHeader(ACCESS_TOKEN_COOKIE, refreshResult.accessToken, ACCESS_TOKEN_MAX_AGE))
        await setCookie(createCookieHeader(REFRESH_TOKEN_COOKIE, refreshResult.refreshToken, REFRESH_TOKEN_MAX_AGE))

        const user = await authApi.getMe(refreshResult.accessToken)
        return { authenticated: true, user, isDemo: false }
    } catch {
        return { authenticated: false, user: null, isDemo: false }
    }
}

/** Get access token (refresh if needed) */
export async function getAccessTokenAction(): Promise<string | null> {
    const isDemoSession = (await getCookieValue(DEMO_SESSION_COOKIE)) === "true"

    if (isDemoSession) {
        const demoAt = generateDemoAccessToken()
        const demoRt = generateDemoRefreshToken()
        await setCookie(createCookieHeader(ACCESS_TOKEN_COOKIE, demoAt, DEMO_SESSION_MAX_AGE))
        await setCookie(createCookieHeader(REFRESH_TOKEN_COOKIE, demoRt, DEMO_SESSION_MAX_AGE))
        return demoAt
    }

    try {
        const refreshToken = await getCookieValue(REFRESH_TOKEN_COOKIE)
        if (!refreshToken) return null

        const result = await authApi.refreshToken(refreshToken)
        await setCookie(createCookieHeader(ACCESS_TOKEN_COOKIE, result.accessToken, ACCESS_TOKEN_MAX_AGE))
        await setCookie(createCookieHeader(REFRESH_TOKEN_COOKIE, result.refreshToken, REFRESH_TOKEN_MAX_AGE))
        return result.accessToken
    } catch {
        return null
    }
}

/** Forgot password — request OTP */
export async function forgotPasswordAction(
    _prevState: ForgotPasswordResult | undefined,
    formData: FormData
): Promise<ForgotPasswordResult> {
    const clientId = await getClientIdFromHeaders()
    const rl = checkRateLimit(`forgot:${clientId}`, FORGOT_PASSWORD_LIMIT)
    if (!rl.allowed) {
        return { success: false, error: "Too many requests. Please try again later." }
    }

    if (IS_DEMO) {
        return {
            success: true,
            verificationToken: "demo-verification-token",
            maskedContact: "d***@company.com",
            channel: "email",
        }
    }

    const parsed = forgotPasswordSchema.safeParse({
        identifier: formData.get("identifier"),
        channel: formData.get("channel") || "email",
    })
    if (!parsed.success) {
        return { success: false, error: "Invalid input." }
    }

    try {
        const result = await authApi.forgotPassword(parsed.data.identifier, parsed.data.channel)
        return {
            success: true,
            verificationToken: result.verificationToken,
            maskedContact: result.maskedContact,
            channel: result.channel,
        }
    } catch {
        // Don't reveal whether the email/phone exists
        return { success: true, maskedContact: "***", channel: "email" }
    }
}

/** Verify OTP code */
export async function verifyOtpAction(
    _prevState: VerifyOtpResult | undefined,
    formData: FormData
): Promise<VerifyOtpResult> {
    const clientId = await getClientIdFromHeaders()
    const rl = checkRateLimit(`otp:${clientId}`, OTP_LIMIT)
    if (!rl.allowed) {
        return { success: false, error: "Too many verification attempts. Please try again later." }
    }

    const code = formData.get("code") as string
    const verificationToken = formData.get("verificationToken") as string

    const isDemoSession = (await getCookieValue(DEMO_SESSION_COOKIE)) === "true"
    if (isDemoSession && verificationToken?.startsWith?.("demo")) {
        const demoAt = generateDemoAccessToken()
        const demoRt = generateDemoRefreshToken()
        await setCookie(createCookieHeader(ACCESS_TOKEN_COOKIE, demoAt, DEMO_SESSION_MAX_AGE))
        await setCookie(createCookieHeader(REFRESH_TOKEN_COOKIE, demoRt, DEMO_SESSION_MAX_AGE))
        await setCookie(createCookieHeader(DEMO_SESSION_COOKIE, "true", DEMO_SESSION_MAX_AGE))
        return { success: true, user: DEMO_USER, isDemo: true }
    }

    try {
        const result = await authApi.verifyOtp(code, verificationToken)

        if (result.accessToken && result.refreshToken) {
            await setCookie(createCookieHeader(ACCESS_TOKEN_COOKIE, result.accessToken, ACCESS_TOKEN_MAX_AGE))
            await setCookie(createCookieHeader(REFRESH_TOKEN_COOKIE, result.refreshToken, REFRESH_TOKEN_MAX_AGE))
            return { success: true, user: result.user }
        }

        return { success: true, resetToken: result.resetToken }
    } catch (error: unknown) {
        const status = (error as { status?: number }).status || 500
        const message = status === 400 ? "Invalid verification code" : "Verification failed"
        return { success: false, error: message }
    }
}

/** Reset password with token */
export async function resetPasswordAction(
    _prevState: ResetPasswordResult | undefined,
    formData: FormData
): Promise<ResetPasswordResult> {
    if (IS_DEMO) {
        return { success: true }
    }

    const parsed = resetPasswordSchema.safeParse({
        resetToken: formData.get("resetToken"),
        newPassword: formData.get("newPassword"),
    })
    if (!parsed.success) {
        return { success: false, error: "Invalid input." }
    }

    try {
        await authApi.resetPassword(parsed.data.resetToken, parsed.data.newPassword)
        return { success: true }
    } catch (error: unknown) {
        const status = (error as { status?: number }).status || 500
        const message = status === 400 ? "Invalid or expired reset token" : "Reset failed"
        return { success: false, error: message }
    }
}

/** Switch workspace */
export async function switchWorkspaceAction(workspaceId: string): Promise<{ success: boolean; workspace?: Workspace }> {
    if (!workspaceId || !/^[a-zA-Z0-9_-]+$/.test(workspaceId)) {
        return { success: false }
    }

    const isDemoSession = (await getCookieValue(DEMO_SESSION_COOKIE)) === "true"

    // Set workspace cookie
    const cookieStore = await cookies()
    const isProduction = process.env.NODE_ENV === "production"
    cookieStore.set(WORKSPACE_COOKIE, workspaceId, {
        httpOnly: true,
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
        secure: isProduction,
    })

    if (isDemoSession) {
        const ws = DEMO_WORKSPACES.find((w) => w.id === workspaceId) || DEMO_ACTIVE_WORKSPACE
        return { success: true, workspace: ws }
    }

    try {
        const token = await getAccessTokenAction()
        if (!token) return { success: false }

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
        await fetch(`${API_BASE}/workspaces/${workspaceId}/switch`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        })

        const wsRes = await fetch(`${API_BASE}/workspaces/${workspaceId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (wsRes.ok) {
            const workspace = await wsRes.json()
            return { success: true, workspace }
        }

        return { success: true }
    } catch {
        return { success: false }
    }
}

/** Get workspaces list */
export async function getWorkspacesAction(): Promise<WorkspaceListResult> {
    const isDemoSession = (await getCookieValue(DEMO_SESSION_COOKIE)) === "true"

    if (isDemoSession) {
        return {
            success: true,
            workspaces: DEMO_WORKSPACES.map((ws) => ({
                id: ws.id,
                name: ws.name,
                memberCount: ws.memberCount ?? 0,
                role: "Admin",
            })),
        }
    }

    try {
        const token = await getAccessTokenAction()
        if (!token) return { success: false, workspaces: [], error: "Not authenticated" }

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
        const res = await fetch(`${API_BASE}/workspaces`, {
            headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
            const workspaces = await res.json()
            return { success: true, workspaces }
        }

        return { success: false, workspaces: [], error: "Failed to load workspaces" }
    } catch {
        return { success: false, workspaces: [], error: "Failed to load workspaces" }
    }
}

/** Get invite info for a token */
export async function getInviteInfoAction(token: string): Promise<InviteInfoResult> {
    try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
        const res = await fetch(`${API_BASE}/invites/${token}`)
        if (res.ok) {
            const info = await res.json()
            return { success: true, ...info }
        }
        return { success: false }
    } catch {
        return { success: false }
    }
}

/** Accept invite */
export async function acceptInviteAction(
    _prevState: AuthActionResult | undefined,
    formData: FormData
): Promise<AuthActionResult> {
    const token = formData.get("token") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string

    if (!token || !name || !password) {
        return { success: false, error: "All fields are required." }
    }

    try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
        const res = await fetch(`${API_BASE}/invites/${token}/accept`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password }),
        })

        if (!res.ok) {
            const result = await res.json()
            return { success: false, error: result.message || "Failed to accept invite" }
        }

        return { success: true }
    } catch {
        return { success: false, error: "Something went wrong. Please try again." }
    }
}

/** Upload sidebar image */
export async function uploadSidebarImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
    const accessToken = await getCookieValue(ACCESS_TOKEN_COOKIE)
    if (!accessToken) return { error: "Unauthorized" }

    // Forward to the sidebar-image API route (which handles file processing)
    const oldImage = formData.get("oldImage") as string | null

    try {
        const apiHeaders: Record<string, string> = {}
        if (oldImage) apiHeaders["x-old-image"] = oldImage

        // We need to call the local API route for file uploads since
        // Server Actions don't natively handle multipart in the same way
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        const cookieStore = await cookies()
        const allCookies = cookieStore.getAll()
        const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ")

        const res = await fetch(`${baseUrl}/api/sidebar-image`, {
            method: "POST",
            headers: {
                ...apiHeaders,
                Cookie: cookieHeader,
            },
            body: formData,
        })

        if (res.ok) {
            const data = await res.json()
            return { url: data.url }
        }

        const errorData = await res.json()
        return { error: errorData.error || "Upload failed" }
    } catch {
        return { error: "Upload failed" }
    }
}

/** Delete sidebar image */
export async function deleteSidebarImageAction(url: string): Promise<{ success: boolean }> {
    const accessToken = await getCookieValue(ACCESS_TOKEN_COOKIE)
    if (!accessToken) return { success: false }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        const cookieStore = await cookies()
        const allCookies = cookieStore.getAll()
        const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ")

        await fetch(`${baseUrl}/api/sidebar-image`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            body: JSON.stringify({ url }),
        })

        return { success: true }
    } catch {
        return { success: false }
    }
}
