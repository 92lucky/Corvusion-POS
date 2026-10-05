
"use server"

import ExcelJS from "exceljs"
import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"

const aliases: Record<string, string[]> = {
  Nama: ["nama", "nama produk", "nama barang", "produk", "barang", "product", "item"],
  Barcode: ["barcode", "kode", "kode barang", "sku"],
  Kategori: ["kategori", "category", "jenis"],
  Supplier: ["supplier", "pemasok", "vendor"],
  Satuan: ["satuan", "unit"],
  Simbol: ["simbol", "symbol"],
  "Harga Modal": ["harga modal", "harga beli", "harga pembelian", "modal", "buy price", "purchase price"],
  "Harga Jual": ["harga jual", "harga penjualan", "jual", "selling price", "sale price"],
  Stok: ["stok", "stock", "jumlah", "qty", "quantity"],
  "Minimum Stok": ["minimum stok", "stok minimum", "min stok", "minimum stock", "min stock"],
  "Tanggal Expired": ["tanggal expired", "expired", "expired at", "tanggal kadaluarsa", "kadaluarsa"],
  Dosis: ["dosis", "dosage"],
  Volume: ["volume"],
  Berat: ["berat", "weight"],
  Catatan: ["catatan", "notes", "keterangan"],
}

function normalize(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
}

function resolveHeader(value: unknown) {
  const header = normalize(value)

  for (const [field, names] of Object.entries(aliases)) {
    if (names.some((name) => normalize(name) === header)) {
      return field
    }
  }

  return null
}

function text(value: unknown) {
  return String(value ?? "").trim()
}

function number(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0
  }

  const cleaned = String(value ?? "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".")

  const parsed = Number(cleaned)

  return Number.isFinite(parsed) ? parsed : 0
}

function dateValue(value: unknown) {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  const date = new Date(String(value))

  return Number.isNaN(date.getTime()) ? null : date
}

export async function importInventory(file: File) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    throw new Error("File harus berformat .xlsx")
  }

  const workbook = new ExcelJS.Workbook()

  await workbook.xlsx.load(await file.arrayBuffer())

  const worksheet = workbook.worksheets[0]

  if (!worksheet) {
    throw new Error("Sheet Excel tidak ditemukan")
  }

  const headers: Record<number, string> = {}

  worksheet.getRow(1).eachCell((cell, index) => {
    const field = resolveHeader(cell.value)

    if (field) {
      headers[index] = field
    }
  })

  if (!Object.values(headers).includes("Nama")) {
    throw new Error(
      'Kolom nama produk tidak ditemukan. Gunakan "Nama", "Nama Produk", "Nama Barang", atau "Product Name".'
    )
  }

  let created = 0
  let updated = 0
  let skipped = 0

  for (
    let rowNumber = 2;
    rowNumber <= worksheet.rowCount;
    rowNumber++
  ) {
    const row = worksheet.getRow(rowNumber)

    const values: Record<string, unknown> = {}

    for (const [index, field] of Object.entries(headers)) {
      values[field] = row.getCell(Number(index)).value
    }

    const name = text(values["Nama"])

    if (!name) {
      skipped++
      continue
    }

    const barcode = text(values["Barcode"])
    const categoryName = text(values["Kategori"])
    const supplierName = text(values["Supplier"])
    const unitName = text(values["Satuan"])

    let categoryId: string | null = null

    if (categoryName) {
      const category = await prisma.category.findFirst({
        where: {
          businessId: user.businessId,
          name: {
            equals: categoryName,
            mode: "insensitive",
          },
        },
      })

      categoryId =
        category?.id ??
        (
          await prisma.category.create({
            data: {
              businessId: user.businessId,
              name: categoryName,
            },
          })
        ).id
    }

    let supplierId: string | null = null

    if (supplierName) {
      const supplier = await prisma.supplier.findFirst({
        where: {
          businessId: user.businessId,
          name: {
            equals: supplierName,
            mode: "insensitive",
          },
        },
      })

      supplierId =
        supplier?.id ??
        (
          await prisma.supplier.create({
            data: {
              businessId: user.businessId,
              name: supplierName,
            },
          })
        ).id
    }

    let unitId: string | null = null

    if (unitName) {
      const unit = await prisma.unit.findFirst({
        where: {
          businessId: user.businessId,
          name: {
            equals: unitName,
            mode: "insensitive",
          },
        },
      })

      unitId =
        unit?.id ??
        (
          await prisma.unit.create({
            data: {
              businessId: user.businessId,
              name: unitName,
              symbol: text(values["Simbol"]) || null,
            },
          })
        ).id
    }

    const existingProduct = await prisma.product.findFirst({
      where: barcode
        ? {
            businessId: user.businessId,
            isActive: true,
            barcode,
          }
        : {
            businessId: user.businessId,
            isActive: true,
            name: {
              equals: name,
              mode: "insensitive",
            },
          },
    })

    const data = {
      name,
      barcode: barcode || null,
      categoryId,
      supplierId,
      unitId,
      purchasePrice: number(values["Harga Modal"]),
      sellingPrice: number(values["Harga Jual"]),
      stock: Math.max(
        0,
        Math.trunc(number(values["Stok"]))
      ),
      minimumStock: Math.max(
        0,
        Math.trunc(number(values["Minimum Stok"]))
      ),
      expiredAt: dateValue(values["Tanggal Expired"]),
      dosage: text(values["Dosis"]) || null,
      volume:
        values["Volume"] != null
          ? number(values["Volume"])
          : null,
      weight:
        values["Berat"] != null
          ? number(values["Berat"])
          : null,
      notes: text(values["Catatan"]) || null,
    }

    if (existingProduct) {
      await prisma.product.update({
        where: {
          id: existingProduct.id,
        },
        data,
      })

      updated++
    } else {
      await prisma.product.create({
        data: {
          businessId: user.businessId,
          ...data,
        },
      })

      created++
    }
  }

  return {
    created,
    updated,
    skipped,
    total: created + updated + skipped,
  }
}
