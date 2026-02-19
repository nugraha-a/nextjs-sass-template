"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  Check,
  Star,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  CalendarDays,
  FileText,
  Plus,
  Video,
  UserPlus,
  Zap,
  Circle,
  CheckCircle2,
  Folder,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

// ── Mock Data ──────────────────────────────────────
const weeklyReport = [
  { day: "Mon", thisWeek: 85, lastWeek: 60 },
  { day: "Tue", thisWeek: 72, lastWeek: 75 },
  { day: "Wed", thisWeek: 90, lastWeek: 55 },
  { day: "Thu", thisWeek: 65, lastWeek: 80 },
  { day: "Fri", thisWeek: 95, lastWeek: 70 },
  { day: "Sat", thisWeek: 45, lastWeek: 40 },
  { day: "Sun", thisWeek: 30, lastWeek: 35 },
]

const projectList = [
  { name: "Organizing UI", role: "Prototyping", color: "bg-primary" },
  { name: "Create Mobile View", role: "Marketer", color: "bg-emerald-500" },
  { name: "Create Landing Pages", role: "DevOps", color: "bg-amber-500" },
  { name: "Front end Issues", role: "Acme Inc Team", color: "bg-rose-500" },
]

const recentActivity = [
  {
    id: 1,
    user: "Antony Hopkins",
    avatar: "AH",
    action: "sent an email",
    detail: "Get an email for previous year sale report",
    time: "1h ago",
    color: "bg-primary",
  },
  {
    id: 2,
    user: "Emma archived a board",
    avatar: "EA",
    action: "",
    detail: "A finished project's board is archived recently",
    time: "4h ago",
    color: "bg-emerald-500",
  },
  {
    id: 3,
    user: "Acme Inc v3.0 released with new features",
    avatar: "F",
    action: "",
    detail: "Acme Inc new version is released successfully with new dashboard",
    time: "6h ago",
    color: "bg-amber-500",
  },
  {
    id: 4,
    user: "Rowan shared a link to the board",
    avatar: "RS",
    action: "",
    detail: "A link is shared with attachments",
    time: "8h ago",
    color: "bg-rose-500",
  },
  {
    id: 5,
    user: "Anna updated a file",
    avatar: "AU",
    action: "",
    detail: "I just fixed bugs and spelling errors on the update",
    time: "12h ago",
    color: "bg-sky-500",
  },
]

const memberInfo = [
  { name: "Gavin Belson", role: "Team Manager", attendance: 88, today: 67, thisWeek: [60, 80, 45, 90, 70, 85, 75] },
  { name: "Rossa Hanneman", role: "Project Leadership", attendance: 92, today: 82, thisWeek: [70, 90, 60, 85, 75, 80, 95] },
  { name: "Peter Gregory", role: "Development", attendance: 75, today: 57, thisWeek: [50, 60, 80, 70, 55, 90, 65] },
  { name: "Jean Yang", role: "QA & Testing", attendance: 95, today: 91, thisWeek: [85, 90, 95, 80, 88, 92, 87] },
  { name: "Laurie Bream", role: "Marketing", attendance: 82, today: 78, thisWeek: [65, 75, 80, 70, 85, 60, 90] },
  { name: "Monica Moyer", role: "UI/UX Creative Design", attendance: 71, today: 63, thisWeek: [55, 70, 60, 80, 65, 75, 50] },
]

const membersActivity = [
  { name: "Chander Bing", progress1: 25, progress2: 67, bars: [40, 80, 55, 90, 70, 65, 85] },
  { name: "Janad Quinn", progress1: 45, progress2: 87, bars: [60, 70, 85, 50, 90, 75, 65] },
  { name: "Monica Geller", progress1: 57, progress2: 69, bars: [75, 55, 80, 65, 70, 90, 60] },
]

