"use client"

import { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  PieChart,
  BarChart3,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  CreditCard,
  Wallet,
  Receipt,
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
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const financialStats = [
  { label: "Total Revenue", value: "$2,845,920", change: "+12.5%", trend: "up", icon: DollarSign },
  { label: "Accounts Receivable", value: "$456,780", change: "+8.2%", trend: "up", icon: ArrowUpRight },
  { label: "Accounts Payable", value: "$234,560", change: "-5.4%", trend: "down", icon: ArrowDownRight },
  { label: "Cash Balance", value: "$1,234,560", change: "+3.1%", trend: "up", icon: Wallet },
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
  { name: "Payroll", value: 45, color: "rgb(244 244 245)" },
  { name: "Operations", value: 25, color: "rgb(161 161 170)" },
  { name: "Marketing", value: 15, color: "rgb(113 113 122)" },
  { name: "Technology", value: 10, color: "rgb(82 82 91)" },
  { name: "Other", value: 5, color: "rgb(63 63 70)" },
]

const budgetItems = [
  { department: "Engineering", allocated: 450000, spent: 385000, remaining: 65000 },
  { department: "Marketing", allocated: 280000, spent: 195000, remaining: 85000 },
  { department: "Sales", allocated: 320000, spent: 298000, remaining: 22000 },
  { department: "Operations", allocated: 180000, spent: 145000, remaining: 35000 },
  { department: "HR", allocated: 120000, spent: 89000, remaining: 31000 },
]

const recentTransactions = [
  { id: "TXN-001234", type: "Invoice", description: "Acme Corp - Q4 Services", amount: 45000, status: "paid", date: "2024-02-04" },
  { id: "TXN-001233", type: "Expense", description: "AWS Cloud Services", amount: -12500, status: "pending", date: "2024-02-03" },
  { id: "TXN-001232", type: "Invoice", description: "TechStart - Consulting", amount: 28000, status: "pending", date: "2024-02-02" },
  { id: "TXN-001231", type: "Payment", description: "Vendor Payment - Supplies", amount: -8900, status: "paid", date: "2024-02-01" },
  { id: "TXN-001230", type: "Invoice", description: "Global Dynamics - Support", amount: 15600, status: "overdue", date: "2024-01-28" },
  { id: "TXN-001229", type: "Expense", description: "Office Rent - February", amount: -22000, status: "paid", date: "2024-02-01" },
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
    Expense: "bg-zinc-500/10 text-zinc-400",
  }
  return <Badge variant="secondary" className={`${colors[type]} border-0 text-[10px]`}>{type}</Badge>
}

