"use client"

import { useState } from "react"
import {
  Workflow,
  Play,
  Pause,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  GitBranch,
  Circle,
  Square,
  Diamond,
  Zap,
  FileCode,
  Copy,
  Trash2,
  Edit2,
  Eye,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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

const workflowTemplates = [
  { id: 1, name: "Invoice Approval", description: "Multi-level approval for invoices based on amount", nodes: 5, active: true, triggers: 234 },
  { id: 2, name: "Leave Request", description: "Employee leave request approval workflow", nodes: 4, active: true, triggers: 89 },
  { id: 3, name: "Purchase Order", description: "PO creation and approval process", nodes: 7, active: true, triggers: 156 },
  { id: 4, name: "Expense Claim", description: "Employee expense reimbursement workflow", nodes: 6, active: false, triggers: 0 },
  { id: 5, name: "Vendor Onboarding", description: "New vendor registration and approval", nodes: 8, active: true, triggers: 23 },
]

const activeInstances = [
  { id: "WF-2024-001234", workflow: "Invoice Approval", status: "pending", currentStep: "CFO Approval", initiator: "Sarah Johnson", amount: "$45,000", created: "2 hours ago" },
  { id: "WF-2024-001233", workflow: "Leave Request", status: "pending", currentStep: "Manager Approval", initiator: "Mike Chen", amount: null, created: "5 hours ago" },
  { id: "WF-2024-001232", workflow: "Purchase Order", status: "approved", currentStep: "Completed", initiator: "Emma Wilson", amount: "$12,500", created: "1 day ago" },
  { id: "WF-2024-001231", workflow: "Invoice Approval", status: "rejected", currentStep: "Rejected at Finance", initiator: "James Rodriguez", amount: "$8,200", created: "1 day ago" },
  { id: "WF-2024-001230", workflow: "Vendor Onboarding", status: "pending", currentStep: "Legal Review", initiator: "Admin", amount: null, created: "2 days ago" },
]

const workflowNodes = [
  { id: 1, type: "start", label: "Start", x: 50, y: 150 },
  { id: 2, type: "condition", label: "Amount > $10K?", x: 200, y: 150 },
  { id: 3, type: "action", label: "Manager Approval", x: 400, y: 80 },
  { id: 4, type: "action", label: "CFO Approval", x: 400, y: 220 },
  { id: 5, type: "action", label: "Finance Review", x: 600, y: 150 },
  { id: 6, type: "end", label: "Complete", x: 800, y: 150 },
]

const ruleCode = `// Invoice Approval Rule
RULE "High Value Invoice Approval"
WHEN
  transaction.type == "INVOICE"
  AND transaction.amount > 10000
  AND transaction.currency == "USD"
THEN
  REQUIRE_APPROVAL(["CFO", "Finance Director"])
  SET_SLA(hours: 24)
  NOTIFY(transaction.requester, "High-value invoice submitted")
END

RULE "Standard Invoice Approval"
WHEN
  transaction.type == "INVOICE"
  AND transaction.amount <= 10000
THEN
  REQUIRE_APPROVAL(["Manager"])
  SET_SLA(hours: 48)
END

RULE "Auto-Approve Small Expenses"
WHEN
  transaction.type == "EXPENSE"
  AND transaction.amount <= 100
  AND requester.has_budget == true
THEN
  AUTO_APPROVE()
  LOG("Auto-approved small expense")
END`

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-0 text-[10px]"><Clock className="size-3 mr-1" />Pending</Badge>
    case "approved":
      return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]"><CheckCircle2 className="size-3 mr-1" />Approved</Badge>
    case "rejected":
      return <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-0 text-[10px]"><XCircle className="size-3 mr-1" />Rejected</Badge>
    default:
      return null
  }
}

