"use client"

import React, { useState } from "react"
import {
  Key,
  Plus,
  Copy,
  MoreHorizontal,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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

const mockClients = [
  {
    id: "1",
    name: "Production App",
    clientId: "ck_prod_a1b2c3d4",
    status: "active" as const,
    rateLimit: 1000,
    lastUsedAt: "2 hours ago",
    endpointCount: 12,
    totalEndpoints: 15,
    createdAt: "Jan 15, 2025",
  },
  {
    id: "2",
    name: "Mobile App",
    clientId: "ck_mob_e5f6g7h8",
    status: "active" as const,
    rateLimit: 500,
    lastUsedAt: "5 min ago",
    endpointCount: 8,
    totalEndpoints: 15,
    createdAt: "Feb 1, 2025",
  },
  {
    id: "3",
    name: "Legacy Integration",
    clientId: "ck_leg_i9j0k1l2",
    status: "expired" as const,
    rateLimit: 100,
    lastUsedAt: "3 months ago",
    endpointCount: 4,
    totalEndpoints: 15,
    createdAt: "Oct 5, 2024",
  },
]

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  expired: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  revoked: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export default function ApiClientsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [showIds, setShowIds] = useState<Set<string>>(new Set())

  const toggleShowId = (id: string) => {
    setShowIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Clients</h1>
          <p className="text-muted-foreground">
            Manage external API integrations
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Client</DialogTitle>
              <DialogDescription>
                Generate credentials for external system integration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input id="client-name" placeholder="e.g. Mobile App" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rate Limit</Label>
                  <Select defaultValue="500">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 req/min</SelectItem>
                      <SelectItem value="500">500 req/min</SelectItem>
                      <SelectItem value="1000">1,000 req/min</SelectItem>
                      <SelectItem value="5000">5,000 req/min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expiry</Label>
                  <Select defaultValue="365">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={() => setCreateOpen(false)}>Generate Credentials →</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Client Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockClients.map((client) => (
          <Card key={client.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Created {client.createdAt}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Manage Endpoints</DropdownMenuItem>
                    <DropdownMenuItem>View Usage</DropdownMenuItem>
                    <DropdownMenuItem>Regenerate Secret</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Revoke</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Client ID */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Client ID</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono bg-muted px-2 py-1.5 rounded border border-border truncate">
                    {showIds.has(client.id) ? client.clientId : "••••••••••••••••"}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => toggleShowId(client.id)}
                  >
                    {showIds.has(client.id) ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => copyToClipboard(client.clientId)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                <Badge variant="secondary" className={statusColors[client.status]}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </Badge>
                <span>{client.rateLimit} req/min</span>
                <span>{client.endpointCount}/{client.totalEndpoints} endpoints</span>
              </div>

              {client.status === "expired" && (
                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-2 rounded-md">
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Expired — regenerate credentials</span>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Last used: {client.lastUsedAt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
