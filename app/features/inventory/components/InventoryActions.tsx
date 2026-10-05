"use client"

import { useRef, useState } from "react"
import {
  Download,
  Upload,
} from "lucide-react"
import {
  getInventoryExportData,
} from "../actions/export.action"
import {
  importInventory,
} from "../actions/import.action"
import {
  exportToExcel,
} from "@/app/lib/export/excel"

type Props = {
  businessId: string
}

export default function InventoryActions({
  businessId,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null)

  const [exporting, setExporting] =
    useState(false)

  const [importing, setImporting] =
    useState(false)

  async function handleExport() {
    setExporting(true)

    try {
      const rows =
        await getInventoryExportData(
          businessId
        )

      if (rows.length === 0) {
        alert(
          "Tidak ada data barang untuk diexport."
        )
        return
      }

      await exportToExcel(
        `inventory-${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`,
        rows
      )
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal export inventory"
      )
    } finally {
      setExporting(false)
    }
  }

  async function handleImport(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0]

    event.target.value = ""

    if (!file) return

    setImporting(true)

    try {
      const result =
        await importInventory(file)

      alert(
        `Import berhasil.\n\n` +
          `Produk baru: ${result.created}\n` +
          `Produk diperbarui: ${result.updated}\n` +
          `Baris dilewati: ${result.skipped}`
      )

      window.location.reload()
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal import inventory"
      )
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        onChange={handleImport}
        className="hidden"
      />

      <button
        type="button"
        onClick={() =>
          inputRef.current?.click()
        }
        disabled={importing}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {importing
          ? "Import..."
          : "Import Excel"}
      </button>

      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        {exporting
          ? "Export..."
          : "Export Excel"}
      </button>
    </div>
  )
}