const runningProjects = [
  { name: "CRM Dashboard Design", category: "Acme", worked: "11h 34m 08s", progress: 70, due: "01/02/27", members: ["CD", "AB", "EF"] },
  { name: "UI/UX Redesign", category: "Acme", worked: "11h 30m 08s", progress: 55, due: "04/03/27", members: ["GH", "IJ", "KL", "MN"] },
  { name: "F.A.Q Section", category: "Acme", worked: "2h 20m 52s", progress: 30, due: "01/02/22", members: ["OP", "QR"] },
  { name: "Drip Campaign Feature", category: "Acme", worked: "11h 36m 08s", progress: 45, due: "23/03/23", members: ["ST", "UV"] },
  { name: "Studio Recording", category: "Acme", worked: "11h 10m 08s", progress: 85, due: "28/02/27", members: ["WX", "YZ"] },
  { name: "Project Management", category: "Acme", worked: "11h 34m 08s", progress: 60, due: "08/01/28", members: ["AB", "CD", "EF", "GH"] },
]

const upcomingEvents = [
  { title: "Monthly team meeting for Acme Inc React Project", date: "07 Feb, 2026 - 13 Feb, 2026", color: "bg-primary" },
  { title: "Newmarket Nights", date: "10 Feb, 2026", color: "bg-rose-500" },
  { title: "Folk Festival", date: "12 Feb, 2026 - 13 Feb, 2026", color: "bg-emerald-500" },
  { title: "Film Festival", date: "07 Feb, 2026 - 13 Feb, 2026", color: "bg-amber-500" },
]

const initialTodoList = [
  { id: 1, text: "Design a facebook ad", done: false, priority: "high" as const },
  { id: 2, text: "Analyze data", done: false, priority: "medium" as const },
  { id: 3, text: "Youtube campaign", done: false, priority: "low" as const },
  { id: 4, text: "Assign 10 employees", done: false, priority: "medium" as const },
  { id: 5, text: "Meeting at 12", done: false, priority: "high" as const },
  { id: 6, text: "Meeting at 16", done: false, priority: "low" as const },
]

const teamPieData = [
  { name: "Completed", value: 75 },
  { name: "In Progress", value: 15 },
  { name: "Remaining", value: 10 },
]
const teamPieColors = ["var(--color-primary)", "var(--color-chart-2)", "var(--color-muted)"]

// Event dates for calendar highlighting
const eventDates = [
  new Date(2026, 1, 7),
  new Date(2026, 1, 10),
  new Date(2026, 1, 12),
  new Date(2026, 1, 13),
  new Date(2026, 1, 17),
  new Date(2026, 1, 25),
  new Date(2026, 1, 26),
  new Date(2026, 1, 27),
]

// Animated counter hook
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
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

  return { count, ref }
}

