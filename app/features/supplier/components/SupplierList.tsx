"use client"

import { useState } from "react"
import { deleteSupplier } from "../actions/supplier.action"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
Card,
CardContent,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"

type Supplier = {
id: string
name: string
phone: string | null
email: string | null
address: string | null
_count: {
products: number
purchases: number
}
}

export default function SupplierList({
suppliers,
}: {
suppliers: Supplier[]
}) {
const [error, setError] = useState("")

async function handleDelete(id: string) {
if (!confirm("Hapus supplier ini?")) {
return
}


try {
  setError("")
  await deleteSupplier(id)
  window.location.reload()
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Gagal menghapus supplier"
  )
}


}

return ( <div className="space-y-3">
{error && ( <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2"> <p className="text-xs text-destructive">
{error} </p> </div>
)}


  {suppliers.length === 0 && (
    <Card>
      <CardContent className="px-4 py-10 text-center">
        <p className="text-sm font-medium">
          Belum ada supplier
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Supplier yang ditambahkan akan muncul di sini.
        </p>
      </CardContent>
    </Card>
  )}

  {suppliers.length > 0 && (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {suppliers.map((supplier) => (
        <Card
          key={supplier.id}
         className="overflow-hidden border border-slate-200/50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:border-slate-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
        >
          <CardHeader className="space-y-2 pb-3">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="min-w-0 truncate text-sm">
                {supplier.name}
              </CardTitle>

              <Badge
                variant="secondary"
                className="shrink-0 rounded-full text-[10px] font-normal"
              >
                {supplier._count.products} produk
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-1.5 pb-4 text-xs text-muted-foreground">
            {supplier.phone && (
              <p className="truncate">
                {supplier.phone}
              </p>
            )}

            {supplier.email && (
              <p className="truncate">
                {supplier.email}
              </p>
            )}

            {supplier.address && (
              <p className="line-clamp-2">
                {supplier.address}
              </p>
            )}

            <p className="pt-1 text-[11px]">
              {supplier._count.purchases} pembelian
            </p>

            {!supplier.phone &&
              !supplier.email &&
              !supplier.address && (
                <p className="text-muted-foreground/60">
                  Belum ada informasi kontak
                </p>
              )}
          </CardContent>

          <CardFooter className="gap-2 border-t border-slate-100/70 px-4 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 flex-1"
              onClick={() =>
                window.location.href = `/supplier?edit=${supplier.id}`
              }
            >
              Edit
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() =>
                handleDelete(supplier.id)
              }
            >
              Hapus
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )}
</div>


)
}
