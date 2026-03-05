/**
 * In-memory sliding window rate limiter.
 * Zero dependencies — swap for @upstash/ratelimit in serverless/multi-instance deployments.
 *
 * SECURITY: Protects auth endpoints against brute-force, credential stuffing, and OTP enumeration.
 */

interface RateLimitEntry {
    timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return
    lastCleanup = now

    const cutoff = now - windowMs * 2
    for (const [key, entry] of store) {
        if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1] < cutoff) {
            store.delete(key)
        }
    }
}

interface RateLimitConfig {
    /** Max requests allowed within the window */
    maxRequests: number
    /** Time window in milliseconds */
    windowMs: number
}

interface RateLimitResult {
    allowed: boolean
    remaining: number
    retryAfterMs: number
}

/**
 * Check if a request is within rate limits.
 * Uses sliding window algorithm for smooth rate enforcement.
 */
export function checkRateLimit(
    key: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now()
    const { maxRequests, windowMs } = config

    cleanup(windowMs)

    let entry = store.get(key)
    if (!entry) {
        entry = { timestamps: [] }
        store.set(key, entry)
    }

    // Remove timestamps outside the window
    const windowStart = now - windowMs
    entry.timestamps = entry.timestamps.filter((t) => t > windowStart)

    if (entry.timestamps.length >= maxRequests) {
        const oldestInWindow = entry.timestamps[0]
        const retryAfterMs = oldestInWindow + windowMs - now

        return {
            allowed: false,
            remaining: 0,
            retryAfterMs: Math.max(retryAfterMs, 1000),
        }
    }

    entry.timestamps.push(now)

    return {
        allowed: true,
        remaining: maxRequests - entry.timestamps.length,
        retryAfterMs: 0,
    }
}

/**
 * Extract client identifier for rate limiting.
 * Uses IP address from standard proxy headers.
 */
export function getClientId(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for")
    if (forwarded) {
        return forwarded.split(",")[0].trim()
    }
    const realIp = request.headers.get("x-real-ip")
    if (realIp) return realIp
    return "unknown"
}

// ─── Pre-configured rate limit presets ───

/** Login: 5 attempts per 15 minutes per IP */
export const LOGIN_LIMIT: RateLimitConfig = {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
}

/** OTP verification: 5 attempts per 5 minutes per IP */
export const OTP_LIMIT: RateLimitConfig = {
    maxRequests: 5,
    windowMs: 5 * 60 * 1000,
}

/** Forgot password: 3 requests per 15 minutes per IP */
export const FORGOT_PASSWORD_LIMIT: RateLimitConfig = {
    maxRequests: 3,
    windowMs: 15 * 60 * 1000,
}

/** General API: 30 requests per minute per IP */
export const API_LIMIT: RateLimitConfig = {
    maxRequests: 30,
    windowMs: 60 * 1000,
}
