"use client"

import { useMemo, useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import ExportButton from "@/app/components/ExportButton"
import { exportToExcel } from "@/app/lib/export/excel"

type Sale = {
  id: string
  invoiceNumber: string
  saleDate: Date
  total: unknown
  paymentMethod: string
  status: string

  customer: {
    name: string
  } | null

  cashier: {
    name: string | null
  } | null
}

type Props = {
  sales: Sale[]
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}

function paymentLabel(method: string) {
  switch (method) {
    case "CASH":
      return "Tunai"
    case "QRIS":
      return "QRIS"
    case "TRANSFER":
      return "Transfer"
    default:
      return method
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Selesai"
    case "PENDING":
      return "Pending"
    case "CANCELLED":
      return "Dibatalkan"
    default:
      return status
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"

    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700"

    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700"

    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

function formatDate(value: Date) {
  const date = new Date(value)

  return {
    date: date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),

    time: date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

export default function LaporanPenjualan({
  sales,
}: Props) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const date = new Date(sale.saleDate)

      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`)

        if (date < start) return false
      }

      if (endDate) {
        const end = new Date(`${endDate}T23:59:59.999`)

        if (date > end) return false
      }

      return true
    })
  }, [sales, startDate, endDate])

  const totalSales = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.total),
    0
  )

  function handleExport() {
    exportToExcel(
      "laporan-penjualan.xlsx",
      filteredSales.map((sale) => ({
        Invoice: sale.invoiceNumber,
        Tanggal: new Date(
          sale.saleDate
        ).toLocaleString("id-ID"),
        Pelanggan: sale.customer?.name ?? "Umum",
        Kasir: sale.cashier?.name ?? "-",
        Pembayaran: paymentLabel(
          sale.paymentMethod
        ),
        Status: statusLabel(sale.status),
        Total: Number(sale.total),
      }))
    )
  }

  return (
    <div className="space-y-5">

      {/* Filter */}
      <div className="rounded-xl border border-border/60 bg-card p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">

          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Dari
            </label>

            <Input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="h-9 w-full bg-background"
            />
          </div>

          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Sampai
            </label>

            <Input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="h-9 w-full bg-background"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
            disabled={!startDate && !endDate}
            onClick={() => {
              setStartDate("")
              setEndDate("")
            }}
          >
            Reset
          </Button>

        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2">

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">
            Total Penjualan
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
            {formatRupiah(totalSales)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Berdasarkan periode yang dipilih
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">
            Transaksi
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
            {filteredSales.length.toLocaleString("id-ID")}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Transaksi penjualan
          </p>
        </div>

      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm md:block">

        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Daftar Penjualan
            </h3>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Riwayat transaksi penjualan
            </p>
          </div>

          <div className="flex items-center gap-2">

            <Badge
              variant="secondary"
              className="rounded-full px-2.5 font-medium"
            >
              {filteredSales.length} transaksi
            </Badge>

            <ExportButton
              onClick={handleExport}
            />

          </div>

        </div>

        <div className="overflow-x-auto">

          <Table>
            <TableHeader>
              <TableRow className="border-border/60 bg-muted/25 hover:bg-muted/25">

                <TableHead className="h-10 px-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Transaksi
                </TableHead>

                <TableHead className="h-10 px-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Tanggal
                </TableHead>

                <TableHead className="h-10 px-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Pelanggan
                </TableHead>

                <TableHead className="h-10 px-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Kasir
                </TableHead>

                <TableHead className="h-10 px-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Pembayaran
                </TableHead>

                <TableHead className="h-10 px-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>

                <TableHead className="h-10 px-4 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Total
                </TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>

              {filteredSales.map((sale) => {
                const date = formatDate(
                  sale.saleDate
                )

                const customer =
                  sale.customer?.name ?? "Umum"

                return (
                  <TableRow
                    key={sale.id}
                    className="border-border/50 transition-colors hover:bg-muted/20"
                  >

                    <TableCell className="px-4 py-3.5">
                      <div>
                        <p className="font-semibold text-foreground">
                          {sale.invoiceNumber}
                        </p>

                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          ID transaksi
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3.5">
                      <div>
                        <p className="whitespace-nowrap text-sm font-medium text-foreground">
                          {date.date}
                        </p>

                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {date.time}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">

                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {customer
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="max-w-[180px] truncate font-medium text-foreground">
                          {customer}
                        </span>

                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3.5">
                      <span className="max-w-[140px] truncate text-sm text-muted-foreground">
                        {sale.cashier?.name ?? "-"}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className="rounded-full border-border/70 bg-background px-2.5 font-medium"
                      >
                        {paymentLabel(
                          sale.paymentMethod
                        )}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-2.5 font-medium ${getStatusClass(
                          sale.status
                        )}`}
                      >
                        {statusLabel(
                          sale.status
                        )}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 py-3.5 text-right">
                      <span className="whitespace-nowrap font-semibold tabular-nums text-foreground">
                        {formatRupiah(
                          Number(sale.total)
                        )}
                      </span>
                    </TableCell>

                  </TableRow>
                )
              })}

              {filteredSales.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-36 text-center"
                  >
                    <p className="font-medium">
                      Tidak ada penjualan
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Tidak ditemukan transaksi
                      pada periode ini.
                    </p>
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>

        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-2 md:hidden">

        <div className="flex items-center justify-between px-1">

          <div>
            <h3 className="text-sm font-semibold">
              Daftar Penjualan
            </h3>

            <p className="text-xs text-muted-foreground">
              Riwayat transaksi
            </p>
          </div>

          <div className="flex items-center gap-2">

            <Badge
              variant="secondary"
              className="rounded-full"
            >
              {filteredSales.length}
            </Badge>

            <ExportButton
              onClick={handleExport}
            />

          </div>

        </div>

        {filteredSales.map((sale) => {
          const date = formatDate(
            sale.saleDate
          )

          const customer =
            sale.customer?.name ?? "Umum"

          return (
            <div
              key={sale.id}
              className="rounded-xl border border-border/60 bg-card p-4 shadow-sm"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {sale.invoiceNumber}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {date.date} · {date.time}
                  </p>
                </div>

                <p className="shrink-0 font-semibold tabular-nums">
                  {formatRupiah(
                    Number(sale.total)
                  )}
                </p>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/50 pt-3">

                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Pelanggan
                  </p>

                  <p className="mt-0.5 truncate text-sm font-medium">
                    {customer}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Kasir
                  </p>

                  <p className="mt-0.5 truncate text-sm font-medium">
                    {sale.cashier?.name ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Pembayaran
                  </p>

                  <Badge
                    variant="outline"
                    className="mt-1 rounded-full border-border/70 font-medium"
                  >
                    {paymentLabel(
                      sale.paymentMethod
                    )}
                  </Badge>
                </div>

                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Status
                  </p>

                  <Badge
                    variant="outline"
                    className={`mt-1 rounded-full font-medium ${getStatusClass(
                      sale.status
                    )}`}
                  >
                    {statusLabel(
                      sale.status
                    )}
                  </Badge>
                </div>

              </div>
            </div>
          )
        })}

        {filteredSales.length === 0 && (
          <div className="rounded-xl border border-border/60 bg-card px-5 py-12 text-center shadow-sm">

            <p className="font-medium">
              Tidak ada penjualan
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Tidak ditemukan transaksi pada
              periode ini.
            </p>

          </div>
        )}

      </div>

    </div>
  )
}
