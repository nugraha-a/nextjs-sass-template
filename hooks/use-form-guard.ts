"use client"

import { useRef, useCallback } from "react"

/**
 * Bulletproof anti-spam hook for form submissions and button actions.
 *
 * 4-layer protection:
 *   1. Synchronous useRef lock — instant re-entry block
 *   2. Leading-edge debounce — blocks rapid re-clicks after unlock
 *   3. HTML `inert` attribute — BROWSER-LEVEL interaction blocking
 *      (disables all clicks, focus, keyboard for the entire form)
 *   4. Direct DOM disabled + pointer-events on buttons
 *
 * @param cooldownMs - Minimum ms between allowed executions (default: 2000)
 */
export function useFormGuard(cooldownMs = 2000) {
    const lockedRef = useRef(false)
    const lastCallRef = useRef(0)

    const guardSubmit = useCallback(
        <T extends unknown[]>(handler: (...args: T) => Promise<void> | void) => {
            return async (...args: T) => {
                // ALWAYS prevent default — even when blocking
                const event = args[0]
                if (event && typeof event === "object" && "preventDefault" in event) {
                    ; (event as Event).preventDefault()
                        ; (event as Event).stopImmediatePropagation?.()
                }

                // Layer 1: Synchronous ref lock
                if (lockedRef.current) return
                lockedRef.current = true

                // Layer 2: Leading-edge debounce
                const now = Date.now()
                if (now - lastCallRef.current < cooldownMs) {
                    lockedRef.current = false
                    return
                }
                lastCallRef.current = now

                // Find the form element
                let formEl: HTMLFormElement | null = null
                if (event && typeof event === "object") {
                    const e = event as Event
                    const target = e.target as HTMLElement | null
                    formEl = target?.tagName === "FORM"
                        ? (target as HTMLFormElement)
                        : (target?.closest?.("form") ?? null)
                }

                // Layer 3: Set HTML `inert` on the entire form
                // This is BROWSER-LEVEL blocking — no CSS, no React, no transitions
                // The browser itself refuses all clicks, focus, keyboard in the form
                if (formEl) {
                    formEl.inert = true
                }

                // Layer 4: Also disable submit buttons via DOM for visual feedback
                const buttons: HTMLButtonElement[] = []
                if (formEl) {
                    formEl.querySelectorAll<HTMLButtonElement>(
                        'button[type="submit"], button:not([type])'
                    ).forEach((btn) => {
                        btn.disabled = true
                        btn.style.pointerEvents = "none"
                        buttons.push(btn)
                    })
                }

                try {
                    await handler(...args)
                } finally {
                    lockedRef.current = false

                    // Remove inert AFTER the request completes
                    if (formEl) {
                        formEl.inert = false
                    }

                    buttons.forEach((btn) => {
                        btn.disabled = false
                        btn.style.pointerEvents = ""
                    })
                }
            }
        },
        [cooldownMs]
    )

    const guardAction = useCallback(
        <T extends unknown[]>(handler: (...args: T) => Promise<void> | void) => {
            return async (...args: T) => {
                // Layer 1: Ref lock
                if (lockedRef.current) return
                lockedRef.current = true

                // Layer 2: Debounce
                const now = Date.now()
                if (now - lastCallRef.current < cooldownMs) {
                    lockedRef.current = false
                    return
                }
                lastCallRef.current = now

                // Layer 3+4: Disable the button via DOM + inert
                let buttonEl: HTMLButtonElement | null = null
                const event = args[0]
                if (event && typeof event === "object" && "currentTarget" in event) {
                    const target = (event as React.MouseEvent).currentTarget
                    if (target instanceof HTMLButtonElement) {
                        buttonEl = target
                        buttonEl.disabled = true
                        buttonEl.style.pointerEvents = "none"
                        buttonEl.inert = true
                    }
                }

                try {
                    await handler(...args)
                } finally {
                    lockedRef.current = false
                    if (buttonEl) {
                        buttonEl.disabled = false
                        buttonEl.style.pointerEvents = ""
                        buttonEl.inert = false
                    }
                }
            }
        },
        [cooldownMs]
    )

    return { guardSubmit, guardAction } as const
}
