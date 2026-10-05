
"use client"

import { useRouter, useSearchParams } from "next/navigation"

type Category = {
  id: string
  name: string
}

export default function CategoryFilter({
  categories,
}: {
  categories: Category[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set("categoryId", value)
    } else {
      params.delete("categoryId")
    }

    router.push(`/inventory?${params.toString()}`)
  }

  return (
    <select
      defaultValue={searchParams.get("categoryId") ?? ""}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300 focus:ring-1 focus:ring-violet-100 sm:w-auto"
    >
      <option value="">Semua kategori</option>

      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  )
}
