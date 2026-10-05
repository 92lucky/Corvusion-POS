"use server"

import { getCurrentUser } from "@/app/lib/auth/current-user"
import { prisma } from "@/app/lib/prisma"

export async function getDashboardData() {
  const user = await getCurrentUser()

  if (!user?.businessId) {
    throw new Error("Business tidak ditemukan")
  }

  const businessId = user.businessId

  // WIB / UTC+7
  const now = new Date()
  const jakartaNow = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    })
  )

  const startOfDay = new Date(jakartaNow)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(jakartaNow)
  endOfDay.setHours(23, 59, 59, 999)

  const [
    totalProducts,
    lowStockProducts,
    todaySales,
    todayTransactions,
    todayPurchases,
    recentSales,
  ] = await Promise.all([
    prisma.product.count({
      where: {
        businessId,
        isActive: true,
      },
    }),

    prisma.product.findMany({
      where: {
        businessId,
        isActive: true,
        stock: {
          lte: 5,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
        minimumStock: true,
        unit: {
          select: {
            symbol: true,
          },
        },
      },
      orderBy: {
        stock: "asc",
      },
      take: 5,
    }),

    prisma.sale.aggregate({
      where: {
        businessId,
        status: "COMPLETED",
        saleDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: {
        total: true,
      },
    }),

    prisma.sale.count({
      where: {
        businessId,
        status: "COMPLETED",
        saleDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    prisma.purchase.aggregate({
      where: {
        businessId,
        status: "COMPLETED",
        purchaseDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: {
        total: true,
      },
    }),

    prisma.sale.findMany({
      where: {
        businessId,
        status: "COMPLETED",
      },
      select: {
        id: true,
        invoiceNumber: true,
        total: true,
        saleDate: true,
        paymentMethod: true,
      },
      orderBy: {
        saleDate: "desc",
      },
      take: 5,
    }),
  ])

  return {
    totalProducts,

    lowStockProducts,

    todaySales: Number(todaySales._sum.total ?? 0),

    todayTransactions,

    todayPurchases: Number(
      todayPurchases._sum.total ?? 0
    ),

    recentSales: recentSales.map((sale) => ({
      id: sale.id,
      invoiceNumber: sale.invoiceNumber,
      total: Number(sale.total),
      saleDate: sale.saleDate,
      paymentMethod: sale.paymentMethod,
    })),
  }
}
