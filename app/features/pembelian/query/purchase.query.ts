
import { prisma } from "@/app/lib/prisma"

export async function getPurchases(
  businessId: string
) {
  return prisma.purchase.findMany({
    where: {
      businessId,
    },
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      purchaseDate: "desc",
    },
  })
}

export async function getPurchaseFormData(
  businessId: string
) {
  const [
    business,
    suppliers,
    products,
    categories,
    units,
  ] = await Promise.all([
    prisma.business.findUnique({
      where: {
        id: businessId,
      },
      select: {
        type: true,
      },
    }),

    prisma.supplier.findMany({
      where: {
        businessId,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.product.findMany({
      where: {
        businessId,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        purchasePrice: true,
        stock: true,
      },
    }),

    prisma.category.findMany({
      where: {
        businessId,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.unit.findMany({
      where: {
        businessId,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ])

  if (!business) {
    throw new Error(
      "Business tidak ditemukan"
    )
  }

  return {
    suppliers,

    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      purchasePrice: Number(
        product.purchasePrice
      ),
      stock: product.stock,
    })),

    categories,
    units,

    businessType: business.type,
  }
}
