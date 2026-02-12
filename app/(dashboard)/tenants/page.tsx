"use client"

import { useState, useEffect, useRef } from "react"
import {
  AlertCircle,
  ArrowUpRight,
  Building,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Crown,
  Download,
  Eye,
  Filter,
  Globe,
  Key,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Shield,
  Star,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
  BarChart3,
  Activity,
  XCircle,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
} from "recharts"

/* ─── Animated counter hook ────────────────────────────── */

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])

  return count
}

/* ─── Data ─────────────────────────────────────────────── */

const tenants = [
  { id: 1, name: "Acme Corporation", domain: "acme.app", plan: "Enterprise", status: "active", users: 156, storage: "45.2 GB", mrr: "$2,450", lastActive: "2 hours ago" },
  { id: 2, name: "TechStart Inc.", domain: "techstart.app", plan: "Business", status: "active", users: 48, storage: "12.8 GB", mrr: "$890", lastActive: "5 hours ago" },
  { id: 3, name: "Global Dynamics", domain: "globaldyn.app", plan: "Enterprise", status: "active", users: 234, storage: "78.5 GB", mrr: "$3,200", lastActive: "Just now" },
  { id: 4, name: "Startup Labs", domain: "startuplabs.app", plan: "Starter", status: "trial", users: 12, storage: "2.1 GB", mrr: "$0", lastActive: "1 day ago" },
  { id: 5, name: "Media Group", domain: "mediagrp.app", plan: "Business", status: "active", users: 67, storage: "28.4 GB", mrr: "$890", lastActive: "3 hours ago" },
  { id: 6, name: "DataFlow Systems", domain: "dataflow.app", plan: "Business", status: "suspended", users: 34, storage: "15.6 GB", mrr: "$0", lastActive: "30 days ago" },
]

const subscriptionPlans = [
  { name: "Starter", price: "$49/mo", tenants: 3, features: ["5 users", "10 GB storage", "Basic support", "Core modules"], color: "bg-emerald-500", icon: Zap },
  { name: "Business", price: "$89/mo", tenants: 8, features: ["50 users", "100 GB storage", "Priority support", "All modules", "API access"], color: "bg-primary", icon: Star },
  { name: "Enterprise", price: "$249/mo", tenants: 4, features: ["Unlimited users", "1 TB storage", "24/7 support", "All modules", "API + SSO", "Custom branding"], color: "bg-amber-500", icon: Crown },
]

const activityLogs = [
  { id: 1, action: "Tenant Created", tenant: "Startup Labs", details: "New trial tenant provisioned automatically", timestamp: "1 hour ago", color: "bg-primary" },
  { id: 2, action: "Plan Upgraded", tenant: "Media Group", details: "Upgraded from Starter → Business plan", timestamp: "3 hours ago", color: "bg-emerald-500" },
  { id: 3, action: "User Limit Reached", tenant: "TechStart Inc.", details: "Approaching 50-user plan limit (48/50)", timestamp: "5 hours ago", color: "bg-amber-500" },
  { id: 4, action: "Billing Failed", tenant: "DataFlow Systems", details: "Payment declined — card ending 4242", timestamp: "1 day ago", color: "bg-red-500" },
  { id: 5, action: "Domain Verified", tenant: "Acme Corporation", details: "Custom domain acme.app DNS verified", timestamp: "2 days ago", color: "bg-sky-500" },
  { id: 6, action: "Tenant Suspended", tenant: "DataFlow Systems", details: "Auto-suspended due to billing failure > 14d", timestamp: "2 days ago", color: "bg-red-500" },
  { id: 7, action: "Storage Alert", tenant: "Global Dynamics", details: "Storage usage at 78% (78.5 GB / 100 GB)", timestamp: "3 days ago", color: "bg-amber-500" },
]

const planDistribution = [
  { name: "Starter", value: 3 },
  { name: "Business", value: 8 },
  { name: "Enterprise", value: 4 },
]
const planColors = ["var(--color-chart-3)", "var(--color-primary)", "var(--color-chart-4)"]

/* ─── Helpers ──────────────────────────────────────────── */

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]"><CheckCircle2 className="size-3 mr-1" />Active</Badge>
    case "trial":
      return <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-0 text-[10px]"><Clock className="size-3 mr-1" />Trial</Badge>
    case "suspended":
      return <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-0 text-[10px]"><AlertCircle className="size-3 mr-1" />Suspended</Badge>
    default:
      return null
  }
}

