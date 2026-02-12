"use client"

import { useState, useEffect, useRef } from "react"
import {
  ChevronRight,
  Clock,
  Download,
  Eye,
  Filter,
  Key,
  Lock,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  ShieldOff,
  TrendingUp,
  TrendingDown,
  User,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  Trash2,
  Settings,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Fingerprint,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

const users = [
  { id: 1, name: "Ahmad Rizky", email: "ahmad.rizky@company.com", role: "Super Admin", status: "active", mfa: true, lastActive: "2 hours ago" },
  { id: 2, name: "Sari Dewi", email: "sari.dewi@company.com", role: "Org Admin", status: "active", mfa: true, lastActive: "5 hours ago" },
  { id: 3, name: "Budi Santoso", email: "budi.santoso@company.com", role: "Module Admin", status: "active", mfa: false, lastActive: "1 day ago" },
  { id: 4, name: "Maya Putri", email: "maya.putri@company.com", role: "Standard User", status: "active", mfa: true, lastActive: "Just now" },
  { id: 5, name: "Rita Wulandari", email: "rita.wulandari@company.com", role: "Standard User", status: "inactive", mfa: false, lastActive: "30 days ago" },
  { id: 6, name: "Dimas Pratama", email: "dimas.pratama@company.com", role: "Read Only", status: "active", mfa: true, lastActive: "3 hours ago" },
]

const roles = [
  { name: "Super Admin", users: 1, permissions: 48, description: "Full system access with all administrative capabilities", color: "bg-red-500" },
  { name: "Org Admin", users: 2, permissions: 36, description: "Organization-level management and user provisioning", color: "bg-amber-500" },
  { name: "Module Admin", users: 4, permissions: 24, description: "Module-specific administration and configuration", color: "bg-sky-500" },
  { name: "Standard User", users: 18, permissions: 12, description: "Basic access with standard operational capabilities", color: "bg-primary" },
  { name: "Read Only", users: 8, permissions: 6, description: "View-only access across permitted modules", color: "bg-emerald-500" },
]

const auditLogs = [
  { id: 1, action: "User Login", user: "Ahmad Rizky", details: "Successful login via SSO", timestamp: "10 minutes ago", severity: "info", color: "bg-primary" },
  { id: 2, action: "Permission Changed", user: "Sari Dewi", details: "Updated role for Budi Santoso to Module Admin", timestamp: "2 hours ago", severity: "warning", color: "bg-amber-500" },
  { id: 3, action: "MFA Disabled", user: "System", details: "MFA disabled for user Rita Wulandari", timestamp: "5 hours ago", severity: "critical", color: "bg-red-500" },
  { id: 4, action: "New User Created", user: "Ahmad Rizky", details: "Created account for dimas.pratama@company.com", timestamp: "1 day ago", severity: "info", color: "bg-emerald-500" },
  { id: 5, action: "Password Reset", user: "Maya Putri", details: "Self-service password reset completed", timestamp: "2 days ago", severity: "info", color: "bg-sky-500" },
  { id: 6, action: "Role Created", user: "Sari Dewi", details: "Created new role: Compliance Officer", timestamp: "3 days ago", severity: "info", color: "bg-primary" },
  { id: 7, action: "Failed Login", user: "Unknown", details: "3 failed attempts for budi.santoso@company.com", timestamp: "3 days ago", severity: "critical", color: "bg-red-500" },
]

const mfaPieData = [
  { name: "MFA Enabled", value: 4 },
  { name: "MFA Disabled", value: 2 },
]
const mfaPieColors = ["var(--color-primary)", "var(--color-muted)"]

/* ─── Helpers ──────────────────────────────────────────── */

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase()
}

