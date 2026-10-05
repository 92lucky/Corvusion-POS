"use server"

import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"
import {
  supplierSchema,
  type SupplierInput,
} from "../schemas/supplier.schema"

export async function createSupplier(input: SupplierInput) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const data = supplierSchema.parse(input)

  return prisma.supplier.create({
    data: {
      businessId: user.businessId,
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
    },
  })
}

export async function updateSupplier(
  id: string,
  input: SupplierInput
) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const data = supplierSchema.parse(input)

  const supplier = await prisma.supplier.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  })

  if (!supplier) {
    throw new Error("Supplier tidak ditemukan")
  }

  return prisma.supplier.update({
    where: {
      id: supplier.id,
    },
    data: {
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
    },
  })
}

export async function deleteSupplier(id: string) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const supplier = await prisma.supplier.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  })

  if (!supplier) {
    throw new Error("Supplier tidak ditemukan")
  }

  return prisma.supplier.delete({
    where: {
      id: supplier.id,
    },
  })
}
