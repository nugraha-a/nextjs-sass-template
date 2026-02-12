"use client"

import { useState, useEffect, useRef, useId } from "react"
import Image from "next/image"
import {
  ChevronRight,
  Download,
  Filter,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Calculator,
  FileText,
  BookOpen,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Printer,
  Building2,
  CheckCircle2,
  Clock,
  BarChart3,
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

const komposisiAkun = [
  { name: "Aset", value: 45, color: "var(--primary)" },
  { name: "Kewajiban", value: 20, color: "var(--chart-2)" },
  { name: "Ekuitas", value: 25, color: "var(--chart-3)" },
  { name: "Pendapatan", value: 8, color: "var(--chart-4)" },
  { name: "Beban", value: 2, color: "var(--chart-5)" },
]

const jurnalUmum = [
  { id: "JU-2026-0142", tanggal: "12 Feb 2026", keterangan: "Pembayaran gaji Januari 2026", debit: "Beban Gaji", kredit: "Kas Bank BRI", nominal: 2100000000, status: "posted", unit: "Semua" },
  { id: "JU-2026-0141", tanggal: "10 Feb 2026", keterangan: "Penerimaan SPP SMA semester genap", debit: "Kas Bank BSI", kredit: "Pendapatan SPP", nominal: 850000000, status: "posted", unit: "SMA" },
  { id: "JU-2026-0140", tanggal: "08 Feb 2026", keterangan: "Pengadaan buku ajar SD", debit: "Persediaan Buku", kredit: "Kas Kecil", nominal: 45000000, status: "draft", unit: "SD" },
  { id: "JU-2026-0139", tanggal: "07 Feb 2026", keterangan: "Pembayaran listrik & air Januari", debit: "Beban Utilitas", kredit: "Kas Bank BRI", nominal: 85000000, status: "posted", unit: "Semua" },
  { id: "JU-2026-0138", tanggal: "05 Feb 2026", keterangan: "Penerimaan donasi yayasan", debit: "Kas Bank BSI", kredit: "Pendapatan Donasi", nominal: 250000000, status: "posted", unit: "Pusat" },
  { id: "JU-2026-0137", tanggal: "03 Feb 2026", keterangan: "Pembelian alat medis UGD", debit: "Peralatan Medis", kredit: "Hutang Usaha", nominal: 420000000, status: "review", unit: "RS" },
  { id: "JU-2026-0136", tanggal: "01 Feb 2026", keterangan: "Penyusutan aset tetap Januari", debit: "Beban Penyusutan", kredit: "Akumulasi Penyusutan", nominal: 125000000, status: "posted", unit: "Semua" },
]

const laporanBulanan = [
  { bulan: "Jul", pendapatan: 3200, beban: 2650, laba: 550 },
  { bulan: "Agu", pendapatan: 3400, beban: 2800, laba: 600 },
  { bulan: "Sep", pendapatan: 3100, beban: 2750, laba: 350 },
  { bulan: "Okt", pendapatan: 3600, beban: 2900, laba: 700 },
  { bulan: "Nov", pendapatan: 3500, beban: 3050, laba: 450 },
  { bulan: "Des", pendapatan: 4200, beban: 3200, laba: 1000 },
  { bulan: "Jan", pendapatan: 3800, beban: 3100, laba: 700 },
]

const neracaData = {
  aset: [
    { akun: "Kas & Setara Kas", saldo: 3100000000 },
    { akun: "Piutang SPP", saldo: 420000000 },
    { akun: "Persediaan", saldo: 185000000 },
    { akun: "Aset Tetap (Netto)", saldo: 28500000000 },
    { akun: "Aset Lainnya", saldo: 350000000 },
  ],
  kewajiban: [
    { akun: "Hutang Usaha", saldo: 680000000 },
    { akun: "Hutang Pajak", saldo: 145000000 },
    { akun: "Pendapatan Diterima Dimuka", saldo: 920000000 },
    { akun: "Kewajiban Jangka Panjang", saldo: 2500000000 },
  ],
  ekuitas: [
    { akun: "Modal Yayasan", saldo: 25000000000 },
    { akun: "Saldo Laba Ditahan", saldo: 3310000000 },
  ],
}

const sparklineJurnal = [{ v: 120 }, { v: 135 }, { v: 128 }, { v: 142 }, { v: 138 }, { v: 145 }, { v: 142 }]
const sparklinePendapatan = [{ v: 3.2 }, { v: 3.4 }, { v: 3.1 }, { v: 3.6 }, { v: 3.5 }, { v: 4.2 }, { v: 3.8 }]
const sparklineBeban = [{ v: 2.65 }, { v: 2.8 }, { v: 2.75 }, { v: 2.9 }, { v: 3.05 }, { v: 3.2 }, { v: 3.1 }]
const sparklineLaba = [{ v: 550 }, { v: 600 }, { v: 350 }, { v: 700 }, { v: 450 }, { v: 1000 }, { v: 700 }]

/* ─── Format ────────────────────────────────────────────── */

function formatRupiah(num: number) {
  if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)} M`
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)} jt`
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num)
}

