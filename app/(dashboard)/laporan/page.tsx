
import { getCurrentUser } from "@/app/lib/auth/current-user"

import LaporanPenjualan from "@/app/features/laporan/components/LaporanPenjualan"
import LaporanPembelian from "@/app/features/laporan/components/LaporanPembelian"
import ProdukTerlaris from "@/app/features/laporan/components/ProdukTerlaris"
import LabaRugi from "@/app/features/laporan/components/LabaRugi"
import LaporanStok from "@/app/features/laporan/components/LaporanStock"

import { getSalesReport } from "@/app/features/laporan/query/laporan.query"
import { getPurchaseReport } from "@/app/features/laporan/query/purchase.query"
import { getStockReport } from "@/app/features/laporan/query/stock-report.query"
import { getBestSellingProducts } from "@/app/features/laporan/query/best-sell.query"
import { getProfitLossReport } from "@/app/features/laporan/query/laba-rugi.query"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default async function LaporanPage() {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    return null
  }

  const [
    sales,
    purchases,
    products,
    bestSelling,
    profitLoss,
  ] = await Promise.all([
    getSalesReport(user.businessId),
    getPurchaseReport(user.businessId),
    getStockReport(user.businessId),
    getBestSellingProducts(user.businessId),
    getProfitLossReport(user.businessId),
  ])

  // =========================
  // RINGKASAN
  // =========================

  const totalTransactions = sales.filter(
    (sale) => sale.status === "COMPLETED"
  ).length

  const totalItemsSold = sales
    .filter(
      (sale) => sale.status === "COMPLETED"
    )
    .reduce((total, sale) => {
      return (
        total +
        sale.items.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        )
      )
    }, 0)

  const totalPurchase = purchases.reduce(
    (total, purchase) =>
      total + Number(purchase.total),
    0
  )

  function formatRupiah(value: number) {
    return `Rp ${value.toLocaleString("id-ID")}`
  }

  return (
    <main className="min-h-screen bg-slate-50/70">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* HEADER */}

        <header className="mb-7">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-500">
            Business Analytics
          </p>

          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
            Laporan
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Analisis aktivitas dan performa bisnis.
          </p>
        </header>

        {/* RINGKASAN */}

        <section className="mb-8">
          <SectionTitle title="Ringkasan" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <SummaryCard
              label="Penjualan Bersih"
              value={formatRupiah(profitLoss.netSales)}
              description="Setelah diskon"
              icon="↗"
              iconClass="bg-violet-50 text-violet-600"
            />

            <SummaryCard
              label="Pembelian"
              value={formatRupiah(totalPurchase)}
              description="Total pengadaan"
              icon="↓"
              iconClass="bg-amber-50 text-amber-600"
            />

            <SummaryCard
              label="Laba Kotor"
              value={formatRupiah(profitLoss.grossProfit)}
              description="Penjualan − HPP"
              icon="+"
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <SummaryCard
              label="Transaksi"
              value={totalTransactions.toLocaleString("id-ID")}
              description={`${totalItemsSold.toLocaleString("id-ID")} unit terjual`}
              icon="#"
              iconClass="bg-slate-100 text-slate-600"
            />

          </div>
        </section>

        {/* PENJUALAN */}

        <section className="mb-8">
          <SectionTitle title="Penjualan" />

          <ReportCard
            title="Aktivitas Penjualan"
            description="Transaksi dan pendapatan penjualan."
          >
            <LaporanPenjualan sales={sales} />
          </ReportCard>
        </section>

        {/* PEMBELIAN */}

        <section className="mb-8">
          <SectionTitle title="Pembelian" />

          <ReportCard
            title="Aktivitas Pembelian"
            description="Riwayat pengadaan barang dan supplier."
          >
            <LaporanPembelian purchases={purchases} />
          </ReportCard>
        </section>

        {/* OPERASIONAL */}

        <section className="mb-8">
          <SectionTitle title="Operasional" />

          <div className="grid min-w-0 gap-4 lg:grid-cols-[3fr_2fr]">

            <ReportCard
              title="Kondisi Stok"
              description="Ringkasan persediaan saat ini."
            >
              <LaporanStok products={products} />
            </ReportCard>

            <ReportCard
              title="Produk Terlaris"
              description="Produk dengan penjualan tertinggi."
            >
              <ProdukTerlaris products={bestSelling} />
            </ReportCard>

          </div>
        </section>

        {/* LABA RUGI */}

        <section>
          <SectionTitle title="Keuangan" />

          <Card className="overflow-hidden">

            <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                  Financial
                </p>

                <CardTitle className="mt-1 text-base text-violet-500">
                  Laba Rugi
                </CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">
                  Pendapatan, HPP, dan laba kotor bisnis.
                </p>
              </div>

              <Badge
                variant="secondary"
                className="w-fit bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
              >
                Gross Profit
              </Badge>

            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <LabaRugi report={profitLoss} />
            </CardContent>

          </Card>
        </section>

      </div>
    </main>
  )
}

/* =========================
   SECTION TITLE
========================= */

function SectionTitle({
  title,
}: {
  title: string
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2 className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h2>

      <Separator className="flex-1" />
    </div>
  )
}

/* =========================
   SUMMARY CARD
========================= */

function SummaryCard({
  label,
  value,
  description,
  icon,
  iconClass,
}: {
  label: string
  value: string
  description: string
  icon: string
  iconClass: string
}) {
  return (
    <Card>
      <CardContent className="p-5">

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground">
            {label}
          </p>

          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs ${iconClass}`}
          >
            {icon}
          </span>
        </div>

        <p className="mt-3 truncate text-xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>

      </CardContent>
    </Card>
  )
}

/* =========================
   REPORT CARD
========================= */

function ReportCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="min-w-0 overflow-hidden">

      <CardHeader className="border-b">
        <CardTitle className="text-sm text-violet-500">
          {title}
        </CardTitle>

        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardHeader>

      <CardContent className="min-w-0 p-4 sm:p-5">
        {children}
      </CardContent>

    </Card>
  )
}
