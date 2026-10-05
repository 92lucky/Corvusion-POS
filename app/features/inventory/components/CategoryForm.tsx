
"use client"

import { useState } from "react"
import { createCategory } from "../actions/category.action"

type Props = {
  onCreated: (category: {
    id: string
    name: string
  }) => void
}

export default function CategoryForm({
  onCreated,
}: Props) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleCreate() {
    const value = name.trim()

    if (!value) {
      setError("Nama kategori wajib diisi")
      return
    }

    setLoading(true)
    setError("")

    try {
      const category = await createCategory({
        name: value,
      })

      onCreated({
        id: category.id,
        name: category.name,
      })

      setName("")
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal membuat kategori"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Tambah kategori"
          className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />

        <button
          type="button"
          onClick={handleCreate}
          disabled={loading}
          className="w-full rounded-md bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50 sm:w-auto"
        >
          {loading ? "..." : "Tambah"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
