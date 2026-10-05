
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createUnit,
  updateUnit,
} from "@/app/features/inventory/actions/unit.action"

type Unit = {
  id: string
  name: string
  symbol: string | null
}

type Props = {
  unit?: Unit
}

export default function UnitForm({ unit }: Props) {
  const router = useRouter()

  const [open, setOpen] = useState(Boolean(unit))
  const [name, setName] = useState(unit?.name ?? "")
  const [symbol, setSymbol] = useState(unit?.symbol ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEdit = Boolean(unit)

  async function handleSubmit() {
    setLoading(true)
    setError("")

    try {
      if (unit) {
        await updateUnit(unit.id, {
          name,
          symbol,
        })
      } else {
        await createUnit({
          name,
          symbol,
        })
      }

      setName("")
      setSymbol("")
      setOpen(false)

      router.push("/unit")
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan satuan"
      )
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    setOpen(false)
    setName("")
    setSymbol("")
    setError("")

    if (isEdit) {
      router.push("/unit")
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full whitespace-nowrap rounded-md bg-violet-500 px-3 py-2 text-sm font-medium text-white hover:bg-violet-600 sm:w-auto"
      >
        + Satuan/Tipe
      </button>
    )
  }

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nama satuan atau tipe"
          autoFocus
          className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />

        <input
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          placeholder="Simbol"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 sm:w-24"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-md bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50 sm:flex-none"
          >
            {loading
              ? "..."
              : isEdit
                ? "Simpan Perubahan"
                : "Simpan"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 rounded-md border px-4 py-2 text-sm sm:flex-none"
          >
            Batal
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
