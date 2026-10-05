"use client"

import Link from "next/link"
import { useState } from "react"
import { deleteUnit } from "../actions/unit.action"

type Unit = {
  id: string
  name: string
  symbol: string | null
  _count: {
    products: number
  }
}

export default function UnitList({
  units,
}: {
  units: Unit[]
}) {
  const [error, setError] = useState("")

  async function handleDelete(id: string) {
    if (!confirm("Hapus satuan ini?")) {
      return
    }

    try {
      setError("")
      await deleteUnit(id)
      window.location.reload()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus satuan"
      )
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {units.map((unit) => (
        <div
          key={unit.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div>
            <p className="font-medium">
              {unit.name}
              {unit.symbol && (
                <span className="ml-2 text-sm text-gray-500">
                  ({unit.symbol})
                </span>
              )}
            </p>

            <p className="text-xs text-gray-400">
              {unit._count.products} produk
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/unit?edit=${unit.id}`}
              className="rounded border px-3 py-1"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(unit.id)}
              className="rounded border px-3 py-1 text-red-500"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
