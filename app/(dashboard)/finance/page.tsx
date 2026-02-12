"use client"

import { useState, useEffect, useRef } from "react"
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  PieChart,
  Plus,
  Receipt,
  Search,
  TrendingDown,
  TrendingUp,
  Upload,
  Wallet,
  ChevronRight,
  Zap,
  CreditCard,
  CalendarDays,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart as RePieChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
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

const financialStats = [
  { label: "Total Revenue", value: 2845920, displayValue: "$2,845,920", change: "+12.5%", trend: "up" as const, icon: DollarSign, chartColor: "var(--color-primary)" },
  { label: "Accounts Receivable", value: 456780, displayValue: "$456,780", change: "+8.2%", trend: "up" as const, icon: ArrowUpRight, chartColor: "var(--color-chart-2)" },
  { label: "Accounts Payable", value: 234560, displayValue: "$234,560", change: "-5.4%", trend: "down" as const, icon: ArrowDownRight, chartColor: "var(--color-chart-3)" },
  { label: "Cash Balance", value: 1234560, displayValue: "$1,234,560", change: "+3.1%", trend: "up" as const, icon: Wallet, chartColor: "var(--color-chart-4)" },
]

const revenueData = [
  { month: "Jan", revenue: 245000, expenses: 180000 },
  { month: "Feb", revenue: 268000, expenses: 195000 },
  { month: "Mar", revenue: 312000, expenses: 210000 },
  { month: "Apr", revenue: 289000, expenses: 188000 },
  { month: "May", revenue: 334000, expenses: 225000 },
  { month: "Jun", revenue: 378000, expenses: 240000 },
]

const expenseCategories = [
  { name: "Payroll", value: 45, color: "var(--chart-1)" },
  { name: "Operations", value: 25, color: "var(--chart-2)" },
  { name: "Marketing", value: 15, color: "var(--chart-3)" },
  { name: "Technology", value: 10, color: "var(--chart-4)" },
  { name: "Other", value: 5, color: "var(--chart-5)" },
]

const budgetItems = [
  { department: "Engineering", allocated: 450000, spent: 385000, remaining: 65000 },
  { department: "Marketing", allocated: 280000, spent: 195000, remaining: 85000 },
  { department: "Sales", allocated: 320000, spent: 298000, remaining: 22000 },
  { department: "Operations", allocated: 180000, spent: 145000, remaining: 35000 },
  { department: "HR", allocated: 120000, spent: 89000, remaining: 31000 },
]

const recentTransactions = [
  { id: "TXN-001234", type: "Invoice", description: "Acme Corp - Q4 Services", amount: "$45,000", status: "paid", date: "2024-02-04", color: "bg-primary" },
  { id: "TXN-001233", type: "Expense", description: "AWS Cloud Services", amount: "$12,500", status: "pending", date: "2024-02-03", color: "bg-amber-500" },
  { id: "TXN-001232", type: "Invoice", description: "TechStart - Consulting", amount: "$28,000", status: "pending", date: "2024-02-02", color: "bg-emerald-500" },
  { id: "TXN-001231", type: "Payment", description: "Vendor Payment - Supplies", amount: "$8,900", status: "paid", date: "2024-02-01", color: "bg-sky-500" },
  { id: "TXN-001230", type: "Invoice", description: "Global Dynamics - Support", amount: "$15,600", status: "overdue", date: "2024-01-28", color: "bg-rose-500" },
  { id: "TXN-001229", type: "Expense", description: "Office Rent - February", amount: "$22,000", status: "paid", date: "2024-02-01", color: "bg-primary" },
]

const chartOfAccounts = [
  { code: "1000", name: "Cash and Cash Equivalents", type: "Asset", balance: 1234560 },
  { code: "1100", name: "Accounts Receivable", type: "Asset", balance: 456780 },
  { code: "1200", name: "Inventory", type: "Asset", balance: 89500 },
  { code: "2000", name: "Accounts Payable", type: "Liability", balance: -234560 },
  { code: "2100", name: "Accrued Expenses", type: "Liability", balance: -45000 },
  { code: "3000", name: "Retained Earnings", type: "Equity", balance: -1500000 },
  { code: "4000", name: "Revenue", type: "Revenue", balance: -2845920 },
  { code: "5000", name: "Cost of Goods Sold", type: "Expense", balance: 1200000 },
]

