import { getCurrentUser } from "@/app/lib/auth/current-user"
import { getSuppliers } from "@/app/features/supplier/query/supplier.query"
import SupplierForm from "@/app/features/supplier/components/SupplierForm"
import SupplierList from "@/app/features/supplier/components/SupplierList"

export default async function SupplierPage({
  searchParams,
}: {
  searchParams: Promise<{
    edit?: string
  }>
}) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    return null
  }

  const params = await searchParams

  const suppliers = await getSuppliers(user.businessId)

  const editingSupplier = params.edit
    ? suppliers.find(
        (supplier) => supplier.id === params.edit
      )
    : undefined

  return (
    <main className="space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Supplier
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Kelola supplier toko.
        </p>
      </div>

      <SupplierForm
        supplier={editingSupplier}
      />

      <SupplierList
        suppliers={suppliers}
      />
    </main>
  )
}
