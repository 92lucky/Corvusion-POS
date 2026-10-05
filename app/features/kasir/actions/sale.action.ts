"use server"

import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"
import { PaymentMethod } from "@/app/generated/prisma/client"
import {
  saleSchema,
  type SaleInput,
} from "../schemas/sale.schema"

export async function createSale(input: SaleInput) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  if (!user.id) {
    throw new Error("User tidak ditemukan")
  }

  const businessId = user.businessId
  const cashierId = user.id

  const data = saleSchema.parse(input)

  return prisma.$transaction(async (tx) => {
    const productIds = data.items.map(
      (item) => item.productId
    )

    const products = await tx.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        businessId,
        isActive: true,
      },
    })

    for (const item of data.items) {
      const product = products.find(
        (product) => product.id === item.productId
      )

      if (!product) {
        throw new Error("Produk tidak ditemukan")
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Stok ${product.name} tidak cukup`
        )
      }
    }

    const subtotal = data.items.reduce(
      (sum, item) =>
        sum + item.quantity * item.sellingPrice,
      0
    )

    const total =
      subtotal - data.discount + data.tax

    if (data.paidAmount < total) {
      throw new Error("Pembayaran kurang")
    }

    const changeAmount =
      data.paidAmount - total

    const invoiceNumber = `INV-${Date.now()}`

    const sale = await tx.sale.create({
      data: {
        businessId,
        customerId: data.customerId || null,
        cashierId,
        invoiceNumber,

        paymentMethod:
          data.paymentMethod as PaymentMethod,

        subtotal,
        discount: data.discount,
        tax: data.tax,
        total,
        paidAmount: data.paidAmount,
        changeAmount,
        notes: data.notes || null,

        items: {
          create: data.items.map((item) => {
            const product = products.find(
              (product) =>
                product.id === item.productId
            )

            if (!product) {
              throw new Error(
                "Produk tidak ditemukan"
              )
            }

            return {
              productId: item.productId,
              quantity: item.quantity,
              sellingPrice: item.sellingPrice,
              purchasePrice: Number(
                product.purchasePrice
              ),
              subtotal:
                item.quantity *
                item.sellingPrice,
            }
          }),
        },
      },

      include: {
        items: true,
      },
    })

    for (const item of data.items) {
      const result = await tx.product.updateMany({
        where: {
          id: item.productId,
          businessId,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })

      if (result.count === 0) {
        throw new Error(
          "Stok berubah atau produk tidak ditemukan"
        )
      }
    }

    return sale
  })
}
