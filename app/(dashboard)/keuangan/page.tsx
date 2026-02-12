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
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  PiggyBank,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  Building2,
  ClipboardCheck,
  BarChart3,
  CalendarDays,
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

const kategoriPengeluaran = [
  { name: "Gaji & Tunjangan", value: 2100, color: "var(--primary)" },
  { name: "Operasional", value: 680, color: "var(--chart-2)" },
  { name: "Pendidikan", value: 450, color: "var(--chart-3)" },
  { name: "Infrastruktur", value: 320, color: "var(--chart-4)" },
  { name: "Kesehatan", value: 280, color: "var(--chart-5)" },
]

const arusKasBulanan = [
  { bulan: "Jul", masuk: 3200, keluar: 2800 },
  { bulan: "Agu", masuk: 3400, keluar: 2900 },
  { bulan: "Sep", masuk: 3100, keluar: 3000 },
  { bulan: "Okt", masuk: 3600, keluar: 2850 },
  { bulan: "Nov", masuk: 3500, keluar: 3100 },
  { bulan: "Des", masuk: 4200, keluar: 3400 },
  { bulan: "Jan", masuk: 3800, keluar: 3200 },
]

const transaksiTerbaru = [
  { id: 1, desc: "Pembayaran gaji bulan Januari", kategori: "Gaji", tipe: "keluar", jumlah: 2100000000, tanggal: "01 Feb 2026", status: "selesai", unit: "Semua Unit", color: "bg-primary" },
  { id: 2, desc: "SPP siswa SMA semester genap", kategori: "SPP", tipe: "masuk", jumlah: 850000000, tanggal: "05 Feb 2026", status: "selesai", unit: "SMA Al Ma'soem", color: "bg-emerald-500" },
  { id: 3, desc: "Pengadaan buku ajar SD", kategori: "Pendidikan", tipe: "keluar", jumlah: 45000000, tanggal: "08 Feb 2026", status: "proses", unit: "SD Al Ma'soem", color: "bg-amber-500" },
  { id: 4, desc: "Perawatan fasilitas RS", kategori: "Infrastruktur", tipe: "keluar", jumlah: 120000000, tanggal: "10 Feb 2026", status: "menunggu", unit: "Klinik Pratama Al Ma'soem Putri Mandiri", color: "bg-sky-500" },
  { id: 5, desc: "Donasi yayasan", kategori: "Donasi", tipe: "masuk", jumlah: 250000000, tanggal: "11 Feb 2026", status: "selesai", unit: "Yayasan Pusat", color: "bg-rose-500" },
  { id: 6, desc: "Biaya listrik dan air", kategori: "Operasional", tipe: "keluar", jumlah: 85000000, tanggal: "12 Feb 2026", status: "selesai", unit: "Semua Unit", color: "bg-primary" },
]

const anggaranPerUnit = [
  { unit: "SMA Al Ma'soem", pagu: 1200, realisasi: 890, persen: 74 },
  { unit: "SMP Al Ma'soem", pagu: 950, realisasi: 620, persen: 65 },
  { unit: "SD Al Ma'soem", pagu: 800, realisasi: 580, persen: 73 },
  { unit: "SMK Al Ma'soem", pagu: 700, realisasi: 410, persen: 59 },
  { unit: "Klinik Pratama Al Ma'soem Putri Mandiri", pagu: 1500, realisasi: 1180, persen: 79 },
  { unit: "Yayasan Pusat", pagu: 500, realisasi: 320, persen: 64 },
]

const persetujuanPending = [
  { id: 1, desc: "Pengadaan komputer lab SMK", pengaju: "Ade Kurniawan", jumlah: 180000000, tanggal: "10 Feb 2026", prioritas: "tinggi" },
  { id: 2, desc: "Renovasi musholla SMP", pengaju: "Siti Nurhaliza", jumlah: 95000000, tanggal: "09 Feb 2026", prioritas: "sedang" },
  { id: 3, desc: "Pelatihan guru SD", pengaju: "Hani Mariam", jumlah: 35000000, tanggal: "08 Feb 2026", prioritas: "rendah" },
  { id: 4, desc: "Alat medis unit gawat darurat", pengaju: "Dr. Rahmat", jumlah: 420000000, tanggal: "07 Feb 2026", prioritas: "tinggi" },
]

