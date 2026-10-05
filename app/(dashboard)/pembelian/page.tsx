
import { getCurrentUser } from "@/app/lib/auth/current-user"
import {
  getPurchases,
  getPurchaseFormData,
} from "@/app/features/pembelian/query/purchase.query"
import PurchaseForm from "@/app/features/pembelian/components/PurchaseForm"
import {
  FileText,
  ShoppingBag,
  Wallet,
} from "lucide-react"

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export default async function PembelianPage() {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    return null
  }

  const [purchases, formData] = await Promise.all([
    getPurchases(user.businessId),
    getPurchaseFormData(user.businessId),
  ])

  const totalItems = purchases.reduce(
    (total, purchase) =>
      total +
      purchase.items.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      ),
    0
  )

  const totalPurchase = purchases.reduce(
    (total, purchase) =>
      total +
      purchase.items.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity) *
            Number(item.purchasePrice),
        0
      ),
    0
  )

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-violet-500">
          Transaksi
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Pembelian
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Catat barang masuk dari supplier.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <FileText className="h-4 w-4 text-violet-500" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Transaksi
              </p>

              <p className="mt-0.5 text-lg font-semibold text-slate-900">
                {purchases.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <ShoppingBag className="h-4 w-4 text-violet-500" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Barang Masuk
              </p>

              <p className="mt-0.5 text-lg font-semibold text-slate-900">
                {totalItems}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Wallet className="h-4 w-4 text-violet-500" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Nilai Pembelian
              </p>

              <p className="mt-0.5 text-lg font-semibold text-slate-900">
                {formatRupiah(totalPurchase)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[480px_minmax(0,1fr)]">
        <PurchaseForm
          suppliers={formData.suppliers}
          products={formData.products}
          categories={formData.categories}
          units={formData.units}
          businessType={formData.businessType}
        />

        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Riwayat Pembelian
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Transaksi pembelian yang telah dicatat.
            </p>
          </div>

          {purchases.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-700">
                Belum ada pembelian
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Pembelian yang dibuat akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Invoice
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Tanggal
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Supplier
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Barang
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-right font-medium">
                      Total
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 font-medium">
                      Pembayaran
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {purchases.map((purchase) => {
                    const total = purchase.items.reduce(
                      (sum, item) =>
                        sum +
                        Number(item.quantity) *
                          Number(item.purchasePrice),
                      0
                    )

                    const itemCount =
                      purchase.items.reduce(
                        (sum, item) =>
                          sum + Number(item.quantity),
                        0
                      )

                    return (
                      <tr
                        key={purchase.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">
                          {purchase.invoiceNumber}
                        </td>

                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                          {formatDate(
                            purchase.purchaseDate
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                          {purchase.supplier?.name ?? "-"}
                        </td>

                        <td className="px-5 py-3.5">
                          {purchase.items.length > 0 ? (
                            <div>
                              <p className="font-medium text-slate-800">
                                {
                                  purchase.items[0]
                                    .product.name
                                }
                              </p>

                              {purchase.items.length > 1 ? (
                                <p className="mt-0.5 text-xs text-slate-400">
                                  +{" "}
                                  {purchase.items.length - 1}{" "}
                                  barang lainnya
                                </p>
                              ) : (
                                <p className="mt-0.5 text-xs text-slate-400">
                                  {itemCount} item
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">
                              -
                            </span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-3.5 text-right font-semibold text-slate-900">
                          {formatRupiah(total)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-3.5">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {purchase.paymentMethod}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
