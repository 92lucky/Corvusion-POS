
"use client"

import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Product = {
  id: string
  name: string
  stock: number
  minimumStock: number
  sellingPrice: unknown

  category: {
    name: string
  } | null

  unit: {
    name: string
    symbol: string | null
  } | null
}

type Props = {
  products: Product[]
}

export default function LaporanStok({
  products,
}: Props) {
  const [filter, setFilter] =
    useState<"ALL" | "LOW">("ALL")

  const lowStockCount = useMemo(
    () =>
      products.filter(
        (product) =>
          product.stock <= product.minimumStock
      ).length,
    [products]
  )

  const filteredProducts = useMemo(() => {
    if (filter === "LOW") {
      return products.filter(
        (product) =>
          product.stock <= product.minimumStock
      )
    }

    return products
  }, [products, filter])

  const totalStock = useMemo(
    () =>
      products.reduce(
        (total, product) =>
          total + product.stock,
        0
      ),
    [products]
  )

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        <div className="rounded-lg border border-border/60 bg-card px-2.5 py-2">
          <p className="text-[10px] text-muted-foreground">
            Total Barang
          </p>
          <p className="mt-0.5 text-base font-semibold">
            {products.length}
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card px-2.5 py-2">
          <p className="text-[10px] text-muted-foreground">
            Total Stok
          </p>
          <p className="mt-0.5 text-base font-semibold">
            {totalStock}
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card px-2.5 py-2">
          <p className="text-[10px] text-muted-foreground">
            Stok Menipis
          </p>
          <p className="mt-0.5 text-base font-semibold">
            {lowStockCount}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-card p-1">
        <Button
          type="button"
          variant={filter === "ALL" ? "default" : "ghost"}
          size="sm"
          className="h-6 px-2 text-[11px]"
          onClick={() => setFilter("ALL")}
        >
          Semua
        </Button>

        <Button
          type="button"
          variant={filter === "LOW" ? "default" : "ghost"}
          size="sm"
          className="h-6 px-2 text-[11px]"
          onClick={() => setFilter("LOW")}
        >
          Stok Menipis
          {lowStockCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-4 min-w-4 px-1 text-[9px]"
            >
              {lowStockCount}
            </Badge>
          )}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed text-xs">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="h-8 w-[30%] whitespace-nowrap px-2 text-[10px]">
                  Barang
                </TableHead>

                <TableHead className="h-8 w-[23%] whitespace-nowrap px-2 text-[10px]">
                  Kategori
                </TableHead>

                <TableHead className="h-8 w-[15%] whitespace-nowrap px-2 text-right text-[10px]">
                  Stok
                </TableHead>

                <TableHead className="h-8 w-[15%] whitespace-nowrap px-2 text-right text-[10px]">
                  Minimum
                </TableHead>

                <TableHead className="h-8 w-[17%] whitespace-nowrap px-2 text-right text-[10px]">
                  Harga Jual
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredProducts.map((product) => {
                const isLow =
                  product.stock <= product.minimumStock

                return (
                  <TableRow
                    key={product.id}
                    className="h-9"
                  >
                    <TableCell className="truncate px-2 py-1.5 font-medium">
                      {product.name}
                    </TableCell>

                    <TableCell className="truncate px-2 py-1.5 text-muted-foreground">
                      {product.category?.name ?? "-"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-2 py-1.5 text-right">
                      <span
                        className={
                          isLow
                            ? "font-medium text-destructive"
                            : "font-medium"
                        }
                      >
                        {product.stock}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {product.unit?.symbol ??
                          product.unit?.name ??
                          ""}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-2 py-1.5 text-right text-muted-foreground">
                      {product.minimumStock}
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-2 py-1.5 text-right">
                      Rp{" "}
                      {Number(
                        product.sellingPrice
                      ).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>
                )
              })}

              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-14 text-center text-xs text-muted-foreground"
                  >
                    Tidak ada data stok.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
