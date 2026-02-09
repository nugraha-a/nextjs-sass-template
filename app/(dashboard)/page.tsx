"use client"

import {
  Users,
  Building2,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  FileText,
  Clock,
  Check,
  X,
  Server,
  Database,
  HardDrive,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"

const stats = [
  {
    title: "Total Tenants",
    value: "2,847",
    change: "+12.5%",
    trend: "up" as const,
    icon: Building2,
  },
  {
    title: "Active Users",
    value: "45,231",
    change: "+8.2%",
    trend: "up" as const,
    icon: Users,
  },
  {
    title: "Revenue (MTD)",
    value: "$892,450",
    change: "+23.1%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Pending Workflows",
    value: "342",
    change: "-5.4%",
    trend: "down" as const,
    icon: Activity,
  },
]

const activityData = [
  { date: "Jan", users: 2400, transactions: 1800 },
  { date: "Feb", users: 2800, transactions: 2200 },
  { date: "Mar", users: 3200, transactions: 2600 },
  { date: "Apr", users: 3600, transactions: 3100 },
  { date: "May", users: 4100, transactions: 3500 },
  { date: "Jun", users: 4500, transactions: 4000 },
  { date: "Jul", users: 5200, transactions: 4600 },
]

const recentActivity = [
  {
    id: 1,
    action: "New tenant onboarded",
    tenant: "Acme Corporation",
    time: "2 minutes ago",
    type: "tenant",
  },
  {
    id: 2,
    action: "Workflow approved",
    tenant: "TechStart Inc",
    time: "15 minutes ago",
    type: "workflow",
  },
  {
    id: 3,
    action: "Invoice generated",
    tenant: "Global Dynamics",
    time: "1 hour ago",
    type: "finance",
  },
  {
    id: 4,
    action: "User role updated",
    tenant: "Innovate Labs",
    time: "2 hours ago",
    type: "iam",
  },
  {
    id: 5,
    action: "Configuration changed",
    tenant: "Future Systems",
    time: "3 hours ago",
    type: "config",
  },
]

const pendingApprovals = [
  {
    id: 1,
    title: "Budget Approval Request",
    requester: "Sarah Johnson",
    amount: "$45,000",
    priority: "high",
    time: "2h ago",
  },
  {
    id: 2,
    title: "New Vendor Registration",
    requester: "Mike Chen",
    amount: null,
    priority: "medium",
    time: "4h ago",
  },
  {
    id: 3,
    title: "Leave Request",
    requester: "Emma Wilson",
    amount: null,
    priority: "low",
    time: "1d ago",
  },
]

const systemMetrics = {
  apiLatency: 45,
  databaseStatus: "Operational",
  storageUsed: 65,
  uptime: "99.99%",
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Real-time metrics and system activity monitoring
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-card border-border hover:border-primary/50 transition-colors duration-150"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center size-10 rounded-lg bg-secondary">
                  <stat.icon className="size-5 text-muted-foreground" />
                </div>
                <div
                  className={`flex items-center gap-1 text-[12px] font-medium ${
                    stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-semibold text-card-foreground tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Chart */}
        <Card className="bg-card border-border">
        <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Platform Activity
                </CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">
                  Overview of system usage and transaction volume
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Users</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-chart-2" />
                  <span className="text-muted-foreground">Transactions</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-primary)"
                    strokeWidth={1.5}
                    fill="url(#userGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="transactions"
                    stroke="var(--color-chart-2)"
                    strokeWidth={1.5}
                    fill="url(#txGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
        <CardHeader className="pb-4">
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">
                Recent Activity
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                Latest actions performed across all tenants
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
                >
                  <div className="flex items-center justify-center size-8 rounded-md bg-secondary">
                    {activity.type === "tenant" && <Building2 className="size-4 text-muted-foreground" />}
                    {activity.type === "workflow" && <Activity className="size-4 text-muted-foreground" />}
                    {activity.type === "finance" && <DollarSign className="size-4 text-muted-foreground" />}
                    {activity.type === "iam" && <Users className="size-4 text-muted-foreground" />}
                    {activity.type === "config" && <FileText className="size-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-card-foreground truncate">
                      {activity.action}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{activity.tenant}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Approvals */}
        <Card className="bg-card border-border h-full">
          <CardHeader className="pb-4">
            <div className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Pending Approvals
                </CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">
                  Requests requiring administrative action
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-secondary text-muted-foreground border-border text-[10px] whitespace-nowrap">
                {pendingApprovals.length} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border transition-all gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border/50">
                      <AvatarFallback className="bg-background text-muted-foreground text-xs font-medium">
                        {approval.requester
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold tracking-tight text-card-foreground">
                          {approval.title}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`text-[9px] px-1.5 py-0 h-4 font-normal capitalize border-0 ${
                            approval.priority === "high"
                              ? "bg-red-500/10 text-red-500"
                              : approval.priority === "medium"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {approval.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {approval.requester} • <span className="text-[10px]">{approval.time}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-12 sm:pl-0">
                    {approval.amount && (
                      <span className="text-sm font-mono font-medium text-foreground tabular-nums">
                        {approval.amount}
                      </span>
                    )}
                    <div className="flex items-center bg-background rounded-full border border-border/50 p-0.5 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 rounded-full">
                        <Check className="h-3.5 w-3.5" />
                        <span className="sr-only">Approve</span>
                      </Button>
                       <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-full">
                        <X className="h-3.5 w-3.5" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-card border-border h-full">
          <CardHeader className="pb-4">
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">System Status</CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                Real-time infrastructure monitoring
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Server className="size-3.5" />
                  <span>API Latency</span>
                </div>
                <span className="text-emerald-500 font-medium">{systemMetrics.apiLatency}ms</span>
              </div>
              <Progress value={35} className="h-1.5 bg-secondary" indicatorClassName="bg-emerald-500" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Database className="size-3.5" />
                  <span>Database Status</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
                  <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {systemMetrics.databaseStatus}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-1.5 rounded-full bg-emerald-500/20 first:bg-emerald-500" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
               <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HardDrive className="size-3.5" />
                  <span>Storage Usage</span>
                </div>
                <span className="text-amber-500 font-medium">{systemMetrics.storageUsed}%</span>
              </div>
              <Progress value={systemMetrics.storageUsed} className="h-1.5 bg-secondary" indicatorClassName="bg-amber-500" />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border">
              <p className="text-[11px] text-muted-foreground">System Uptime</p>
              <p className="text-sm font-mono font-medium text-foreground">{systemMetrics.uptime}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
