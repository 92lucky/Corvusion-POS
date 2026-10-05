import { prisma } from "@/app/lib/prisma"

export async function getSalesReport(
  businessId: string
) {
  const sales = await prisma.sale.findMany({
    where: {
      businessId,
    },
    include: {
      customer: true,
      cashier: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      saleDate: "desc",
    },
  })

  return sales
}
