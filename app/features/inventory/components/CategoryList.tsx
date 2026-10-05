"use client"

import { useState } from "react"
import { deleteCategory } from "../actions/category.action"
import Link from "next/link"

type Category = {
  id: string
  name: string
  description: string | null
  _count: {
    products: number
  }
}

export default function CategoryList({
  categories,
}: {
  categories: Category[]
}) {
  const [error, setError] = useState("")

  async function handleDelete(id: string) {
    if (!confirm("Hapus kategori ini?")) {
      return
    }

    try {
      setError("")
      await deleteCategory(id)
      window.location.reload()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus kategori"
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

      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div>
            <p className="font-medium">
              {category.name}
            </p>

            <p className="text-sm text-gray-500">
              {category.description || "Tidak ada deskripsi"}
            </p>

            <p className="text-xs text-gray-400">
              {category._count.products} produk
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/kategori?edit=${category.id}`}
              className="rounded border px-3 py-1"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(category.id)}
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
