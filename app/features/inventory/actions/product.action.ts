"use server"

import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"
import {
  type ProductInput,
  productSchema,
} from "../schemas/product.schema"

export async function createProduct(input: ProductInput) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const data = productSchema.parse(input)

  return prisma.product.create({
    data: {
      businessId: user.businessId,
      name: data.name,
      barcode: data.barcode || null,
      categoryId: data.categoryId || null,
      supplierId: data.supplierId || null,
      unitId: data.unitId || null,
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      stock: data.stock,
      minimumStock: data.minimumStock,
      expiredAt: data.expiredAt
        ? new Date(data.expiredAt)
        : null,
      dosage: data.dosage || null,
      volume: data.volume ?? null,
      weight: data.weight ?? null,
      notes: data.notes || null,
    },
  })
}

export async function findExistingProduct(name: string) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  return prisma.product.findFirst({
    where: {
      businessId: user.businessId,
      isActive: true,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      barcode: true,
      categoryId: true,
      supplierId: true,
      unitId: true,
      purchasePrice: true,
      sellingPrice: true,
      stock: true,
      weight: true,
      expiredAt: true,
      dosage: true,
      volume: true,
      notes: true,
    },
  })
}

export async function updateProduct(
  id: string,
  input: ProductInput
) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const data = productSchema.parse(input)

  const product = await prisma.product.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  })

  if (!product) {
    throw new Error("Produk tidak ditemukan")
  }

  return prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      name: data.name,
      barcode: data.barcode || null,
      categoryId: data.categoryId || null,
      supplierId: data.supplierId || null,
      unitId: data.unitId || null,
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      stock: data.stock,
      minimumStock: data.minimumStock,
      expiredAt: data.expiredAt
        ? new Date(data.expiredAt)
        : null,
      dosage: data.dosage || null,
      volume: data.volume ?? null,
      weight: data.weight ?? null,
      notes: data.notes || null,
    },
  })
}

export async function deleteProduct(id: string) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  })

  if (!product) {
    throw new Error("Produk tidak ditemukan")
  }

  return prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      isActive: false,
    },
  })
}