// ── Component ──────────────────────────────────────
export default function DashboardPage() {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date())
  const [todoItems, setTodoItems] = useState(initialTodoList)
  const today = new Date()

  const toggleTodo = useCallback((id: number) => {
    setTodoItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }, [])

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ─── Row 1: Welcome + Team Progress + Announcement ─── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Welcome Banner */}
        <Card className="lg:col-span-5 border-primary/20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, color-mix(in oklch, var(--primary), transparent 92%) 0%, transparent 50%), var(--card)' }}>
          {/* Decorative background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-gradient-primary">
              Welcome to Acme Inc!
            </h2>
            <p className="text-[12px] text-muted-foreground mt-1">
              Here are some quick links for you to start
            </p>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
              <QuickLink icon={<Zap className="size-4" />} label="General" description="Customize with a few clicks" />
              <QuickLink icon={<TrendingUp className="size-4" />} label="Upgrade to pro" description="Try for 14 days free" />
              <QuickLink icon={<Video className="size-4" />} label="Create a meeting" description="Schedule meetings easily" />
              <QuickLink icon={<UserPlus className="size-4" />} label="Members activity" description="All members & activities" />
            </div>
          </CardContent>
        </Card>

        {/* Team Progress */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Team Progress
              </CardTitle>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                Report <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              See team members' time worked, activity levels, and progress
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center py-2">
              <div className="relative size-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={54}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {teamPieData.map((_, idx) => (
                        <Cell key={idx} fill={teamPieColors[idx]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-foreground">75%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-1">
              {teamPieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full" style={{ backgroundColor: teamPieColors[idx] }} />
                  <span className="text-[10px] text-muted-foreground">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Discussion / Announcement */}
        <Card className="lg:col-span-3 bg-card border border-border">
          <CardContent className="p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Upcoming schedule</p>
              <h3 className="text-sm font-semibold text-primary mt-1">
                Acme Inc discussion
              </h3>
              <Badge className="mt-2 bg-primary/10 text-primary border-0 text-[10px]">
                <CalendarDays className="size-3 mr-1" /> 09 MAR
              </Badge>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                The very first general meeting for planning future design and development activities.
              </p>
            </div>
            <Button size="sm" className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8">
              <Video className="size-3 mr-1.5" /> Join meeting
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ─── Row 2: Stats + Project Statistics ─── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Customer & Orders Stats */}
        <div className="lg:col-span-5 grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Customers"
            value="58.39k"
            change="+26.5%"
            trend="up"
            badgeText="daily"
            chartColor="var(--color-primary)"
          />
          <StatCard
            label="Orders"
            value="23.43k"
            change="+13.2%"
            trend="up"
            badgeText="daily"
            chartColor="var(--color-chart-2)"
          />
          <StatCard
            label="Revenue"
            value="12.84k"
            change="+6.8%"
            trend="up"
            badgeText="weekly"
            chartColor="var(--color-chart-3)"
          />
          <StatCard
            label="Bounce Rate"
            value="3.19k"
            change="-2.3%"
            trend="down"
            badgeText="monthly"
            chartColor="var(--color-chart-4)"
          />
        </div>

        {/* Project Statistics */}
        <Card className="lg:col-span-7 bg-card border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Project Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold text-foreground tracking-tight">5,432</p>
                <p className="text-[11px] text-muted-foreground">Total Work Hours</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground tracking-tight">13</p>
                <p className="text-[11px] text-muted-foreground">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground tracking-tight">7</p>
                <p className="text-[11px] text-muted-foreground">Ongoing</p>
              </div>
            </div>
            <div className="flex gap-1 w-full h-2 rounded-full overflow-hidden mb-4">
              <div className="bg-primary h-full rounded-l-full" style={{ width: "25%" }} />
              <div className="bg-emerald-500 h-full" style={{ width: "40%" }} />
              <div className="bg-amber-500 h-full" style={{ width: "18%" }} />
              <div className="bg-rose-500 h-full rounded-r-full" style={{ width: "17%" }} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-[11px] text-muted-foreground mr-1">Assignees in Sprint</p>
              <div className="flex -space-x-2">
                {["AH", "BK", "CM", "DL", "EJ", "FK"].map((initials) => (
                  <Avatar key={initials} className="size-7 border-2 border-background">
                    <AvatarFallback className="text-[9px] bg-secondary text-muted-foreground">{initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                <span>Project</span>
                <span>Team</span>
              </div>
              {projectList.map((project) => (
                <div key={project.name} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <Circle className={`size-2.5 ${project.color} rounded-full fill-current`} />
                    <span className="text-[12px] text-card-foreground">{project.name}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{project.role}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Row 3: Weekly Report + Recent Activity ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Report Chart */}
        <Card className="lg:col-span-5 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Report for this week
              </CardTitle>
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">This Week</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-2 rounded-full bg-muted-foreground/30" />
                  <span className="text-muted-foreground">Last Week</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyReport} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Bar dataKey="thisWeek" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lastWeek" fill="hsl(var(--muted-foreground) / 0.2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                See all projects <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-7 bg-card border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3 relative">
                    <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${activity.color} text-white text-[10px] font-semibold shrink-0`}>
                      {activity.avatar.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] font-medium text-card-foreground truncate">
                          {activity.user}
                        </p>
                        <span className="text-[10px] text-tertiary-foreground ml-2 shrink-0">{activity.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        {activity.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Clock className="size-3" />
                <span>Last 7 days</span>
              </div>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                Location overview <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* ─── Row 5: Member Info + Members Activity ─── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Member Info */}
        <Card className="lg:col-span-7 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Member Info
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-[11px] text-muted-foreground font-medium">Member Info</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground font-medium hidden md:table-cell">Attendance</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground font-medium">Today</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground font-medium hidden lg:table-cell">This Week</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberInfo.map((member) => (
                  <TableRow key={member.name} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8 border border-border/50">
                          <AvatarFallback className="text-[10px] bg-secondary text-muted-foreground">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[12px] font-medium text-card-foreground">{member.name}</p>
                          <p className="text-[10px] text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={member.attendance} className="h-1 w-16 bg-secondary" indicatorClassName="bg-primary" />
                        <span className="text-[11px] text-muted-foreground">{member.attendance}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-[12px] font-medium ${member.today >= 80 ? "text-emerald-500" : member.today >= 60 ? "text-amber-500" : "text-rose-500"}`}>
                        {member.today}%
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <MiniBarChart data={member.thisWeek} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Clock className="size-3" />
                <span>Last 7 days</span>
              </div>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                View All <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Members Activity */}
        <Card className="lg:col-span-5 bg-card border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Members Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {membersActivity.map((member) => (
              <div key={member.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                <Avatar className="size-10 border border-border/50 shrink-0">
                  <AvatarFallback className="text-[11px] bg-secondary text-muted-foreground">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-card-foreground">{member.name}</p>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Progress value={member.progress1} className="h-1 flex-1 bg-secondary" indicatorClassName="bg-primary" />
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{member.progress1}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={member.progress2} className="h-1 flex-1 bg-secondary" indicatorClassName="bg-emerald-500" />
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{member.progress2}%</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <MiniBarChart data={member.bars} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto w-full justify-end">
              See all projects <ChevronRight className="size-3 ml-0.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ─── Row 6: Running Projects ─── */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">
            Running Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-[11px] text-muted-foreground font-medium">Projects ↕</TableHead>
                <TableHead className="text-[11px] text-muted-foreground font-medium hidden md:table-cell">Worked ↕</TableHead>
                <TableHead className="text-[11px] text-muted-foreground font-medium">Progress ↕</TableHead>
                <TableHead className="text-[11px] text-muted-foreground font-medium hidden lg:table-cell">Due Date ↕</TableHead>
                <TableHead className="text-[11px] text-muted-foreground font-medium hidden lg:table-cell">Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runningProjects.map((project) => (
                <TableRow key={project.name} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className={`flex items-center justify-center size-8 rounded-lg text-white text-[11px] font-bold ${
                        project.name.includes("CRM") ? "bg-primary" :
                        project.name.includes("UI") ? "bg-emerald-500" :
                        project.name.includes("F.A.Q") ? "bg-amber-500" :
                        project.name.includes("Drip") ? "bg-sky-500" :
                        project.name.includes("Studio") ? "bg-rose-500" : "bg-primary"
                      }`}>
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-card-foreground">{project.name}</p>
                        <p className="text-[10px] text-muted-foreground">{project.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-[12px] text-card-foreground">{project.worked}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="h-1.5 w-24 bg-secondary" indicatorClassName={
                        project.progress >= 80 ? "bg-emerald-500" :
                        project.progress >= 50 ? "bg-primary" :
                        project.progress >= 30 ? "bg-amber-500" : "bg-rose-500"
                      } />
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-[12px] text-muted-foreground">{project.due}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex -space-x-1.5">
                      {project.members.map((m) => (
                        <Avatar key={m} className="size-6 border-2 border-background">
                          <AvatarFallback className="text-[8px] bg-secondary text-muted-foreground">{m}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-3 text-center">
            <Button variant="link" size="sm" className="text-primary text-[11px] h-auto">
              Show all projects <ChevronRight className="size-3 ml-0.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── Row 7: Calendar + Events + To-Do ─── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Calendar */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                <Plus className="size-3 mr-1" /> New Schedule
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-6 text-muted-foreground">
                  <ChevronLeft className="size-3.5" />
                </Button>
                <span className="text-[11px] text-muted-foreground font-medium">Today</span>
                <Button variant="ghost" size="icon" className="size-6 text-muted-foreground">
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex justify-center">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              className="w-full"
              modifiers={{ event: eventDates }}
              modifiersClassNames={{ event: "!bg-primary/15 !text-primary font-semibold" }}
            />
          </CardContent>
        </Card>

        {/* Events */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground">
              {today.toLocaleString("default", { month: "long", year: "numeric" })}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground">
              {today.toLocaleString("default", { weekday: "long" })}
            </p>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`size-2.5 rounded-full ${event.color} mt-1.5 shrink-0`} />
                <div>
                  <p className="text-[12px] font-medium text-card-foreground leading-snug">{event.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{event.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* To-Do List */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-card-foreground">To Do List</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            {todoItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between py-2 border-b border-border last:border-0 transition-opacity duration-200 ${item.done ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="size-3.5 rounded border-border accent-primary cursor-pointer"
                    checked={item.done}
                    onChange={() => toggleTodo(item.id)}
                  />
                  <span className={`text-[12px] transition-all duration-200 ${item.done ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                    {item.text}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-[9px] px-1.5 py-0 h-4 font-normal capitalize border-0 ${
                    item.priority === "high"
                      ? "bg-rose-500/10 text-rose-500"
                      : item.priority === "medium"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <ArrowUpRight className="size-2.5 mr-0.5" />
                </Badge>
              </div>
            ))}
            <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto w-full justify-start mt-2">
              <Plus className="size-3 mr-1" /> Add New Task
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ─── Row 8: Footer ─── */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-[11px] text-muted-foreground">
          Thank you for creating with Acme Inc | 2026 © Acme
        </p>
        <p className="text-[10px] text-tertiary-foreground">v3.0.2</p>
      </div>
    </div>
  )
}

// ── Sub-Components ─────────────────────────────────

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

function StatCard({ label, value, change, trend, badgeText, chartColor }: {
  label: string; value: string; change: string; trend: "up" | "down"; badgeText: string; chartColor: string
}) {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")) * (value.includes("k") ? 1000 : 1)
  const { count } = useCountUp(numericValue)
  const displayValue = numericValue >= 1000
    ? `${(count / 1000).toFixed(count >= numericValue ? 2 : 1)}k`
    : count.toString()

  const sparkData = [35, 50, 40, 60, 45, 70, 55, 80, 60, 90, 65, 85].map((v, i) => ({ i, v }))

  return (
    <Card className="bg-card border border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-card-foreground">{label}</p>
          <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary border-0 h-4 px-1.5">
            {badgeText}
          </Badge>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{displayValue}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <div className={`flex items-center gap-0.5 text-[11px] font-medium ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
            {trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {change}
          </div>
        </div>
        {/* Area sparkline */}
        <div className="h-8 mt-2 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={chartColor} strokeWidth={1.5} fill={`url(#spark-${label})`} dot={false} />
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

function MiniBarChart({ data }: { data: number[] }) {
  return (
    <div className="flex items-end gap-0.5 h-6">
      {data.map((value, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm min-w-[3px] transition-all duration-300 ${
            value >= 80 ? "bg-emerald-500" :
            value >= 60 ? "bg-primary" :
            value >= 40 ? "bg-amber-500" : "bg-rose-400"
          }`}
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  )
}
