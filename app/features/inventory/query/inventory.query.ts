import { prisma } from "@/app/lib/prisma"

export async function getProducts(
  businessId: string,
  search?: string,
  categoryId?: string,
  page = 1,
  limit = 10
) {
  const where = {
    businessId,
    isActive: true,

    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              barcode: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(categoryId
      ? {
          categoryId,
        }
      : {}),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        supplier: true,
        unit: true,
      },
      orderBy: {
        name: "asc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.product.count({
      where,
    }),
  ])

  return {
    products,
    total,
    totalPages: Math.ceil(total / limit),
    page,
    limit,
  }
}

export async function getInventoryStats(
  businessId: string
) {
  const [
    totalProducts,
    lowStock,
    outOfStock,
    stockValue,
  ] = await Promise.all([
    prisma.product.count({
      where: {
        businessId,
        isActive: true,
      },
    }),

    prisma.product.count({
      where: {
        businessId,
        isActive: true,
        stock: {
          gt: 0,
          lte: 10,
        },
      },
    }),

    prisma.product.count({
      where: {
        businessId,
        isActive: true,
        stock: {
          lte: 0,
        },
      },
    }),

    prisma.$queryRaw<{ total: string | null }[]>`
      SELECT COALESCE(
        SUM(
          "purchasePrice" * "stock"
        ),
        0
      )::text AS total
      FROM "Product"
      WHERE "businessId" = ${businessId}
        AND "isActive" = true
    `,
  ])

  return {
    totalProducts,
    lowStock,
    outOfStock,
    totalStockValue: Number(
      stockValue[0]?.total ?? 0
    ),
  }
}
