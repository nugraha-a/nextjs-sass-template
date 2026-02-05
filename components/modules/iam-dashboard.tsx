"use client"

import { useState } from "react"
import {
  Shield,
  Users,
  Key,
  Lock,
  Search,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Edit2,
  Trash2,
  Copy,
  Eye,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  History,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
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

const users = [
  { id: 1, name: "Sarah Johnson", email: "sarah@acme.com", role: "Super Admin", status: "active", lastLogin: "2 hours ago", mfa: true },
  { id: 2, name: "Mike Chen", email: "mike@acme.com", role: "Admin", status: "active", lastLogin: "1 day ago", mfa: true },
  { id: 3, name: "Emma Wilson", email: "emma@acme.com", role: "Finance Manager", status: "active", lastLogin: "3 hours ago", mfa: false },
  { id: 4, name: "James Rodriguez", email: "james@acme.com", role: "HR Manager", status: "active", lastLogin: "5 hours ago", mfa: true },
  { id: 5, name: "Lisa Park", email: "lisa@acme.com", role: "Viewer", status: "inactive", lastLogin: "30 days ago", mfa: false },
  { id: 6, name: "David Kim", email: "david@acme.com", role: "Accountant", status: "active", lastLogin: "1 hour ago", mfa: true },
  { id: 7, name: "Anna Martinez", email: "anna@acme.com", role: "HR Staff", status: "pending", lastLogin: "Never", mfa: false },
]

const roles = [
  { id: 1, name: "Super Admin", description: "Full system access", users: 2, permissions: 156, builtIn: true },
  { id: 2, name: "Admin", description: "Administrative access without system config", users: 5, permissions: 124, builtIn: true },
  { id: 3, name: "Finance Manager", description: "Full access to finance module", users: 8, permissions: 45, builtIn: false },
  { id: 4, name: "HR Manager", description: "Full access to HR module", users: 4, permissions: 38, builtIn: false },
  { id: 5, name: "Accountant", description: "Read/Write access to financial records", users: 12, permissions: 28, builtIn: false },
  { id: 6, name: "Viewer", description: "Read-only access across modules", users: 45, permissions: 15, builtIn: true },
]

const permissions = [
  { module: "Finance", permissions: [
    { key: "finance.gl.read", label: "View General Ledger", granted: true },
    { key: "finance.gl.write", label: "Edit General Ledger", granted: true },
    { key: "finance.ap.read", label: "View Accounts Payable", granted: true },
    { key: "finance.ap.write", label: "Create/Edit AP", granted: false },
    { key: "finance.ar.read", label: "View Accounts Receivable", granted: true },
    { key: "finance.ar.write", label: "Create/Edit AR", granted: false },
  ]},
  { module: "Human Capital", permissions: [
    { key: "hcm.employees.read", label: "View Employees", granted: true },
    { key: "hcm.employees.write", label: "Edit Employees", granted: false },
    { key: "hcm.payroll.read", label: "View Payroll", granted: false },
    { key: "hcm.payroll.write", label: "Process Payroll", granted: false },
  ]},
  { module: "System", permissions: [
    { key: "system.config.read", label: "View Configuration", granted: true },
    { key: "system.config.write", label: "Edit Configuration", granted: false },
    { key: "system.users.read", label: "View Users", granted: true },
    { key: "system.users.write", label: "Manage Users", granted: false },
  ]},
]

const auditLogs = [
  { id: 1, user: "Sarah Johnson", action: "User Created", target: "anna@acme.com", timestamp: "2024-02-04 14:32:15", ip: "192.168.1.45" },
  { id: 2, user: "Mike Chen", action: "Role Modified", target: "Finance Manager", timestamp: "2024-02-04 13:18:42", ip: "192.168.1.67" },
  { id: 3, user: "Sarah Johnson", action: "Permission Changed", target: "Accountant Role", timestamp: "2024-02-04 11:55:30", ip: "192.168.1.45" },
  { id: 4, user: "System", action: "Failed Login", target: "unknown@external.com", timestamp: "2024-02-04 10:22:18", ip: "45.33.128.99" },
  { id: 5, user: "James Rodriguez", action: "Password Reset", target: "Self", timestamp: "2024-02-04 09:45:00", ip: "192.168.1.89" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]"><CheckCircle2 className="size-3 mr-1" />Active</Badge>
    case "inactive":
      return <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-[10px]"><XCircle className="size-3 mr-1" />Inactive</Badge>
    case "pending":
      return <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-0 text-[10px]"><Clock className="size-3 mr-1" />Pending</Badge>
    default:
      return null
  }
}

