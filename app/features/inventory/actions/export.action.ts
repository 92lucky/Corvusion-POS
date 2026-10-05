"use server"

import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"

export async function getInventoryExportData(
  businessId: string
) {
  const user = await getCurrentUser()

  if (!user?.businessId || user.businessId !== businessId) {
    throw new Error("Akses tidak diizinkan")
  }

  const products = await prisma.product.findMany({
    where: {
      businessId,
      isActive: true,
    },
    include: {
      category: true,
      supplier: true,
      unit: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return products.map((product) => ({
    Nama: product.name,
    Barcode: product.barcode ?? "",
    Kategori: product.category?.name ?? "",
    Supplier: product.supplier?.name ?? "",
    Satuan: product.unit?.name ?? "",
    Simbol: product.unit?.symbol ?? "",
    "Harga Modal": Number(product.purchasePrice),
    "Harga Jual": Number(product.sellingPrice),
    Stok: product.stock,
    "Minimum Stok": product.minimumStock,
    "Tanggal Expired": product.expiredAt
      ? product.expiredAt.toISOString().split("T")[0]
      : "",
    Dosis: product.dosage ?? "",
    Volume:
      product.volume != null
        ? Number(product.volume)
        : "",
    Berat:
      product.weight != null
        ? Number(product.weight)
        : "",
    Catatan: product.notes ?? "",
  }))
}
