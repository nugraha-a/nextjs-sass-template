"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OverviewDashboard } from "@/components/modules/overview-dashboard"
import { ConfigurationEngine } from "@/components/modules/configuration-engine"
import { TenantManagement } from "@/components/modules/tenant-management"
import { IAMDashboard } from "@/components/modules/iam-dashboard"
import { WorkflowDesigner } from "@/components/modules/workflow-designer"
import { FinanceModule } from "@/components/modules/finance-module"

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

export default function DashboardPage() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("overview")
  const currentModule = modules[activeModule]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          title={currentModule.title}
          breadcrumbs={currentModule.breadcrumbs}
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />
        <main className="flex-1 overflow-auto bg-zinc-950">
          {activeModule === "overview" && <OverviewDashboard />}
          {activeModule === "config" && <ConfigurationEngine />}
          {activeModule === "tenants" && <TenantManagement />}
          {activeModule === "iam" && <IAMDashboard />}
          {activeModule === "workflow" && <WorkflowDesigner />}
          {activeModule === "finance" && <FinanceModule />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
