import { prisma } from "@/app/lib/prisma"

export async function getPurchaseReport(
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
