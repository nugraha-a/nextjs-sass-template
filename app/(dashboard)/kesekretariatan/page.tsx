"use client"

import { useState, useEffect, useRef, useId } from "react"
import Image from "next/image"
import {
  ChevronRight,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Mail,
  FileCheck,
  Send,
  Inbox,
  Archive,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Stamp,
  FolderOpen,
  CalendarDays,
  BarChart3,
  FileText,
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

const kategoriSurat = [
  { name: "Surat Masuk", value: 128, color: "var(--primary)" },
  { name: "Surat Keluar", value: 95, color: "var(--chart-2)" },
  { name: "Memo Internal", value: 42, color: "var(--chart-3)" },
  { name: "SK & Keputusan", value: 18, color: "var(--chart-4)" },
]

const suratMasuk = [
  { id: "SM-2026-0285", tanggal: "12 Feb 2026", pengirim: "Dinas Pendidikan Kab. Bandung", perihal: "Undangan Rakorda Pendidikan 2026", tujuan: "Yayasan Pusat", status: "baru", prioritas: "tinggi" },
  { id: "SM-2026-0284", tanggal: "11 Feb 2026", pengirim: "Kemenag Kab. Bandung", perihal: "Verifikasi data madrasah TP 2026/2027", tujuan: "SD Al Ma'soem", status: "didisposisi", prioritas: "sedang" },
  { id: "SM-2026-0283", tanggal: "10 Feb 2026", pengirim: "PT Telkom Indonesia", perihal: "Perpanjangan kontrak internet sekolah", tujuan: "Yayasan Pusat", status: "diproses", prioritas: "sedang" },
  { id: "SM-2026-0282", tanggal: "09 Feb 2026", pengirim: "Orang Tua Wali Murid", perihal: "Permohonan keringanan SPP kelas 12", tujuan: "SMA Al Ma'soem", status: "didisposisi", prioritas: "rendah" },
  { id: "SM-2026-0281", tanggal: "08 Feb 2026", pengirim: "Dinas Kesehatan Kab. Bandung", perihal: "Jadwal imunisasi siswa SD semester 2", tujuan: "Klinik Pratama Al Ma'soem Putri Mandiri", status: "selesai", prioritas: "sedang" },
  { id: "SM-2026-0280", tanggal: "07 Feb 2026", pengirim: "Bank BSI Cabang Bandung", perihal: "Konfirmasi pembaruan rekening yayasan", tujuan: "Yayasan Pusat", status: "selesai", prioritas: "tinggi" },
]

const suratKeluar = [
  { id: "SK-2026-0198", tanggal: "12 Feb 2026", penerima: "Dinas Pendidikan Kab. Bandung", perihal: "Konfirmasi kehadiran Rakorda", pengirim: "Ketua Yayasan", status: "terkirim" },
  { id: "SK-2026-0197", tanggal: "11 Feb 2026", penerima: "Seluruh Orangtua SMP", perihal: "Pemberitahuan kegiatan class meeting", pengirim: "Kepsek SMP", status: "terkirim" },
  { id: "SK-2026-0196", tanggal: "10 Feb 2026", penerima: "PT Telkom Indonesia", perihal: "Tanggapan perpanjangan kontrak", pengirim: "Sekretaris Yayasan", status: "draft" },
  { id: "SK-2026-0195", tanggal: "09 Feb 2026", penerima: "Seluruh Guru SD", perihal: "Surat tugas pelatihan kurikulum", pengirim: "Kepsek SD", status: "terkirim" },
  { id: "SK-2026-0194", tanggal: "08 Feb 2026", penerima: "BPJS Ketenagakerjaan", perihal: "Pendaftaran peserta baru", pengirim: "HRD Yayasan", status: "terkirim" },
]

const dokumenLegal = [
  { nama: "Akta Pendirian Yayasan", nomor: "No. 27/1985", jenis: "Akta Notaris", berlaku: "Permanen", status: "aktif" },
  { nama: "SK Kemenkumham", nomor: "AHU-0012345.AH.01.04", jenis: "SK", berlaku: "Permanen", status: "aktif" },
  { nama: "Izin Operasional SMA", nomor: "420/1234/Disdik/2024", jenis: "Izin", berlaku: "31 Des 2028", status: "aktif" },
  { nama: "Izin Operasional SMP", nomor: "420/1235/Disdik/2024", jenis: "Izin", berlaku: "31 Des 2028", status: "aktif" },
  { nama: "Izin Operasional RS", nomor: "HK.02.02/I/1456/2023", jenis: "Izin", berlaku: "15 Mar 2027", status: "aktif" },
  { nama: "Sertifikat Akreditasi SMA", nomor: "A/BAN-SM/2024", jenis: "Akreditasi", berlaku: "31 Des 2029", status: "aktif" },
  { nama: "Izin Operasional SD", nomor: "420/1236/Disdik/2022", jenis: "Izin", berlaku: "31 Jul 2026", status: "segera" },
  { nama: "NPWP Yayasan", nomor: "01.234.567.8-423.000", jenis: "Pajak", berlaku: "Permanen", status: "aktif" },
]

const volumeSuratBulanan = [
  { bulan: "Agu", masuk: 95, keluar: 72 },
  { bulan: "Sep", masuk: 110, keluar: 85 },
  { bulan: "Okt", masuk: 105, keluar: 78 },
  { bulan: "Nov", masuk: 120, keluar: 90 },
  { bulan: "Des", masuk: 88, keluar: 68 },
  { bulan: "Jan", masuk: 128, keluar: 95 },
]

const sparklineMasuk = [{ v: 95 }, { v: 110 }, { v: 105 }, { v: 120 }, { v: 88 }, { v: 128 }, { v: 134 }]
const sparklineKeluar = [{ v: 72 }, { v: 85 }, { v: 78 }, { v: 90 }, { v: 68 }, { v: 95 }, { v: 98 }]
const sparklineDokumen = [{ v: 38 }, { v: 40 }, { v: 42 }, { v: 45 }, { v: 48 }, { v: 50 }, { v: 52 }]
const sparklineDisposisi = [{ v: 85 }, { v: 88 }, { v: 90 }, { v: 87 }, { v: 92 }, { v: 94 }, { v: 93 }]

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

function StatCard({ title, value, suffix, trend, trendValue, chartColor, sparkData }: {
  title: string; value: number; suffix?: string; trend: "up" | "down"; trendValue: string; chartColor?: string; sparkData: { v: number }[]
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
        <p className="text-2xl font-bold text-foreground tracking-tight">{animatedValue.toLocaleString("id-ID")}{suffix}</p>
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

export default function KesekretariatanPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSuratMasuk = suratMasuk.filter(s =>
    s.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.pengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
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
                  Kesekretariatan
                </h2>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Yayasan Al Ma'soem Bandung · Fase 1
                </p>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
              <QuickLink icon={<Inbox className="size-4" />} label="Surat Masuk" description="Catat surat masuk baru" />
              <QuickLink icon={<Send className="size-4" />} label="Surat Keluar" description="Buat dan kirim surat" />
              <QuickLink icon={<Archive className="size-4" />} label="Arsip Dokumen" description="Kelola arsip digital" />
              <QuickLink icon={<Stamp className="size-4" />} label="Disposisi" description="Agenda disposisi surat" />
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card className="lg:col-span-4 bg-card border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-card-foreground">Kategori Surat</CardTitle>
              <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                Report <ChevronRight className="size-3 ml-0.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">Distribusi surat bulan berjalan</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="relative size-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={kategoriSurat} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {kategoriSurat.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">283</span>
                </div>
              </div>
              <div className="grid gap-1.5 flex-1">
                {kategoriSurat.map((item) => (
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

        {/* Status Card */}
        <Card className="lg:col-span-3 bg-card border border-border">
          <CardContent className="p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status hari ini</p>
              <h3 className="text-sm font-semibold text-primary mt-1">12 Februari 2026</h3>
              <div className="text-center mt-3">
                <p className="text-3xl font-bold text-foreground">7</p>
                <p className="text-xs text-muted-foreground mt-1">Surat perlu ditindaklanjuti</p>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              {[
                { label: "Surat Baru", value: 3, color: "bg-primary" },
                { label: "Didisposisi", value: 2, color: "bg-amber-500" },
                { label: "Dalam Proses", value: 1, color: "bg-blue-500" },
                { label: "Jatuh Tempo Izin", value: 1, color: "bg-red-500" },
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
        <StatCard title="Surat Masuk" value={128} suffix=" surat" trend="up" trendValue="+15.3%" sparkData={sparklineMasuk} chartColor="var(--color-primary)" />
        <StatCard title="Surat Keluar" value={95} suffix=" surat" trend="up" trendValue="+8.1%" sparkData={sparklineKeluar} chartColor="var(--color-chart-2)" />
        <StatCard title="Dokumen Legal" value={52} suffix=" dok" trend="up" trendValue="+4" sparkData={sparklineDokumen} chartColor="var(--color-chart-3)" />
        <StatCard title="Disposisi Selesai" value={93} suffix="%" trend="up" trendValue="+1.2%" sparkData={sparklineDisposisi} chartColor="var(--color-chart-4)" />
      </div>

      {/* ─── Row 3: Tabs ──────────────────────────────────── */}
      <Tabs defaultValue="surat-masuk" className="space-y-0">
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-transparent p-0 h-auto rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="surat-masuk" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Inbox className="size-3.5 mr-1.5" />Surat Masuk
            </TabsTrigger>
            <TabsTrigger value="surat-keluar" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <Send className="size-3.5 mr-1.5" />Surat Keluar
            </TabsTrigger>
            <TabsTrigger value="dokumen" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <FileCheck className="size-3.5 mr-1.5" />Dokumen Legal
            </TabsTrigger>
            <TabsTrigger value="statistik" className="rounded-t-md border-b-2 border-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-[13px] flex-1 sm:flex-none">
              <BarChart3 className="size-3.5 mr-1.5" />Statistik
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Surat Masuk */}
        <TabsContent value="surat-masuk" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Surat Masuk</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Seluruh surat masuk yang diterima yayasan</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Cari surat..."
                      className="h-8 w-full sm:w-64 pl-8 bg-background border-input text-[13px] text-foreground placeholder:text-muted-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground">
                    <Filter className="size-3.5 mr-1.5" />Filter
                  </Button>
                  <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="size-3.5 mr-1.5" />Catat Surat
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">No. Surat</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">Tanggal</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Perihal</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">Pengirim</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden sm:table-cell">Tujuan</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Status</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuratMasuk.map((s) => (
                    <TableRow key={s.id} className="group hover:bg-muted/50 border-border transition-colors duration-150">
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-2">
                          {s.prioritas === "tinggi" && <AlertTriangle className="size-3 text-red-500 shrink-0" />}
                          <span className="text-[12px] font-mono text-primary font-medium">{s.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden lg:table-cell">{s.tanggal}</TableCell>
                      <TableCell className="py-3">
                        <div>
                          <p className="text-[12px] font-medium text-card-foreground">{s.perihal}</p>
                          <p className="text-[10px] text-muted-foreground lg:hidden">{s.tanggal}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden md:table-cell max-w-[180px] truncate">{s.pengirim}</TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden sm:table-cell">{s.tujuan}</TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 h-5 border-0 ${
                            s.status === "baru" ? "bg-primary/10 text-primary"
                            : s.status === "didisposisi" ? "bg-amber-500/10 text-amber-400"
                            : s.status === "diproses" ? "bg-blue-500/10 text-blue-400"
                            : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {s.status === "baru" ? "Baru" : s.status === "didisposisi" ? "Disposisi" : s.status === "diproses" ? "Proses" : "Selesai"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="size-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-popover border-border">
                            <DropdownMenuItem className="text-xs"><Eye className="size-3 mr-2" />Lihat Detail</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs"><Stamp className="size-3 mr-2" />Disposisi</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs"><Archive className="size-3 mr-2" />Arsipkan</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

        {/* Tab: Surat Keluar */}
        <TabsContent value="surat-keluar" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Surat Keluar</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Seluruh surat keluar yang dikirim yayasan</CardDescription>
                </div>
                <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                  <Send className="size-3.5 mr-1.5" />Buat Surat Baru
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pl-6">No. Surat</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden lg:table-cell">Tanggal</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10">Perihal</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden md:table-cell">Penerima</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 hidden sm:table-cell">Pengirim</TableHead>
                    <TableHead className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider h-10 pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suratKeluar.map((s) => (
                    <TableRow key={s.id} className="group hover:bg-muted/50 border-border transition-colors duration-150">
                      <TableCell className="py-3 pl-6">
                        <span className="text-[12px] font-mono text-primary font-medium">{s.id}</span>
                      </TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden lg:table-cell">{s.tanggal}</TableCell>
                      <TableCell className="py-3">
                        <div>
                          <p className="text-[12px] font-medium text-card-foreground">{s.perihal}</p>
                          <p className="text-[10px] text-muted-foreground lg:hidden">{s.tanggal}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden md:table-cell max-w-[180px] truncate">{s.penerima}</TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden sm:table-cell">{s.pengirim}</TableCell>
                      <TableCell className="py-3 pr-6">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 h-5 border-0 ${
                            s.status === "terkirim" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {s.status === "terkirim" ? "Terkirim" : "Draft"}
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

        {/* Tab: Dokumen Legal */}
        <TabsContent value="dokumen" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Dokumen Legal & Perizinan</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Akta, izin operasional, dan sertifikasi yayasan</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8 border-border bg-transparent text-muted-foreground hover:text-foreground w-full sm:w-auto">
                  <Download className="size-3.5 mr-1.5" />Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dokumenLegal.map((doc, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors duration-200">
                  <div className={`flex size-10 items-center justify-center rounded-lg shrink-0 ${
                    doc.status === "segera" ? "bg-amber-500/10 text-amber-400" : "bg-primary/10 text-primary"
                  }`}>
                    {doc.jenis === "Akta Notaris" ? <FileText className="size-5" />
                      : doc.jenis === "SK" ? <Stamp className="size-5" />
                      : doc.jenis === "Izin" ? <FileCheck className="size-5" />
                      : doc.jenis === "Akreditasi" ? <CheckCircle2 className="size-5" />
                      : <FolderOpen className="size-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">{doc.nama}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{doc.nomor}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 h-5 shrink-0 border-0 ${
                          doc.status === "aktif" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {doc.status === "aktif" ? "Aktif" : "Segera Perbarui"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><FolderOpen className="size-3" />{doc.jenis}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="size-3" />Berlaku: {doc.berlaku}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Statistik */}
        <TabsContent value="statistik" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-medium text-card-foreground">Volume Surat 6 Bulan Terakhir</CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground">Perbandingan surat masuk vs surat keluar</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary" /><span className="text-muted-foreground">Masuk</span></div>
                  <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-chart-3" /><span className="text-muted-foreground">Keluar</span></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeSuratBulanan} barGap={4}>
                    <defs>
                      <linearGradient id="colorSuratMasuk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--popover-foreground)" }}
                      cursor={{ fill: "var(--muted)" }}
                    />
                    <Bar dataKey="masuk" name="Surat Masuk" fill="url(#colorSuratMasuk)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="keluar" name="Surat Keluar" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>6 bulan terakhir</span>
                </div>
                <Button variant="link" size="sm" className="text-primary text-[11px] p-0 h-auto">
                  Lihat Semua <ChevronRight className="size-3 ml-0.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
