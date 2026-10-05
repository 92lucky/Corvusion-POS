import { getCurrentUser } from "@/app/lib/auth/current-user"
import { getUnits } from "@/app/features/unit/query/unit.query"
import UnitForm from "@/app/features/unit/components/UnitForm"
import UnitList from "@/app/features/unit/components/UnitList"

export default async function UnitPage({
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

  const units = await getUnits(user.businessId)

  const editingUnit = params.edit
    ? units.find((unit) => unit.id === params.edit)
    : undefined

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Satuan
        </h1>

        <p className="text-sm text-gray-500">
          Kelola satuan produk.
        </p>
      </div>

      <UnitForm unit={editingUnit} />

      <UnitList units={units} />
    </main>
  )
}
