import { getDashboardData } from "./actions/dashboard.action"
import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"
import SubscriptionCountdown from "./components/SubscriptionCountdown"

function formatPrice(value: number) {
  return value.toLocaleString("id-ID")
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

function getPaymentLabel(paymentMethod: string) {
  switch (paymentMethod) {
    case "CASH":
      return "Tunai"
    case "QRIS":
      return "QRIS"
    case "TRANSFER":
      return "Transfer"
    case "DEBIT":
      return "Debit"
    default:
      return paymentMethod
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  const user = await getCurrentUser()

  const business = user?.businessId
    ? await prisma.business.findUnique({
        where: {
          id: user.businessId,
        },
        select: {
          trialEndsAt: true,
          subscription: {
            select: {
              status: true,
              endDate: true,
            },
          },
        },
      })
    : null

  const endDate =
    business?.subscription?.status === "ACTIVE"
      ? business.subscription.endDate
      : business?.trialEndsAt

  return (
    <main className="min-h-screen bg-slate-50/60 p-5 sm:p-6 lg:p-8">

      {/* ================= HEADER ================= */}

      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
          <span>Home</span>
          <span>/</span>
          <span className="text-slate-600">
            Dashboard
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Ringkasan aktivitas toko hari ini.
        </p>

        {/* ================= SUBSCRIPTION ================= */}

        {endDate && (
          <div className="mt-5">
            <SubscriptionCountdown
              endDate={endDate.toISOString()}
            />
          </div>
        )}
      </div>

      {/* ================= STAT CARDS ================= */}

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* PENJUALAN */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Penjualan Hari Ini
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Rp {formatPrice(data.todaySales)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-sm font-bold text-violet-500">
              Rp
            </div>
          </div>

          <p className="mt-3 text-xs text-emerald-500">
            Total penjualan hari ini
          </p>
        </div>

        {/* TRANSAKSI */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Transaksi Hari Ini
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {data.todayTransactions}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-lg">
              🛒
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Transaksi selesai
          </p>
        </div>

        {/* PRODUK */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Produk
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {data.totalProducts}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">
              📦
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Produk aktif
          </p>
        </div>

        {/* STOK */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Stok Perlu Cek
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {data.lowStockProducts.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-lg">
              ⚠
            </div>
          </div>

          <p className="mt-3 text-xs text-amber-500">
            Perlu diperhatikan
          </p>
        </div>

      </section>

      {/* ================= CONTENT ================= */}

      <section className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">

        {/* ================= TRANSAKSI ================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Aktivitas Terbaru
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Transaksi penjualan terakhir
              </p>
            </div>

            <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
              Hari ini
            </span>

          </div>

          {data.recentSales.length === 0 ? (

            <div className="px-5 py-14 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-xl">
                🛒
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                Belum ada transaksi
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Transaksi penjualan akan muncul di sini.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {data.recentSales.map((sale) => (

                <div
                  key={sale.id}
                  className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50/60"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-sm">
                      🛒
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-slate-800">
                        {sale.invoiceNumber}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {formatTime(sale.saleDate)}
                        {" · "}
                        {getPaymentLabel(
                          sale.paymentMethod
                        )}
                      </p>

                    </div>

                  </div>

                  <p className="ml-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                    Rp {formatPrice(sale.total)}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ================= LOW STOCK ================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Stok Perlu Diperhatikan
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Produk dengan stok rendah
                </p>
              </div>

              {data.lowStockProducts.length > 0 && (
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                  {data.lowStockProducts.length}
                </span>
              )}

            </div>

          </div>

          {data.lowStockProducts.length === 0 ? (

            <div className="px-5 py-14 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-lg">
                ✓
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                Semua stok aman
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Tidak ada produk yang perlu direstock.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {data.lowStockProducts.map((product) => (

                <div
                  key={product.id}
                  className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50/60"
                >

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {product.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Minimum {product.minimumStock}{" "}
                      {product.unit?.symbol || "unit"}
                    </p>

                  </div>

                  <div className="ml-4 text-right">

                    <p className="text-sm font-bold text-amber-600">
                      {product.stock}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {product.unit?.symbol || "unit"}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* ================= QUICK SUMMARY ================= */}

      <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-violet-100 bg-violet-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm shadow-sm">
            ✨
          </div>

          <div>

            <p className="text-sm font-semibold text-violet-800">
              Pantau toko dengan mudah
            </p>

            <p className="mt-1 text-xs leading-5 text-violet-700/70">
              Gunakan Inventory untuk mengelola
              stok dan Laporan untuk melihat detail
              aktivitas bisnis.
            </p>

          </div>

        </div>

      </section>

    </main>
  )
}
