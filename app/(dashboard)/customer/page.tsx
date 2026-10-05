import { getCurrentUser } from "@/app/lib/auth/current-user"
import { getCustomers } from "@/app/features/customer/query/customer.query"
import CustomerForm from "@/app/features/customer/components/CustomerForm"
import CustomerList from "@/app/features/customer/components/CustomerList"

export default async function CustomerPage({
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
  const customers = await getCustomers(user.businessId)

  const editingCustomer = params.edit
    ? customers.find(
        (customer) => customer.id === params.edit
      )
    : undefined

  return (
    <main className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Customer
        </h1>

        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Kelola data pelanggan toko.
        </p>
      </div>

      {/* Form */}
      <CustomerForm customer={editingCustomer} />

      {/* List */}
      <CustomerList customers={customers} />
    </main>
  )
}
