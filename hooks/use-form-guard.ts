"use client"

import { useRef, useCallback } from "react"

/**
 * Bulletproof anti-spam hook for form submissions and button actions.
 *
 * 4-layer protection:
 *   1. Synchronous useRef lock — instant re-entry block
 *   2. Leading-edge debounce — blocks rapid re-clicks after reset
 *   3. HTML `inert` attribute — browser-level interaction blocking
 *   4. Direct DOM disabled + pointer-events on buttons
 *
 * IMPORTANT: The guard does NOT auto-unlock after the handler completes.
 * This is by design — on success, the page navigates away and the component
 * unmounts. Use `reset()` in your error handler to re-enable the form.
 *
 * @param cooldownMs - Min ms between allowed executions (default: 2000)
 */
export function useFormGuard(cooldownMs = 2000) {
    const lockedRef = useRef(false)
    const lastCallRef = useRef(0)
    const cleanupRef = useRef<(() => void) | null>(null)

    /**
     * Manually reset the guard — call this in `catch` blocks
     * to re-enable the form after an error.
     */
    const reset = useCallback(() => {
        lockedRef.current = false
        cleanupRef.current?.()
        cleanupRef.current = null
    }, [])

    const guardSubmit = useCallback(
        <T extends unknown[]>(handler: (...args: T) => Promise<void> | void) => {
            return async (...args: T) => {
                // Always prevent default — even when blocking
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
                if (formEl) {
                    formEl.inert = true
                }

                // Layer 4: Disable submit buttons via DOM
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

                // Store cleanup so reset() can undo DOM changes
                cleanupRef.current = () => {
                    if (formEl) formEl.inert = false
                    buttons.forEach((btn) => {
                        btn.disabled = false
                        btn.style.pointerEvents = ""
                    })
                }

                // Execute the handler — NO auto-unlock in finally
                // On success: stays locked, component unmounts on navigation
                // On error: caller calls reset() to re-enable
                await handler(...args)
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

                // Layer 3+4: Disable the button
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

                // Store cleanup
                cleanupRef.current = () => {
                    if (buttonEl) {
                        buttonEl.disabled = false
                        buttonEl.style.pointerEvents = ""
                        buttonEl.inert = false
                    }
                }

                // NO auto-unlock
                await handler(...args)
            }
        },
        [cooldownMs]
    )

    return { guardSubmit, guardAction, reset } as const
}
