"use client"

import { useState } from "react"

import { deleteCustomer } from "../actions/customer.action"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
Card,
CardContent,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"

type Customer = {
id: string
name: string
phone: string | null
email: string | null
address: string | null
_count: {
sales: number
}
}

export default function CustomerList({
customers,
}: {
customers: Customer[]
}) {
const [error, setError] = useState("")

async function handleDelete(id: string) {
if (!confirm("Hapus customer ini?")) {
return
}


try {
  setError("")
  await deleteCustomer(id)
  window.location.reload()
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Gagal menghapus customer"
  )
}


}

return ( <div className="space-y-3">
{error && ( <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2"> <p className="text-xs text-destructive">
{error} </p> </div>
)}


  {customers.length === 0 && (
    <Card>
      <CardContent className="px-4 py-10 text-center">
        <p className="text-sm font-medium">
          Belum ada customer
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Customer yang ditambahkan akan muncul di sini.
        </p>
      </CardContent>
    </Card>
  )}

  {customers.length > 0 && (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer) => (
        <Card
          key={customer.id}
          className="overflow-hidden border-0 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
        >
          <CardHeader className="space-y-2 pb-3">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="min-w-0 truncate text-sm">
                {customer.name}
              </CardTitle>

              <Badge
                variant="secondary"
                className="shrink-0 rounded-full text-[10px] font-normal"
              >
                {customer._count.sales} transaksi
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-1.5 pb-4 text-xs text-muted-foreground">
            {customer.phone && (
              <p className="truncate">
                {customer.phone}
              </p>
            )}

            {customer.email && (
              <p className="truncate">
                {customer.email}
              </p>
            )}

            {customer.address && (
              <p className="line-clamp-2">
                {customer.address}
              </p>
            )}

            {!customer.phone &&
              !customer.email &&
              !customer.address && (
                <p className="text-muted-foreground/60">
                  Belum ada informasi kontak
                </p>
              )}
          </CardContent>

        <CardFooter className="gap-2 px-4 py-3">
            <Button
              variant="outline"
              size="sm"
              className="h-8 flex-1"
              onClick={() =>
                window.location.href = `/customer?edit=${customer.id}`
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
                handleDelete(customer.id)
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
