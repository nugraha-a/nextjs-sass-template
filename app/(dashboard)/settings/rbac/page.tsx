"use client"

import React, { useState } from "react"
import {
  Shield,
  Plus,
  Users,
  MoreHorizontal,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data
const mockRoles = [
  { id: "1", name: "Super Admin", description: "Full system access", isSystem: true, userCount: 2, permissionsCount: 24 },
  { id: "2", name: "Admin", description: "Manage workspace settings and users", isSystem: true, userCount: 5, permissionsCount: 18 },
  { id: "3", name: "Editor", description: "Create and edit content", isSystem: false, userCount: 12, permissionsCount: 10 },
  { id: "4", name: "Viewer", description: "View-only access", isSystem: false, userCount: 20, permissionsCount: 5 },
]

const permissionGroups = [
  {
    label: "Platform",
    resources: [
      { id: "dashboard", label: "Dashboard" },
      { id: "users", label: "Users" },
      { id: "roles", label: "Roles" },
      { id: "api-clients", label: "API Clients" },
    ],
  },
  {
    label: "Operations",
    resources: [
      { id: "configuration", label: "Configuration" },
      { id: "workflow", label: "Workflow" },
      { id: "notifications", label: "Notifications" },
    ],
  },
  {
    label: "Business",
    resources: [
      { id: "finance", label: "Finance" },
      { id: "hcm", label: "HCM" },
      { id: "scm", label: "SCM" },
      { id: "programs", label: "Programs" },
    ],
  },
]

const actions = ["view", "create", "edit", "delete"] as const

export default function RBACPage() {
  const [selectedRole, setSelectedRole] = useState(mockRoles[0])
  const [createOpen, setCreateOpen] = useState(false)

  // Mock permission state — in real impl this comes from API
  const [permissions, setPermissions] = useState<Record<string, Set<string>>>({
    dashboard: new Set(["view"]),
    users: new Set(["view", "create", "edit", "delete"]),
    roles: new Set(["view", "create", "edit", "delete"]),
    "api-clients": new Set(["view", "create", "edit", "delete"]),
    configuration: new Set(["view", "edit"]),
    workflow: new Set(["view", "create", "edit"]),
    notifications: new Set(["view"]),
    finance: new Set(["view", "create", "edit", "delete"]),
    hcm: new Set(["view", "create", "edit", "delete"]),
    scm: new Set(["view", "create", "edit", "delete"]),
    programs: new Set(["view", "create", "edit", "delete"]),
  })

  const togglePermission = (resource: string, action: string) => {
    setPermissions((prev) => {
      const next = { ...prev }
      const set = new Set(next[resource] || [])
      if (set.has(action)) {
        set.delete(action)
      } else {
        set.add(action)
      }
      next[resource] = set
      return next
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Access</h1>
          <p className="text-muted-foreground">
            Manage roles and permissions
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Role</DialogTitle>
              <DialogDescription>
                Define a new role with custom permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Name</Label>
                <Input id="role-name" placeholder="e.g. Branch Manager" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-desc">Description</Label>
                <Textarea id="role-desc" placeholder="Describe what this role can do" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={() => setCreateOpen(false)}>Create →</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Role list */}
        <div className="space-y-2">
          {mockRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`
                w-full text-left px-4 py-3 rounded-lg border transition-colors
                ${selectedRole.id === role.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-accent"
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{role.name}</span>
                    {role.isSystem && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">System</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {role.userCount}
                </span>
                <span>{role.permissionsCount} permissions</span>
              </div>
            </button>
          ))}
        </div>

        {/* Permission matrix */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedRole.name}</CardTitle>
                  <CardDescription>{selectedRole.description}</CardDescription>
                </div>
                {!selectedRole.isSystem && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Role</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Resource</TableHead>
                      {actions.map((a) => (
                        <TableHead key={a} className="text-center w-24 capitalize">{a}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionGroups.map((group) => (
                      <React.Fragment key={group.label}>
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={5} className="font-medium text-xs uppercase tracking-wider text-muted-foreground py-2">
                            {group.label}
                          </TableCell>
                        </TableRow>
                        {group.resources.map((resource) => (
                          <TableRow key={resource.id}>
                            <TableCell className="font-medium">{resource.label}</TableCell>
                            {actions.map((action) => (
                              <TableCell key={action} className="text-center">
                                <Checkbox
                                  checked={permissions[resource.id]?.has(action) || false}
                                  onCheckedChange={() => togglePermission(resource.id, action)}
                                  disabled={selectedRole.isSystem}
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {!selectedRole.isSystem && (
                <div className="flex justify-end mt-4">
                  <Button>Save Permissions</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
