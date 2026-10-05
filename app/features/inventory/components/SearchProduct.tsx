"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function SearchProduct() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }

    router.push(`/inventory?${params.toString()}`)
  }

  return (
    <input
      type="search"
      defaultValue={searchParams.get("search") ?? ""}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Cari produk atau barcode..."
      className="w-full rounded-md border p-2"
    />
  )
}
