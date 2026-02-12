"use client"

import { useState, useEffect, useRef, useId } from "react"
import Image from "next/image"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Wallet,
  CalendarCheck,
  Calculator,
  Mail,
  Building2,
  ChevronRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  FileCheck,
  Inbox,
  BookOpen,
  PiggyBank,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
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

const kpiData = [
  {
    module: "SDM", icon: Users, kpis: [
      { label: "Total Pegawai", value: 424, suffix: "", trend: "up" as const, trendVal: "+3.8%", color: "text-primary" },
      { label: "Kehadiran", value: 96, suffix: "%", trend: "up" as const, trendVal: "+1.2%", color: "text-emerald-500" },
      { label: "Skor Kinerja", value: 87, suffix: "/100", trend: "up" as const, trendVal: "+2.3%", color: "text-blue-500" },
    ]
  },
  {
    module: "Keuangan", icon: Wallet, kpis: [
      { label: "Saldo Kas", value: 3100, suffix: " jt", trend: "up" as const, trendVal: "+24%", color: "text-primary" },
      { label: "Pemasukan", value: 3800, suffix: " jt", trend: "up" as const, trendVal: "+8.6%", color: "text-emerald-500" },
      { label: "Realisasi", value: 72, suffix: "%", trend: "up" as const, trendVal: "+6.2%", color: "text-blue-500" },
    ]
  },
  {
    module: "Akuntansi", icon: Calculator, kpis: [
      { label: "Total Jurnal", value: 142, suffix: "", trend: "up" as const, trendVal: "+12", color: "text-primary" },
      { label: "Laba Bersih", value: 700, suffix: " jt", trend: "up" as const, trendVal: "+55.6%", color: "text-emerald-500" },
      { label: "Tutup Buku", value: 16, suffix: " hari", trend: "down" as const, trendVal: "H-16", color: "text-amber-500" },
    ]
  },
  {
    module: "Kesekretariatan", icon: Mail, kpis: [
      { label: "Surat Masuk", value: 128, suffix: "", trend: "up" as const, trendVal: "+15.3%", color: "text-primary" },
      { label: "Disposisi", value: 93, suffix: "%", trend: "up" as const, trendVal: "+1.2%", color: "text-emerald-500" },
      { label: "Dokumen Legal", value: 52, suffix: "", trend: "up" as const, trendVal: "+4", color: "text-blue-500" },
    ]
  },
]

const distribusiPegawai = [
  { name: "SD Al Ma'soem", value: 68, color: "var(--primary)" },
  { name: "SMP Al Ma'soem", value: 72, color: "var(--chart-2)" },
  { name: "SMA Al Ma'soem", value: 85, color: "var(--chart-3)" },
  { name: "SMK Al Ma'soem", value: 62, color: "var(--chart-4)" },
  { name: "Klinik Pratama", value: 68, color: "var(--chart-5)" },
  { name: "Yayasan Pusat", value: 69, color: "var(--primary)" },
]

const trendBulanan = [
  { bulan: "Jul", pendapatan: 3200, pengeluaran: 2800, pegawai: 410 },
  { bulan: "Agu", pendapatan: 3400, pengeluaran: 2900, pegawai: 412 },
  { bulan: "Sep", pendapatan: 3100, pengeluaran: 3000, pegawai: 415 },
  { bulan: "Okt", pendapatan: 3600, pengeluaran: 2850, pegawai: 418 },
  { bulan: "Nov", pendapatan: 3500, pengeluaran: 3100, pegawai: 420 },
  { bulan: "Des", pendapatan: 4200, pengeluaran: 3400, pegawai: 422 },
  { bulan: "Jan", pendapatan: 3800, pengeluaran: 3200, pegawai: 424 },
]

const unitPerformance = [
  { unit: "SD Al Ma'soem", kehadiran: 97, kinerja: 89, realisasi: 73, surat: 15 },
  { unit: "SMP Al Ma'soem", kehadiran: 96, kinerja: 91, realisasi: 65, surat: 22 },
  { unit: "SMA Al Ma'soem", kehadiran: 95, kinerja: 88, realisasi: 74, surat: 28 },
  { unit: "SMK Al Ma'soem", kehadiran: 94, kinerja: 82, realisasi: 59, surat: 18 },
  { unit: "Klinik Pratama", kehadiran: 98, kinerja: 90, realisasi: 79, surat: 25 },
  { unit: "Yayasan Pusat", kehadiran: 97, kinerja: 92, realisasi: 64, surat: 20 },
]

