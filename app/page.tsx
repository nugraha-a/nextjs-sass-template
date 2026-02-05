"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OverviewDashboard } from "@/components/modules/overview-dashboard"
import { ConfigurationEngine } from "@/components/modules/configuration-engine"
import { TenantManagement } from "@/components/modules/tenant-management"
import { IAMDashboard } from "@/components/modules/iam-dashboard"
import { WorkflowDesigner } from "@/components/modules/workflow-designer"
import { FinanceModule } from "@/components/modules/finance-module"
import { useThemeSettings, type SidebarMode } from "@/contexts/theme-settings-context"
import { cn } from "@/lib/utils"

type ModuleKey = "overview" | "config" | "tenants" | "iam" | "workflow" | "finance"

const modules: Record<ModuleKey, { title: string; breadcrumbs: { label: string; href?: string }[] }> = {
  overview: {
    title: "Overview",
    breadcrumbs: [{ label: "Dashboard" }, { label: "Overview" }],
  },
  config: {
    title: "Configuration Engine",
    breadcrumbs: [{ label: "Core Kernel" }, { label: "Configuration" }],
  },
  tenants: {
    title: "Tenant Management",
    breadcrumbs: [{ label: "Core Kernel" }, { label: "Tenants" }],
  },
  iam: {
    title: "Identity & Access",
    breadcrumbs: [{ label: "Core Kernel" }, { label: "IAM" }],
  },
  workflow: {
    title: "Workflow Designer",
    breadcrumbs: [{ label: "Core Kernel" }, { label: "Workflow" }],
  },
  finance: {
    title: "Finance",
    breadcrumbs: [{ label: "Business Modules" }, { label: "Finance" }],
  },
}

function DashboardContent({ 
  activeModule, 
  setActiveModule,
  currentModule 
}: { 
  activeModule: ModuleKey
  setActiveModule: (module: ModuleKey) => void
  currentModule: typeof modules[ModuleKey]
}) {
  const { sidebarMode } = useThemeSettings()
  const { setOpen } = useSidebar()

  // Apply sidebar mode
  useEffect(() => {
    if (sidebarMode === "compact") {
      setOpen(false)
    } else if (sidebarMode === "normal") {
      setOpen(true)
    }
    // offcanvas mode will be handled by the sidebar's collapsible prop
  }, [sidebarMode, setOpen])

  return (
    <SidebarInset className="bg-background h-screen flex flex-col overflow-hidden">
      <DashboardHeader
        title={currentModule.title}
        breadcrumbs={currentModule.breadcrumbs}
        activeModule={activeModule}
        onModuleChange={(module) => setActiveModule(module as ModuleKey)}
      />
      <main className="flex-1 overflow-auto bg-background">
        <div className="content-container h-full">
          {activeModule === "overview" && <OverviewDashboard />}
          {activeModule === "config" && <ConfigurationEngine />}
          {activeModule === "tenants" && <TenantManagement />}
          {activeModule === "iam" && <IAMDashboard />}
          {activeModule === "workflow" && <WorkflowDesigner />}
          {activeModule === "finance" && <FinanceModule />}
        </div>
      </main>
    </SidebarInset>
  )
}

function getSidebarCollapsible(mode: SidebarMode): "offcanvas" | "icon" | "none" {
  switch (mode) {
    case "offcanvas":
      return "offcanvas"
    case "compact":
      return "icon"
    default:
      return "icon"
  }
}

export default function DashboardPage() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("overview")
  const [mounted, setMounted] = useState(false)
  const currentModule = modules[activeModule]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Read sidebar mode from localStorage directly for initial render
  const [initialSidebarMode, setInitialSidebarMode] = useState<SidebarMode>("normal")
  
  useEffect(() => {
    const stored = localStorage.getItem("aurora-theme-settings")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.sidebarMode) {
          setInitialSidebarMode(parsed.sidebarMode)
        }
      } catch {
        // Use default
      }
    }
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <SidebarProviderWithSettings 
      activeModule={activeModule}
      setActiveModule={setActiveModule}
      currentModule={currentModule}
      initialSidebarMode={initialSidebarMode}
    />
  )
}

function SidebarProviderWithSettings({
  activeModule,
  setActiveModule,
  currentModule,
  initialSidebarMode,
}: {
  activeModule: ModuleKey
  setActiveModule: (module: ModuleKey) => void
  currentModule: typeof modules[ModuleKey]
  initialSidebarMode: SidebarMode
}) {
  const { sidebarMode } = useThemeSettings()
  const collapsible = getSidebarCollapsible(sidebarMode || initialSidebarMode)
  
  return (
    <SidebarProvider defaultOpen={sidebarMode !== "compact"}>
      <AppSidebar collapsible={collapsible} />
      <DashboardContent 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        currentModule={currentModule}
      />
    </SidebarProvider>
  )
}
