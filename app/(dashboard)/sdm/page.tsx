"use client"

import { useState, useEffect, useRef, useId } from "react"
import Image from "next/image"
import {
  ChevronRight,
  Clock,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  UserCheck,
  CalendarCheck,
  Wallet,
  Star,
  Briefcase,
  GraduationCap,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  ClipboardList,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

const pegawai = [
  { id: 1, nama: "Ahmad Fauzi, S.Pd.", nip: "YAM-2019-001", unit: "SMA Al Ma'soem", jabatan: "Guru Matematika", status: "aktif", masuk: "07:15", telepon: "0812-xxxx-1234" },
  { id: 2, nama: "Siti Nurhaliza, M.Pd.", nip: "YAM-2018-015", unit: "SMP Al Ma'soem", jabatan: "Wakasek Kurikulum", status: "aktif", masuk: "06:55", telepon: "0813-xxxx-5678" },
  { id: 3, nama: "Budi Santoso", nip: "YAM-2020-032", unit: "Klinik Pratama Al Ma'soem Putri Mandiri", jabatan: "Staff Administrasi", status: "aktif", masuk: "07:30", telepon: "0815-xxxx-9012" },
  { id: 4, nama: "Dewi Rahmawati, S.Kep.", nip: "YAM-2017-008", unit: "Klinik Pratama Al Ma'soem Putri Mandiri", jabatan: "Perawat Senior", status: "cuti", masuk: "-", telepon: "0821-xxxx-3456" },
  { id: 5, nama: "Rizky Pratama", nip: "YAM-2022-045", unit: "Yayasan Pusat", jabatan: "Staff IT", status: "aktif", masuk: "07:05", telepon: "0856-xxxx-7890" },
  { id: 6, nama: "Hani Mariam, S.Pd.I", nip: "YAM-2016-003", unit: "SD Al Ma'soem", jabatan: "Guru PAI", status: "aktif", masuk: "06:45", telepon: "0878-xxxx-2345" },
  { id: 7, nama: "Ade Kurniawan", nip: "YAM-2021-028", unit: "SMK Al Ma'soem", jabatan: "Guru Produktif TKJ", status: "aktif", masuk: "07:20", telepon: "0838-xxxx-6789" },
  { id: 8, nama: "Nenden Sukaesih", nip: "YAM-2015-012", unit: "Yayasan Pusat", jabatan: "Kepala HRD", status: "aktif", masuk: "06:50", telepon: "0817-xxxx-4321" },
]

const distribusiPegawai = [
  { name: "Tenaga Pendidik", value: 245, color: "var(--primary)" },
  { name: "Tenaga Kesehatan", value: 68, color: "var(--chart-2)" },
  { name: "Staff Administrasi", value: 87, color: "var(--chart-3)" },
  { name: "Pimpinan", value: 24, color: "var(--chart-4)" },
]

const kehadiranMingguan = [
  { hari: "Sen", hadir: 398, izin: 12, sakit: 8, alpha: 2 },
  { hari: "Sel", hadir: 405, izin: 8, sakit: 5, alpha: 2 },
  { hari: "Rab", hadir: 410, izin: 6, sakit: 3, alpha: 1 },
  { hari: "Kam", hadir: 395, izin: 15, sakit: 7, alpha: 3 },
  { hari: "Jum", hadir: 402, izin: 10, sakit: 5, alpha: 3 },
]

const penggajianData = [
  { id: 1, nama: "Ahmad Fauzi, S.Pd.", unit: "SMA", gajiPokok: 5200000, tunjangan: 1500000, potongan: 350000, total: 6350000 },
  { id: 2, nama: "Siti Nurhaliza, M.Pd.", unit: "SMP", gajiPokok: 6800000, tunjangan: 2200000, potongan: 520000, total: 8480000 },
  { id: 3, nama: "Budi Santoso", unit: "RS", gajiPokok: 4200000, tunjangan: 800000, potongan: 280000, total: 4720000 },
  { id: 4, nama: "Dewi Rahmawati, S.Kep.", unit: "RS", gajiPokok: 5800000, tunjangan: 1800000, potongan: 450000, total: 7150000 },
  { id: 5, nama: "Rizky Pratama", unit: "Pusat", gajiPokok: 5000000, tunjangan: 1200000, potongan: 320000, total: 5880000 },
  { id: 6, nama: "Hani Mariam, S.Pd.I", unit: "SD", gajiPokok: 5500000, tunjangan: 1600000, potongan: 380000, total: 6720000 },
]

const kinerjaPegawai = [
  { nama: "Ahmad Fauzi, S.Pd.", unit: "SMA Al Ma'soem", skor: 92, grade: "A", trend: "up" },
  { nama: "Siti Nurhaliza, M.Pd.", unit: "SMP Al Ma'soem", skor: 96, grade: "A+", trend: "up" },
  { nama: "Budi Santoso", unit: "Klinik Pratama Al Ma'soem Putri Mandiri", skor: 78, grade: "B+", trend: "stable" },
  { nama: "Dewi Rahmawati, S.Kep.", unit: "Klinik Pratama Al Ma'soem Putri Mandiri", skor: 88, grade: "A-", trend: "up" },
  { nama: "Rizky Pratama", unit: "Yayasan Pusat", skor: 85, grade: "A-", trend: "up" },
  { nama: "Hani Mariam, S.Pd.I", unit: "SD Al Ma'soem", skor: 91, grade: "A", trend: "stable" },
  { nama: "Ade Kurniawan", unit: "SMK Al Ma'soem", skor: 74, grade: "B", trend: "down" },
  { nama: "Nenden Sukaesih", unit: "Yayasan Pusat", skor: 94, grade: "A+", trend: "up" },
]

const sparklineKehadiran = [
  { v: 94 }, { v: 95 }, { v: 93 }, { v: 96 }, { v: 97 }, { v: 95 }, { v: 96 },
]
const sparklineGaji = [
  { v: 1.8 }, { v: 1.9 }, { v: 1.85 }, { v: 1.92 }, { v: 1.95 }, { v: 2.0 }, { v: 2.1 },
]
const sparklinePegawai = [
  { v: 380 }, { v: 392 }, { v: 398 }, { v: 405 }, { v: 410 }, { v: 418 }, { v: 424 },
]
const sparklineKinerja = [
  { v: 82 }, { v: 84 }, { v: 83 }, { v: 86 }, { v: 87 }, { v: 88 }, { v: 87 },
]

const recentActivity = [
  { type: "masuk", user: "Ahmad Fauzi", time: "07:15", desc: "Check-in SMA Al Ma'soem", color: "bg-emerald-500" },
  { type: "cuti", user: "Dewi Rahmawati", time: "Kemarin", desc: "Pengajuan cuti 3 hari disetujui", color: "bg-amber-500" },
  { type: "gaji", user: "Sistem", time: "01 Feb", desc: "Penggajian bulan Januari selesai diproses", color: "bg-primary" },
  { type: "baru", user: "HRD", time: "28 Jan", desc: "Pegawai baru: Ade Kurniawan (SMK)", color: "bg-sky-500" },
  { type: "kinerja", user: "Wakasek", time: "25 Jan", desc: "Evaluasi kinerja semester 1 selesai", color: "bg-rose-500" },
]

/* ─── Format Rupiah ─────────────────────────────────────── */

function formatRupiah(num: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num)
}

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

