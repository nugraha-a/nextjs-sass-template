"use client"

import { useState, useEffect, useRef } from "react"
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Cog,
  Copy,
  Download,
  Eye,
  Filter,
  GitBranch,
  Layers,
  MoreHorizontal,
  Pause,
  PenLine,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
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

const workflowTemplates = [
  { id: 1, name: "Purchase Order Approval", category: "Finance", steps: 5, lastEdited: "2 days ago", status: "active", runs: 234, avgDuration: "4.2h" },
  { id: 2, name: "Employee Onboarding", category: "HR", steps: 8, lastEdited: "1 week ago", status: "active", runs: 156, avgDuration: "3.5d" },
  { id: 3, name: "Expense Report Review", category: "Finance", steps: 4, lastEdited: "3 days ago", status: "active", runs: 89, avgDuration: "2.1h" },
  { id: 4, name: "Contract Renewal", category: "Legal", steps: 6, lastEdited: "5 days ago", status: "draft", runs: 0, avgDuration: "—" },
  { id: 5, name: "Support Ticket Escalation", category: "Operations", steps: 3, lastEdited: "1 day ago", status: "active", runs: 312, avgDuration: "45m" },
]

const businessRules = [
  { name: "Auto-approve < $1,000", description: "Skip approval for expenses under $1,000", trigger: "Expense Created", status: "active", executions: 456 },
  { name: "Manager Escalation", description: "Escalate to manager after 48h without action", trigger: "Task Overdue", status: "active", executions: 89 },
  { name: "Budget Alert", description: "Notify CFO when dept budget exceeds 90%", trigger: "Budget Threshold", status: "active", executions: 12 },
  { name: "Vendor Blacklist Check", description: "Block PO if vendor is on compliance blacklist", trigger: "PO Created", status: "draft", executions: 0 },
  { name: "SLA Breach Notification", description: "Alert team lead when SLA is about to breach", trigger: "SLA Timer", status: "active", executions: 67 },
]

const activeInstances = [
  { id: "WF-001234", workflow: "Purchase Order Approval", initiator: "Ahmad Rizky", currentStep: "Manager Review", status: "running", startedAt: "2 hours ago", progress: 60, color: "bg-primary" },
  { id: "WF-001233", workflow: "Employee Onboarding", initiator: "Sari Dewi", currentStep: "IT Setup", status: "running", startedAt: "1 day ago", progress: 45, color: "bg-emerald-500" },
  { id: "WF-001232", workflow: "Expense Report Review", initiator: "Budi Santoso", currentStep: "Finance Approval", status: "paused", startedAt: "3 hours ago", progress: 50, color: "bg-amber-500" },
  { id: "WF-001231", workflow: "Purchase Order Approval", initiator: "Maya Putri", currentStep: "Completed", status: "completed", startedAt: "5 hours ago", progress: 100, color: "bg-emerald-500" },
  { id: "WF-001230", workflow: "Support Ticket Escalation", initiator: "System", currentStep: "Failed at Notification", status: "failed", startedAt: "1 day ago", progress: 33, color: "bg-red-500" },
  { id: "WF-001229", workflow: "Employee Onboarding", initiator: "Ahmad Rizky", currentStep: "Document Signing", status: "running", startedAt: "2 days ago", progress: 75, color: "bg-primary" },
]

const completionPieData = [
  { name: "Completed", value: 156 },
  { name: "Running", value: 23 },
  { name: "Failed", value: 8 },
]
const completionPieColors = ["var(--color-chart-3)", "var(--color-primary)", "var(--color-destructive)"]

/* ─── Workflow Visual Canvas ───────────────────────────── */

function WorkflowCanvas() {
  const steps = [
    { label: "Start", type: "start" },
    { label: "Submit Request", type: "action" },
    { label: "Auto-Review", type: "condition" },
    { label: "Manager Approval", type: "action" },
    { label: "End", type: "end" },
  ]

  return (
    <div className="flex items-center justify-between gap-1 overflow-x-auto py-4 px-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1 shrink-0">
          <div
            className={`flex items-center justify-center px-3 py-2 rounded-lg border text-[11px] font-medium transition-colors ${
              step.type === "start" || step.type === "end"
                ? "bg-primary/10 border-primary/30 text-primary rounded-full min-w-[60px]"
                : step.type === "condition"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 rotate-0 min-w-[90px]"
                : "bg-card border-border text-card-foreground min-w-[110px]"
            }`}
          >
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="size-3.5 text-muted-foreground/50 shrink-0" />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Helpers ──────────────────────────────────────────── */

function getInstanceStatusBadge(status: string) {
  switch (status) {
    case "running":
      return <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px]"><Play className="size-3 mr-1" />Running</Badge>
    case "paused":
      return <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-0 text-[10px]"><Pause className="size-3 mr-1" />Paused</Badge>
    case "completed":
      return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]"><CheckCircle2 className="size-3 mr-1" />Completed</Badge>
    case "failed":
      return <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-0 text-[10px]"><XCircle className="size-3 mr-1" />Failed</Badge>
    default:
      return null
  }
}

