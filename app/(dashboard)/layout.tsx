import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TenantProvider, type TenantId, TENANTS } from "@/contexts/tenant-context"
import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get("sidebar_state")
  // Default to true (open/normal) for first-time visitors
  const defaultOpen = sidebarCookie ? sidebarCookie.value === "true" : true

  const tenantCookie = cookieStore.get("active-tenant")?.value as TenantId | undefined
  const initialTenant: TenantId = tenantCookie && TENANTS[tenantCookie] ? tenantCookie : "acme"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <TenantProvider initialTenant={initialTenant}>
        <AppSidebar />
        <SidebarInset className="bg-background h-screen flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto bg-background">
            <div className="content-container h-full">
              {children}
            </div>
          </main>
        </SidebarInset>
      </TenantProvider>
    </SidebarProvider>
  )
}