/* ─── Stat Card Component ──────────────────────────────── */

function StatCard({
  title,
  value,
  suffix,
  prefix,
  trend,
  trendValue,
  icon: Icon,
  sparkData,
  chartColor,
}: {
  title: string
  value: number
  suffix?: string
  prefix?: string
  trend: "up" | "down"
  trendValue: string
  icon: React.ComponentType<{ className?: string }>
  sparkData: { v: number }[]
  chartColor?: string
}) {
  const animatedValue = useCountUp(value)
  const gradientId = useId()
  const color = chartColor || "var(--color-primary)"

  return (
    <Card className="bg-card border border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-card-foreground">{title}</p>
          <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary border-0 h-4 px-1.5">
            monthly
          </Badge>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {prefix}{animatedValue.toLocaleString("id-ID")}{suffix}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <div className={`flex items-center gap-0.5 text-[11px] font-medium ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
            {trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {trendValue}
          </div>
        </div>
        <div className="h-8 mt-2 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${gradientId})`} dot={false} />
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

/* ─── Page ─────────────────────────────────────────────── */

export default function SDMPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPegawai = pegawai.filter(p =>
    p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.unit.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ─── Row 1: Hero + Donut + Status ─────────────────── */}
      <div className="grid gap-4 lg:grid-cols-12">

        {/* Hero Banner */}
        <Card className="lg:col-span-5 bg-gradient-to-br from-primary/8 via-primary/3 to-background border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardContent className="p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/90 shrink-0 overflow-hidden border border-white/20 shadow-sm">
                <Image src="/images/yab.png" alt="Yayasan Al Ma'soem Bandung" width={48} height={48} className="size-8 object-contain" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Manajemen SDM
                </h2>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Yayasan Al Ma'soem Bandung · Fase 1
                </p>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
              <QuickLink icon={<UserPlus className="size-4" />} label="Tambah Pegawai" description="Daftarkan pegawai baru" />
              <QuickLink icon={<CalendarCheck className="size-4" />} label="Kehadiran" description="Monitor absensi harian" />
              <QuickLink icon={<Wallet className="size-4" />} label="Penggajian" description="Proses slip gaji" />
              <QuickLink icon={<Star className="size-4" />} label="Kinerja" description="Evaluasi performa" />
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">Distribusi Pegawai</CardTitle>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                Report <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">Per kategori kepegawaian</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="relative size-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribusiPegawai}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {distribusiPegawai.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">424</span>
                </div>
              </div>
              <div className="grid gap-1.5 flex-1">
                {distribusiPegawai.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium tabular-nums text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card — Today */}
        <Card className="lg:col-span-3 bg-card border border-border">
          <CardContent className="p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Kehadiran hari ini</p>
              <h3 className="text-sm font-semibold text-primary mt-1">
                12 Februari 2026
              </h3>
              <div className="text-center mt-3">
                <p className="text-3xl font-bold text-foreground">96.2%</p>
                <p className="text-xs text-muted-foreground mt-1">408 / 424 pegawai</p>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              {[
                { label: "Hadir", value: 408, color: "bg-emerald-500" },
                { label: "Izin", value: 8, color: "bg-amber-500" },
                { label: "Sakit", value: 5, color: "bg-orange-500" },
                { label: "Alpha", value: 3, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-medium tabular-nums text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Row 2: 4 Stat Cards ──────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pegawai"
          value={424}
          trend="up"
          trendValue="+3.8%"
          icon={Users}
          sparkData={sparklinePegawai}
          chartColor="var(--color-primary)"
        />
        <StatCard
          title="Kehadiran Rata-rata"
          value={96}
          suffix="%"
          trend="up"
          trendValue="+1.2%"
          icon={CalendarCheck}
          sparkData={sparklineKehadiran}
          chartColor="var(--color-chart-2)"
        />
        <StatCard
          title="Anggaran Gaji"
          value={2100}
          prefix="Rp "
          suffix=" jt"
          trend="up"
          trendValue="+5.4%"
          icon={Wallet}
          sparkData={sparklineGaji}
          chartColor="var(--color-chart-3)"
        />
        <StatCard
          title="Skor Kinerja"
          value={87}
          suffix="/100"
          trend="up"
          trendValue="+2.3%"
          icon={Star}
          sparkData={sparklineKinerja}
          chartColor="var(--color-chart-4)"
        />
      </div>

      {/* ─── Row 3: Tabs ──────────────────────────────────── */}
      <Tabs defaultValue="direktori" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="direktori" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Users className="size-3.5 mr-1.5" />Direktori Pegawai
            </TabsTrigger>
            <TabsTrigger value="kehadiran" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <CalendarCheck className="size-3.5 mr-1.5" />Kehadiran
            </TabsTrigger>
            <TabsTrigger value="penggajian" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Wallet className="size-3.5 mr-1.5" />Penggajian
            </TabsTrigger>
            <TabsTrigger value="kinerja" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Star className="size-3.5 mr-1.5" />Kinerja
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Direktori Pegawai */}
        <TabsContent value="direktori" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Direktori Pegawai</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Seluruh pegawai yayasan dari semua unit kerja</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Cari pegawai..."
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground">
                    <Filter className="size-3.5 mr-1.5" />Filter
                  </Button>
                  <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">
                    <UserPlus className="size-3.5 mr-1.5" />Tambah
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">Pegawai</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">NIP</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">Unit Kerja</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden sm:table-cell">Jabatan</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Status</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPegawai.map((p) => (
                    <TableRow key={p.id} className="group hover:bg-muted/50 border-border transition-colors duration-150">
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8 border border-border/50">
                            <AvatarFallback className="text-[10px] bg-secondary text-muted-foreground">
                              {p.nama.split(" ").map(n => n[0]).slice(0, 2).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-[12px] font-medium text-card-foreground">{p.nama}</p>
                            <p className="text-[10px] text-muted-foreground md:hidden">{p.unit}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden md:table-cell font-mono">{p.nip}</TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden lg:table-cell">{p.unit}</TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden sm:table-cell">{p.jabatan}</TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 h-5 border-0 ${
                            p.status === "aktif"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {p.status === "aktif" ? <CheckCircle2 className="size-3 mr-1" /> : <Clock className="size-3 mr-1" />}
                          {p.status === "aktif" ? "Aktif" : "Cuti"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                            <Eye className="size-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="size-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-popover border-border">
                              <DropdownMenuItem className="text-xs"><Eye className="size-3 mr-2" />Lihat Detail</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs"><CalendarCheck className="size-3 mr-2" />Kehadiran</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs"><Wallet className="size-3 mr-2" />Slip Gaji</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
              <div className="flex items-center justify-between px-6 py-3 border-t border-border">
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

        {/* Tab: Kehadiran */}
        <TabsContent value="kehadiran" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-7 bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-sm font-medium text-card-foreground">Kehadiran Minggu Ini</CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground">Ringkasan kehadiran per hari kerja</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Hadir</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-chart-2" />
                      <span className="text-muted-foreground">Izin</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-destructive" />
                      <span className="text-muted-foreground">Alpha</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={kehadiranMingguan} barGap={4}>
                      <defs>
                        <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="hari" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "var(--popover-foreground)",
                        }}
                        cursor={{ fill: "var(--muted)" }}
                      />
                      <Bar dataKey="hadir" fill="url(#colorHadir)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="izin" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sakit" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="alpha" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    <span>Minggu ini</span>
                  </div>
                  <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                    Lihat Semua <ChevronRight className="size-3 ml-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="lg:col-span-5 bg-card border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Aktivitas Terkini
                </CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">Log kehadiran dan aktivitas SDM</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                  <div className="space-y-4">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex gap-3 relative">
                        <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${activity.color} text-white text-[10px] font-semibold shrink-0`}>
                          {activity.user.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center justify-between">
                            <p className="text-[12px] font-medium text-card-foreground truncate">
                              {activity.desc}
                            </p>
                            <span className="text-[10px] text-muted-foreground ml-2 shrink-0">{activity.time}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                            {activity.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    <span>7 hari terakhir</span>
                  </div>
                  <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                    Lihat Semua <ChevronRight className="size-3 ml-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Penggajian */}
        <TabsContent value="penggajian" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Daftar Penggajian</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Periode: Januari 2026</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground w-full sm:w-auto">
                  <Download className="size-3.5 mr-1.5" />Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">Nama Pegawai</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden sm:table-cell">Unit</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell text-right">Gaji Pokok</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell text-right">Tunjangan</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell text-right">Potongan</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {penggajianData.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/50 border-border transition-colors duration-150">
                      <TableCell className="py-3 pl-6 text-[13px] font-medium text-foreground">{p.nama}</TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden sm:table-cell">{p.unit}</TableCell>
                      <TableCell className="py-3 text-[12px] tabular-nums text-muted-foreground hidden lg:table-cell text-right">{formatRupiah(p.gajiPokok)}</TableCell>
                      <TableCell className="py-3 text-[12px] tabular-nums text-emerald-400 hidden md:table-cell text-right">+{formatRupiah(p.tunjangan)}</TableCell>
                      <TableCell className="py-3 text-[12px] tabular-nums text-red-400 hidden md:table-cell text-right">-{formatRupiah(p.potongan)}</TableCell>
                      <TableCell className="py-3 pr-6 text-[13px] font-medium font-mono tabular-nums text-foreground text-right">{formatRupiah(p.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
              <div className="flex items-center justify-between px-6 py-3 border-t border-border">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>Periode Januari 2026</span>
                </div>
                <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                  Lihat Semua <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Kinerja */}
        <TabsContent value="kinerja" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kinerjaPegawai.map((p) => (
              <Card key={p.nama} className="bg-card border border-border group hover:border-primary/30 transition-colors duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8 border border-border/50">
                        <AvatarFallback className="text-[10px] bg-secondary text-muted-foreground">
                          {p.nama.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[12px] font-medium text-card-foreground">{p.nama}</p>
                        <p className="text-[10px] text-muted-foreground">{p.unit}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs font-bold border-0 ${
                        p.skor >= 90
                          ? "bg-emerald-500/10 text-emerald-400"
                          : p.skor >= 80
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {p.grade}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Skor Kinerja</span>
                      <span className="font-semibold tabular-nums text-foreground">{p.skor}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-primary/80"
                        style={{ width: `${p.skor}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {p.trend === "up" && <TrendingUp className="size-3 text-emerald-500" />}
                      {p.trend === "down" && <TrendingDown className="size-3 text-red-500" />}
                      {p.trend === "stable" && <span className="text-muted-foreground">—</span>}
                      <span className="text-muted-foreground">
                        {p.trend === "up" ? "Meningkat" : p.trend === "down" ? "Menurun" : "Stabil"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
