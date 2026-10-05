import Link from "next/link"
import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"

import {
  getProducts,
  getInventoryStats,
} from "@/app/features/inventory/query/inventory.query"

import {
  getProductFormData,
} from "@/app/features/inventory/query/product-form.query"

import ProductForm from "@/app/features/inventory/components/ProductForm"
import ProductList from "@/app/features/inventory/components/ProductList"
import SearchProduct from "@/app/features/inventory/components/SearchProduct"
import CategoryFilter from "@/app/features/inventory/components/CategoryFilter"
import InventoryActions from "@/app/features/inventory/components/InventoryActions"

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    edit?: string
    create?: string
    search?: string
    categoryId?: string
    page?: string
  }>
}) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    return null
  }

  const params = await searchParams

  const search =
    params.search?.trim() || undefined

  const categoryId =
    params.categoryId || undefined

  const page = Math.max(
    Number(params.page) || 1,
    1
  )

  const [
    productData,
    inventoryStats,
    formData,
    business,
  ] = await Promise.all([
    getProducts(
      user.businessId,
      search,
      categoryId,
      page
    ),

    getInventoryStats(
      user.businessId
    ),

    getProductFormData(
      user.businessId
    ),

    prisma.business.findUnique({
      where: {
        id: user.businessId,
      },
      select: {
        type: true,
      },
    }),
  ])

  if (!business) {
    return null
  }

  const {
    products,
    total,
    totalPages,
  } = productData

  const {
    totalProducts,
    lowStock,
    outOfStock,
    totalStockValue,
  } = inventoryStats

  const editingProduct = params.edit
    ? products.find(
        (product) =>
          product.id === params.edit
      )
    : undefined

  function formatPrice(value: number) {
    return value.toLocaleString("id-ID")
  }

  const showForm =
    Boolean(params.create) ||
    Boolean(editingProduct)

  return (
    <main className="min-h-screen bg-slate-50/60 p-5 sm:p-6 lg:p-8">

      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-600">
              Inventory
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola produk, harga, dan stok toko.
          </p>
        </div>

        <div className="flex gap-2">
          <InventoryActions
            businessId={user.businessId}
          />

          <Link
            href="/inventory?create=1"
            className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-600"
          >
            <span className="mr-1.5 text-base">
              +
            </span>
            Tambah Produk
          </Link>
        </div>
      </div>

      {showForm && (
        <section className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">
                {editingProduct
                  ? "Edit Produk"
                  : "Tambah Produk"}
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Lengkapi informasi produk di bawah.
              </p>
            </div>

            <Link
              href="/inventory"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              title="Tutup"
            >
              ×
            </Link>
          </div>

          <div className="p-5 sm:p-6">
            <ProductForm
              categories={formData.categories}
              suppliers={formData.suppliers}
              units={formData.units}
              businessType={business.type}
              product={editingProduct}
            />
          </div>
        </section>
      )}

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Produk
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {totalProducts.toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-lg">
              📦
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Produk dalam inventory
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Stok Rendah
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {lowStock}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-lg">
              ⚠
            </div>
          </div>

          <p className="mt-3 text-xs text-amber-500">
            Perlu restock
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Stok Habis
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {outOfStock}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-lg text-red-500">
              !
            </div>
          </div>

          <p className="mt-3 text-xs text-red-500">
            Segera tambah stok
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-sm text-slate-500">
                Nilai Stok
              </p>

              <p className="mt-2 truncate text-xl font-bold tracking-tight text-slate-900">
                Rp {formatPrice(totalStockValue)}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-sm font-bold text-violet-500">
              Rp
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Berdasarkan harga modal
          </p>
        </div>
      </section>

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="min-w-0 flex-1">
            <SearchProduct />
          </div>

          <div className="lg:w-56">
            <CategoryFilter
              categories={formData.categories}
            />
          </div>

        </div>
      </section>

      <ProductList
        products={products}
        businessType={business.type}
        page={page}
        totalPages={totalPages}
      />

      <section className="mt-5 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
            💡
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Tips Inventory
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/70">
              Atur minimum stok agar kamu
              mengetahui produk yang perlu
              direstock.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Atur Minimum Stok
        </button>
      </section>

    </main>
  )
}