const alertsData = [
  { type: "urgent", module: "Kesekretariatan", desc: "Izin Operasional SD akan habis 31 Jul 2026", icon: AlertTriangle, color: "bg-red-500/10 text-red-500" },
  { type: "warning", module: "Keuangan", desc: "4 pengajuan menunggu persetujuan pimpinan", icon: Clock, color: "bg-amber-500/10 text-amber-400" },
  { type: "info", module: "Akuntansi", desc: "4 jurnal masih berstatus draft (Februari)", icon: BookOpen, color: "bg-blue-500/10 text-blue-400" },
  { type: "success", module: "SDM", desc: "Penggajian Januari selesai diproses", icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-400" },
  { type: "warning", module: "SDM", desc: "3 pegawai alpha hari ini", icon: Users, color: "bg-amber-500/10 text-amber-400" },
]

const healthScore = [
  { module: "SDM", skor: 92, fill: "var(--primary)" },
  { module: "Keuangan", skor: 88, fill: "var(--chart-2)" },
  { module: "Akuntansi", skor: 85, fill: "var(--chart-3)" },
  { module: "Kesekretariatan", skor: 90, fill: "var(--chart-4)" },
]

/* ─── QuickLink Component ──────────────────────────────── */

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

/* ─── Stat Mini ────────────────────────────────────────── */

function StatMini({ label, value, suffix, trend, trendVal, color }: {
  label: string; value: number; suffix: string; trend: "up" | "down"; trendVal: string; color: string
}) {
  const animated = useCountUp(value)
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold tabular-nums ${color}`}>
          {animated.toLocaleString("id-ID")}{suffix}
        </span>
        <Badge variant="secondary" className={`text-[9px] px-1 py-0 h-4 border-0 ${trend === "up" ? "text-emerald-400" : "text-amber-400"}`}>
          {trendVal}
        </Badge>
      </div>
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────── */

export default function ExecutiveDashboardPage() {
  const overallScore = useCountUp(89)
  const totalPegawai = useCountUp(424)
  const saldoKas = useCountUp(3100)
  const kehadiranRata = useCountUp(96)

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ─── Row 1: Hero + Overall Health + Alerts ────────── */}
      <div className="grid gap-4 lg:grid-cols-12">

        {/* Hero Banner */}
        <Card className="lg:col-span-5 bg-gradient-to-br from-primary/8 via-primary/3 to-background border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/90 shrink-0 overflow-hidden border border-white/20 shadow-sm">
                <Image src="/images/yab.png" alt="Yayasan Al Ma'soem Bandung" width={48} height={48} className="size-8 object-contain" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Dashboard Eksekutif
                </h2>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Yayasan Al Ma'soem Bandung · Ringkasan Seluruh Modul
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{totalPegawai}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Total Pegawai</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">Rp {saldoKas.toLocaleString("id-ID")} jt</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Saldo Kas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{kehadiranRata}%</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Kehadiran</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">Skor Kesehatan Organisasi</CardTitle>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                Detail <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">Gabungan seluruh modul operasional</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="relative size-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={healthScore} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="skor" strokeWidth={0}>
                      {healthScore.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">{overallScore}</span>
                </div>
              </div>
              <div className="grid gap-1.5 flex-1">
                {healthScore.map((item) => (
                  <div key={item.module} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                      <span className="text-muted-foreground">{item.module}</span>
                    </div>
                    <span className="font-medium tabular-nums text-foreground">{item.skor}/100</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="lg:col-span-3 bg-card border border-border">
          <CardContent className="p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Notifikasi & Peringatan</p>
              <h3 className="text-sm font-semibold text-primary mt-1">{alertsData.length} item perlu perhatian</h3>
            </div>
            <div className="space-y-2.5 mt-3">
              {alertsData.slice(0, 4).map((alert, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`flex size-6 items-center justify-center rounded shrink-0 mt-0.5 ${alert.color}`}>
                    <alert.icon className="size-3" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-card-foreground leading-tight">{alert.desc}</p>
                    <p className="text-[10px] text-muted-foreground">{alert.module}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-border">
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                Lihat Semua <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Row 2: 4 KPI Module Cards ────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((mod) => (
          <Card key={mod.module} className="bg-card border border-border group hover:border-primary/30 transition-colors duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                  <mod.icon className="size-4" />
                </div>
                <p className="text-sm font-semibold text-card-foreground">{mod.module}</p>
              </div>
              <div className="space-y-0.5 divide-y divide-border">
                {mod.kpis.map((kpi) => (
                  <StatMini key={kpi.label} {...kpi} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Row 3: Tabs ──────────────────────────────────── */}
      <Tabs defaultValue="trend" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="trend" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Activity className="size-3.5 mr-1.5" />Tren Bulanan
            </TabsTrigger>
            <TabsTrigger value="unit" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Building2 className="size-3.5 mr-1.5" />Per Unit Kerja
            </TabsTrigger>
            <TabsTrigger value="sdm" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Users className="size-3.5 mr-1.5" />Distribusi SDM
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Tren Bulanan */}
        <TabsContent value="trend" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Tren Pendapatan & Pengeluaran</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">7 bulan terakhir (juta Rupiah)</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary" /><span className="text-muted-foreground">Pendapatan</span></div>
                  <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-chart-3" /><span className="text-muted-foreground">Pengeluaran</span></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendBulanan}>
                    <defs>
                      <linearGradient id="gradPendapatan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradPengeluaran" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--popover-foreground)" }}
                      formatter={(value: number) => [`Rp ${value} jt`, ""]}
                      cursor={{ fill: "var(--muted)" }}
                    />
                    <Area type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="var(--primary)" strokeWidth={2} fill="url(#gradPendapatan)" />
                    <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="var(--chart-3)" strokeWidth={2} fill="url(#gradPengeluaran)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>7 bulan terakhir</span>
                </div>
                <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                  Lihat Semua <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Per Unit */}
        <TabsContent value="unit" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-card-foreground">Perbandingan Kinerja Per Unit</CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">Metrik utama dari seluruh modul per unit kerja</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-2.5 pr-4 pl-2">Unit Kerja</th>
                      <th className="text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-2.5 px-3">Kehadiran</th>
                      <th className="text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-2.5 px-3">Kinerja</th>
                      <th className="text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-2.5 px-3">Realisasi</th>
                      <th className="text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-2.5 px-3">Surat</th>
                      <th className="text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-2.5 pl-3 pr-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {unitPerformance.map((u) => {
                      const avg = Math.round((u.kehadiran + u.kinerja + u.realisasi) / 3)
                      return (
                        <tr key={u.unit} className="hover:bg-muted/50 transition-colors duration-150">
                          <td className="py-2.5 pr-4 pl-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                              <span className="font-medium text-card-foreground text-[12px]">{u.unit}</span>
                            </div>
                          </td>
                          <td className="text-center py-2.5 px-3">
                            <span className={`text-[12px] font-semibold tabular-nums ${u.kehadiran >= 96 ? "text-emerald-400" : "text-foreground"}`}>
                              {u.kehadiran}%
                            </span>
                          </td>
                          <td className="text-center py-2.5 px-3">
                            <span className={`text-[12px] font-semibold tabular-nums ${u.kinerja >= 90 ? "text-emerald-400" : u.kinerja >= 85 ? "text-blue-400" : "text-amber-400"}`}>
                              {u.kinerja}
                            </span>
                          </td>
                          <td className="text-center py-2.5 px-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${u.realisasi}%` }} />
                              </div>
                              <span className="text-[10px] tabular-nums text-muted-foreground">{u.realisasi}%</span>
                            </div>
                          </td>
                          <td className="text-center py-2.5 px-3">
                            <span className="text-[12px] tabular-nums text-muted-foreground">{u.surat}</span>
                          </td>
                          <td className="text-center py-2.5 pl-3 pr-2">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] px-1.5 py-0 h-5 border-0 ${avg >= 85 ? "bg-emerald-500/10 text-emerald-400"
                                  : avg >= 75 ? "bg-blue-500/10 text-blue-400"
                                    : "bg-amber-500/10 text-amber-400"
                                }`}
                            >
                              {avg >= 85 ? "Baik" : avg >= 75 ? "Cukup" : "Perlu Perhatian"}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>Data terkini</span>
                </div>
                <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                  Lihat Semua <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Distribusi SDM */}
        <TabsContent value="sdm" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-card border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-card-foreground">Distribusi Pegawai Per Unit</CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">Total 424 pegawai tersebar di 6 unit kerja</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distribusiPegawai} layout="vertical" barSize={20}>
                      <defs>
                        <linearGradient id="gradDistribusi" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={110} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--popover-foreground)" }}
                        formatter={(value: number) => [`${value} pegawai`, ""]}
                        cursor={{ fill: "var(--muted)" }}
                      />
                      <Bar dataKey="value" name="Pegawai" fill="url(#gradDistribusi)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    <span>Data terkini</span>
                  </div>
                  <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                    Lihat Semua <ChevronRight className="size-3 ml-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-card-foreground">Ringkasan Lintas Modul</CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">Metrik kunci dari seluruh departemen</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {[
                    { icon: Users, label: "Pegawai Aktif", value: "420 / 424", sub: "4 sedang cuti", color: "bg-primary/10 text-primary" },
                    { icon: CalendarCheck, label: "Kehadiran Hari Ini", value: "96.2%", sub: "408 hadir, 16 tidak hadir", color: "bg-emerald-500/10 text-emerald-400" },
                    { icon: PiggyBank, label: "Rasio Untung/Rugi", value: "1.19×", sub: "Pendapatan > Pengeluaran", color: "bg-blue-500/10 text-blue-400" },
                    { icon: BookOpen, label: "Jurnal Pending", value: "6 entri", sub: "4 draft + 2 review", color: "bg-amber-500/10 text-amber-400" },
                    { icon: Inbox, label: "Surat Belum Ditindaklanjuti", value: "7 surat", sub: "3 baru + 2 disposisi + 1 proses + 1 izin", color: "bg-red-500/10 text-red-500" },
                    { icon: FileCheck, label: "Dokumen Segera Perbarui", value: "1 dokumen", sub: "Izin Operasional SD (Jul 2026)", color: "bg-amber-500/10 text-amber-400" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`flex size-8 items-center justify-center rounded-md shrink-0 ${item.color}`}>
                        <item.icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-[12px] font-medium text-card-foreground">{item.label}</p>
                          <p className="text-[12px] font-bold tabular-nums text-foreground">{item.value}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
