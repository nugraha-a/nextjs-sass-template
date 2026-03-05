"use client"

import { useRef, useCallback } from "react"

/**
 * Bulletproof form submission guard — prevents spam clicks even from bots.
 *
 * Layer 1: Synchronous `useRef` — blocks re-entry instantly (no render needed).
 * Layer 2: Always calls `preventDefault()` — even on blocked attempts.
 * Layer 3: Direct DOM mutation — disables ALL submit buttons via DOM API
 *          immediately, bypassing React's async render cycle.
 * Layer 4: Form-level `data-submitting` attribute blocks native resubmission.
 */
export function useFormGuard() {
    const lockedRef = useRef(false)

    /**
     * Wraps an async form onSubmit handler.
     * IMPORTANT: The wrapped handler will receive the event with
     * `preventDefault()` already called.
     */
    const guardSubmit = useCallback(
        <T extends unknown[]>(handler: (...args: T) => Promise<void> | void) => {
            return async (...args: T) => {
                // Always prevent default FIRST — even if we're going to block.
                // This stops the native form from resubmitting.
                const event = args[0]
                if (event && typeof event === "object" && "preventDefault" in event) {
                    ; (event as Event).preventDefault()
                }

                // Layer 1: Synchronous ref check — instant, no render needed
                if (lockedRef.current) return
                lockedRef.current = true

                // Layer 3: Locate the form and directly disable all submit buttons via DOM
                let formEl: HTMLFormElement | null = null
                const buttons: HTMLButtonElement[] = []

                if (event && typeof event === "object") {
                    const e = event as Event
                    const target = e.target as HTMLElement | null
                    if (target?.tagName === "FORM") {
                        formEl = target as HTMLFormElement
                    } else if (target?.closest?.("form")) {
                        formEl = target.closest("form") as HTMLFormElement
                    }
                }

                if (formEl) {
                    // Disable ALL buttons in the form (submit and non-typed)
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

                    // Re-enable all buttons
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
        []
    )

    /**
     * Wraps a non-form async action (button onClick, workspace select, etc.).
     * Prevents double-firing of standalone actions.
     */
    const guardAction = useCallback(
        <T extends unknown[]>(handler: (...args: T) => Promise<void> | void) => {
            return async (...args: T) => {
                if (lockedRef.current) return
                lockedRef.current = true

                // Directly disable the clicked button via DOM
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
        []
    )

    return {
        guardSubmit,
        guardAction,
        /** Check if currently locked (for conditional rendering) */
        get isGuarded() {
            return lockedRef.current
        },
    }
}
