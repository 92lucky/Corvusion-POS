"use server"

import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"

type UnitInput = {
  name: string
  symbol?: string
}

export async function createUnit(input: UnitInput) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const name = input.name.trim()
  const symbol = input.symbol?.trim() || null

  if (!name) {
    throw new Error("Nama satuan wajib diisi")
  }

  const existing = await prisma.unit.findFirst({
    where: {
      businessId: user.businessId,
      name,
    },
  })

  if (existing) {
    throw new Error("Satuan sudah ada")
  }

  return prisma.unit.create({
    data: {
      businessId: user.businessId,
      name,
      symbol,
    },
  })
}

export async function updateUnit(
  id: string,
  input: UnitInput
) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const name = input.name.trim()
  const symbol = input.symbol?.trim() || null

  if (!name) {
    throw new Error("Nama satuan wajib diisi")
  }

  const existing = await prisma.unit.findFirst({
    where: {
      businessId: user.businessId,
      name,
      NOT: {
        id,
      },
    },
  })

  if (existing) {
    throw new Error("Satuan sudah ada")
  }

  return prisma.unit.updateMany({
    where: {
      id,
      businessId: user.businessId,
    },
    data: {
      name,
      symbol,
    },
  })
}

export async function deleteUnit(id: string) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  return prisma.unit.deleteMany({
    where: {
      id,
      businessId: user.businessId,
    },
  })
}
