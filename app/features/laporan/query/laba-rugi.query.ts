import { prisma } from "@/app/lib/prisma"

export async function getProfitLossReport(
  businessId: string
) {
  const sales = await prisma.sale.findMany({
    where: {
      businessId,
      status: "COMPLETED",
    },
    include: {
      items: true,
    },
    orderBy: {
      saleDate: "desc",
    },
  })

  let omzet = 0
  let hpp = 0
  let discount = 0
  let tax = 0

  for (const sale of sales) {
    omzet += Number(sale.subtotal)
    discount += Number(sale.discount)
    tax += Number(sale.tax)

    for (const item of sale.items) {
      hpp +=
        Number(item.purchasePrice) *
        item.quantity
    }
  }

  const netSales =
    omzet - discount

  const grossProfit =
    netSales - hpp

  return {
    omzet,
    discount,
    tax,
    netSales,
    hpp,
    grossProfit,
  }
}