/* ─── Helpers ──────────────────────────────────────────── */

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]"><CheckCircle2 className="size-3 mr-1" />Paid</Badge>
    case "pending":
      return <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-0 text-[10px]"><Clock className="size-3 mr-1" />Pending</Badge>
    case "overdue":
      return <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-0 text-[10px]"><AlertCircle className="size-3 mr-1" />Overdue</Badge>
    default:
      return null
  }
}

function getAccountTypeBadge(type: string) {
  const colors: Record<string, string> = {
    Asset: "bg-emerald-500/10 text-emerald-400",
    Liability: "bg-red-500/10 text-red-400",
    Equity: "bg-blue-500/10 text-blue-400",
    Revenue: "bg-amber-500/10 text-amber-400",
    Expense: "bg-muted/50 text-muted-foreground",
  }
  return <Badge variant="secondary" className={`${colors[type]} border-0 text-[10px]`}>{type}</Badge>
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

function StatCard({ label, displayValue, change, trend, chartColor }: {
  label: string; displayValue: string; change: string; trend: "up" | "down"; chartColor: string
}) {
  const sparkData = [35, 50, 40, 60, 45, 70, 55, 80, 60, 90, 65, 85].map((v, i) => ({ i, v }))

  return (
    <Card className="bg-card border border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-card-foreground">{label}</p>
          <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary border-0 h-4 px-1.5">
            monthly
          </Badge>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{displayValue}</p>
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
                <linearGradient id={`spark-fin-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={chartColor} strokeWidth={1.5} fill={`url(#spark-fin-${label})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2">
          <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
            See all <ChevronRight className="size-3 ml-0.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Page ─────────────────────────────────────────────── */

export default function FinancePage() {
  const [period, setPeriod] = useState("this-month")

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ─── Row 1: Welcome Banner + Revenue Summary + Quick Action ─── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Welcome Banner */}
        <Card className="lg:col-span-5 bg-gradient-to-br from-primary/8 via-primary/3 to-background border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-foreground">
              Finance & Accounting
            </h2>
            <p className="text-[12px] text-muted-foreground mt-1">
              General ledger, budgeting, and financial reporting
            </p>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
              <QuickLink icon={<Plus className="size-4" />} label="New Invoice" description="Create & send invoices" />
              <QuickLink icon={<Download className="size-4" />} label="Export Report" description="Download financials" />
              <QuickLink icon={<PieChart className="size-4" />} label="Budget Review" description="Track allocations" />
              <QuickLink icon={<CalendarDays className="size-4" />} label="Payment Schedule" description="Upcoming payments" />
            </div>
          </CardContent>
        </Card>

        {/* Revenue vs Expenses Mini */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Revenue vs Expenses
              </CardTitle>
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Revenue</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-2 rounded-full bg-muted-foreground/30" />
                  <span className="text-muted-foreground">Expenses</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} barGap={4}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                  />
                  <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--muted-foreground) / 0.2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Financial Status Card */}
        <Card className="lg:col-span-3 bg-card border border-border">
          <CardContent className="p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fiscal period</p>
              <h3 className="text-sm font-semibold text-primary mt-1">
                Q1 Financial Review
              </h3>
              <Badge className="mt-2 bg-primary/10 text-primary border-0 text-[10px]">
                <CalendarDays className="size-3 mr-1" /> Feb 2026
              </Badge>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                Net profit margin up 4.2%. Accounts receivable collection improved by 8 days.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="h-8 flex-1 bg-background border-input text-[13px] text-muted-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="this-month" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">This Month</SelectItem>
                  <SelectItem value="last-month" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">Last Month</SelectItem>
                  <SelectItem value="this-quarter" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">This Quarter</SelectItem>
                  <SelectItem value="this-year" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="size-3.5 mr-1.5" />
                Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Row 2: Financial Stats with Sparklines ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {financialStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            displayValue={stat.displayValue}
            change={stat.change}
            trend={stat.trend}
            chartColor={stat.chartColor}
          />
        ))}
      </div>

      {/* ─── Row 3: Tabs ─── */}
      <Tabs defaultValue="overview" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="overview" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <BarChart3 className="size-3.5 mr-1.5" />Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Receipt className="size-3.5 mr-1.5" />Transactions
            </TabsTrigger>
            <TabsTrigger value="budget" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <PieChart className="size-3.5 mr-1.5" />Budget
            </TabsTrigger>
            <TabsTrigger value="accounts" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <FileText className="size-3.5 mr-1.5" />Chart of Accounts
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Revenue vs Expenses Chart */}
            <Card className="lg:col-span-7 bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-sm font-medium text-card-foreground">Revenue vs Expenses</CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground">Comparative analysis of financial performance</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Revenue</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-chart-2" />
                      <span className="text-muted-foreground">Expenses</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} barGap={4}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--popover-foreground)" }}
                        labelStyle={{ color: "var(--muted-foreground)" }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                        cursor={{ fill: "var(--muted)" }}
                      />
                      <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card className="lg:col-span-5 bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-card-foreground">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={expenseCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--popover-foreground)" }}
                        formatter={(value: number) => [`${value}%`, ""]}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {expenseCategories.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-[12px] text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="text-[12px] text-foreground font-medium">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab — Visual Timeline */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Recent Transactions</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Latest financial movements and status</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground w-full sm:w-auto">
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
                  {recentTransactions.map((txn) => (
                    <div key={txn.id} className="flex gap-3 relative group">
                      <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${txn.color} text-white text-[10px] font-semibold shrink-0`}>
                        {txn.type === "Invoice" ? <FileText className="size-3.5" /> :
                         txn.type === "Expense" ? <TrendingDown className="size-3.5" /> :
                         <DollarSign className="size-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-[12px] font-medium text-card-foreground truncate">
                              {txn.description}
                            </p>
                            {getStatusBadge(txn.status)}
                          </div>
                          <span className="text-[13px] font-mono font-medium text-foreground ml-2 shrink-0">{txn.amount}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {txn.id} • {txn.date} • {txn.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Eye className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Download className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>Last 30 days</span>
                </div>
                <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                  View all transactions <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Budget Allocation</CardTitle>
                  <CardDescription className="text-[12px] text-muted-foreground">Track spending against allocated budgets</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground w-full sm:w-auto">
                  <Upload className="size-3.5 mr-1.5" />Import Budget
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetItems.map((item) => {
                const percentUsed = Math.round((item.spent / item.allocated) * 100)
                const isOverBudget = percentUsed > 90
                return (
                  <div key={item.department} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-8 rounded-md bg-secondary">
                          <Building2 className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-foreground">{item.department}</p>
                          <p className="text-[11px] text-muted-foreground">
                            ${item.spent.toLocaleString()} of ${item.allocated.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-[13px] font-medium ${isOverBudget ? "text-red-400" : "text-foreground"}`}>
                          {percentUsed}%
                        </p>
                        <p className="text-[11px] text-muted-foreground">${item.remaining.toLocaleString()} remaining</p>
                      </div>
                    </div>
                    <Progress
                      value={percentUsed}
                      className="h-1.5 bg-muted"
                      indicatorClassName="bg-primary/80"
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chart of Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Chart of Accounts</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Master list of all organizational accounts</CardDescription>
                </div>
                <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="size-3.5 mr-1.5" />Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">Code</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Account Name</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Type</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6 text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartOfAccounts.map((account) => (
                    <TableRow key={account.code} className="border-border hover:bg-muted/50">
                      <TableCell className="py-3 pl-6 text-[12px] text-muted-foreground font-mono">{account.code}</TableCell>
                      <TableCell className="py-3 text-[13px] text-foreground">{account.name}</TableCell>
                      <TableCell className="py-3">{getAccountTypeBadge(account.type)}</TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <span className={`text-[13px] font-medium font-mono ${account.balance < 0 ? "text-muted-foreground" : "text-foreground"}`}>
                          {account.balance < 0 ? "(" : ""}${Math.abs(account.balance).toLocaleString()}{account.balance < 0 ? ")" : ""}
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
      </Tabs>
    </div>
  )
}
