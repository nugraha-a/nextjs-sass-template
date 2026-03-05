"use client"

import { useRef, useCallback, useMemo } from "react"

/**
 * Bulletproof anti-spam hook for form submissions and button actions.
 *
 * Combines THREE protection layers:
 *   1. Synchronous useRef lock — blocks re-entry before React renders
 *   2. Leading-edge debounce — blocks rapid re-clicks for `cooldownMs`
 *      after the last execution, preserved across re-renders via useCallback
 *   3. Direct DOM mutation — disables buttons via DOM API, no render needed
 *
 * The debounce is "leading edge" (immediate=true): the FIRST call executes
 * immediately, then ALL subsequent calls within `cooldownMs` are dropped.
 *
 * @param cooldownMs - Minimum interval between executions (default: 400ms)
 */
export function useFormGuard(cooldownMs = 400) {
    const lockedRef = useRef(false)
    const lastCallRef = useRef(0)

    /**
     * Wraps a form onSubmit handler with multi-layer spam protection.
     * Automatically calls `e.preventDefault()` even on blocked attempts.
     *
     * IMPORTANT: Wrap at the form level, not the inner handler.
     * ✅ <form onSubmit={guardSubmit(handler)}>
     * ✅ <form onSubmit={guardSubmit(form.handleSubmit(onSubmit))}>
     */
    const guardSubmit = useCallback(
        <T extends unknown[]>(handler: (...args: T) => Promise<void> | void) => {
            // Return a stable function that checks all guard layers
            return async (...args: T) => {
                // Always prevent default FIRST — even when blocking
                const event = args[0]
                if (event && typeof event === "object" && "preventDefault" in event) {
                    ; (event as Event).preventDefault()
                        ; (event as Event).stopImmediatePropagation?.()
                }

                // Layer 1: Synchronous ref lock
                if (lockedRef.current) return
                lockedRef.current = true

                // Layer 2: Leading-edge debounce — reject if within cooldown
                const now = Date.now()
                if (now - lastCallRef.current < cooldownMs) {
                    lockedRef.current = false
                    return
                }
                lastCallRef.current = now

                // Layer 3: Direct DOM mutation — disable buttons immediately
                let formEl: HTMLFormElement | null = null
                const buttons: HTMLButtonElement[] = []

                if (event && typeof event === "object") {
                    const e = event as Event
                    const target = e.target as HTMLElement | null
                    formEl = target?.tagName === "FORM"
                        ? (target as HTMLFormElement)
                        : (target?.closest?.("form") ?? null)
                }

                if (formEl) {
                    formEl.querySelectorAll<HTMLButtonElement>(
                        'button[type="submit"], button:not([type])'
                    ).forEach((btn) => {
                        btn.disabled = true
                        btn.style.pointerEvents = "none"
                        buttons.push(btn)
                    })
                    formEl.dataset.submitting = "true"
                }

                try {
                    await handler(...args)
                } finally {
                    lockedRef.current = false

                    buttons.forEach((btn) => {
                        btn.disabled = false
                        btn.style.pointerEvents = ""
                    })
                    if (formEl) {
                        delete formEl.dataset.submitting
                    }
                }
            }
        },
        [cooldownMs]
    )

    /**
     * Wraps a standalone button action (not inside a <form>).
     * Use for workspace select, logout, Google SSO, etc.
     */
    const guardAction = useCallback(
        <T extends unknown[]>(handler: (...args: T) => Promise<void> | void) => {
            return async (...args: T) => {
                // Layer 1: Ref lock
                if (lockedRef.current) return
                lockedRef.current = true

                // Layer 2: Leading-edge debounce
                const now = Date.now()
                if (now - lastCallRef.current < cooldownMs) {
                    lockedRef.current = false
                    return
                }
                lastCallRef.current = now

                // Layer 3: Disable clicked button via DOM
                let buttonEl: HTMLButtonElement | null = null
                const event = args[0]
                if (event && typeof event === "object" && "currentTarget" in event) {
                    const target = (event as React.MouseEvent).currentTarget
                    if (target instanceof HTMLButtonElement) {
                        buttonEl = target
                        buttonEl.disabled = true
                        buttonEl.style.pointerEvents = "none"
                    }
                }

                try {
                    await handler(...args)
                } finally {
                    lockedRef.current = false
                    if (buttonEl) {
                        buttonEl.disabled = false
                        buttonEl.style.pointerEvents = ""
                    }
                }
            }
        },
        [cooldownMs]
    )

    return { guardSubmit, guardAction } as const
}