export function FinanceModule() {
  const [period, setPeriod] = useState("this-month")

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Finance & Accounting
          </h1>
          <p className="text-[13px] text-zinc-500 mt-1">
            General ledger, accounts payable/receivable, budgeting, and financial reporting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-8 w-36 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="this-month" className="text-[13px] text-zinc-300 focus:bg-zinc-800">This Month</SelectItem>
              <SelectItem value="last-month" className="text-[13px] text-zinc-300 focus:bg-zinc-800">Last Month</SelectItem>
              <SelectItem value="this-quarter" className="text-[13px] text-zinc-300 focus:bg-zinc-800">This Quarter</SelectItem>
              <SelectItem value="this-year" className="text-[13px] text-zinc-300 focus:bg-zinc-800">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="h-8 bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
            <Plus className="size-3.5 mr-1.5" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {financialStats.map((stat) => (
          <Card key={stat.label} className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center size-9 rounded-lg bg-zinc-800/50">
                  <stat.icon className="size-4 text-zinc-400" />
                </div>
                <span className={`flex items-center gap-1 text-[11px] font-medium ${stat.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                  {stat.trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xl font-semibold text-zinc-100 tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1 h-10">
          <TabsTrigger value="overview" className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
            <BarChart3 className="size-3.5 mr-1.5" />Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
            <Receipt className="size-3.5 mr-1.5" />Transactions
          </TabsTrigger>
          <TabsTrigger value="budget" className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
            <PieChart className="size-3.5 mr-1.5" />Budget
          </TabsTrigger>
          <TabsTrigger value="accounts" className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
            <FileText className="size-3.5 mr-1.5" />Chart of Accounts
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Revenue vs Expenses Chart */}
            <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-zinc-100">Revenue vs Expenses</CardTitle>
                  <div className="flex items-center gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-zinc-100" />
                      <span className="text-zinc-500">Revenue</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-zinc-600" />
                      <span className="text-zinc-500">Expenses</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} barGap={4}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "rgb(113 113 122)", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgb(113 113 122)", fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "rgb(24 24 27)", border: "1px solid rgb(39 39 42)", borderRadius: "8px", fontSize: "12px" }}
                        labelStyle={{ color: "rgb(161 161 170)" }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                      />
                      <Bar dataKey="revenue" fill="rgb(244 244 245)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="rgb(82 82 91)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-100">Expense Breakdown</CardTitle>
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
                        contentStyle={{ backgroundColor: "rgb(24 24 27)", border: "1px solid rgb(39 39 42)", borderRadius: "8px", fontSize: "12px" }}
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
                        <span className="text-[12px] text-zinc-400">{cat.name}</span>
                      </div>
                      <span className="text-[12px] text-zinc-300 font-medium">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-zinc-100">Recent Transactions</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600" />
                    <Input
                      placeholder="Search transactions..."
                      className="h-8 w-64 pl-8 bg-zinc-900 border-zinc-800 text-[13px] text-zinc-100 placeholder:text-zinc-600"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-100">
                    <Download className="size-3.5 mr-1.5" />Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800/50 hover:bg-transparent">
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10 pl-6">Transaction ID</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Type</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Description</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Amount</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Status</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Date</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10 pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((txn) => (
                    <TableRow key={txn.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                      <TableCell className="py-3 pl-6 text-[12px] text-zinc-400 font-mono">{txn.id}</TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-0 text-[10px]">{txn.type}</Badge>
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-zinc-100">{txn.description}</TableCell>
                      <TableCell className="py-3">
                        <span className={`text-[13px] font-medium ${txn.amount > 0 ? "text-emerald-400" : "text-zinc-300"}`}>
                          {txn.amount > 0 ? "+" : ""}{txn.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">{getStatusBadge(txn.status)}</TableCell>
                      <TableCell className="py-3 text-[13px] text-zinc-500">{txn.date}</TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <Button variant="ghost" size="icon" className="size-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-zinc-100">Budget Allocation</CardTitle>
                  <CardDescription className="text-[12px] text-zinc-500">Track spending against allocated budgets</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="h-8 border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-100">
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
                        <div className="flex items-center justify-center size-8 rounded-md bg-zinc-800/50">
                          <Building2 className="size-4 text-zinc-500" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-zinc-100">{item.department}</p>
                          <p className="text-[11px] text-zinc-500">
                            ${item.spent.toLocaleString()} of ${item.allocated.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-[13px] font-medium ${isOverBudget ? "text-red-400" : "text-zinc-100"}`}>
                          {percentUsed}%
                        </p>
                        <p className="text-[11px] text-zinc-500">${item.remaining.toLocaleString()} remaining</p>
                      </div>
                    </div>
                    <Progress
                      value={percentUsed}
                      className="h-1.5 bg-zinc-800"
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chart of Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-zinc-100">Chart of Accounts</CardTitle>
                <Button size="sm" className="h-8 bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                  <Plus className="size-3.5 mr-1.5" />Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800/50 hover:bg-transparent">
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10 pl-6">Code</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Account Name</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Type</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10 pr-6 text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartOfAccounts.map((account) => (
                    <TableRow key={account.code} className="border-zinc-800/50 hover:bg-zinc-800/30">
                      <TableCell className="py-3 pl-6 text-[12px] text-zinc-400 font-mono">{account.code}</TableCell>
                      <TableCell className="py-3 text-[13px] text-zinc-100">{account.name}</TableCell>
                      <TableCell className="py-3">{getAccountTypeBadge(account.type)}</TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <span className={`text-[13px] font-medium font-mono ${account.balance < 0 ? "text-zinc-400" : "text-zinc-100"}`}>
                          {account.balance < 0 ? "(" : ""}${Math.abs(account.balance).toLocaleString()}{account.balance < 0 ? ")" : ""}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
