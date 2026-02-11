"use client"

import React, { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  ChevronsUpDown,
  Sparkles,
  ChevronRight,
  Globe,
  Palette,
  Key,
  Settings,
  LogOut,
  PanelLeftIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useThemeSettings } from "@/contexts/theme-settings-context"

import {
  kernelModules,
  businessModules,
  supportItems,
  type NavItem,
  type NavSubItem,
} from "@/lib/nav-config"

function SidebarSubItemLink({ subItem, isActive }: { subItem: NavSubItem, isActive: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (isActive && ref.current) {
      // Delay slightly to allow Collapsible to expand
      const timer = setTimeout(() => {
        ref.current?.scrollIntoView({ block: "center", behavior: "smooth" })
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
        isActive={isActive}
        className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold text-xs leading-normal transition-all duration-200"
      >
        <Link ref={ref} href={subItem.href}>{subItem.title}</Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

function NavItemWithSub({ 
  item, 
  openGroups, 
  onToggle 
}: { 
  item: NavItem; 
  openGroups: string[]; 
  onToggle: (title: string, open: boolean) => void; 
}) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Determine if this item or any of its children are active
  const isActive = item.href 
    ? pathname === item.href 
    : item.items?.some(sub => pathname.startsWith(sub.href))

  const isOpen = openGroups.includes(item.title)
  const leafRef = useRef<HTMLAnchorElement>(null)

  // Scroll active leaf item into view
  useEffect(() => {
    if (isActive && !item.items && leafRef.current) {
        leafRef.current.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }, [isActive, item.items])

  if (!item.items) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={item.title}
          className="transition-colors duration-150 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:!size-8"
        >
          <Link ref={leafRef} href={item.href || "#"} className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <span className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0">
              <item.icon className="size-4 shrink-0" />
              <span className="text-sm leading-4 group-data-[collapsible=icon]:hidden">{item.title}</span>
            </span>
            {item.badge && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-secondary text-muted-foreground border-0 group-data-[collapsible=icon]:hidden">
                {item.badge}
              </Badge>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  if (isCollapsed) {
    return (
      <SidebarMenuItem>
        <DropdownMenu modal={false} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={isDropdownOpen ? undefined : item.title}
              isActive={isActive}
          className="transition-all duration-300 ease-[cubic-bezier(0.2,0.4,0,1)] text-muted-foreground hover:text-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:!size-8 justify-center data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <item.icon className="size-4 shrink-0" />
              <span className="sr-only">{item.title}</span>
              <ChevronRight className="ml-auto size-4 hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="right" 
            align="start" 
            className="w-60 p-1.5 bg-popover/95 backdrop-blur-sm border-border/40 animate-in slide-in-from-left-2 fade-in-50 duration-300 ease-[cubic-bezier(0.2,0.4,0,1)] shadow-2xl ml-2 rounded-xl"
            sideOffset={-4}
          >
            {/* Header with Icon Box */}
            <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1 border-b border-border/40 pb-2">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-accent/50 text-sidebar-accent-foreground ring-1 ring-border/30">
                    <item.icon className="size-3.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold tracking-tight text-foreground leading-none">{item.title}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium leading-none opacity-80">Module Group</span>
                </div>
            </div>

            <div className="flex flex-col gap-0.5 mt-0.5">
            {item.items.map((subItem) => {
              const isSubActive = pathname === subItem.href
              return (
              <DropdownMenuItem 
                key={subItem.title} 
                asChild 
                className={cn(
                  "group flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer transition-all duration-200 outline-none",
                  isSubActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
                    : "text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                )}
              >
                <Link href={subItem.href} className="w-full flex items-center gap-2">
                   {/* Clean Dot Indicator */}
                   <div className={cn(
                      "flex items-center justify-center size-3 shrink-0 transition-colors",
                      isSubActive ? "text-sidebar-accent-foreground" : "text-border group-hover:text-sidebar-foreground"
                   )}>
                        <div className={cn(
                            "size-1.5 rounded-full bg-current shadow-sm", 
                            !isSubActive && "scale-75 opacity-70 group-hover:opacity-100 group-hover:scale-90 transition-all"
                        )} />
                   </div>
                   <span className={cn("text-[13px] leading-tight", isSubActive ? "font-medium" : "font-normal")}>
                     {subItem.title}
                   </span>
                </Link>
              </DropdownMenuItem>
            )})}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={(open) => onToggle(item.title, open)} 
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className="transition-colors duration-150 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent data-[state=open]:text-foreground group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:!size-8"
          >
            <item.icon className="size-4 shrink-0" />
            <span className="text-sm leading-4 group-data-[collapsible=icon]:hidden">{item.title}</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-150 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => {
              const isSubActive = pathname === subItem.href
              return (
                <SidebarSubItemLink key={subItem.title} subItem={subItem} isActive={isSubActive} />
            )})}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

interface AppSidebarProps {
  collapsible?: "offcanvas" | "icon" | "none"
}

export function AppSidebar({ collapsible = "icon" }: AppSidebarProps) {
  const pathname = usePathname()
  const { sidebarMode, setSidebarMode } = useThemeSettings()
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar()
  const [openGroups, setOpenGroups] = useState<string[]>([])

  // Helper to find the active group based on current path
  const getActiveGroupTitle = () => {
    const allGroups = [...kernelModules, ...businessModules, ...supportItems]
    return allGroups.find(g => 
       g.items?.some(i => pathname === i.href || pathname.startsWith(i.href + '/'))
    )?.title
  }

  useEffect(() => {
    const activeTitle = getActiveGroupTitle()
    if (activeTitle) {
      setOpenGroups([activeTitle])
    } else {
      setOpenGroups([])
    }
  }, [pathname])

  const prevSidebarModeRef = useRef(sidebarMode)
  const prevOpenRef = useRef(open)
  const prevIsMobileRef = useRef(isMobile)
  const lastDesktopModeRef = useRef<"normal" | "compact" | "offcanvas">(sidebarMode)


  // Preserve desktop mode when switching to/from mobile
  useEffect(() => {
    // Detect transition FROM desktop TO mobile - store mode before switching
    if (!prevIsMobileRef.current && isMobile) {
      // We're transitioning TO mobile, store current desktop mode
      if (sidebarMode !== "offcanvas") {
        lastDesktopModeRef.current = sidebarMode
      }
    }
    
    // Detect transition FROM mobile TO desktop - restore mode
    if (prevIsMobileRef.current && !isMobile) {
      // We're transitioning TO desktop, restore last desktop mode
      if (lastDesktopModeRef.current) {
        setSidebarMode(lastDesktopModeRef.current)
      }
    }
    
    // Update stored desktop mode whenever it changes on desktop
    if (!isMobile && sidebarMode !== "offcanvas") {
      lastDesktopModeRef.current = sidebarMode
    }
    
    prevIsMobileRef.current = isMobile
  }, [isMobile, sidebarMode, setSidebarMode])

  // Sync Theme Mode -> Sidebar Open State (Desktop/Tablet only)
  useEffect(() => {
    // Skip sync on mobile - mobile always uses offcanvas with openMobile state
    if (isMobile) return

    if (prevSidebarModeRef.current !== sidebarMode) {
      if (sidebarMode === "compact") {
        setOpen(false)
      } else if (sidebarMode === "normal") {
        setOpen(true)
      }
      prevSidebarModeRef.current = sidebarMode
    }
  }, [sidebarMode, setOpen, isMobile])

  // Sync Sidebar Open State -> Theme Mode (Harmony - Desktop/Tablet only)
  useEffect(() => {
    // Skip sync on mobile and offcanvas mode
    if (isMobile || sidebarMode === "offcanvas") return

    if (prevOpenRef.current !== open) {
      if (open) {
        setSidebarMode("normal")
      } else {
        setSidebarMode("compact")
      }
      prevOpenRef.current = open
    }
  }, [open, setSidebarMode, isMobile, sidebarMode])

  // Mobile: always use offcanvas (Sheet overlay)
  // Desktop/Tablet: respect sidebarMode setting
  const effectiveCollapsible = isMobile ? "offcanvas" : (sidebarMode === "offcanvas" ? "offcanvas" : collapsible)

  const handleGroupToggle = (title: string, open: boolean) => {
    setOpenGroups(prev => {
      if (open) {
        // When opening a group, keep the active group open (if it exists), 
        // but close others. Effectively allowing [Active, NewGroup] at most.
        const activeTitle = getActiveGroupTitle()
        const nextGroups = activeTitle ? [activeTitle] : []
        if (title !== activeTitle) {
          nextGroups.push(title)
        }
        return Array.from(new Set(nextGroups))
      } else {
        // When closing, just remove the group
        return prev.filter(t => t !== title)
      }
    })
  }

  return (
    <Sidebar collapsible={effectiveCollapsible} className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-2 relative">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-primary/10 data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-primary/5 transition-colors duration-150"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shrink-0">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold tracking-tight text-foreground">
                      Acme Inc
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Nextjs SaaS Template
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 bg-popover border-border"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-accent-foreground">
                  <Sparkles className="mr-2 size-4" />
                  Acme Inc 
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="text-muted-foreground focus:bg-accent focus:text-accent-foreground">
                  <Globe className="mr-2 size-4" />
                  Switch tenant
                </DropdownMenuItem>
                <DropdownMenuItem className="text-muted-foreground focus:bg-accent focus:text-accent-foreground">
                  <Palette className="mr-2 size-4" />
                  Customize branding
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMobile(false)}
            className="absolute top-1/2 -translate-y-1/2 right-[-2rem] flex size-8 items-center justify-center rounded-r-md border border-l-0 border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xs hover:bg-sidebar focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none z-50 rounded-l-none"
          >
            <PanelLeftIcon className="size-4" />
            <span className="sr-only">Close Sidebar</span>
          </Button>
        )}
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-1 mb-1">
            Core Kernel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {kernelModules.map((item) => (
                <NavItemWithSub 
                  key={item.title} 
                  item={item} 
                  openGroups={openGroups} 
                  onToggle={handleGroupToggle} 
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-1 mb-1">
            Business Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessModules.map((item) => (
                <NavItemWithSub 
                  key={item.title} 
                  item={item} 
                  openGroups={openGroups} 
                  onToggle={handleGroupToggle} 
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-1 mb-1">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <NavItemWithSub 
                  key={item.title} 
                  item={item} 
                  openGroups={openGroups} 
                  onToggle={handleGroupToggle} 
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-primary/10 data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-primary/5 transition-colors duration-150"
                >
                  <Avatar className="size-8 rounded-md shrink-0">
                    <AvatarFallback className="rounded-md bg-secondary text-muted-foreground text-xs font-medium">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium tracking-tight text-foreground text-[13px]">
                      Admin User
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Super Admin
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 bg-popover border-border"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-accent-foreground">
                  <Key className="mr-2 size-4" />
                  API Keys
                </DropdownMenuItem>
                <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-accent-foreground">
                  <Settings className="mr-2 size-4" />
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="text-destructive-foreground focus:bg-accent focus:text-destructive-foreground">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
