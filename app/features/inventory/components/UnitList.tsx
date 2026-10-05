"use client"

import Link from "next/link"
import { deleteUnit } from "@/app/features/inventory/actions/unit.action"

type Unit = {
  id: string
  name: string
  symbol: string | null
}

export default function UnitList({
  units,
}: {
  units: Unit[]
}) {
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Yakin ingin menghapus satuan ini?"
    )

    if (!confirmed) return

    await deleteUnit(id)
    window.location.reload()
  }

  if (units.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-sm text-gray-500">
        Belum ada satuan.
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <div className="border-b p-4 font-semibold">
        Daftar Satuan
      </div>

      <div className="divide-y">
        {units.map((unit) => (
          <div
            key={unit.id}
            className="flex items-center justify-between p-4"
          >
            <div>
              <p className="font-medium">
                {unit.name}
              </p>

              {unit.symbol && (
                <p className="text-sm text-gray-500">
                  {unit.symbol}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                href={`/unit?edit=${unit.id}`}
                className="rounded-md border px-3 py-1.5 text-sm"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(unit.id)}
                className="rounded-md border px-3 py-1.5 text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