function getStatusBadge(status: string) {
  return status === "active" ? (
    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">
      <CheckCircle2 className="size-3 mr-1" />Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-0 text-[10px]">
      <XCircle className="size-3 mr-1" />Inactive
    </Badge>
  )
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

function StatCard({ label, value, change, trend, chartColor, badge }: {
  label: string; value: number; change: string; trend: "up" | "down"; chartColor: string; badge?: string
}) {
  const count = useCountUp(value)
  const sparkData = [35, 50, 40, 60, 45, 70, 55, 80, 60, 90, 65, 85].map((v, i) => ({ i, v }))

  return (
    <Card className="bg-card border border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-card-foreground">{label}</p>
          <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary border-0 h-4 px-1.5">
            {badge || "iam"}
          </Badge>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{count}</p>
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
                <linearGradient id={`spark-iam-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={chartColor} strokeWidth={1.5} fill={`url(#spark-iam-${label})`} dot={false} />
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

export default function IAMPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ─── Row 1: Welcome Banner + MFA Overview + Security Status ─── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Welcome Banner */}
        <Card className="lg:col-span-5 bg-gradient-to-br from-primary/8 via-primary/3 to-background border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-foreground">
              Identity & Access
            </h2>
            <p className="text-[12px] text-muted-foreground mt-1">
              Manage users, roles, permissions, and security policies
            </p>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
              <QuickLink icon={<UserPlus className="size-4" />} label="Add User" description="Create new account" />
              <QuickLink icon={<ShieldCheck className="size-4" />} label="Manage Roles" description="Edit role access" />
              <QuickLink icon={<History className="size-4" />} label="View Audit" description="Security audit log" />
              <QuickLink icon={<Settings className="size-4" />} label="Security" description="Policy settings" />
            </div>
          </CardContent>
        </Card>

        {/* MFA Adoption Donut */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">
                MFA Adoption
              </CardTitle>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                Enforce <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {mfaPieData[0].value} of {mfaPieData[0].value + mfaPieData[1].value} users with MFA enabled
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center py-2">
              <div className="relative size-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mfaPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={54}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {mfaPieData.map((_, idx) => (
                        <Cell key={idx} fill={mfaPieColors[idx]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-foreground">
                    {Math.round((mfaPieData[0].value / (mfaPieData[0].value + mfaPieData[1].value)) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-1">
              {mfaPieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full" style={{ backgroundColor: mfaPieColors[idx] }} />
                  <span className="text-[10px] text-muted-foreground">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card className="lg:col-span-3 bg-card border border-border">
          <CardContent className="p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Security posture</p>
              <h3 className="text-sm font-semibold text-primary mt-1">
                Access Security
              </h3>
              <Badge className="mt-2 bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">
                <ShieldCheck className="size-3 mr-1" /> Healthy
              </Badge>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                1 user without MFA. No suspicious login activity in the last 24 hours.
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
                <UserPlus className="size-3 mr-1.5" />
                Add User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Row 2: Sparkline Stats ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={users.length} change="+2 this month" trend="up" chartColor="var(--color-primary)" />
        <StatCard label="Active Roles" value={roles.length} change="Stable" trend="up" chartColor="var(--color-chart-2)" />
        <StatCard label="Permissions" value={48} change="+4 new" trend="up" chartColor="var(--color-chart-3)" />
        <StatCard label="Audit Events" value={auditLogs.length} change="+3 today" trend="up" chartColor="var(--color-chart-4)" badge="24h" />
      </div>

      {/* ─── Row 3: Tabs ─── */}
      <Tabs defaultValue="users" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="users" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Users className="size-3.5 mr-1.5" />Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Shield className="size-3.5 mr-1.5" />Roles
            </TabsTrigger>
            <TabsTrigger value="audit" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <History className="size-3.5 mr-1.5" />Audit Log
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">User Directory</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">{users.length} users across {roles.length} roles</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                    <UserPlus className="size-3.5 mr-1.5" />Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">User</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">Role</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">MFA</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">Last Active</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 w-10 pr-6"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-muted/50">
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 bg-primary/10 border border-primary/20">
                            <AvatarFallback className="text-[11px] font-semibold text-primary bg-primary/10">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-[13px] font-medium text-foreground">{user.name}</p>
                            <p className="text-[11px] text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 hidden lg:table-cell">
                        <Badge variant="outline" className="text-[10px] border-border text-muted-foreground font-normal">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 hidden md:table-cell">{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="py-3 hidden md:table-cell">
                        {user.mfa ? (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">
                            <Fingerprint className="size-3 mr-1" />Enabled
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-0 text-[10px]">
                            <ShieldOff className="size-3 mr-1" />Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden lg:table-cell">{user.lastActive}</TableCell>
                      <TableCell className="py-3 pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-popover border-border">
                            <DropdownMenuItem className="text-[12px] text-foreground focus:bg-accent focus:text-accent-foreground"><Eye className="size-3.5 mr-2" />View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-foreground focus:bg-accent focus:text-accent-foreground"><UserCog className="size-3.5 mr-2" />Edit Role</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-foreground focus:bg-accent focus:text-accent-foreground"><Key className="size-3.5 mr-2" />Reset Password</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-destructive focus:bg-accent focus:text-destructive"><Trash2 className="size-3.5 mr-2" />Deactivate</DropdownMenuItem>
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

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Roles & Permissions</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">{roles.length} roles configured with granular permissions</CardDescription>
                </div>
                <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="size-3.5 mr-1.5" />New Role
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-transparent hover:border-border/50 transition-all group"
                >
                  <div className={`flex items-center justify-center size-10 rounded-lg ${role.color} text-white shrink-0`}>
                    <Shield className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium text-foreground">{role.name}</p>
                      <Badge variant="secondary" className="text-[9px] bg-muted border border-border/50 text-muted-foreground px-1.5 hidden sm:flex">
                        {role.permissions} perms
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{role.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Users className="size-3 text-muted-foreground" />
                      <span className="text-[12px] font-medium text-foreground">{role.users}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">users</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <Settings className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab — Visual Timeline */}
        <TabsContent value="audit" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Audit Trail</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Security and access event history</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
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
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex gap-3 relative group">
                      <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${log.color} text-white text-[10px] font-semibold shrink-0`}>
                        {log.severity === "critical" ? <AlertTriangle className="size-3.5" /> :
                         log.severity === "warning" ? <AlertTriangle className="size-3.5" /> :
                         <CheckCircle2 className="size-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-[12px] font-medium text-card-foreground">
                            {log.action}
                          </p>
                          {log.severity === "critical" && (
                            <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-0 text-[9px] px-1.5">Critical</Badge>
                          )}
                          {log.severity === "warning" && (
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-0 text-[9px] px-1.5">Warning</Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {log.details}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground/70">by {log.user}</span>
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
                  View full audit log <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
