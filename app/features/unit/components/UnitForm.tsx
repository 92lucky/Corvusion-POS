"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createUnit,
  updateUnit,
} from "../actions/unit.action"

type Unit = {
  id: string
  name: string
  symbol: string | null
}

export default function UnitForm({
  unit,
}: {
  unit?: Unit
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEdit = Boolean(unit)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    try {
      const input = {
        name: String(formData.get("name")),
        symbol: String(formData.get("symbol") || ""),
      }

      if (unit) {
        await updateUnit(unit.id, input)
      } else {
        await createUnit(input)
      }

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

  return (
    <form
      action={handleSubmit}
      className="max-w-md space-y-4 rounded-lg border p-4"
    >
      <h2 className="font-semibold">
        {isEdit ? "Edit Satuan" : "Tambah Satuan"}
      </h2>

      <input
        name="name"
        required
        defaultValue={unit?.name ?? ""}
        placeholder="Contoh: Tablet"
        className="w-full rounded-md border p-2"
      />

      <input
        name="symbol"
        defaultValue={unit?.symbol ?? ""}
        placeholder="Contoh: tab"
        className="w-full rounded-md border p-2"
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading
          ? "Menyimpan..."
          : isEdit
            ? "Simpan Perubahan"
            : "Tambah Satuan"}
      </button>
    </form>
  )
}
