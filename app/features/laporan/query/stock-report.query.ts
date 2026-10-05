import { prisma } from "@/app/lib/prisma"

export async function getStockReport(
  businessId: string
) {
  return prisma.product.findMany({
    where: {
      businessId,
      isActive: true,
    },
    include: {
      category: true,
      unit: true,
    },
    orderBy: {
      name: "asc",
    },
  })
}