export function IAMDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<number | null>(3)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Identity & Access Management
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Manage users, roles, permissions, and audit security events
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-secondary">
                <Users className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-semibold text-card-foreground">245</p>
                <p className="text-[11px] text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-secondary">
                <Shield className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-semibold text-card-foreground">12</p>
                <p className="text-[11px] text-muted-foreground">Roles Defined</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10">
                <ShieldCheck className="size-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-semibold text-card-foreground">89%</p>
                <p className="text-[11px] text-muted-foreground">MFA Enabled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-red-500/10">
                <ShieldAlert className="size-4 text-red-400" />
              </div>
              <div>
                <p className="text-xl font-semibold text-card-foreground">3</p>
                <p className="text-[11px] text-muted-foreground">Failed Logins (24h)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-muted border border-border p-1 h-10">
          <TabsTrigger value="users" className="text-[13px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <Users className="size-3.5 mr-1.5" />Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="text-[13px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <Shield className="size-3.5 mr-1.5" />Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-[13px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <History className="size-3.5 mr-1.5" />Audit Log
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-card-foreground">User Directory</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">
                    <UserPlus className="size-3.5 mr-1.5" />Invite User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">User</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Role</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Status</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">MFA</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Last Login</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-muted/50">
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 rounded-md">
                            <AvatarFallback className="rounded-md bg-secondary text-secondary-foreground text-[10px]">
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-[13px] font-medium text-card-foreground">{user.name}</p>
                            <p className="text-[11px] text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground border-0 text-[10px]">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="py-3">
                        {user.mfa ? (
                          <ShieldCheck className="size-4 text-emerald-400" />
                        ) : (
                          <ShieldAlert className="size-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border w-44">
                            <DropdownMenuItem className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground"><Eye className="size-3.5 mr-2" />View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground"><Edit2 className="size-3.5 mr-2" />Edit User</DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] text-foreground focus:bg-accent focus:text-accent-foreground"><Key className="size-3.5 mr-2" />Reset Password</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem className="text-[13px] text-destructive focus:bg-destructive/10 focus:text-destructive"><Trash2 className="size-3.5 mr-2" />Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Roles List */}
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-card-foreground">Roles</CardTitle>
                  <Button size="sm" variant="ghost" className="h-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                    <Plus className="size-3.5 mr-1" />Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedRole === role.id
                          ? "bg-secondary border border-border"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="size-4 text-muted-foreground" />
                          <span className="text-[13px] font-medium text-foreground">{role.name}</span>
                          {role.builtIn && (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-[9px]">
                              Built-in
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 ml-6">{role.description}</p>
                      <div className="flex items-center gap-4 mt-2 ml-6">
                        <span className="text-[10px] text-muted-foreground">{role.users} users</span>
                        <span className="text-[10px] text-muted-foreground">{role.permissions} permissions</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permissions Matrix */}
            <Card className="lg:col-span-3 bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-card-foreground">
                      {roles.find((r) => r.id === selectedRole)?.name} Permissions
                    </CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground">
                      Configure access rights for this role
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 border-border bg-transparent text-muted-foreground hover:text-foreground">
                    <Copy className="size-3 mr-1.5" />Clone Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-6">
                  {permissions.map((group) => (
                    <div key={group.module}>
                      <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        {group.module}
                      </h4>
                      <div className="space-y-2">
                        {group.permissions.map((perm) => (
                          <div
                            key={perm.key}
                            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={perm.key}
                                checked={perm.granted}
                                className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <label htmlFor={perm.key} className="text-[13px] text-foreground cursor-pointer">
                                {perm.label}
                              </label>
                            </div>
                            <code className="text-[10px] text-muted-foreground font-mono">{perm.key}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-card-foreground">Security Audit Log</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      className="h-8 w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground">
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">Timestamp</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">User</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Action</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Target</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="border-border hover:bg-muted/50">
                      <TableCell className="py-3 pl-6 text-[12px] text-muted-foreground font-mono">{log.timestamp}</TableCell>
                      <TableCell className="py-3 text-[13px] text-foreground">{log.user}</TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] border-0 ${
                            log.action.includes("Failed")
                              ? "bg-red-500/10 text-red-400"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-muted-foreground">{log.target}</TableCell>
                      <TableCell className="py-3 pr-6 text-[12px] text-muted-foreground font-mono">{log.ip}</TableCell>
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
