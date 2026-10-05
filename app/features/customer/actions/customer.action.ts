"use server"

import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"
import {
  customerSchema,
  type CustomerInput,
} from "../schemas/customer.schema"

export async function createCustomer(input: CustomerInput) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const data = customerSchema.parse(input)

  return prisma.customer.create({
    data: {
      businessId: user.businessId,
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
    },
  })
}

export async function updateCustomer(
  id: string,
  input: CustomerInput
) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const data = customerSchema.parse(input)

  const customer = await prisma.customer.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  })

  if (!customer) {
    throw new Error("Customer tidak ditemukan")
  }

  return prisma.customer.update({
    where: {
      id: customer.id,
    },
    data: {
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
    },
  })
}

export async function deleteCustomer(id: string) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id,
      businessId: user.businessId,
    },
  })

  if (!customer) {
    throw new Error("Customer tidak ditemukan")
  }

  return prisma.customer.delete({
    where: {
      id: customer.id,
    },
  })
}