const sparklineMasuk = [{ v: 3.2 }, { v: 3.4 }, { v: 3.1 }, { v: 3.6 }, { v: 3.5 }, { v: 4.2 }, { v: 3.8 }]
const sparklineKeluar = [{ v: 2.8 }, { v: 2.9 }, { v: 3.0 }, { v: 2.85 }, { v: 3.1 }, { v: 3.4 }, { v: 3.2 }]
const sparklineSaldo = [{ v: 1.8 }, { v: 2.0 }, { v: 1.9 }, { v: 2.3 }, { v: 2.5 }, { v: 2.8 }, { v: 3.1 }]
const sparklineRealisasi = [{ v: 45 }, { v: 52 }, { v: 58 }, { v: 62 }, { v: 66 }, { v: 70 }, { v: 72 }]

/* ─── Format Rupiah ─────────────────────────────────────── */

function formatRupiah(num: number) {
  if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)} M`
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)} jt`
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

export default function KeuanganPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransaksi = transaksiTerbaru.filter(t =>
    t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.unit.toLowerCase().includes(searchQuery.toLowerCase())
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
                  Manajemen Keuangan
                </h2>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Yayasan Al Ma'soem Bandung · Fase 1
                </p>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
              <QuickLink icon={<Plus className="size-4" />} label="Transaksi Baru" description="Catat pemasukan/pengeluaran" />
              <QuickLink icon={<Receipt className="size-4" />} label="Laporan Arus Kas" description="Download laporan keuangan" />
              <QuickLink icon={<ClipboardCheck className="size-4" />} label="Review Anggaran" description="Pantau realisasi anggaran" />
              <QuickLink icon={<CalendarDays className="size-4" />} label="Jadwal Pembayaran" description="Pembayaran mendatang" />
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">Kategori Pengeluaran</CardTitle>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                Report <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">Distribusi anggaran tahun berjalan</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="relative size-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={kategoriPengeluaran} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {kategoriPengeluaran.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">3,8M</span>
                </div>
              </div>
              <div className="grid gap-1.5 flex-1">
                {kategoriPengeluaran.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium tabular-nums text-foreground">Rp {item.value} jt</span>
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
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Saldo kas saat ini</p>
              <h3 className="text-sm font-semibold text-primary mt-1">Per 12 Februari 2026</h3>
              <div className="text-center mt-3">
                <p className="text-3xl font-bold text-foreground">Rp 3,1 M</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-500 font-medium">+Rp 600 jt</span> dari bulan lalu
                </p>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              {[
                { label: "Kas Bank BRI", value: "Rp 1,8 M", color: "bg-primary" },
                { label: "Kas Bank BSI", value: "Rp 920 jt", color: "bg-chart-2" },
                { label: "Kas Kecil", value: "Rp 380 jt", color: "bg-chart-3" },
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
        <StatCard title="Total Pemasukan" value={3800} prefix="Rp " suffix=" jt" trend="up" trendValue="+8.6%" sparkData={sparklineMasuk} chartColor="var(--color-primary)" />
        <StatCard title="Total Pengeluaran" value={3200} prefix="Rp " suffix=" jt" trend="up" trendValue="+3.1%" sparkData={sparklineKeluar} chartColor="var(--color-chart-2)" />
        <StatCard title="Saldo Kas" value={3100} prefix="Rp " suffix=" jt" trend="up" trendValue="+24%" sparkData={sparklineSaldo} chartColor="var(--color-chart-3)" />
        <StatCard title="Realisasi Anggaran" value={72} suffix="%" trend="up" trendValue="+6.2%" sparkData={sparklineRealisasi} chartColor="var(--color-chart-4)" />
      </div>

      {/* ─── Row 3: Tabs ──────────────────────────────────── */}
      <Tabs defaultValue="ringkasan" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="ringkasan" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <BarChart3 className="size-3.5 mr-1.5" />Ringkasan
            </TabsTrigger>
            <TabsTrigger value="transaksi" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Receipt className="size-3.5 mr-1.5" />Transaksi
            </TabsTrigger>
            <TabsTrigger value="anggaran" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <ClipboardCheck className="size-3.5 mr-1.5" />Anggaran
            </TabsTrigger>
            <TabsTrigger value="persetujuan" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <FileText className="size-3.5 mr-1.5" />Persetujuan
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Ringkasan */}
        <TabsContent value="ringkasan" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-7 bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-sm font-medium text-card-foreground">Arus Kas 7 Bulan Terakhir</CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground">Perbandingan pemasukan vs pengeluaran (dalam juta Rupiah)</CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Pemasukan</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-chart-2" />
                      <span className="text-muted-foreground">Pengeluaran</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={arusKasBulanan} barGap={4}>
                      <defs>
                        <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `${v} jt`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--popover-foreground)" }}
                        formatter={(value: number) => [`Rp ${value} jt`, ""]}
                        cursor={{ fill: "var(--muted)" }}
                      />
                      <Bar dataKey="masuk" name="Pemasukan" fill="url(#colorMasuk)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="keluar" name="Pengeluaran" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
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

            {/* Expense Breakdown Donut */}
            <Card className="lg:col-span-5 bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium text-card-foreground">Rincian Pengeluaran</CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">Distribusi per kategori anggaran</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={kategoriPengeluaran} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                        {kategoriPengeluaran.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--popover-foreground)" }}
                        formatter={(value: number) => [`Rp ${value} jt`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {kategoriPengeluaran.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-[12px] text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="text-[12px] text-foreground font-medium">Rp {cat.value} jt</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Transaksi — Timeline */}
        <TabsContent value="transaksi" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Daftar Transaksi</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Seluruh transaksi keuangan yayasan</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Cari transaksi..."
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground w-full sm:w-auto">
                    <Download className="size-3.5 mr-1.5" />Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Visual Timeline */}
              <div className="relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  {filteredTransaksi.map((txn) => (
                    <div key={txn.id} className="flex gap-3 relative group">
                      <div className={`relative z-10 flex items-center justify-center size-8 rounded-full ${txn.color} text-white text-[10px] font-semibold shrink-0`}>
                        {txn.tipe === "masuk" ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-[12px] font-medium text-card-foreground truncate">{txn.desc}</p>
                            <Badge variant="secondary" className={`text-[10px] border-0 ${txn.status === "selesai" ? "bg-emerald-500/10 text-emerald-400" : txn.status === "proses" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"}`}>
                              {txn.status === "selesai" ? "Selesai" : txn.status === "proses" ? "Proses" : "Menunggu"}
                            </Badge>
                          </div>
                          <span className={`text-[13px] font-mono font-medium ml-2 shrink-0 ${txn.tipe === "masuk" ? "text-emerald-500" : "text-foreground"}`}>
                            {txn.tipe === "masuk" ? "+" : "-"}{formatRupiah(txn.jumlah)}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {txn.kategori} • {txn.tanggal} • {txn.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Eye className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Download className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>30 hari terakhir</span>
                </div>
                <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                  Lihat semua transaksi <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Anggaran */}
        <TabsContent value="anggaran" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Realisasi Anggaran per Unit</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Tahun Anggaran 2026 (dalam juta Rupiah)</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground w-full sm:w-auto">
                  <Download className="size-3.5 mr-1.5" />Import Budget
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {anggaranPerUnit.map((unit) => (
                <div key={unit.unit} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-md bg-secondary">
                        <Building2 className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{unit.unit}</p>
                        <p className="text-[11px] text-muted-foreground">Rp {unit.realisasi} jt of Rp {unit.pagu} jt</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[13px] font-medium ${unit.persen > 80 ? "text-red-400" : "text-foreground"}`}>{unit.persen}%</p>
                      <p className="text-[11px] text-muted-foreground">Rp {unit.pagu - unit.realisasi} jt sisa</p>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-primary/80"
                      style={{ width: `${unit.persen}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Persetujuan */}
        <TabsContent value="persetujuan" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-sm font-medium text-card-foreground">Antrean Persetujuan</CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">{persetujuanPending.length} pengajuan menunggu persetujuan pimpinan</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {persetujuanPending.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors duration-200">
                  <div className={`flex size-10 items-center justify-center rounded-lg shrink-0 ${
                    item.prioritas === "tinggi" ? "bg-red-500/10 text-red-500" : item.prioritas === "sedang" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {item.prioritas === "tinggi" ? <AlertTriangle className="size-5" /> : <FileText className="size-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">{item.desc}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Diajukan oleh {item.pengaju} · {item.tanggal}</p>
                      </div>
                      <p className="text-[13px] font-bold tabular-nums text-foreground shrink-0">{formatRupiah(item.jumlah)}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 h-5 border-0 ${
                          item.prioritas === "tinggi" ? "bg-red-500/10 text-red-500" : item.prioritas === "sedang" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        Prioritas {item.prioritas}
                      </Badge>
                      <div className="flex-1" />
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/5">
                        <XCircle className="size-3" />Tolak
                      </Button>
                      <Button size="sm" className="h-7 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        <CheckCircle2 className="size-3" />Setujui
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