function getPlanBadge(plan: string) {
  const colors: Record<string, string> = {
    Starter: "bg-emerald-500/10 text-emerald-400",
    Business: "bg-primary/10 text-primary",
    Enterprise: "bg-amber-500/10 text-amber-400",
  }
  return <Badge variant="secondary" className={`${colors[plan]} border-0 text-[10px]`}>{plan}</Badge>
}

/* ─── Quick Link ───────────────────────────────────────── */

function QuickLink({ icon, label, description }: { icon: React.ReactNode; label: string; description: string }) {
  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-background/60 border border-border/50 hover:border-primary/30 hover:bg-background transition-colors cursor-pointer group">
      <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary/15 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[12px] font-medium text-card-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

/* ─── Stat Card with Sparkline ─────────────────────────── */

function StatCard({ label, value, displayValue, change, trend, chartColor, badge }: {
  label: string; value: number; displayValue?: string; change: string; trend: "up" | "down"; chartColor: string; badge?: string
}) {
  const count = useCountUp(value)
  const sparkData = [35, 50, 40, 60, 45, 70, 55, 80, 60, 90, 65, 85].map((v, i) => ({ i, v }))

  return (
    <Card className="bg-card border border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-card-foreground">{label}</p>
          <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary border-0 h-4 px-1.5">
            {badge || "tenants"}
          </Badge>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{displayValue || count}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <div className={`flex items-center gap-0.5 text-[11px] font-medium ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
            {trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {change}
          </div>
        </div>
        <div className="h-8 mt-2 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={`spark-tnt-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={chartColor} strokeWidth={1.5} fill={`url(#spark-tnt-${label})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2">
          <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
            Details <ChevronRight className="size-3 ml-0.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Page ─────────────────────────────────────────────── */

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeTenants = tenants.filter((t) => t.status === "active").length
  const totalUsers = tenants.reduce((sum, t) => sum + t.users, 0)

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ─── Row 1: Welcome Banner + Plan Distribution + Tenant Status ─── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Welcome Banner */}
        <Card className="lg:col-span-5 bg-gradient-to-br from-primary/8 via-primary/3 to-background border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-foreground">
              Tenant Management
            </h2>
            <p className="text-[12px] text-muted-foreground mt-1">
              Multi-tenant provisioning, billing, and monitoring
            </p>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
              <QuickLink icon={<Plus className="size-4" />} label="Add Tenant" description="Provision new org" />
              <QuickLink icon={<CreditCard className="size-4" />} label="View Plans" description="Subscription tiers" />
              <QuickLink icon={<Activity className="size-4" />} label="Activity Log" description="Tenant events" />
              <QuickLink icon={<BarChart3 className="size-4" />} label="Billing" description="Revenue & invoices" />
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution Donut */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Plan Distribution
              </CardTitle>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                Manage <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {tenants.length} tenants across {subscriptionPlans.length} plans
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center py-2">
              <div className="relative size-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={54}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {planDistribution.map((_, idx) => (
                        <Cell key={idx} fill={planColors[idx]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-foreground">{tenants.length}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-1">
              {planDistribution.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full" style={{ backgroundColor: planColors[idx] }} />
                  <span className="text-[10px] text-muted-foreground">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Status */}
        <Card className="lg:col-span-3 bg-card border border-border">
          <CardContent className="p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Platform health</p>
              <h3 className="text-sm font-semibold text-primary mt-1">
                Tenant Operations
              </h3>
              <Badge className="mt-2 bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">
                <CheckCircle2 className="size-3 mr-1" /> Operational
              </Badge>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                {activeTenants} active tenants. 1 tenant suspended. Total {totalUsers} users across platform.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent text-xs"
              >
                <Download className="size-3 mr-1.5" />
                Export
              </Button>
              <Button
                size="sm"
                className="flex-1 h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
              >
                <Plus className="size-3 mr-1.5" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Row 2: Sparkline Stats ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Tenants" value={activeTenants} change="+1 this month" trend="up" chartColor="var(--color-primary)" />
        <StatCard label="Total Users" value={totalUsers} change="+24 this week" trend="up" chartColor="var(--color-chart-2)" />
        <StatCard label="Monthly Revenue" value={7430} displayValue="$7,430" change="+15.3%" trend="up" chartColor="var(--color-chart-3)" badge="MRR" />
        <StatCard label="Storage Used" value={182} displayValue="182 GB" change="+8.2%" trend="up" chartColor="var(--color-chart-4)" badge="total" />
      </div>

      {/* ─── Row 3: Tabs ─── */}
      <Tabs defaultValue="directory" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="directory" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Building2 className="size-3.5 mr-1.5" />Directory
            </TabsTrigger>
            <TabsTrigger value="plans" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <CreditCard className="size-3.5 mr-1.5" />Plans
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Activity className="size-3.5 mr-1.5" />Activity
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Directory Tab */}
        <TabsContent value="directory" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Tenant Directory</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">{tenants.length} organizations on the platform</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search tenants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                    <Plus className="size-3.5 mr-1.5" />Add Tenant
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">Organization</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">Plan</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">Users</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">MRR</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 w-10 pr-6"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id} className="border-border hover:bg-muted/50">
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 bg-primary/10 border border-primary/20">
                            <AvatarFallback className="text-[11px] font-semibold text-primary bg-primary/10">
                              {tenant.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-[13px] font-medium text-foreground">{tenant.name}</p>
                            <p className="text-[11px] text-muted-foreground">{tenant.domain}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 hidden md:table-cell">{getPlanBadge(tenant.plan)}</TableCell>
                      <TableCell className="py-3 hidden md:table-cell">{getStatusBadge(tenant.status)}</TableCell>
                      <TableCell className="py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Users className="size-3 text-muted-foreground" />
                          <span className="text-[12px] text-foreground">{tenant.users}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 hidden lg:table-cell">
                        <span className="text-[13px] font-medium font-mono text-foreground">{tenant.mrr}</span>
                      </TableCell>
                      <TableCell className="py-3 pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-popover border-border">
                            <DropdownMenuItem className="text-[12px] text-foreground focus:bg-accent focus:text-accent-foreground"><Eye className="size-3.5 mr-2" />View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-foreground focus:bg-accent focus:text-accent-foreground"><Settings className="size-3.5 mr-2" />Configure</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-foreground focus:bg-accent focus:text-accent-foreground"><CreditCard className="size-3.5 mr-2" />Manage Plan</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-destructive focus:bg-accent focus:text-destructive"><Trash2 className="size-3.5 mr-2" />Suspend</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => {
              const PlanIcon = plan.icon
              return (
                <Card key={plan.name} className="bg-card border-border hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center size-10 rounded-lg ${plan.color} text-white`}>
                        <PlanIcon className="size-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium text-foreground">{plan.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-semibold text-primary">{plan.price}</span>
                          <Badge variant="secondary" className="text-[9px] bg-muted text-muted-foreground border-0">
                            {plan.tenants} tenants
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                        <span className="text-[12px] text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                    <div className="pt-3">
                      <Button variant="outline" className="w-full h-8 border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent text-xs">
                        Configure Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Activity Tab — Visual Timeline */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Activity Feed</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Tenant events, provisioning, and billing activity</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search activity..."
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground">
                    <Download className="size-3.5 mr-1.5" />Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Visual Timeline */}
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex gap-3 relative group">
                      <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${log.color} text-white text-[10px] font-semibold shrink-0`}>
                        {log.action.includes("Created") ? <Plus className="size-3.5" /> :
                         log.action.includes("Upgraded") ? <ArrowUpRight className="size-3.5" /> :
                         log.action.includes("Failed") || log.action.includes("Suspended") ? <AlertCircle className="size-3.5" /> :
                         log.action.includes("Limit") || log.action.includes("Alert") ? <AlertCircle className="size-3.5" /> :
                         <CheckCircle2 className="size-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-[12px] font-medium text-card-foreground">
                            {log.action}
                          </p>
                          {(log.action.includes("Failed") || log.action.includes("Suspended")) && (
                            <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-0 text-[9px] px-1.5">Critical</Badge>
                          )}
                          {log.action.includes("Limit") && (
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-0 text-[9px] px-1.5">Warning</Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {log.details}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground/70">{log.tenant}</span>
                          <span className="text-[10px] text-muted-foreground/50">•</span>
                          <span className="text-[10px] text-muted-foreground/70">{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>Last 7 days</span>
                </div>
                <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                  View full history <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
