
"use client"

import { useState } from "react"
import {
  createProduct,
  updateProduct,
  findExistingProduct,
} from "../actions/product.action"
import CategoryForm from "./CategoryForm"
import UnitForm from "./UnitForm"

type Option = {
  id: string
  name: string
  symbol?: string | null
}

type ExistingProduct = {
  id: string
  name: string
  barcode: string | null
  categoryId: string | null
  supplierId: string | null
  unitId: string | null
  purchasePrice: unknown
  sellingPrice: unknown
  stock: number
  weight: unknown
  expiredAt: Date | null
  dosage: string | null
  volume: unknown
  notes: string | null
}

type Product = ExistingProduct

type BusinessType =
  | "APOTEK"
  | "KLONTONG"
  | "BANGUNAN"

type Props = {
  categories: Option[]
  suppliers: Option[]
  units: Option[]
  businessType: BusinessType
  product?: Product
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

export default function ProductForm({
  categories: initialCategories,
  suppliers,
  units: initialUnits,
  businessType,
  product,
}: Props) {
  const [categories, setCategories] =
    useState(initialCategories)

  const [units] =
    useState(initialUnits)

  const [existingProduct, setExistingProduct] =
    useState<ExistingProduct | null>(null)

  const [checking, setChecking] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEdit = Boolean(product)

  const [form, setForm] = useState({
    name: product?.name ?? "",
    barcode: product?.barcode ?? "",
    categoryId: product?.categoryId ?? "",
    supplierId: product?.supplierId ?? "",
    unitId: product?.unitId ?? "",

    purchasePrice: product?.purchasePrice
      ? String(product.purchasePrice)
      : "",

    sellingPrice: product?.sellingPrice
      ? String(product.sellingPrice)
      : "",

    stock: product
      ? String(product.stock)
      : "",

    weight: product?.weight
      ? String(product.weight)
      : "",

    expiredAt: product?.expiredAt
      ? new Date(product.expiredAt)
          .toISOString()
          .split("T")[0]
      : "",

    dosage: product?.dosage ?? "",

    volume: product?.volume
      ? String(product.volume)
      : "",

    notes: product?.notes ?? "",
  })

  function setField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleNameChange(
    value: string
  ) {
    setField("name", value)

    if (isEdit) return

    const name = value.trim()

    if (name.length < 2) {
      setExistingProduct(null)
      return
    }

    setChecking(true)

    try {
      const found =
        await findExistingProduct(name)

      if (!found) {
        setExistingProduct(null)
        return
      }

      setExistingProduct(found)

      setForm((current) => ({
        ...current,

        name: found.name,
        barcode: found.barcode ?? "",
        categoryId: found.categoryId ?? "",
        supplierId: found.supplierId ?? "",
        unitId: found.unitId ?? "",

        purchasePrice:
          found.purchasePrice != null
            ? String(found.purchasePrice)
            : "",

        sellingPrice:
          found.sellingPrice != null
            ? String(found.sellingPrice)
            : "",

        stock: "",

        weight:
          found.weight != null
            ? String(found.weight)
            : "",

        expiredAt: found.expiredAt
          ? new Date(found.expiredAt)
              .toISOString()
              .split("T")[0]
          : "",

        dosage: found.dosage ?? "",

        volume:
          found.volume != null
            ? String(found.volume)
            : "",

        notes: found.notes ?? "",
      }))
    } catch {
      setExistingProduct(null)
    } finally {
      setChecking(false)
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setLoading(true)
    setError("")

    try {
      if (!form.categoryId) {
        throw new Error(
          "Kategori wajib dipilih"
        )
      }

      const additionalStock = Number(
        form.stock || 0
      )

      if (additionalStock < 0) {
        throw new Error(
          "Stok tambahan tidak valid"
        )
      }

      const stock = existingProduct
        ? existingProduct.stock +
          additionalStock
        : additionalStock

      const input = {
        name: form.name,
        categoryId: form.categoryId,
        barcode: form.barcode,
        supplierId: form.supplierId,
        unitId: form.unitId,

        purchasePrice: Number(
          form.purchasePrice || 0
        ),

        sellingPrice: Number(
          form.sellingPrice || 0
        ),

        stock,

        minimumStock: 0,

        weight:
          businessType === "BANGUNAN"
            ? Number(form.weight || 0)
            : undefined,

        expiredAt:
          businessType === "APOTEK"
            ? form.expiredAt
            : "",

        dosage:
          businessType === "APOTEK"
            ? form.dosage
            : "",

        volume:
          businessType === "APOTEK"
            ? form.volume || undefined
            : undefined,

        notes: form.notes,
      }

      if (product) {
        await updateProduct(
          product.id,
          input
        )
      } else if (existingProduct) {
        await updateProduct(
          existingProduct.id,
          input
        )
      } else {
        await createProduct(input)
      }

      window.location.reload()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan barang"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <h2 className="text-sm font-semibold text-slate-900">
        {isEdit
          ? "Edit Barang"
          : "Tambah Barang"}
      </h2>

      <input
        name="name"
        required
        value={form.name}
        onChange={(event) =>
          handleNameChange(
            event.target.value
          )
        }
        placeholder="Nama barang"
        className={inputClass}
      />

      {checking && (
        <p className="text-xs text-slate-400">
          Mengecek barang...
        </p>
      )}

      {existingProduct && !isEdit && (
        <div className="rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-700">
          <strong>
            Barang sudah ada.
          </strong>

          <br />

          Data barang otomatis terisi.

          <br />

          Stok saat ini:{" "}
          <strong>
            {existingProduct.stock}
          </strong>

          <br />

          Masukkan stok tambahan saja.
        </div>
      )}

      <div className="space-y-2">
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={(event) =>
            setField(
              "categoryId",
              event.target.value
            )
          }
          required
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

        <CategoryForm
          onCreated={(category) => {
            setCategories((current) => [
              ...current,
              category,
            ])

            setField(
              "categoryId",
              category.id
            )
          }}
        />
      </div>

      <input
        name="barcode"
        value={form.barcode}
        onChange={(event) =>
          setField(
            "barcode",
            event.target.value
          )
        }
        placeholder="Barcode"
        className={inputClass}
      />

      <select
        name="supplierId"
        value={form.supplierId}
        onChange={(event) =>
          setField(
            "supplierId",
            event.target.value
          )
        }
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

      <div className="space-y-2">
        <select
          name="unitId"
          value={form.unitId}
          onChange={(event) =>
            setField(
              "unitId",
              event.target.value
            )
          }
          className={inputClass}
        >
          <option value="">
            Pilih satuan/tipe
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

        <UnitForm />
      </div>

      {businessType === "BANGUNAN" && (
        <input
          name="weight"
          type="number"
          min="0"
          step="0.01"
          value={form.weight}
          onChange={(event) =>
            setField(
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
            name="expiredAt"
            type="date"
            value={form.expiredAt}
            onChange={(event) =>
              setField(
                "expiredAt",
                event.target.value
              )
            }
            className={inputClass}
          />

          <input
            name="dosage"
            value={form.dosage}
            onChange={(event) =>
              setField(
                "dosage",
                event.target.value
              )
            }
            placeholder="Dosis"
            className={inputClass}
          />

          <input
            name="volume"
            type="text"
            value={form.volume}
            onChange={(event) =>
              setField(
                "volume",
                event.target.value
              )
            }
            placeholder="Volume"
            className={inputClass}
          />
        </>
      )}

      <input
        name="purchasePrice"
        type="number"
        min="0"
        required
        value={form.purchasePrice}
        onChange={(event) =>
          setField(
            "purchasePrice",
            event.target.value
          )
        }
        placeholder="Harga modal"
        className={inputClass}
      />

      <input
        name="sellingPrice"
        type="number"
        min="0"
        required
        value={form.sellingPrice}
        onChange={(event) =>
          setField(
            "sellingPrice",
            event.target.value
          )
        }
        placeholder="Harga jual"
        className={inputClass}
      />

      <input
        name="stock"
        type="number"
        min="0"
        required
        value={form.stock}
        onChange={(event) =>
          setField(
            "stock",
            event.target.value
          )
        }
        placeholder={
          existingProduct
            ? "Stok tambahan"
            : "Stok"
        }
        className={inputClass}
      />

      <textarea
        name="notes"
        value={form.notes}
        onChange={(event) =>
          setField(
            "notes",
            event.target.value
          )
        }
        placeholder="Catatan"
        rows={3}
        className={inputClass}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={
          loading || checking
        }
        className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50"
      >
        {loading
          ? "Menyimpan..."
          : isEdit
            ? "Simpan Perubahan"
            : existingProduct
              ? "Tambah Stok"
              : "Tambah Barang"}
      </button>
    </form>
  )
}
