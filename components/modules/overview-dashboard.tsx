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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
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
  },
  {
    id: 2,
    title: "New Vendor Registration",
    requester: "Mike Chen",
    amount: null,
    priority: "medium",
  },
  {
    id: 3,
    title: "Leave Request",
    requester: "Emma Wilson",
    amount: null,
    priority: "low",
  },
]

export function OverviewDashboard() {
  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors duration-150"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center size-10 rounded-lg bg-zinc-800/50">
                  <stat.icon className="size-5 text-zinc-400" />
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
                <p className="text-2xl font-semibold text-zinc-100 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[12px] text-zinc-500 mt-0.5">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Chart */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-100">
                Platform Activity
              </CardTitle>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-zinc-100" />
                  <span className="text-zinc-500">Users</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-zinc-600" />
                  <span className="text-zinc-500">Transactions</span>
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
                      <stop offset="0%" stopColor="rgb(244 244 245)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="rgb(244 244 245)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(82 82 91)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="rgb(82 82 91)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgb(113 113 122)", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgb(113 113 122)", fontSize: 11 }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(24 24 27)",
                      border: "1px solid rgb(39 39 42)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "rgb(161 161 170)" }}
                    itemStyle={{ color: "rgb(244 244 245)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="rgb(244 244 245)"
                    strokeWidth={1.5}
                    fill="url(#userGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="transactions"
                    stroke="rgb(82 82 91)"
                    strokeWidth={1.5}
                    fill="url(#txGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-100">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 py-2.5 border-b border-zinc-800/50 last:border-0"
                >
                  <div className="flex items-center justify-center size-8 rounded-md bg-zinc-800/50">
                    {activity.type === "tenant" && <Building2 className="size-4 text-zinc-400" />}
                    {activity.type === "workflow" && <Activity className="size-4 text-zinc-400" />}
                    {activity.type === "finance" && <DollarSign className="size-4 text-zinc-400" />}
                    {activity.type === "iam" && <Users className="size-4 text-zinc-400" />}
                    {activity.type === "config" && <FileText className="size-4 text-zinc-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-zinc-100 truncate">
                      {activity.action}
                    </p>
                    <p className="text-[11px] text-zinc-500">{activity.tenant}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                    <Clock className="size-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-zinc-100">
              Pending Approvals
            </CardTitle>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 border-0 text-[10px]">
              {pendingApprovals.length} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center gap-3 py-3 border-b border-zinc-800/50 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-zinc-100">{approval.title}</p>
                  <p className="text-[11px] text-zinc-500">
                    Requested by {approval.requester}
                  </p>
                </div>
                {approval.amount && (
                  <span className="text-[13px] font-medium text-zinc-100">
                    {approval.amount}
                  </span>
                )}
                <Badge
                  variant="outline"
                  className={`text-[10px] capitalize border-0 ${
                    approval.priority === "high"
                      ? "bg-red-500/10 text-red-400"
                      : approval.priority === "medium"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-zinc-500/10 text-zinc-400"
                  }`}
                >
                  {approval.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
