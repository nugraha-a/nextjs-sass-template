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
    title: "Tenant",
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
    title: "Workflow",
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
  {
    title: "Settings",
    icon: Settings,
    items: [
      { title: "General", href: "/settings" },
      { title: "Users", href: "/settings/users" },
      { title: "Roles & Access", href: "/settings/rbac" },
      { title: "API Clients", href: "/settings/api" },
      { title: "Security", href: "/settings/security" },
    ],
  },
  { title: "Help & Docs", icon: HelpCircle, href: "/help" },
]

// ─────────────────────────────────────────────
// YAYASAN AL MA'SOEM — Tenant-specific navigation
// ─────────────────────────────────────────────

import {
  Users,
  CalendarCheck,
  Wallet,
  Calculator,
  FileStack,
  ClipboardCheck,
  BarChart3,
  Scale,
  Mail,
  MailOpen,
  FileCheck,
  GraduationCap,
  Heart,
  TrendingUp as TrendingUpIcon,
  Receipt,
} from "lucide-react"

export const yayasanCoreModules: NavItem[] = [
  {
    title: "Dashboard Eksekutif",
    icon: BarChart3,
    href: "/executive",
  },
  {
    title: "SDM",
    icon: Users,
    items: [
      { title: "Manajemen SDM", href: "/sdm" },
      { title: "Kehadiran", href: "/sdm/kehadiran" },
      { title: "Penggajian", href: "/sdm/penggajian" },
      { title: "Kinerja", href: "/sdm/kinerja" },
    ],
  },
  {
    title: "Keuangan",
    icon: Wallet,
    items: [
      { title: "Manajemen Keuangan", href: "/keuangan" },
      { title: "Arus Kas", href: "/keuangan/arus-kas" },
      { title: "Anggaran", href: "/keuangan/anggaran" },
      { title: "Persetujuan", href: "/keuangan/persetujuan" },
    ],
  },
]

export const yayasanBusinessModules: NavItem[] = [
  {
    title: "Akuntansi",
    icon: Calculator,
    items: [
      { title: "Manajemen Akuntansi", href: "/akuntansi" },
      { title: "Jurnal Umum", href: "/akuntansi/jurnal" },
      { title: "Laporan Keuangan", href: "/akuntansi/laporan" },
      { title: "Neraca", href: "/akuntansi/neraca" },
    ],
  },
  {
    title: "Kesekretariatan",
    icon: FileStack,
    items: [
      { title: "Manajemen Arsip", href: "/kesekretariatan" },
      { title: "Surat Masuk", href: "/kesekretariatan/surat-masuk" },
      { title: "Surat Keluar", href: "/kesekretariatan/surat-keluar" },
      { title: "Dokumen Legal", href: "/kesekretariatan/legal" },
    ],
  },
]

export const yayasanSupportItems: NavItem[] = [
  {
    title: "Pengaturan",
    icon: Settings,
    items: [
      { title: "Umum", href: "/settings" },
      { title: "Pengguna", href: "/settings/users" },
      { title: "Peran & Akses", href: "/settings/rbac" },
      { title: "API Clients", href: "/settings/api" },
      { title: "Keamanan", href: "/settings/security" },
    ],
  },
  { title: "Bantuan", icon: HelpCircle, href: "/help" },
]