function formatFull(num: number) {
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

function StatCard({ title, value, suffix, prefix, trend, trendValue, chartColor, sparkData }: {
  title: string; value: number; suffix?: string; prefix?: string; trend: "up" | "down"; trendValue: string; chartColor?: string; sparkData: { v: number }[]
}) {
  const animatedValue = useCountUp(value)
  const gradientId = useId()
  const color = chartColor || "var(--color-primary)"

  return (
    <Card className="bg-card border border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-card-foreground">{title}</p>
          <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary border-0 h-4 px-1.5">monthly</Badge>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{prefix}{animatedValue.toLocaleString("id-ID")}{suffix}</p>
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

export default function AkuntansiPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredJurnal = jurnalUmum.filter(j =>
    j.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.debit.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalAset = neracaData.aset.reduce((s, a) => s + a.saldo, 0)
  const totalKewajiban = neracaData.kewajiban.reduce((s, a) => s + a.saldo, 0)
  const totalEkuitas = neracaData.ekuitas.reduce((s, a) => s + a.saldo, 0)

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
                  Manajemen Akuntansi
                </h2>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Yayasan Al Ma'soem Bandung · Fase 1
                </p>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
              <QuickLink icon={<Plus className="size-4" />} label="Jurnal Baru" description="Buat entri jurnal baru" />
              <QuickLink icon={<FileText className="size-4" />} label="Laporan Keuangan" description="Download laporan keuangan" />
              <QuickLink icon={<BookOpen className="size-4" />} label="Buku Besar" description="Lihat detail buku besar" />
              <QuickLink icon={<Scale className="size-4" />} label="Neraca" description="Neraca saldo terbaru" />
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">Komposisi Akun</CardTitle>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                Report <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">Distribusi Chart of Accounts</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="relative size-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={komposisiAkun} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {komposisiAkun.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">100%</span>
                </div>
              </div>
              <div className="grid gap-1.5 flex-1">
                {komposisiAkun.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium tabular-nums text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="lg:col-span-3 bg-card border border-border">
          <CardContent className="p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status tutup buku</p>
              <h3 className="text-sm font-semibold text-primary mt-1">Periode Februari 2026</h3>
              <div className="text-center mt-3">
                <p className="text-3xl font-bold text-foreground">H-16</p>
                <p className="text-xs text-muted-foreground mt-1">Tenggat tutup buku bulanan</p>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              {[
                { label: "Jurnal Posted", value: "138", color: "bg-emerald-500" },
                { label: "Jurnal Draft", value: "4", color: "bg-amber-500" },
                { label: "Menunggu Review", value: "2", color: "bg-blue-500" },
                { label: "Rekonsiliasi", value: "Selesai", color: "bg-primary" },
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
        <StatCard title="Total Jurnal" value={142} suffix=" entri" trend="up" trendValue="+12" sparkData={sparklineJurnal} chartColor="var(--color-primary)" />
        <StatCard title="Total Pendapatan" value={3800} prefix="Rp " suffix=" jt" trend="up" trendValue="+8.6%" sparkData={sparklinePendapatan} chartColor="var(--color-chart-2)" />
        <StatCard title="Total Beban" value={3100} prefix="Rp " suffix=" jt" trend="up" trendValue="+3.1%" sparkData={sparklineBeban} chartColor="var(--color-chart-3)" />
        <StatCard title="Laba Bersih" value={700} prefix="Rp " suffix=" jt" trend="up" trendValue="+55.6%" sparkData={sparklineLaba} chartColor="var(--color-chart-4)" />
      </div>

      {/* ─── Row 3: Tabs ──────────────────────────────────── */}
      <Tabs defaultValue="jurnal" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="jurnal" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <BookOpen className="size-3.5 mr-1.5" />Jurnal Umum
            </TabsTrigger>
            <TabsTrigger value="laporan" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <BarChart3 className="size-3.5 mr-1.5" />Laporan Keuangan
            </TabsTrigger>
            <TabsTrigger value="neraca" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Scale className="size-3.5 mr-1.5" />Neraca
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Jurnal Umum */}
        <TabsContent value="jurnal" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Jurnal Umum</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Seluruh entri jurnal akuntansi yayasan</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Cari jurnal..."
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground">
                    <Filter className="size-3.5 mr-1.5" />Filter
                  </Button>
                  <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="size-3.5 mr-1.5" />Jurnal Baru
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">No. Jurnal</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">Tanggal</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Keterangan</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">Debit</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">Kredit</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 text-right">Nominal</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJurnal.map((j) => (
                    <TableRow key={j.id} className="group hover:bg-muted/50 border-border transition-colors duration-150">
                      <TableCell className="py-3 pl-6">
                        <span className="text-[12px] font-mono text-primary font-medium">{j.id}</span>
                      </TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden lg:table-cell">{j.tanggal}</TableCell>
                      <TableCell className="py-3">
                        <div>
                          <p className="text-[12px] font-medium text-card-foreground">{j.keterangan}</p>
                          <p className="text-[10px] text-muted-foreground lg:hidden">{j.tanggal}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden md:table-cell">{j.debit}</TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden md:table-cell">{j.kredit}</TableCell>
                      <TableCell className="py-3 text-[13px] font-semibold tabular-nums text-foreground text-right">
                        {formatRupiah(j.nominal)}
                      </TableCell>
                      <TableCell className="py-3 pr-6">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 h-5 border-0 ${
                            j.status === "posted" ? "bg-emerald-500/10 text-emerald-400"
                            : j.status === "draft" ? "bg-amber-500/10 text-amber-400"
                            : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {j.status === "posted" ? "Posted" : j.status === "draft" ? "Draft" : "Review"}
                        </Badge>
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

        {/* Tab: Laporan Keuangan */}
        <TabsContent value="laporan" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-7 bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-sm font-medium text-card-foreground">Laba Rugi 7 Bulan Terakhir</CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground">Pendapatan, beban, dan laba bersih (juta Rupiah)</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary" /><span className="text-muted-foreground">Pendapatan</span></div>
                    <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-chart-3" /><span className="text-muted-foreground">Beban</span></div>
                    <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-chart-2" /><span className="text-muted-foreground">Laba</span></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={laporanBulanan} barGap={2}>
                      <defs>
                        <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.3} />
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
                      <Bar dataKey="pendapatan" name="Pendapatan" fill="url(#colorPendapatan)" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="beban" name="Beban" fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="laba" name="Laba Bersih" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
                    </BarChart>
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

            {/* Available Reports */}
            <Card className="lg:col-span-5 bg-card border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-card-foreground">Laporan Tersedia</CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">Klik untuk melihat atau unduh</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {[
                    { nama: "Laporan Laba Rugi", periode: "Jan 2026", icon: FileText, status: "ready" },
                    { nama: "Neraca", periode: "Jan 2026", icon: Scale, status: "ready" },
                    { nama: "Arus Kas", periode: "Jan 2026", icon: ArrowUpRight, status: "ready" },
                    { nama: "Laporan Laba Rugi", periode: "Feb 2026", icon: FileText, status: "draft" },
                    { nama: "Neraca", periode: "Feb 2026", icon: Scale, status: "draft" },
                  ].map((lap, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-150 cursor-pointer group">
                      <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                        <lap.icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-card-foreground">{lap.nama}</p>
                        <p className="text-[10px] text-muted-foreground">{lap.periode}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 h-5 border-0 ${
                          lap.status === "ready" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {lap.status === "ready" ? "Siap" : "Draft"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Printer className="size-3" />
                    <span>5 laporan</span>
                  </div>
                  <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                    Lihat Semua <ChevronRight className="size-3 ml-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Neraca */}
        <TabsContent value="neraca" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Aset */}
            <Card className="bg-card border border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-card-foreground">Aset</CardTitle>
                  <p className="text-[13px] font-bold tabular-nums text-foreground">{formatFull(totalAset)}</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableBody>
                    {neracaData.aset.map((a) => (
                      <TableRow key={a.akun} className="hover:bg-muted/50 border-border">
                        <TableCell className="text-[12px] text-card-foreground py-2.5 pl-6">{a.akun}</TableCell>
                        <TableCell className="text-[12px] font-medium tabular-nums text-foreground text-right pr-6">{formatFull(a.saldo)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Kewajiban & Ekuitas */}
            <div className="space-y-4">
              <Card className="bg-card border border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-card-foreground">Kewajiban</CardTitle>
                    <p className="text-[13px] font-bold tabular-nums text-foreground">{formatFull(totalKewajiban)}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableBody>
                      {neracaData.kewajiban.map((k) => (
                        <TableRow key={k.akun} className="hover:bg-muted/50 border-border">
                          <TableCell className="text-[12px] text-card-foreground py-2.5 pl-6">{k.akun}</TableCell>
                          <TableCell className="text-[12px] font-medium tabular-nums text-foreground text-right pr-6">{formatFull(k.saldo)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-card-foreground">Ekuitas</CardTitle>
                    <p className="text-[13px] font-bold tabular-nums text-foreground">{formatFull(totalEkuitas)}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableBody>
                      {neracaData.ekuitas.map((e) => (
                        <TableRow key={e.akun} className="hover:bg-muted/50 border-border">
                          <TableCell className="text-[12px] text-card-foreground py-2.5 pl-6">{e.akun}</TableCell>
                          <TableCell className="text-[12px] font-medium tabular-nums text-foreground text-right pr-6">{formatFull(e.saldo)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Balance check */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <span className="text-[13px] font-medium text-foreground">Neraca Seimbang</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Aset = Kewajiban + Ekuitas
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
