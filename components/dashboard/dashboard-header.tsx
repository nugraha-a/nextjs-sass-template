"use client"

import { ChevronRight, Bell, Search, Command } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardHeaderProps {
  title?: string
  breadcrumbs?: { label: string; href?: string }[]
  activeModule?: string
  onModuleChange?: (module: string) => void
}

export function DashboardHeader({
  breadcrumbs = [{ label: "Dashboard" }, { label: "Overview" }],
  activeModule = "overview",
  onModuleChange,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col border-b border-zinc-800/50 bg-zinc-950">
      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 text-zinc-500 hover:text-zinc-100 transition-colors duration-150" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-800" />
        
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className="inline-flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="size-3.5 text-zinc-700" aria-hidden="true" />
                )}
                {index < breadcrumbs.length - 1 ? (
                  <a
                    href={crumb.href || "#"}
                    className="text-zinc-500 hover:text-zinc-100 text-[13px] transition-colors duration-150"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-zinc-100 font-medium text-[13px]">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            className="hidden md:flex h-8 px-3 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900 transition-colors duration-150 gap-2 text-[13px]"
          >
            <Search className="size-3.5" />
            <span>Search</span>
            <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-500">
              <Command className="size-2.5" />K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative size-8 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900 transition-colors duration-150"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-100 opacity-75" />
              <span className="relative inline-flex rounded-full size-1.5 bg-zinc-100" />
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>

      {/* Module tabs */}
      <div className="px-4 -mb-px">
        <Tabs value={activeModule} onValueChange={onModuleChange}>
          <TabsList className="h-10 bg-transparent p-0 gap-0">
            <TabsTrigger 
              value="overview" 
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 text-[13px] text-zinc-500 hover:text-zinc-300 data-[state=active]:border-zinc-100 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors duration-150"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="config" 
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 text-[13px] text-zinc-500 hover:text-zinc-300 data-[state=active]:border-zinc-100 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors duration-150"
            >
              Configuration
            </TabsTrigger>
            <TabsTrigger 
              value="tenants" 
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 text-[13px] text-zinc-500 hover:text-zinc-300 data-[state=active]:border-zinc-100 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors duration-150"
            >
              Tenants
            </TabsTrigger>
            <TabsTrigger 
              value="iam" 
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 text-[13px] text-zinc-500 hover:text-zinc-300 data-[state=active]:border-zinc-100 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors duration-150"
            >
              IAM
            </TabsTrigger>
            <TabsTrigger 
              value="workflow" 
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 text-[13px] text-zinc-500 hover:text-zinc-300 data-[state=active]:border-zinc-100 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors duration-150"
            >
              Workflow
            </TabsTrigger>
            <TabsTrigger 
              value="finance" 
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 text-[13px] text-zinc-500 hover:text-zinc-300 data-[state=active]:border-zinc-100 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors duration-150"
            >
              Finance
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  )
}
