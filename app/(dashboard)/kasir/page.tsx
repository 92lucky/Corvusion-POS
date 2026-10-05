import { getCurrentUser } from "@/app/lib/auth/current-user"
import { getSaleFormData } from "@/app/features/kasir/query/sale.query"
import SaleForm from "@/app/features/kasir/components/SaleForm"

export default async function KasirPage() {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    return null
  }

  const { products, customers } =
    await getSaleFormData(user.businessId)

  return (
    <main className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Kasir
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Proses penjualan dan pembayaran.
        </p>
      </div>

      <section className="max-w-md rounded-xl border border-slate-200 bg-white p-4">
        <SaleForm
          products={products}
          customers={customers}
        />
      </section>
    </main>
  )
}
