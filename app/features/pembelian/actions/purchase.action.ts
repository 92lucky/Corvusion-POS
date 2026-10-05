
"use server"

import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"
import { PaymentMethod } from "@/app/generated/prisma/client"
import {
  purchaseSchema,
  type PurchaseInput,
} from "../schemas/purchase.schema"

export async function createPurchase(
  input: PurchaseInput
) {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const businessId = user.businessId
  const data = purchaseSchema.parse(input)

  const subtotal = data.items.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        item.purchasePrice,
    0
  )

  const total =
    subtotal -
    data.discount +
    data.tax

  return prisma.$transaction(
    async (tx) => {
      /*
       * Cek nomor invoice
       *
       * Satu business tidak boleh
       * memiliki invoice yang sama.
       */
      const existingPurchase =
        await tx.purchase.findFirst({
          where: {
            businessId,
            invoiceNumber:
              data.invoiceNumber,
          },

          select: {
            id: true,
          },
        })

      if (existingPurchase) {
        throw new Error(
          `Nomor invoice ${data.invoiceNumber} sudah digunakan`
        )
      }

      /*
       * Buat transaksi pembelian
       */
      const purchase =
        await tx.purchase.create({
          data: {
            businessId,

            supplierId:
              data.supplierId || null,

            invoiceNumber:
              data.invoiceNumber,

            purchaseDate:
              data.purchaseDate
                ? new Date(
                    data.purchaseDate
                  )
                : new Date(),

            paymentMethod:
              data.paymentMethod as PaymentMethod,

            subtotal,
            discount:
              data.discount,
            tax: data.tax,
            total,

            notes:
              data.notes || null,

            items: {
              create:
                data.items.map(
                  (item) => ({
                    productId:
                      item.productId,

                    quantity:
                      item.quantity,

                    purchasePrice:
                      item.purchasePrice,

                    subtotal:
                      item.quantity *
                      item.purchasePrice,
                  })
                ),
            },
          },

          include: {
            items: true,
          },
        })

      /*
       * Tambahkan stok
       *
       * Setiap barang yang masuk
       * otomatis menambah stock Product.
       */
      for (const item of data.items) {
        const result =
          await tx.product.updateMany({
            where: {
              id: item.productId,
              businessId,
            },

            data: {
              stock: {
                increment:
                  item.quantity,
              },
            },
          })

        if (result.count === 0) {
          throw new Error(
            "Produk tidak ditemukan"
          )
        }
      }

      return purchase
    }
  )
}
