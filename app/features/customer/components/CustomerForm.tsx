"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  createCustomer,
  updateCustomer,
} from "../actions/customer.action"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


type Customer = {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
}

export default function CustomerForm({
  customer,
}: {
  customer?: Customer
}) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEdit = Boolean(customer)

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

      if (customer) {
        await updateCustomer(customer.id, input)
      } else {
        await createCustomer(input)
      }

      router.push("/customer")
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan customer"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-xl border border-border/60 bg-card p-4 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold">
          {isEdit ? "Edit Customer" : "Tambah Customer"}
        </h2>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {isEdit
            ? "Perbarui informasi customer."
            : "Tambahkan customer baru ke toko."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Nama
          </label>

          <Input
            name="name"
            required
            defaultValue={customer?.name ?? ""}
            placeholder="Nama customer"
            className="placeholder:text-slate-300/70"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Nomor Telepon
          </label>

          <Input
            name="phone"
            type="tel"
            defaultValue={customer?.phone ?? ""}
            placeholder="Nomor telepon"
            className="placeholder:text-slate-300/70"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Email
          </label>

          <Input
            name="email"
            type="email"
            defaultValue={customer?.email ?? ""}
            placeholder="Email"
            className="placeholder:text-slate-300/70"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Alamat
          </label>

          <Input
            name="address"
            defaultValue={customer?.address ?? ""}
            placeholder="Alamat"
            className="placeholder:text-slate-300/70"
          />
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
          <p className="text-xs text-destructive">
            {error}
          </p>
        </div>
      )}

      <div className="mt-4 flex justify-end ">
        <Button className="bg-violet-500"

          type="submit"
          size="sm"
          disabled={loading}

        >
          {loading
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Tambah Customer"}
        </Button>
      </div>
    </form>
  )
}
