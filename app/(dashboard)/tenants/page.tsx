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
  Edit2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
        </div>
        <Button
          size="sm"
          className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="size-3.5 mr-1.5" />
          Add Tenant
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border hover:border-primary/50 transition-colors duration-150">
            <CardContent className="p-6">
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

      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-medium text-card-foreground">
                All Tenants
              </CardTitle>
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
        <CardContent className="pt-0">
          <div className="space-y-3">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border transition-all gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary border border-primary/20">
                     <Building2 className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                     <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold tracking-tight text-card-foreground">
                          {tenant.name}
                        </p>
                        <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 h-4 font-normal capitalize border-0 ${
                          tenant.status === "active" ? "bg-emerald-500/10 text-emerald-500" :
                          tenant.status === "trial" ? "bg-blue-500/10 text-blue-500" :
                          "bg-red-500/10 text-red-500"
                        }`}>
                          {tenant.status}
                        </Badge>
                     </div>
                     <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{tenant.plan} Plan</span>
                        <span>•</span>
                        <span>{tenant.users} Users</span>
                        <span>•</span>
                        <span className="font-mono">{tenant.mrr}</span>
                     </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pl-14 sm:pl-0">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Joined</span>
                    <span className="text-xs font-medium text-foreground">{tenant.createdAt}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem className="text-[13px]">
                          <Eye className="mr-2 size-3.5" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px]">
                          <Edit2 className="mr-2 size-3.5" />
                          Edit Tenant
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] text-red-500 focus:text-red-500">
                          <Trash2 className="mr-2 size-3.5" />
                          Suspend Tenant
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
