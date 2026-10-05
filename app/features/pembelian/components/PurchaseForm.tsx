
"use client"

import { useMemo, useState } from "react"
import { createPurchase } from "../actions/purchase.action"
import { createProduct } from "../../inventory/actions/product.action"

type Supplier = {
  id: string
  name: string
}

type Category = {
  id: string
  name: string
}

type Unit = {
  id: string
  name: string
  symbol?: string | null
}

type Product = {
  id: string
  name: string
  purchasePrice: number
  stock: number
}

type BusinessType =
  | "APOTEK"
  | "KLONTONG"
  | "BANGUNAN"

type Props = {
  suppliers: Supplier[]
  products: Product[]
  categories: Category[]
  units: Unit[]
  businessType: BusinessType
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}

export default function PurchaseForm({
  suppliers,
  products,
  categories,
  units,
  businessType,
}: Props) {
  const [savingPurchase, setSavingPurchase] =
    useState(false)

  const [creatingProduct, setCreatingProduct] =
    useState(false)

  const [
    creatingProductLoading,
    setCreatingProductLoading,
  ] = useState(false)

  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [purchasePrice, setPurchasePrice] =
    useState("")

  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    categoryId: "",
    unitId: "",
    sellingPrice: "",
    minimumStock: "0",
    weight: "",
    expiredAt: "",
    dosage: "",
    volume: "",
    notes: "",
  })

  const selectedProduct = useMemo(
    () =>
      products.find(
        (product) => product.id === productId
      ),
    [products, productId]
  )

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) return products

    return products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(keyword)
    )
  }, [products, search])

  const subtotal =
    Number(quantity || 0) *
    Number(purchasePrice || 0)

  function setNewProductField(
    field: keyof typeof newProduct,
    value: string
  ) {
    setNewProduct((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function selectProduct(product: Product) {
    setProductId(product.id)
    setSearch(product.name)
    setPurchasePrice(
      String(product.purchasePrice)
    )
    setCreatingProduct(false)
    setError("")
  }

  function openCreateProduct() {
    setCreatingProduct(true)

    setNewProduct((current) => ({
      ...current,
      name: search.trim(),
    }))

    setError("")
  }

  function cancelCreateProduct() {
    setCreatingProduct(false)
    setError("")
  }

  async function handleCreateProduct() {
    setError("")

    const name = newProduct.name.trim()

    if (name.length < 2) {
      setError("Nama barang minimal 2 karakter")
      return
    }

    if (!newProduct.categoryId) {
      setError("Kategori wajib dipilih")
      return
    }

    const sellingPrice = Number(
      newProduct.sellingPrice || 0
    )

    if (
      Number.isNaN(sellingPrice) ||
      sellingPrice < 0
    ) {
      setError("Harga jual tidak valid")
      return
    }

    setCreatingProductLoading(true)

    try {
      const product = await createProduct({
        name,
        barcode:
          newProduct.barcode || undefined,
        categoryId:
          newProduct.categoryId,
        supplierId: undefined,
        unitId:
          newProduct.unitId || undefined,
        purchasePrice: 0,
        sellingPrice,
        stock: 0,
        minimumStock: Number(
          newProduct.minimumStock || 0
        ),
        weight:
          businessType === "BANGUNAN"
            ? Number(newProduct.weight || 0)
            : undefined,
        expiredAt:
          businessType === "APOTEK"
            ? newProduct.expiredAt
            : "",
        dosage:
          businessType === "APOTEK"
            ? newProduct.dosage
            : "",
        volume:
          businessType === "APOTEK"
            ? Number(newProduct.volume || 0)
            : undefined,
        notes: newProduct.notes || "",
      })

      setProductId(product.id)
      setSearch(product.name)
      setPurchasePrice("")
      setCreatingProduct(false)

      setNewProduct({
        name: "",
        barcode: "",
        categoryId: "",
        unitId: "",
        sellingPrice: "",
        minimumStock: "0",
        weight: "",
        expiredAt: "",
        dosage: "",
        volume: "",
        notes: "",
      })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal membuat barang"
      )
    } finally {
      setCreatingProductLoading(false)
    }
  }

  async function handleSubmit(
    formData: FormData
  ) {
    setSavingPurchase(true)
    setError("")

    try {
      if (!productId) {
        throw new Error("Produk wajib dipilih")
      }

      const quantityValue = Number(quantity)
      const priceValue = Number(purchasePrice)

      if (
        !quantityValue ||
        quantityValue < 1
      ) {
        throw new Error(
          "Jumlah harus lebih dari 0"
        )
      }

      if (
        Number.isNaN(priceValue) ||
        priceValue < 0
      ) {
        throw new Error(
          "Harga beli tidak valid"
        )
      }

      await createPurchase({
        supplierId:
          String(
            formData.get("supplierId") || ""
          ) || undefined,

        invoiceNumber: String(
          formData.get("invoiceNumber") || ""
        ),

        paymentMethod: String(
          formData.get("paymentMethod") || ""
        ),

        items: [
          {
            productId,
            quantity: quantityValue,
            purchasePrice: priceValue,
          },
        ],

        discount: 0,
        tax: 0,
        notes: "",
      })

      window.location.reload()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan pembelian"
      )
    } finally {
      setSavingPurchase(false)
    }
  }

  return (
    <form
      action={handleSubmit}
      className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Tambah Pembelian
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Barang yang dibeli akan otomatis
          menambah stok.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Nomor Invoice
        </label>

        <input
          name="invoiceNumber"
          required
          placeholder="Contoh: PB-001"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Supplier
        </label>

        <select
          name="supplierId"
          className={inputClass}
        >
          <option value="">
            Pilih supplier
          </option>

          {suppliers.map((supplier) => (
            <option
              key={supplier.id}
              value={supplier.id}
            >
              {supplier.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-600">
          Barang
        </label>

        <input
          type="text"
          value={search}
          onChange={(event) => {
            const value = event.target.value

            setSearch(value)
            setError("")

            if (
              selectedProduct &&
              value !== selectedProduct.name
            ) {
              setProductId("")
              setPurchasePrice("")
            }

            if (creatingProduct) {
              setNewProductField(
                "name",
                value
              )
            }
          }}
          placeholder="Cari nama barang..."
          className={inputClass}
        />

        {search &&
          !selectedProduct &&
          !creatingProduct && (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredProducts.map(
                      (product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() =>
                            selectProduct(
                              product
                            )
                          }
                          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-violet-50"
                        >
                          <span className="font-medium text-slate-800">
                            {product.name}
                          </span>

                          <span className="text-xs text-slate-500">
                            Stok {product.stock}
                          </span>
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={openCreateProduct}
                    className="w-full border-t border-slate-100 px-3 py-2.5 text-left text-sm font-medium text-violet-600 hover:bg-violet-50"
                  >
                    + Tambah barang baru
                  </button>
                </>
              ) : (
                <div>
                  <p className="px-3 py-3 text-sm text-slate-500">
                    Barang tidak ditemukan.
                  </p>

                  <button
                    type="button"
                    onClick={openCreateProduct}
                    className="w-full border-t border-slate-100 px-3 py-2.5 text-left text-sm font-medium text-violet-600 hover:bg-violet-50"
                  >
                    + Tambah barang baru
                  </button>
                </div>
              )}
            </div>
          )}

        {!search &&
          !selectedProduct &&
          !creatingProduct && (
            <button
              type="button"
              onClick={openCreateProduct}
              className="text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              + Tambah barang baru
            </button>
          )}
      </div>

      {creatingProduct && (
        <div className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Tambah Barang Baru
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Barang dibuat sebagai master.
              Stok masuk melalui pembelian.
            </p>
          </div>

          <input
            value={newProduct.name}
            onChange={(event) =>
              setNewProductField(
                "name",
                event.target.value
              )
            }
            placeholder="Nama barang"
            className={inputClass}
          />

          <select
            value={newProduct.categoryId}
            onChange={(event) =>
              setNewProductField(
                "categoryId",
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              Pilih kategori
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <input
            value={newProduct.barcode}
            onChange={(event) =>
              setNewProductField(
                "barcode",
                event.target.value
              )
            }
            placeholder="Barcode (opsional)"
            className={inputClass}
          />

          <select
            value={newProduct.unitId}
            onChange={(event) =>
              setNewProductField(
                "unitId",
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              Pilih satuan
            </option>

            {units.map((unit) => (
              <option
                key={unit.id}
                value={unit.id}
              >
                {unit.name}
                {unit.symbol
                  ? ` (${unit.symbol})`
                  : ""}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            value={newProduct.sellingPrice}
            onChange={(event) =>
              setNewProductField(
                "sellingPrice",
                event.target.value
              )
            }
            placeholder="Harga jual"
            className={inputClass}
          />

          {businessType === "BANGUNAN" && (
            <input
              type="number"
              min="0"
              step="0.01"
              value={newProduct.weight}
              onChange={(event) =>
                setNewProductField(
                  "weight",
                  event.target.value
                )
              }
              placeholder="Berat"
              className={inputClass}
            />
          )}

          {businessType === "APOTEK" && (
            <>
              <input
                type="date"
                value={newProduct.expiredAt}
                onChange={(event) =>
                  setNewProductField(
                    "expiredAt",
                    event.target.value
                  )
                }
                className={inputClass}
              />

              <input
                value={newProduct.dosage}
                onChange={(event) =>
                  setNewProductField(
                    "dosage",
                    event.target.value
                  )
                }
                placeholder="Dosis"
                className={inputClass}
              />

              <input
                type="number"
                min="0"
                step="0.01"
                value={newProduct.volume}
                onChange={(event) =>
                  setNewProductField(
                    "volume",
                    event.target.value
                  )
                }
                placeholder="Volume"
                className={inputClass}
              />
            </>
          )}

          <textarea
            value={newProduct.notes}
            onChange={(event) =>
              setNewProductField(
                "notes",
                event.target.value
              )
            }
            placeholder="Catatan"
            rows={2}
            className={inputClass}
          />

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={cancelCreateProduct}
              disabled={creatingProductLoading}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleCreateProduct}
              disabled={creatingProductLoading}
              className="flex-1 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creatingProductLoading
                ? "Membuat..."
                : "Tambah Barang"}
            </button>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500">
                Barang
              </p>

              <p className="mt-0.5 font-medium text-slate-900">
                {selectedProduct.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Stok sekarang
              </p>

              <p className="mt-0.5 font-medium text-slate-900">
                {selectedProduct.stock}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Jumlah Masuk
        </label>

        <input
          name="quantity"
          type="number"
          min="1"
          required
          value={quantity}
          onChange={(event) =>
            setQuantity(event.target.value)
          }
          placeholder="Jumlah barang"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Harga Modal
        </label>

        <input
          name="purchasePrice"
          type="number"
          min="0"
          required
          value={purchasePrice}
          onChange={(event) =>
            setPurchasePrice(
              event.target.value
            )
          }
          placeholder="Harga beli per unit"
          className={inputClass}
        />

        {purchasePrice && (
          <p className="mt-1 text-xs text-slate-500">
            {formatRupiah(
              Number(purchasePrice)
            )}{" "}
            / unit
          </p>
        )}
      </div>

      <div className="rounded-lg bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Subtotal
          </span>

          <span className="font-semibold text-slate-900">
            {formatRupiah(subtotal)}
          </span>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Pembayaran
        </label>

        <select
          name="paymentMethod"
          required
          className={inputClass}
        >
          <option value="">
            Pilih pembayaran
          </option>

          <option value="CASH">
            Tunai
          </option>

          <option value="TRANSFER">
            Transfer
          </option>

          <option value="QRIS">
            QRIS
          </option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={
          savingPurchase ||
          creatingProduct
        }
        className="w-full rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {savingPurchase
          ? "Menyimpan..."
          : "Simpan Pembelian"}
      </button>
    </form>
  )
}