function WorkflowCanvas() {
  return (
    <div className="relative h-[300px] bg-zinc-950 rounded-lg border border-zinc-800/50 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(39 39 42 / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(39 39 42 / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="rgb(113 113 122)" />
          </marker>
        </defs>
        {/* Start to Condition */}
        <line x1="90" y1="150" x2="180" y2="150" stroke="rgb(113 113 122)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        {/* Condition to Manager (Yes) */}
        <path d="M 240 130 Q 280 80 380 80" fill="none" stroke="rgb(113 113 122)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        {/* Condition to CFO (No) */}
        <path d="M 240 170 Q 280 220 380 220" fill="none" stroke="rgb(113 113 122)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        {/* Manager to Finance */}
        <path d="M 480 80 Q 520 80 520 130 Q 520 150 580 150" fill="none" stroke="rgb(113 113 122)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        {/* CFO to Finance */}
        <path d="M 480 220 Q 520 220 520 170 Q 520 150 580 150" fill="none" stroke="rgb(113 113 122)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        {/* Finance to End */}
        <line x1="680" y1="150" x2="780" y2="150" stroke="rgb(113 113 122)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        {/* Labels */}
        <text x="290" y="70" fill="rgb(161 161 170)" fontSize="10">Yes</text>
        <text x="290" y="240" fill="rgb(161 161 170)" fontSize="10">No</text>
      </svg>

      {/* Nodes */}
      {workflowNodes.map((node) => (
        <div
          key={node.id}
          className="absolute flex flex-col items-center"
          style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
        >
          {node.type === "start" && (
            <div className="flex items-center justify-center size-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500">
              <Circle className="size-4 text-emerald-400 fill-emerald-400" />
            </div>
          )}
          {node.type === "end" && (
            <div className="flex items-center justify-center size-10 rounded-full bg-zinc-700/50 border-2 border-zinc-600">
              <Square className="size-4 text-zinc-400 fill-zinc-400" />
            </div>
          )}
          {node.type === "condition" && (
            <div className="flex items-center justify-center size-12 rotate-45 bg-amber-500/20 border-2 border-amber-500 rounded-sm">
              <Diamond className="size-4 text-amber-400 -rotate-45" />
            </div>
          )}
          {node.type === "action" && (
            <div className="flex items-center justify-center px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg">
              <span className="text-[11px] text-zinc-300">{node.label}</span>
            </div>
          )}
          {(node.type === "start" || node.type === "end" || node.type === "condition") && (
            <span className="mt-2 text-[10px] text-zinc-500">{node.label}</span>
          )}
        </div>
      ))}

      {/* Toolbar */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <Button size="sm" variant="ghost" className="h-7 px-2 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800">
          <Plus className="size-3.5" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800">
          <GitBranch className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

export function WorkflowDesigner() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(1)

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Workflow Engine
          </h1>
          <p className="text-[13px] text-zinc-500 mt-1">
            Design, deploy, and monitor approval workflows and business rules
          </p>
        </div>
        <Button size="sm" className="h-8 bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
          <Plus className="size-3.5 mr-1.5" />
          New Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-zinc-800/50">
                <Workflow className="size-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-100">12</p>
                <p className="text-[11px] text-zinc-500">Active Workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-amber-500/10">
                <Clock className="size-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-100">47</p>
                <p className="text-[11px] text-zinc-500">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10">
                <Zap className="size-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-100">502</p>
                <p className="text-[11px] text-zinc-500">Triggered Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-red-500/10">
                <AlertTriangle className="size-4 text-red-400" />
              </div>
              <div>
                <p className="text-xl font-semibold text-zinc-100">3</p>
                <p className="text-[11px] text-zinc-500">SLA Breaches</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="designer" className="space-y-6">
        <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1 h-10">
          <TabsTrigger value="designer" className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
            <GitBranch className="size-3.5 mr-1.5" />Visual Designer
          </TabsTrigger>
          <TabsTrigger value="rules" className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
            <FileCode className="size-3.5 mr-1.5" />Rule Engine
          </TabsTrigger>
          <TabsTrigger value="instances" className="text-[13px] data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
            <Play className="size-3.5 mr-1.5" />Active Instances
          </TabsTrigger>
        </TabsList>

        {/* Visual Designer Tab */}
        <TabsContent value="designer" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Workflow List */}
            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-100">Workflow Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {workflowTemplates.map((wf) => (
                    <button
                      key={wf.id}
                      type="button"
                      onClick={() => setSelectedWorkflow(wf.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedWorkflow === wf.id
                          ? "bg-zinc-800 border border-zinc-700"
                          : "hover:bg-zinc-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-zinc-100">{wf.name}</span>
                        {wf.active ? (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[9px]">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-zinc-800 text-zinc-500 border-0 text-[9px]">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">{wf.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-zinc-600">
                        <span>{wf.nodes} nodes</span>
                        <span>{wf.triggers} triggers</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Canvas */}
            <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-zinc-100">
                      {workflowTemplates.find((w) => w.id === selectedWorkflow)?.name}
                    </CardTitle>
                    <CardDescription className="text-[11px] text-zinc-500">
                      Drag and drop to modify the workflow
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-7 border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-100">
                      <Play className="size-3 mr-1" />Test
                    </Button>
                    <Button size="sm" className="h-7 bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                      Deploy
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <WorkflowCanvas />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rule Engine Tab */}
        <TabsContent value="rules" className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-zinc-100">Business Rules DSL</CardTitle>
                  <CardDescription className="text-[11px] text-zinc-500">
                    Define declarative rules for workflow automation
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-7 border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-100">
                    Validate
                  </Button>
                  <Button size="sm" className="h-7 bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                    Save Rules
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                value={ruleCode}
                readOnly
                className="h-[400px] font-mono text-[12px] bg-zinc-950 border-zinc-800 text-zinc-300 resize-none"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Instances Tab */}
        <TabsContent value="instances" className="space-y-4">
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-zinc-100">Active Workflow Instances</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800/50 hover:bg-transparent">
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10 pl-6">Instance ID</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Workflow</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Status</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Current Step</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Initiator</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10">Amount</TableHead>
                    <TableHead className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider h-10 pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeInstances.map((instance) => (
                    <TableRow key={instance.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                      <TableCell className="py-3 pl-6 text-[12px] text-zinc-400 font-mono">{instance.id}</TableCell>
                      <TableCell className="py-3 text-[13px] text-zinc-100">{instance.workflow}</TableCell>
                      <TableCell className="py-3">{getStatusBadge(instance.status)}</TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="size-3.5 text-zinc-600" />
                          <span className="text-[13px] text-zinc-300">{instance.currentStep}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-zinc-400">{instance.initiator}</TableCell>
                      <TableCell className="py-3 text-[13px] text-zinc-100 font-medium">{instance.amount || "-"}</TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 w-44">
                            <DropdownMenuItem className="text-[13px] text-zinc-300 focus:bg-zinc-800"><Eye className="size-3.5 mr-2" />View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-[13px] text-zinc-300 focus:bg-zinc-800"><Edit2 className="size-3.5 mr-2" />Reassign</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="text-[13px] text-red-400 focus:bg-zinc-800"><Pause className="size-3.5 mr-2" />Cancel</DropdownMenuItem>
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
      </Tabs>
    </div>
  )
}
