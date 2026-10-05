"use client"

import { useState } from "react"
import { createUnit } from "../actions/unit.action"

type Props = {
  onCreated: (unit: {
    id: string
    name: string
    symbol?: string | null
  }) => void
}

export default function UnitForm({
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleCreate() {
    setLoading(true)
    setError("")

    try {
      const unit = await createUnit({
        name,
        symbol,
      })

      onCreated(unit)

      setName("")
      setSymbol("")
      setOpen(false)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal membuat satuan"
      )
    } finally {
      setLoading(false)
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
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Nama satuan atau tipe"
          autoFocus
          className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />

        <input
          value={symbol}
          onChange={(event) =>
            setSymbol(event.target.value)
          }
          placeholder="Simbol"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 sm:w-24"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 rounded-md bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50 sm:flex-none"
          >
            {loading ? "..." : "Simpan"}
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              setName("")
              setSymbol("")
              setError("")
            }}
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
