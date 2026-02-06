import {
  LayoutDashboard,
  Shield,
  Building2,
  Cog,
  Workflow,
  Bell,
  FileText,
  Blocks,
  DollarSign,
  UserCog,
  Package,
  Briefcase,
  Settings,
  HelpCircle,
} from "lucide-react"

export interface NavSubItem {
  title: string
  href: string
}

export interface NavItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  badge?: string
  items?: NavSubItem[]
}

export const kernelModules: NavItem[] = [
  { 
    title: "Overview", 
    icon: LayoutDashboard, 
    href: "/", 
  },
  {
    title: "Identity & Access",
    icon: Shield,
    items: [
      { title: "Identity & Access Management", href: "/iam" },
      { title: "Roles & Permissions", href: "/iam/roles" }, 
      { title: "Access Policies", href: "/iam/policies" },
      { title: "Audit Log", href: "/iam/audit" },
    ],
  },
  {
    title: "Tenant Management",
    icon: Building2,
    items: [
      { title: "Tenant Management", href: "/tenants" },
      { title: "Subscriptions", href: "/tenants/subscriptions" },
      { title: "Billing", href: "/tenants/billing" },
    ],
  },
  {
    title: "Configuration",
    icon: Cog,
    items: [
      { title: "Configuration Engine", href: "/config" },
      { title: "Terminology", href: "/config/terminology" },
      { title: "Localization", href: "/config/localization" },
      { title: "Feature Flags", href: "/config/features" },
      { title: "Branding", href: "/config/branding" },
    ],
  },
  {
    title: "Workflow Engine",
    icon: Workflow,
    items: [
      { title: "Workflow Engine", href: "/workflow" },
      { title: "Rules", href: "/workflow/rules" },
      { title: "Instances", href: "/workflow/instances" },
      { title: "Templates", href: "/workflow/templates" },
    ],
  },
  { 
    title: "Notifications", 
    icon: Bell, 
    href: "/notifications",
    badge: "12"
  },
  { 
    title: "Documents", 
    icon: FileText, 
    href: "/documents" 
  },
  { 
    title: "Integrations", 
    icon: Blocks, 
    href: "/integrations" 
  },
]

export const businessModules: NavItem[] = [
  {
    title: "Finance",
    icon: DollarSign,
    items: [
      { title: "Finance & Accounting", href: "/finance" },
      { title: "Accounts Payable", href: "/finance/ap" },
      { title: "Accounts Receivable", href: "/finance/ar" },
      { title: "Budgeting", href: "/finance/budget" },
      { title: "Fixed Assets", href: "/finance/assets" },
      { title: "Reports", href: "/finance/reports" },
    ],
  },
  {
    title: "Human Capital",
    icon: UserCog,
    items: [
      { title: "Human Capital Management", href: "/hcm" },
      { title: "Attendance", href: "/hcm/attendance" },
      { title: "Payroll", href: "/hcm/payroll" },
      { title: "Performance", href: "/hcm/performance" },
      { title: "Recruitment", href: "/hcm/recruitment" },
    ],
  },
  {
    title: "Supply Chain",
    icon: Package,
    items: [
      { title: "Supply Chain Management", href: "/scm" },
      { title: "Inventory", href: "/scm/inventory" },
      { title: "Vendors", href: "/scm/vendors" },
      { title: "Goods Receipt", href: "/scm/gr" },
    ],
  },
  {
    title: "Programs",
    icon: Briefcase,
    items: [
      { title: "Programs Management", href: "/programs" },
      { title: "Donations", href: "/programs/donations" },
      { title: "Fund Tracking", href: "/programs/funds" },
      { title: "Impact Reports", href: "/programs/impact" },
    ],
  },
]

export const supportItems: NavItem[] = [
  { title: "Settings", icon: Settings, href: "/settings" },
  { title: "Help & Docs", icon: HelpCircle, href: "/help" },
]
