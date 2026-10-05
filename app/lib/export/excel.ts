import ExcelJS from "exceljs"

export async function exportToExcel(
  filename: string,
  rows: Record<string, unknown>[]
) {
  if (rows.length === 0) return

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Laporan")

  const headers = Object.keys(rows[0])

  // Lebar kolom
  worksheet.columns = headers.map((header) => {
    const maxLength = Math.max(
      header.length,
      ...rows.map((row) =>
        String(row[header] ?? "").length
      )
    )

    return {
      header,
      key: header,
      width: Math.min(
        Math.max(maxLength + 4, 14),
        40
      ),
    }
  })

  // Data
  const tableRows = rows.map((row) =>
    headers.map((header) => row[header] ?? "")
  )

  // Excel Table
  worksheet.addTable({
    name: "LaporanTable",
    ref: `A1:${worksheet.getColumn(headers.length).letter}${rows.length + 1}`,
    headerRow: true,
    totalsRow: false,

    style: {
      theme: "TableStyleMedium2",
      showRowStripes: true,
      showFirstColumn: false,
      showLastColumn: false,
    },

    columns: headers.map((header) => ({
      name: header,
      filterButton: true,
    })),

    rows: tableRows,
  })

  // Header
  const headerRow = worksheet.getRow(1)

  headerRow.height = 28

  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      size: 11,
    }

    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    }

    cell.border = {
      top: {
        style: "thin",
        color: { argb: "FF94A3B8" },
      },
      bottom: {
        style: "thin",
        color: { argb: "FF94A3B8" },
      },
      left: {
        style: "thin",
        color: { argb: "FFCBD5E1" },
      },
      right: {
        style: "thin",
        color: { argb: "FFCBD5E1" },
      },
    }
  })

  // Border seluruh isi tabel
  worksheet.eachRow((row) => {
    row.height = 24

    row.eachCell((cell) => {
      cell.alignment = {
        vertical: "middle",
      }

      cell.border = {
        top: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },
        bottom: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },
        left: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },
        right: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },
      }
    })
  })

  // Freeze header
  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ]

  // Print
  worksheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  }

  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}
