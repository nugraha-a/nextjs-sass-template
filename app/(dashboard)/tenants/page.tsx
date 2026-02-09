"use client"

import { useState } from "react"
import {
  Building2,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Users,
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Settings,
  Trash2,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

const tenants = [
  {
    id: "TEN-001",
    name: "Acme Corporation",
    type: "Enterprise",
    plan: "Enterprise",
    status: "active",
    users: 245,
    mrr: 4500,
    createdAt: "2024-01-15",
    industry: "Technology",
  },
  {
    id: "TEN-002",
    name: "Global Dynamics",
    type: "Business",
    plan: "Professional",
    status: "active",
    users: 89,
    mrr: 1200,
    createdAt: "2024-02-20",
    industry: "Manufacturing",
  },
  {
    id: "TEN-003",
    name: "Innovate Labs",
    type: "Startup",
    plan: "Starter",
    status: "active",
    users: 12,
    mrr: 299,
    createdAt: "2024-03-10",
    industry: "Research",
  },
  {
    id: "TEN-004",
    name: "TechStart Inc",
    type: "Business",
    plan: "Professional",
    status: "trial",
    users: 34,
    mrr: 0,
    createdAt: "2024-04-05",
    industry: "Software",
  },
  {
    id: "TEN-005",
    name: "Future Systems",
    type: "Enterprise",
    plan: "Enterprise",
    status: "active",
    users: 512,
    mrr: 8900,
    createdAt: "2023-11-22",
    industry: "Finance",
  },
  {
    id: "TEN-006",
    name: "Green Energy Co",
    type: "Business",
    plan: "Professional",
    status: "suspended",
    users: 67,
    mrr: 0,
    createdAt: "2024-01-08",
    industry: "Energy",
  },
  {
    id: "TEN-007",
    name: "HealthCare Plus",
    type: "Enterprise",
    plan: "Enterprise",
    status: "active",
    users: 189,
    mrr: 3500,
    createdAt: "2023-09-14",
    industry: "Healthcare",
  },
]

const stats = [
  { label: "Total Tenants", value: "2,847", change: "+12.5%", icon: Building2 },
  { label: "Active Subscriptions", value: "2,634", change: "+8.2%", icon: CheckCircle2 },
  { label: "Total MRR", value: "$892,450", change: "+23.1%", icon: CreditCard },
  { label: "Avg Users/Tenant", value: "45", change: "+5.7%", icon: Users },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">
          <CheckCircle2 className="size-3 mr-1" />
          Active
        </Badge>
      )
    case "trial":
      return (
        <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-0 text-[10px]">
          <Clock className="size-3 mr-1" />
          Trial
        </Badge>
      )
    case "suspended":
      return (
        <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-0 text-[10px]">
          <XCircle className="size-3 mr-1" />
          Suspended
        </Badge>
      )
    default:
      return null
  }
}

function getPlanBadge(plan: string) {
  const colors: Record<string, string> = {
    Enterprise: "bg-primary/10 text-primary",
    Professional: "bg-secondary text-secondary-foreground",
    Starter: "bg-muted text-muted-foreground",
  }
  return (
    <Badge variant="secondary" className={`${colors[plan] || "bg-muted text-muted-foreground"} border-0 text-[10px]`}>
      {plan}
    </Badge>
  )
}

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Tenant Management
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Manage organizations, subscriptions, and billing across the platform
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
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center size-9 rounded-lg bg-secondary">
                  <stat.icon className="size-4 text-muted-foreground" />
                </div>
                <span className="text-[11px] text-emerald-500 font-medium">{stat.change}</span>
              </div>
              <div className="mt-3">
                <p className="text-xl font-semibold text-card-foreground tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tenants Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-sm font-medium text-card-foreground">
              All Tenants
            </CardTitle>
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
                <SelectTrigger className="h-8 w-full sm:w-32 bg-background border-input text-[13px] text-muted-foreground">
                  <Filter className="size-3.5 mr-1.5" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">
                    All Status
                  </SelectItem>
                  <SelectItem value="active" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">
                    Active
                  </SelectItem>
                  <SelectItem value="trial" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">
                    Trial
                  </SelectItem>
                  <SelectItem value="suspended" className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">
                    Suspended
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">
                  Organization
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">
                  Plan
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">
                  Status
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">
                  Users
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">
                  MRR
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">
                  Created
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id} className="border-border hover:bg-muted/50">
                  <TableCell className="py-3 pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 rounded-md">
                        <AvatarFallback className="rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium">
                          {tenant.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{tenant.name}</p>
                        <p className="text-[11px] text-muted-foreground">{tenant.industry}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">{getPlanBadge(tenant.plan)}</TableCell>
                  <TableCell className="py-3">{getStatusBadge(tenant.status)}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-muted-foreground" />
                      <span className="text-[13px] text-muted-foreground">{tenant.users}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-[13px] text-foreground font-medium">
                      ${tenant.mrr.toLocaleString('en-US')}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <span className="text-[13px] text-muted-foreground">{tenant.createdAt}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border w-44">
                        <DropdownMenuItem className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">
                          <Eye className="size-3.5 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">
                          <Settings className="size-3.5 mr-2" />
                          Manage
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground">
                          <ArrowUpRight className="size-3.5 mr-2" />
                          Login as Tenant
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem className="text-[13px] text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <Trash2 className="size-3.5 mr-2" />
                          Suspend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
