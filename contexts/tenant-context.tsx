"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

export type TenantId = "acme" | "yayasan"

interface TenantInfo {
  id: TenantId
  name: string
  subtitle: string
}

export const TENANTS: Record<TenantId, TenantInfo> = {
  acme: {
    id: "acme",
    name: "Acme Inc",
    subtitle: "Nextjs SaaS Template",
  },
  yayasan: {
    id: "yayasan",
    name: "Yayasan Al Ma'soem",
    subtitle: "Bandung · Fase 1",
  },
}

interface TenantContextType {
  tenant: TenantInfo
  tenantId: TenantId
  setTenant: (id: TenantId) => void
  allTenants: TenantInfo[]
}

const TenantContext = createContext<TenantContextType | null>(null)

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}

const COOKIE_KEY = "active-tenant"

export function TenantProvider({
  children,
  initialTenant = "acme",
}: {
  children: React.ReactNode
  initialTenant?: TenantId
}) {
  const [tenantId, setTenantId] = useState<TenantId>(initialTenant)
  const router = useRouter()

  const setTenant = useCallback((id: TenantId) => {
    setTenantId(id)
    // Write to cookie so the server can read it on next request
    document.cookie = `${COOKIE_KEY}=${id};path=/;max-age=31536000;samesite=lax`
    router.push(id === "yayasan" ? "/executive" : "/")
  }, [router])

  return (
    <TenantContext.Provider
      value={{
        tenant: TENANTS[tenantId],
        tenantId,
        setTenant,
        allTenants: Object.values(TENANTS),
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}
