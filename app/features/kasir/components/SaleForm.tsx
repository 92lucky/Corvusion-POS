"use client"

import { useState } from "react"
import { createSale } from "../actions/sale.action"

type Product = {
  id: string
  name: string
  stock: number
  sellingPrice: number
}

type Customer = {
  id: string
  name: string
}

type Props = {
  products: Product[]
  customers: Customer[]
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

export default function SaleForm({
  products,
  customers,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [productId, setProductId] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const [showProducts, setShowProducts] = useState(false)

  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("CASH")
  const [paidAmount, setPaidAmount] = useState("")

  const product = products.find(
    (item) => item.id === productId
  )

  const filteredProducts = products.filter((item) =>
    item.name
      .toLowerCase()
      .includes(productSearch.toLowerCase())
  )

  const price = product?.sellingPrice ?? 0
  const total = price * quantity
  const change = Number(paidAmount || 0) - total

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    try {
      if (!product) {
        throw new Error("Pilih barang")
      }

      if (quantity < 1) {
        throw new Error("Jumlah tidak valid")
      }

      if (quantity > product.stock) {
        throw new Error("Stok tidak mencukupi")
      }

      const paid = Number(paidAmount || 0)

      if (paymentMethod === "CASH" && paid < total) {
        throw new Error("Uang pembayaran kurang")
      }

      await createSale({
        customerId:
          String(formData.get("customerId") || "") ||
          undefined,

        paymentMethod,

        discount: 0,
        tax: 0,

        paidAmount:
          paymentMethod === "CASH"
            ? paid
            : total,

        notes: "",

        items: [
          {
            productId: product.id,
            quantity,
            sellingPrice: price,
          },
        ],
      })

      window.location.reload()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal memproses transaksi"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-3"
    >
      <h2 className="text-sm font-semibold text-slate-900">
        Transaksi Baru
      </h2>

      <select
        name="customerId"
        className={inputClass}
      >
        <option value="">
          Pelanggan umum
        </option>

        {customers.map((customer) => (
          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.name}
          </option>
        ))}
      </select>

      {/* Product search */}
      <div className="relative">
        <input
          type="text"
          value={productSearch}
          onChange={(e) => {
            setProductSearch(e.target.value)
            setProductId("")
            setShowProducts(true)
          }}
          onFocus={() => setShowProducts(true)}
          placeholder="Ketik nama barang..."
          autoComplete="off"
          className={inputClass}
        />

        {showProducts &&
          productSearch &&
          filteredProducts.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
              {filteredProducts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setProductId(item.id)
                    setProductSearch(item.name)
                    setShowProducts(false)
                    setQuantity(1)
                    setError("")
                  }}
                  className="block w-full px-3 py-2 text-left hover:bg-slate-50"
                >
                  <div className="text-sm font-medium text-slate-900">
                    {item.name}
                  </div>

                  <div className="text-xs text-slate-500">
                    Stok {item.stock} · Rp{" "}
                    {item.sellingPrice.toLocaleString("id-ID")}
                  </div>
                </button>
              ))}
            </div>
          )}

        {showProducts &&
          productSearch &&
          filteredProducts.length === 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-500 shadow-lg">
              Barang tidak ditemukan
            </div>
          )}
      </div>

      {product && (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Harga</span>
            <span className="text-slate-900">
              Rp {price.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between text-slate-500">
            <span>Stok</span>
            <span className="text-slate-900">
              {product.stock}
            </span>
          </div>
        </div>
      )}

      <input
        name="quantity"
        type="number"
        min="1"
        max={product?.stock}
        value={quantity}
        onChange={(e) =>
          setQuantity(Number(e.target.value))
        }
        required
        placeholder="Jumlah"
        className={inputClass}
      />

      <div className="flex items-center justify-between border-y border-slate-100 py-3">
        <span className="text-sm text-slate-500">
          Total
        </span>

        <span className="text-lg font-semibold text-slate-900">
          Rp {total.toLocaleString("id-ID")}
        </span>
      </div>

      <select
        name="paymentMethod"
        value={paymentMethod}
        onChange={(e) =>
          setPaymentMethod(e.target.value)
        }
        required
        className={inputClass}
      >
        <option value="CASH">Tunai</option>
        <option value="QRIS">QRIS</option>
        <option value="TRANSFER">Transfer</option>
      </select>

      {paymentMethod === "CASH" && (
        <>
          <input
            name="paidAmount"
            type="number"
            min={total}
            value={paidAmount}
            onChange={(e) =>
              setPaidAmount(e.target.value)
            }
            placeholder="Uang diterima"
            className={inputClass}
          />

          {paidAmount && (
            <div className="flex justify-between py-2 text-sm">
              <span className="text-slate-500">
                Kembalian
              </span>

              <span className="font-medium text-slate-900">
                Rp{" "}
                {Math.max(
                  change,
                  0
                ).toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </>
      )}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !product}
        className="w-full rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Bayar"}
      </button>
    </form>
  )
}
