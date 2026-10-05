import { prisma } from "@/app/lib/prisma"

export async function getSaleFormData(
  businessId: string
) {
  const [products, customers] = await Promise.all([
    prisma.product.findMany({
      where: {
        businessId,
        isActive: true,
        stock: {
          gt: 0,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
        sellingPrice: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.customer.findMany({
      where: {
        businessId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ])

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      stock: product.stock,
      sellingPrice: Number(product.sellingPrice),
    })),

    customers,
  }
}
