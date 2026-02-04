"use client"

import React from "react"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronsUpDown,
  Sparkles,
  Shield,
  Workflow,
  Bell,
  FileText,
  Blocks,
  DollarSign,
  UserCog,
  Package,
  Briefcase,
  ChevronRight,
  Cog,
  Database,
  Globe,
  Palette,
  Key,
} from "lucide-react"

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
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface NavItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  isActive?: boolean
  badge?: string
  items?: { title: string; href: string; isActive?: boolean }[]
}

const kernelModules: NavItem[] = [
  { 
    title: "Overview", 
    icon: LayoutDashboard, 
    href: "#overview", 
    isActive: true 
  },
  {
    title: "Identity & Access",
    icon: Shield,
    items: [
      { title: "Users", href: "#iam/users" },
      { title: "Roles & Permissions", href: "#iam/roles" },
      { title: "Access Policies", href: "#iam/policies" },
      { title: "Audit Log", href: "#iam/audit" },
    ],
  },
  {
    title: "Tenant Management",
    icon: Building2,
    items: [
      { title: "Organizations", href: "#tenants/orgs" },
      { title: "Subscriptions", href: "#tenants/subscriptions" },
      { title: "Billing", href: "#tenants/billing" },
    ],
  },
  {
    title: "Configuration",
    icon: Cog,
    items: [
      { title: "General", href: "#config/general" },
      { title: "Terminology", href: "#config/terminology" },
      { title: "Localization", href: "#config/localization" },
      { title: "Feature Flags", href: "#config/features" },
      { title: "Branding", href: "#config/branding" },
    ],
  },
  {
    title: "Workflow Engine",
    icon: Workflow,
    items: [
      { title: "Designer", href: "#workflow/designer" },
      { title: "Rules", href: "#workflow/rules" },
      { title: "Instances", href: "#workflow/instances" },
      { title: "Templates", href: "#workflow/templates" },
    ],
  },
  { 
    title: "Notifications", 
    icon: Bell, 
    href: "#notifications",
    badge: "12"
  },
  { 
    title: "Documents", 
    icon: FileText, 
    href: "#documents" 
  },
  { 
    title: "Integrations", 
    icon: Blocks, 
    href: "#integrations" 
  },
]

const businessModules: NavItem[] = [
  {
    title: "Finance",
    icon: DollarSign,
    items: [
      { title: "General Ledger", href: "#finance/gl" },
      { title: "Accounts Payable", href: "#finance/ap" },
      { title: "Accounts Receivable", href: "#finance/ar" },
      { title: "Budgeting", href: "#finance/budget" },
      { title: "Fixed Assets", href: "#finance/assets" },
      { title: "Reports", href: "#finance/reports" },
    ],
  },
  {
    title: "Human Capital",
    icon: UserCog,
    items: [
      { title: "Employee Directory", href: "#hcm/employees" },
      { title: "Attendance", href: "#hcm/attendance" },
      { title: "Payroll", href: "#hcm/payroll" },
      { title: "Performance", href: "#hcm/performance" },
      { title: "Recruitment", href: "#hcm/recruitment" },
    ],
  },
  {
    title: "Supply Chain",
    icon: Package,
    items: [
      { title: "Purchase Orders", href: "#scm/po" },
      { title: "Inventory", href: "#scm/inventory" },
      { title: "Vendors", href: "#scm/vendors" },
      { title: "Goods Receipt", href: "#scm/gr" },
    ],
  },
  {
    title: "Programs",
    icon: Briefcase,
    items: [
      { title: "Projects", href: "#programs/projects" },
      { title: "Donations", href: "#programs/donations" },
      { title: "Fund Tracking", href: "#programs/funds" },
      { title: "Impact Reports", href: "#programs/impact" },
    ],
  },
]

const supportItems: NavItem[] = [
  { title: "Settings", icon: Settings, href: "#settings" },
  { title: "Help & Docs", icon: HelpCircle, href: "#help" },
]

function NavItemWithSub({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(item.isActive || false)

  if (!item.items) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={item.isActive}
          tooltip={item.title}
          className="transition-colors duration-150 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 data-[active=true]:bg-zinc-900 data-[active=true]:text-zinc-100"
        >
          <a href={item.href} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <item.icon className="size-4" />
              <span className="text-[13px]">{item.title}</span>
            </span>
            {item.badge && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-zinc-800 text-zinc-400 border-0">
                {item.badge}
              </Badge>
            )}
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className="transition-colors duration-150 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 data-[state=open]:text-zinc-100"
          >
            <item.icon className="size-4" />
            <span className="text-[13px]">{item.title}</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-150 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={subItem.isActive}
                  className="text-zinc-500 hover:text-zinc-100 data-[active=true]:text-zinc-100 text-[12px]"
                >
                  <a href={subItem.href}>{subItem.title}</a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-800/50 bg-zinc-950">
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-zinc-900 data-[state=open]:text-zinc-100 hover:bg-zinc-900 transition-colors duration-150"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 shrink-0">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold tracking-tight text-zinc-100">
                      Aurora
                    </span>
                    <span className="truncate text-xs text-zinc-500">
                      Reforged
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-zinc-600" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 bg-zinc-900 border-zinc-800"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuItem className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">
                  <Sparkles className="mr-2 size-4" />
                  Aurora Reforged
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="text-zinc-500 focus:bg-zinc-800 focus:text-zinc-400">
                  <Globe className="mr-2 size-4" />
                  Switch tenant
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-500 focus:bg-zinc-800 focus:text-zinc-400">
                  <Palette className="mr-2 size-4" />
                  Customize branding
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="bg-zinc-800/50" />

      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest px-3 mb-1">
            Core Kernel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {kernelModules.map((item) => (
                <NavItemWithSub key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-zinc-800/50" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest px-3 mb-1">
            Business Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessModules.map((item) => (
                <NavItemWithSub key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-zinc-800/50" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest px-3 mb-1">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <NavItemWithSub key={item.title} item={item} />
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
                  className="data-[state=open]:bg-zinc-900 data-[state=open]:text-zinc-100 hover:bg-zinc-900 transition-colors duration-150"
                >
                  <Avatar className="size-8 rounded-md shrink-0">
                    <AvatarFallback className="rounded-md bg-zinc-800 text-zinc-400 text-xs font-medium">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium tracking-tight text-zinc-100 text-[13px]">
                      Admin User
                    </span>
                    <span className="truncate text-xs text-zinc-500">
                      Super Admin
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-zinc-600" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 bg-zinc-900 border-zinc-800"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">
                  <Key className="mr-2 size-4" />
                  API Keys
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100">
                  <Settings className="mr-2 size-4" />
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="text-red-400 focus:bg-zinc-800 focus:text-red-400">
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