function getTemplateStatusBadge(status: string) {
  return status === "active"
    ? <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]"><CheckCircle2 className="size-3 mr-1" />Active</Badge>
    : <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-0 text-[10px]"><PenLine className="size-3 mr-1" />Draft</Badge>
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

function StatCard({ label, value, displayValue, change, trend, chartColor, badge }: {
  label: string; value: number; displayValue?: string; change: string; trend: "up" | "down"; chartColor: string; badge?: string
}) {
  const count = useCountUp(value)
  const sparkData = [35, 50, 40, 60, 45, 70, 55, 80, 60, 90, 65, 85].map((v, i) => ({ i, v }))

  return (
    <Card className="bg-card border border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-card-foreground">{label}</p>
          <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary border-0 h-4 px-1.5">
            {badge || "wf"}
          </Badge>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{displayValue || count}</p>
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
                <linearGradient id={`spark-wf-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={chartColor} strokeWidth={1.5} fill={`url(#spark-wf-${label})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2">
          <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
            Details <ChevronRight className="size-3 ml-0.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Page ─────────────────────────────────────────────── */

export default function WorkflowPage() {
  const runningCount = activeInstances.filter((i) => i.status === "running").length
  const completedCount = activeInstances.filter((i) => i.status === "completed").length
  const activeTemplates = workflowTemplates.filter((t) => t.status === "active").length

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ─── Row 1: Welcome Banner + Completion Donut + Status ─── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Welcome Banner */}
        <Card className="lg:col-span-5 bg-gradient-to-br from-primary/8 via-primary/3 to-background border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-foreground">
              Workflow Engine
            </h2>
            <p className="text-[12px] text-muted-foreground mt-1">
              Design, automate, and monitor business workflows
            </p>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
              <QuickLink icon={<Plus className="size-4" />} label="New Workflow" description="Create template" />
              <QuickLink icon={<Clock className="size-4" />} label="Pending" description="Awaiting approval" />
              <QuickLink icon={<Code2 className="size-4" />} label="Rule Editor" description="Business logic" />
              <QuickLink icon={<Activity className="size-4" />} label="View Logs" description="Execution history" />
            </div>
          </CardContent>
        </Card>

        {/* Completion Donut */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Execution Status
              </CardTitle>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                View all <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {completionPieData[0].value + completionPieData[1].value + completionPieData[2].value} total executions this month
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center py-2">
              <div className="relative size-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={54}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {completionPieData.map((_, idx) => (
                        <Cell key={idx} fill={completionPieColors[idx]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-lg font-bold text-foreground">83%</span>
                    <p className="text-[9px] text-muted-foreground">success</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-1">
              {completionPieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full" style={{ backgroundColor: completionPieColors[idx] }} />
                  <span className="text-[10px] text-muted-foreground">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Status */}
        <Card className="lg:col-span-3 bg-card border border-border">
          <CardContent className="p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Engine status</p>
              <h3 className="text-sm font-semibold text-primary mt-1">
                Workflow Orchestrator
              </h3>
              <Badge className="mt-2 bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">
                <Zap className="size-3 mr-1" /> Running
              </Badge>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                {runningCount} active instances. {activeTemplates} templates deployed. {businessRules.filter(r => r.status === "active").length} rules active.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent text-xs"
              >
                <Download className="size-3 mr-1.5" />
                Export
              </Button>
              <Button
                size="sm"
                className="flex-1 h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
              >
                <Plus className="size-3 mr-1.5" />
                Create
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Row 2: Sparkline Stats ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Templates" value={activeTemplates} change="+1 this week" trend="up" chartColor="var(--color-primary)" />
        <StatCard label="Running Instances" value={runningCount} change="+2 today" trend="up" chartColor="var(--color-chart-2)" badge="live" />
        <StatCard label="Total Executions" value={791} change="+12.8%" trend="up" chartColor="var(--color-chart-3)" badge="month" />
        <StatCard label="Avg. Duration" value={3} displayValue="3.2h" change="-18% faster" trend="up" chartColor="var(--color-chart-4)" badge="avg" />
      </div>

      {/* ─── Row 3: Tabs ─── */}
      <Tabs defaultValue="designer" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="designer" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Layers className="size-3.5 mr-1.5" />Designer
            </TabsTrigger>
            <TabsTrigger value="rules" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Code2 className="size-3.5 mr-1.5" />Rules
            </TabsTrigger>
            <TabsTrigger value="instances" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Activity className="size-3.5 mr-1.5" />Instances
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Designer Tab */}
        <TabsContent value="designer" className="space-y-6">
          {/* Visual Canvas Preview */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Workflow Preview</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Purchase Order Approval — Visual flow</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground">
                  <PenLine className="size-3.5 mr-1.5" />Edit in Designer
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <WorkflowCanvas />
            </CardContent>
          </Card>

          {/* Template List */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Workflow Templates</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">{workflowTemplates.length} templates, {activeTemplates} active</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                    <Plus className="size-3.5 mr-1.5" />New Template
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">Template</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">Steps</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">Runs</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">Avg. Duration</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 w-10 pr-6"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflowTemplates.map((template) => (
                    <TableRow key={template.id} className="border-border hover:bg-muted/50">
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 text-primary">
                            <GitBranch className="size-3.5" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-foreground">{template.name}</p>
                            <p className="text-[11px] text-muted-foreground">{template.category} • Edited {template.lastEdited}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[12px] text-foreground hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <Layers className="size-3 text-muted-foreground" />
                          {template.steps}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 hidden md:table-cell">{getTemplateStatusBadge(template.status)}</TableCell>
                      <TableCell className="py-3 text-[12px] font-mono text-foreground hidden lg:table-cell">{template.runs}</TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden lg:table-cell">{template.avgDuration}</TableCell>
                      <TableCell className="py-3 pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-popover border-border">
                            <DropdownMenuItem className="text-[12px] text-foreground focus:bg-accent focus:text-accent-foreground"><PenLine className="size-3.5 mr-2" />Edit Template</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-foreground focus:bg-accent focus:text-accent-foreground"><Copy className="size-3.5 mr-2" />Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-foreground focus:bg-accent focus:text-accent-foreground"><Eye className="size-3.5 mr-2" />Preview</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-foreground focus:bg-accent focus:text-accent-foreground"><Play className="size-3.5 mr-2" />Run Now</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Business Rules Engine</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Automated decision logic and event-driven actions</CardDescription>
                </div>
                <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="size-3.5 mr-1.5" />New Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {businessRules.map((rule) => (
                <div
                  key={rule.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-transparent hover:border-border/50 transition-all group"
                >
                  <div className={`flex items-center justify-center size-10 rounded-lg shrink-0 ${
                    rule.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground border border-border/50"
                  }`}>
                    <Code2 className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium text-foreground">{rule.name}</p>
                      {rule.status === "active" ? (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0 text-[9px] hidden sm:inline-flex">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-0 text-[9px] hidden sm:inline-flex">Draft</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{rule.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[9px] border-border/50 text-muted-foreground/60 font-normal px-1.5 h-4">
                        {rule.trigger}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground/50">•</span>
                      <span className="text-[10px] text-muted-foreground/70">{rule.executions} runs</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <Settings className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instances Tab — Visual Timeline */}
        <TabsContent value="instances" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Active Instances</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Live workflow executions and their current status</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search instances..."
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground">
                    <RefreshCw className="size-3.5 mr-1.5" />Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Visual Timeline */}
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  {activeInstances.map((instance) => (
                    <div key={instance.id} className="flex gap-3 relative group">
                      <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${instance.color} text-white text-[10px] font-semibold shrink-0`}>
                        {instance.status === "running" ? <Play className="size-3.5" /> :
                         instance.status === "completed" ? <CheckCircle2 className="size-3.5" /> :
                         instance.status === "paused" ? <Pause className="size-3.5" /> :
                         <XCircle className="size-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-[12px] font-medium text-card-foreground truncate">
                            {instance.workflow}
                          </p>
                          {getInstanceStatusBadge(instance.status)}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Step: {instance.currentStep} — {instance.progress}% complete
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground/70 font-mono">{instance.id}</span>
                          <span className="text-[10px] text-muted-foreground/50">•</span>
                          <span className="text-[10px] text-muted-foreground/70">by {instance.initiator}</span>
                          <span className="text-[10px] text-muted-foreground/50">•</span>
                          <span className="text-[10px] text-muted-foreground/70">{instance.startedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Eye className="size-3.5" />
                        </Button>
                        {instance.status === "running" && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                            <Pause className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>Real-time updates</span>
                </div>
                <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                  View execution history <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
