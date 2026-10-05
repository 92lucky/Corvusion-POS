"use server"

import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"
import {
  categorySchema,
  type CategoryInput,
} from "../schemas/category.schema"

export async function createCategory(input: CategoryInput) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const data = categorySchema.parse(input)

  return prisma.category.create({
    data: {
      businessId: user.businessId,
      name: data.name,
      description: data.description || null,
    },
  })
}

export async function updateCategory(
  id: string,
  input: CategoryInput
) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const data = categorySchema.parse(input)

  const category = await prisma.category.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  })

  if (!category) {
    throw new Error("Kategori tidak ditemukan")
  }

  return prisma.category.update({
    where: {
      id: category.id,
    },
    data: {
      name: data.name,
      description: data.description || null,
    },
  })
}

export async function deleteCategory(id: string) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const category = await prisma.category.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  })

  if (!category) {
    throw new Error("Kategori tidak ditemukan")
  }

  return prisma.category.delete({
    where: {
      id: category.id,
    },
  })
}
