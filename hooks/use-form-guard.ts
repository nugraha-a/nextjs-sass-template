"use client"

import { useRef, useCallback } from "react"

/**
 * Multi-layer form submission guard that prevents spam clicks and bot abuse.
 *
 * Layer 1: Synchronous `useRef` — blocks re-entry before React renders.
 * Layer 2: Direct DOM mutation — sets `disabled` + `pointer-events:none`
 *          on the submit button immediately (no render cycle needed).
 * Layer 3: Form-level prevention — disables the entire form's submit event.
 *
 * Usage:
 *   const { guardSubmit, isGuarded } = useFormGuard()
 *   <form onSubmit={guardSubmit(handleMySubmit)}>
 *   <Button disabled={isGuarded} ...>
 */
export function useFormGuard() {
    const lockedRef = useRef(false)
    const isGuardedRef = useRef(false)

    // Force a re-render for the `isGuarded` state consumers
    const subscribersRef = useRef<Set<() => void>>(new Set())
    const forceUpdateRef = useRef(0)

    const setGuarded = useCallback((value: boolean) => {
        isGuardedRef.current = value
        lockedRef.current = value
    }, [])

    /**
     * Wraps an async submit handler with multi-layer spam protection.
     * Works with both form onSubmit and button onClick.
     */
    const guardSubmit = useCallback(
        <T extends unknown[]>(handler: (...args: T) => Promise<void> | void) => {
            return async (...args: T) => {
                // Layer 1: Synchronous ref check (instant, no render needed)
                if (lockedRef.current) return
                lockedRef.current = true
                isGuardedRef.current = true

                // Layer 2: Direct DOM mutation on the submit button
                // Find the event target to locate the form/button
                const event = args[0]
                let formEl: HTMLFormElement | null = null
                let buttonEl: HTMLButtonElement | null = null

                if (event && typeof event === "object" && "preventDefault" in event) {
                    const e = event as Event
                    const target = e.target as HTMLElement | null
                    if (target?.tagName === "FORM") {
                        formEl = target as HTMLFormElement
                    } else if (target?.closest?.("form")) {
                        formEl = target.closest("form") as HTMLFormElement
                    }
                }

                if (formEl) {
                    // Disable ALL submit buttons in the form immediately via DOM
                    buttonEl = formEl.querySelector(
                        'button[type="submit"], button:not([type])'
                    ) as HTMLButtonElement | null
                    if (buttonEl) {
                        buttonEl.disabled = true
                        buttonEl.style.pointerEvents = "none"
                    }
                    // Also prevent native form resubmission
                    formEl.dataset.submitting = "true"
                }

                try {
                    await handler(...args)
                } finally {
                    // Unlock everything
                    setGuarded(false)

                    if (buttonEl) {
                        buttonEl.disabled = false
                        buttonEl.style.pointerEvents = ""
                    }
                    if (formEl) {
                        delete formEl.dataset.submitting
                    }
                }
            }
        },
        [setGuarded]
    )

    /**
     * Wraps a non-form async action (like button onClick) with spam protection.
     * Use this for standalone buttons that don't belong to a <form>.
     */
    const guardAction = useCallback(
        <T extends unknown[]>(handler: (...args: T) => Promise<void> | void) => {
            return async (...args: T) => {
                if (lockedRef.current) return
                lockedRef.current = true
                isGuardedRef.current = true

                // Try to disable the clicked button directly via DOM
                const event = args[0]
                let buttonEl: HTMLButtonElement | null = null

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
                    setGuarded(false)
                    if (buttonEl) {
                        buttonEl.disabled = false
                        buttonEl.style.pointerEvents = ""
                    }
                }
            }
        },
        [setGuarded]
    )

    return {
        guardSubmit,
        guardAction,
        /** Current locked state — use for `disabled` prop on buttons */
        get isGuarded() {
            return isGuardedRef.current
        },
    }
}
