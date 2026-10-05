
"use client"

import { useState } from "react"

import {
  completeProfile,
  deleteAccount,
} from "../actions/profile.action"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  businessName: string
  businessType: string
  ownerName: string
  phone: string
  address: string
}

export default function ProfileForm({
  businessName,
  businessType,
  ownerName,
  phone,
  address,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    try {
      await completeProfile({
        businessName: String(formData.get("businessName")),
        businessType: String(formData.get("businessType")) as
          | "APOTEK"
          | "KLONTONG"
          | "BANGUNAN",
        ownerName: String(formData.get("ownerName") || ""),
        phone: String(formData.get("phone") || ""),
        address: String(formData.get("address") || ""),
      })
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      )
      setLoading(false)
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Yakin ingin menghapus akun dan seluruh data toko? Tindakan ini tidak dapat dibatalkan."
    )

    if (!confirmed) return

    setLoading(true)
    setError("")

    try {
      await deleteAccount()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus akun"
      )
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-violet-500">
          Pengaturan
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Informasi Usaha
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Lengkapi informasi usaha untuk mulai menggunakan Corvusion.
        </p>
      </div>

      <form action={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Informasi Toko
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="businessName"
                className="text-sm font-medium"
              >
                Nama Toko
              </label>

              <Input
                id="businessName"
                name="businessName"
                type="text"
                required
                defaultValue={businessName}
                placeholder="Nama toko"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="businessType"
                className="text-sm font-medium"
              >
                Jenis Usaha
              </label>

              <Select
                name="businessType"
                defaultValue={businessType}
                required
              >
                <SelectTrigger id="businessType">
                  <SelectValue placeholder="Pilih jenis usaha" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="APOTEK">
                    Apotek
                  </SelectItem>

                  <SelectItem value="KLONTONG">
                    Minimarket
                  </SelectItem>

                  <SelectItem value="BANGUNAN">
                    Toko Bangunan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="ownerName"
                className="text-sm font-medium"
              >
                Nama Pemilik
              </label>

              <Input
                id="ownerName"
                name="ownerName"
                type="text"
                defaultValue={ownerName}
                placeholder="Nama pemilik"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium"
              >
                Nomor Telepon
              </label>

              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={phone}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="address"
                className="text-sm font-medium"
              >
                Alamat
              </label>

              <Textarea
                id="address"
                name="address"
                rows={4}
                defaultValue={address}
                placeholder="Alamat toko"
                className="resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}
          </CardContent>

          <CardFooter className="justify-end border-t">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="mt-10">
        <div className="mb-3">
          <h2 className="text-sm font-semibold">
            Hapus Akun
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Menghapus akun akan menghapus seluruh data toko secara permanen.
          </p>
        </div>

        <Button
          type="button"
          variant="destructive"
          disabled={loading}
          onClick={handleDeleteAccount}
        >
          Hapus Akun
        </Button>
      </div>
    </div>
  )
}
