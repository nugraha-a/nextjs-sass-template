"use client"

import { useState } from "react"
import {
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  Users,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Shield,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  UserPlus,
  RefreshCw,
  AlertTriangle,
  Layers,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* ─── Data ─────────────────────────────────────────────── */

const tenants = [
  { id: "TEN-001", name: "Acme Corporation", plan: "Enterprise", status: "active", users: 245, mrr: 4500, createdAt: "2024-01-15", industry: "Technology" },
  { id: "TEN-002", name: "Global Dynamics", plan: "Professional", status: "active", users: 89, mrr: 1200, createdAt: "2024-02-20", industry: "Manufacturing" },
  { id: "TEN-003", name: "Innovate Labs", plan: "Starter", status: "active", users: 12, mrr: 299, createdAt: "2024-03-10", industry: "Research" },
  { id: "TEN-004", name: "TechStart Inc", plan: "Professional", status: "trial", users: 34, mrr: 0, createdAt: "2024-04-05", industry: "Software" },
  { id: "TEN-005", name: "Future Systems", plan: "Enterprise", status: "active", users: 512, mrr: 8900, createdAt: "2023-11-22", industry: "Finance" },
  { id: "TEN-006", name: "Green Energy Co", plan: "Professional", status: "suspended", users: 67, mrr: 0, createdAt: "2024-01-08", industry: "Energy" },
  { id: "TEN-007", name: "HealthCare Plus", plan: "Enterprise", status: "active", users: 189, mrr: 3500, createdAt: "2023-09-14", industry: "Healthcare" },
  { id: "TEN-008", name: "EduTech Global", plan: "Starter", status: "active", users: 28, mrr: 299, createdAt: "2024-05-01", industry: "Education" },
]

const stats = [
  { label: "Total Tenants", value: "2,847", change: "+12.5%", positive: true, icon: Building2 },
  { label: "Active Subscriptions", value: "2,634", change: "+8.2%", positive: true, icon: CheckCircle2 },
  { label: "Total MRR", value: "$892,450", change: "+23.1%", positive: true, icon: CreditCard },
  { label: "Avg Users/Tenant", value: "45", change: "+5.7%", positive: true, icon: Users },
]

const planDistribution = [
  { plan: "Enterprise", count: 847, percentage: 30, avgMrr: 6200, color: "text-primary", bgColor: "bg-primary/10" },
  { plan: "Professional", count: 1256, percentage: 44, avgMrr: 1200, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { plan: "Starter", count: 744, percentage: 26, avgMrr: 299, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
]

const activityLog = [
  { id: 1, tenant: "Acme Corporation", event: "Plan Upgraded", details: "Professional → Enterprise", timestamp: "2024-02-04 14:32", type: "upgrade" },
  { id: 2, tenant: "TechStart Inc", event: "Trial Started", details: "14-day Professional trial", timestamp: "2024-02-04 13:18", type: "trial" },
  { id: 3, tenant: "Green Energy Co", event: "Suspended", details: "Payment overdue (32 days)", timestamp: "2024-02-04 11:55", type: "warning" },
  { id: 4, tenant: "EduTech Global", event: "New Sign-up", details: "Starter Plan via website", timestamp: "2024-02-04 10:22", type: "new" },
  { id: 5, tenant: "Future Systems", event: "Users Added", details: "+48 users (512 total)", timestamp: "2024-02-04 09:45", type: "update" },
  { id: 6, tenant: "HealthCare Plus", event: "Renewal Processed", details: "Enterprise annual — $42,000", timestamp: "2024-02-03 16:30", type: "renewal" },
  { id: 7, tenant: "Global Dynamics", event: "Config Updated", details: "SSO integration enabled", timestamp: "2024-02-03 14:10", type: "update" },
]

/* ─── Helpers ──────────────────────────────────────────── */

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-0 text-[10px]"><CheckCircle2 className="size-3 mr-1" />Active</Badge>
    case "trial":
      return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-0 text-[10px]"><Clock className="size-3 mr-1" />Trial</Badge>
    case "suspended":
      return <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-0 text-[10px]"><XCircle className="size-3 mr-1" />Suspended</Badge>
    default:
      return null
  }
}

function getPlanBadge(plan: string) {
  const styles: Record<string, string> = {
    Enterprise: "bg-primary/10 text-primary",
    Professional: "bg-blue-500/10 text-blue-500",
    Starter: "bg-emerald-500/10 text-emerald-500",
  }
  return (
    <Badge variant="secondary" className={`${styles[plan] || "bg-muted text-muted-foreground"} border-0 text-[10px]`}>
      {plan}
    </Badge>
  )
}

function getEventIcon(type: string) {
  switch (type) {
    case "upgrade": return <ArrowUpRight className="size-3.5 text-emerald-500" />
    case "trial": return <Clock className="size-3.5 text-amber-500" />
    case "warning": return <AlertTriangle className="size-3.5 text-red-500" />
    case "new": return <UserPlus className="size-3.5 text-blue-500" />
    case "update": return <RefreshCw className="size-3.5 text-muted-foreground" />
    case "renewal": return <CheckCircle2 className="size-3.5 text-emerald-500" />
    default: return <Activity className="size-3.5 text-muted-foreground" />
  }
}

function getEventBadge(type: string, label: string) {
  const styles: Record<string, string> = {
    upgrade: "bg-emerald-500/10 text-emerald-500",
    trial: "bg-amber-500/10 text-amber-500",
    warning: "bg-red-500/10 text-red-500",
    new: "bg-blue-500/10 text-blue-500",
    update: "bg-secondary text-secondary-foreground",
    renewal: "bg-emerald-500/10 text-emerald-500",
  }
  return (
    <Badge variant="secondary" className={`${styles[type] || "bg-secondary text-secondary-foreground"} border-0 text-[10px]`}>
      {label}
    </Badge>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value)
}

/* ─── Page ─────────────────────────────────────────────── */

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Tenant Management
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Manage organizations, subscriptions, and monitor tenant activity
          </p>
        </div>
        <Button
          size="sm"
          className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="size-3.5 mr-1.5" />
          Add Tenant
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border hover:border-primary/50 transition-colors duration-150">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center size-9 rounded-lg bg-secondary">
                  <stat.icon className="size-4 text-muted-foreground" />
                </div>
                <span className={`text-[11px] font-medium flex items-center gap-0.5 ${stat.positive ? "text-emerald-500" : "text-red-500"}`}>
                  {stat.positive ? <TrendingUp className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-semibold text-card-foreground tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="directory" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="directory" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Building2 className="size-3.5 mr-1.5" />Directory
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Layers className="size-3.5 mr-1.5" />Subscriptions
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Activity className="size-3.5 mr-1.5" />Activity
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ═══ Directory Tab ═══ */}
        <TabsContent value="directory" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">All Tenants</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">
                    Directory of all registered organizations
                  </CardDescription>
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-full sm:w-32 bg-background border-input text-[13px] text-muted-foreground cursor-pointer">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">All Status</SelectItem>
                      <SelectItem value="active" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">Active</SelectItem>
                      <SelectItem value="trial" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">Trial</SelectItem>
                      <SelectItem value="suspended" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">Tenant</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Plan</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Status</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 text-right">Users</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 text-right">MRR</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">Industry</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">Joined</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id} className="border-border hover:bg-muted/50">
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 text-primary border border-primary/20">
                            <Building2 className="size-4" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-card-foreground">{tenant.name}</p>
                            <p className="text-[11px] text-muted-foreground font-mono">{tenant.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">{getPlanBadge(tenant.plan)}</TableCell>
                      <TableCell className="py-3">{getStatusBadge(tenant.status)}</TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Users className="size-3 text-muted-foreground" />
                          <span className="text-[13px] text-foreground">{tenant.users.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <span className="text-[13px] font-medium text-card-foreground font-mono">
                          {tenant.mrr > 0 ? formatCurrency(tenant.mrr) : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 hidden lg:table-cell">
                        <span className="text-[13px] text-muted-foreground">{tenant.industry}</span>
                      </TableCell>
                      <TableCell className="py-3 hidden md:table-cell">
                        <span className="text-[13px] text-muted-foreground">{tenant.createdAt}</span>
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border w-44">
                            <DropdownMenuItem className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">
                              <Eye className="size-3.5 mr-2" />View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">
                              <Edit2 className="size-3.5 mr-2" />Edit Tenant
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">
                              <Shield className="size-3.5 mr-2" />Manage Access
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem className="text-[13px] text-destructive focus:bg-destructive/10 focus:text-destructive">
                              <Trash2 className="size-3.5 mr-2" />Suspend Tenant
                            </DropdownMenuItem>
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

        {/* ═══ Subscriptions Tab ═══ */}
        <TabsContent value="subscriptions" className="space-y-4">
          {/* Plan Distribution */}
          <div className="grid gap-4 md:grid-cols-3">
            {planDistribution.map((plan) => (
              <Card key={plan.plan} className="bg-card border-border hover:border-primary/50 transition-colors duration-150">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center justify-center size-9 rounded-lg ${plan.bgColor}`}>
                      <Layers className={`size-4 ${plan.color}`} />
                    </div>
                    <Badge variant="secondary" className={`${plan.bgColor} ${plan.color} border-0 text-[10px]`}>
                      {plan.percentage}%
                    </Badge>
                  </div>
                  <p className="text-2xl font-semibold text-card-foreground tracking-tight">
                    {plan.count.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{plan.plan} Plans</p>
                  <div className="mt-3 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">Avg MRR</span>
                      <span className="text-[13px] font-medium text-card-foreground font-mono">
                        {formatCurrency(plan.avgMrr)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upcoming Renewals */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Upcoming Renewals</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">
                    Subscriptions due for renewal in the next 30 days
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-0 text-[11px]">
                  12 upcoming
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">Tenant</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Plan</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Renewal Date</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 text-right pr-6">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Acme Corporation", plan: "Enterprise", date: "2024-02-15", amount: 54000 },
                    { name: "Global Dynamics", plan: "Professional", date: "2024-02-20", amount: 14400 },
                    { name: "Innovate Labs", plan: "Starter", date: "2024-02-28", amount: 3588 },
                    { name: "Future Systems", plan: "Enterprise", date: "2024-03-01", amount: 106800 },
                  ].map((renewal) => (
                    <TableRow key={renewal.name} className="border-border hover:bg-muted/50">
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 text-primary border border-primary/20">
                            <Building2 className="size-4" />
                          </div>
                          <span className="text-[13px] font-medium text-card-foreground">{renewal.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">{getPlanBadge(renewal.plan)}</TableCell>
                      <TableCell className="py-3 text-[13px] text-muted-foreground">{renewal.date}</TableCell>
                      <TableCell className="py-3 text-right pr-6">
                        <span className="text-[13px] font-medium text-card-foreground font-mono">
                          {formatCurrency(renewal.amount)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ Activity Tab ═══ */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Tenant Activity Log</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">
                    Recent sign-ups, plan changes, and tenant events
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search activity..."
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground w-full sm:w-auto">
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">Timestamp</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Tenant</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Event</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLog.map((log) => (
                    <TableRow key={log.id} className="border-border hover:bg-muted/50">
                      <TableCell className="py-3 pl-6 text-[12px] text-muted-foreground font-mono whitespace-nowrap">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          {getEventIcon(log.type)}
                          <span className="text-[13px] font-medium text-foreground">{log.tenant}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        {getEventBadge(log.type, log.event)}
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-[13px] text-muted-foreground">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
