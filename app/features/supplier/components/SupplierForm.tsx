
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createSupplier,
  updateSupplier,
} from "../actions/supplier.action"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Supplier = {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
}

export default function SupplierForm({
  supplier,
}: {
  supplier?: Supplier
}) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEdit = Boolean(supplier)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    try {
      const input = {
        name: String(formData.get("name")),
        phone: String(formData.get("phone") || ""),
        email: String(formData.get("email") || ""),
        address: String(formData.get("address") || ""),
      }

      if (supplier) {
        await updateSupplier(supplier.id, input)
      } else {
        await createSupplier(input)
      }

      router.push("/supplier")
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan supplier"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      action={handleSubmit}
      className="max-w-2xl space-y-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
    >
      <div>
        <h2 className="text-sm font-semibold">
          {isEdit ? "Edit Supplier" : "Tambah Supplier"}
        </h2>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {isEdit
            ? "Perbarui informasi supplier."
            : "Tambahkan supplier untuk kebutuhan pembelian."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium">
            Nama Supplier
          </label>

          <Input
            name="name"
            required
            defaultValue={supplier?.name ?? ""}
            placeholder="Contoh: PT Sumber Sehat"
            className="h-9 border-gray-200 focus-visible:border-violet-300 focus-visible:ring-violet-100 placeholder:text-slate-300/70"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium">
            Nomor Telepon
          </label>

          <Input
            name="phone"
            type="tel"
            defaultValue={supplier?.phone ?? ""}
            placeholder="08xxxxxxxxxx"
            className="h-9 border-gray-200 focus-visible:border-violet-300 focus-visible:ring-violet-100  placeholder:text-slate-300/70"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium">
            Email
          </label>

          <Input
            name="email"
            type="email"
            defaultValue={supplier?.email ?? ""}
            placeholder="supplier@email.com"
            className="h-9 border-gray-200 focus-visible:border-violet-300 focus-visible:ring-violet-100 placeholder:text-slate-300/70"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium">
            Alamat
          </label>

          <Input
            name="address"
            defaultValue={supplier?.address ?? ""}
            placeholder="Alamat supplier"
            className="h-9 border-gray-200 focus-visible:border-violet-300 focus-visible:ring-violet-100 placeholder:text-slate-300/70"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
          <p className="text-xs text-destructive">
            {error}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          size="sm"
          className="w-full bg-violet-500 text-white hover:bg-violet-600 sm:w-auto"
        >
          {loading
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Tambah Supplier"}
        </Button>
      </div>
    </form>
  )
}
