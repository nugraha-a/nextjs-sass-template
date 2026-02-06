"use client"

import { ChevronRight, Bell, Search, Command, PanelLeft } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeSettingsPanel } from "@/components/dashboard/theme-settings-panel"
import { useThemeSettings } from "@/contexts/theme-settings-context"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { kernelModules, businessModules, supportItems } from "@/lib/nav-config"

function getBreadcrumbs(pathname: string) {
  const crumbs = [{ label: "Dashboard", href: "/" }]
  
  if (pathname === "/") {
    crumbs.push({ label: "Overview", href: "/" })
    return crumbs
  }

  // Helper to find path in modules
  const allModules = [...kernelModules, ...businessModules, ...supportItems]
  
  for (const module of allModules) {
    // Check if it matches a top-level item
    if (module.href === pathname) {
      crumbs.push({ label: module.title, href: module.href })
      return crumbs
    }
    
    // Check if it matches a sub-item
    if (module.items) {
      const subItem = module.items.find(item => item.href === pathname)
      if (subItem) {
        // Add Group Level
        crumbs.push({ 
          label: module.title, 
          href: "#" // Non-clickable group header 
        })
        // Add Page Level
        crumbs.push({ 
          label: subItem.title, 
          href: subItem.href 
        })
        return crumbs
      }
    }
  }

  // Fallback for paths not in menu (e.g. details pages)
  const paths = pathname.split("/").filter(Boolean)
  // Simple fallback logic if needed, but the main ones are covered above.
  // We can try to match the first segment to a group at least.
  
  if (paths.length > 0) {
     const p = paths[0]
     // Try to find a group that likely corresponds to this segment
     // This is heuristic, can be improved if needed
     const group = allModules.find(m => 
        m.items?.some(i => i.href.startsWith(`/${p}`)) || 
        (m.href && m.href.startsWith(`/${p}`))
     )
     
     if (group) {
        crumbs.push({ label: group.title, href: "#" })
     }
     
     // Add remaining segments capitalized
     paths.forEach((segment, index) => {
         // Skip if we already added the group and this segment is the group prefix?
         // Actually, let's just make it simple: if we didn't find an exact match above,
         // we just add the segments as we did before, but maybe prettier.
         if (group && index === 0) return; // Skip first if we added group? No, paths[0] is 'finance'. Group is 'Finance'.
         
         const href = "/" + paths.slice(0, index + 1).join("/")
         // Check if this specific href matches a known subitem to get a pretty title
         let label = segment.charAt(0).toUpperCase() + segment.slice(1)
         
         for (const m of allModules) {
             const found = m.items?.find(i => i.href === href)
             if (found) {
                 label = found.title
                 break
             }
         }
         
         if (crumbs[crumbs.length - 1].label !== label) {
            crumbs.push({ label, href })
         }
     })
  }

  return crumbs
}

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar()
  const { sidebarMode, setSidebarMode } = useThemeSettings()
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbs(pathname)

  const handleSidebarToggle = () => {
    if (sidebarMode === "offcanvas") {
      toggleSidebar()
      return
    }
    
    // Toggle between normal and compact
    setSidebarMode(sidebarMode === "normal" ? "compact" : "normal")
  }

  // Active Tab Logic helper
  const isTabActive = (path: string) => {
      if (path === "/" && pathname === "/") return true;
      if (path !== "/" && pathname.startsWith(path)) return true;
      return false;
  }

  return (
    <header className="flex flex-col border-b border-border bg-background">
      {/* Top Row: Sidebar Trigger & Breadcrumbs */}
      <div className="flex h-12 w-full items-center border-b border-border">
        {/* Sidebar Trigger Box */}
        <div className="flex h-full w-12 shrink-0 items-center justify-center border-r border-border relative z-20">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 -ml-1 text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:ring-0 focus-visible:outline-none"
            onClick={handleSidebarToggle}
          >
            <PanelLeft className="size-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>

        {/* Breadcrumbs & Actions */}
        <div className="flex flex-1 items-center justify-between px-4 min-w-0">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href + index} className="inline-flex items-center gap-1.5">
                  {index > 0 && (
                    <ChevronRight className="size-3.5 text-muted-foreground/50" aria-hidden="true" />
                  )}
                  {index < breadcrumbs.length - 1 ? (
                    crumb.href === "#" ? (
                      <span className="text-muted-foreground text-[13px]">{crumb.label}</span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="text-muted-foreground hover:text-foreground text-[13px] transition-colors duration-150"
                      >
                        {crumb.label}
                      </Link>
                    )
                  ) : (
                    <span className="text-foreground font-medium text-[13px]">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className="hidden md:flex h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150 gap-2 text-[13px]"
            >
              <Search className="size-3.5" />
              <span>Search</span>
              <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-secondary px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="size-2.5" />K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 flex size-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full size-1.5 bg-primary" />
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
            <ThemeSettingsPanel />
          </div>
        </div>
      </div>

      {/* Bottom Row: Module Tabs (Full Width) */}
      <div className="px-0 -mb-px flex items-center overflow-x-auto no-scrollbar border-b border-transparent">
        <Link 
          href="/" 
          className={`relative h-10 flex items-center justify-center border-b-2 px-4 text-[13px] transition-colors duration-150 ${isTabActive("/") ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground/80"}`}
        >
          Overview
        </Link>
        <Link 
          href="/config" 
          className={`relative h-10 flex items-center justify-center border-b-2 px-4 text-[13px] transition-colors duration-150 ${isTabActive("/config") ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground/80"}`}
        >
          Configuration
        </Link>
        <Link 
          href="/tenants" 
          className={`relative h-10 flex items-center justify-center border-b-2 px-4 text-[13px] transition-colors duration-150 ${isTabActive("/tenants") ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground/80"}`}
        >
          Tenants
        </Link>
        <Link 
          href="/iam" 
          className={`relative h-10 flex items-center justify-center border-b-2 px-4 text-[13px] transition-colors duration-150 ${isTabActive("/iam") ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground/80"}`}
        >
          IAM
        </Link>
        <Link 
          href="/workflow" 
          className={`relative h-10 flex items-center justify-center border-b-2 px-4 text-[13px] transition-colors duration-150 ${isTabActive("/workflow") ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground/80"}`}
        >
          Workflow
        </Link>
        <Link 
          href="/finance" 
          className={`relative h-10 flex items-center justify-center border-b-2 px-4 text-[13px] transition-colors duration-150 ${isTabActive("/finance") ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground/80"}`}
        >
          Finance
        </Link>
      </div>
    </header>
  )
}
