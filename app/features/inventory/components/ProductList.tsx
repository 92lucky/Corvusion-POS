"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { deleteProduct } from "../actions/product.action"

type Product = {
  id: string
  name: string
  barcode: string | null
  purchasePrice: unknown
  sellingPrice: unknown
  stock: number

  category: {
    name: string
  } | null

  supplier: {
    name: string
  } | null

  unit: {
    name: string
    symbol: string | null
  } | null

  weight: unknown
  expiredAt: Date | null
  dosage: string | null
  volume: unknown
}

type BusinessType =
  | "APOTEK"
  | "KLONTONG"
  | "BANGUNAN"

type ProductListProps = {
  products: Product[]
  businessType: BusinessType
  page: number
  totalPages: number
}

export default function ProductList({
  products,
  businessType,
  page,
  totalPages,
}: ProductListProps) {
  const searchParams = useSearchParams()
  const [error, setError] = useState("")

  async function handleDelete(id: string) {
    if (!confirm("Hapus barang ini?")) {
      return
    }

    try {
      setError("")
      await deleteProduct(id)
      window.location.reload()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus barang"
      )
    }
  }

  function formatPrice(value: unknown) {
    return Number(value).toLocaleString("id-ID")
  }

  function formatDate(value: Date | null) {
    if (!value) return "-"

    return new Date(value).toLocaleDateString(
      "id-ID"
    )
  }

  function getStatus(stock: number) {
    if (stock <= 0) {
      return {
        label: "Stok Habis",
        className:
          "bg-red-50 text-red-600",
      }
    }

    if (stock <= 10) {
      return {
        label: "Stok Rendah",
        className:
          "bg-amber-50 text-amber-600",
      }
    }

    return {
      label: "Aman",
      className:
        "bg-emerald-50 text-emerald-600",
    }
  }

  function pageHref(targetPage: number) {
    const params = new URLSearchParams(
      searchParams.toString()
    )

    params.set("page", String(targetPage))
    params.delete("edit")
    params.delete("create")

    return `/inventory?${params.toString()}`
  }

  function editHref(productId: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    )

    params.set("edit", productId)
    params.delete("create")

    return `/inventory?${params.toString()}`
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-2xl">
          📦
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          Belum ada produk
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
          Produk yang kamu tambahkan akan
          muncul di sini.
        </p>

        <Link
          href="/inventory?create=1"
          className="mt-5 inline-flex rounded-lg bg-violet-500 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-600"
        >
          + Tambah Produk
        </Link>
      </div>
    )
  }

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {error && (
        <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">

          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-left">

              <th className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                Produk
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Kategori
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Stok
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Harga Modal
              </th>

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Harga Jual
              </th>

              {businessType === "APOTEK" && (
                <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                  Expired
                </th>
              )}

              <th className="px-4 py-3.5 text-xs font-semibold text-slate-500">
                Status
              </th>

              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500">
                Aksi
              </th>

            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const status =
                getStatus(product.stock)

              return (
                <tr
                  key={product.id}
                  className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/60"
                >

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm">
                        📦
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {product.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {product.barcode ||
                            "Tanpa barcode"}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {product.category ? (
                      <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        -
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-900">
                      {product.stock}
                    </div>

                    <div className="text-xs text-slate-400">
                      {product.unit?.symbol ||
                        product.unit?.name ||
                        "unit"}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                    Rp{" "}
                    {formatPrice(
                      product.purchasePrice
                    )}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">
                    Rp{" "}
                    {formatPrice(
                      product.sellingPrice
                    )}
                  </td>

                  {businessType === "APOTEK" && (
                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className={
                          product.expiredAt &&
                          new Date(
                            product.expiredAt
                          ) < new Date()
                            ? "text-red-500"
                            : "text-slate-500"
                        }
                      >
                        {formatDate(
                          product.expiredAt
                        )}
                      </span>
                    </td>
                  )}

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />

                      {status.label}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">

                      <Link
                        href={editHref(product.id)}
                        title="Edit produk"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        ✎
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(product.id)
                        }
                        title="Hapus produk"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        ×
                      </button>

                    </div>
                  </td>

                </tr>
              )
            })}
          </tbody>

        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">

        <p className="text-xs text-slate-400">
          Menampilkan{" "}
          <span className="font-medium text-slate-600">
            {products.length}
          </span>{" "}
          produk
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">

            {page > 1 ? (
              <Link
                href={pageHref(page - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                ‹
              </Link>
            ) : (
              <button
                disabled
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-300"
              >
                ‹
              </button>
            )}

            {pages.map((pageNumber) => (
              <Link
                key={pageNumber}
                href={pageHref(pageNumber)}
                className={
                  pageNumber === page
                    ? "flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-xs font-semibold text-white"
                    : "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50"
                }
              >
                {pageNumber}
              </Link>
            ))}

            {page < totalPages ? (
              <Link
                href={pageHref(page + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                ›
              </Link>
            ) : (
              <button
                disabled
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-300"
              >
                ›
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  )
}
