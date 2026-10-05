import { prisma } from "@/app/lib/prisma"

export async function getBestSellingProducts(
  businessId: string
) {
  const items = await prisma.saleItem.findMany({
    where: {
      sale: {
        businessId,
        status: "COMPLETED",
      },
    },
    include: {
      product: true,
    },
  })

  const grouped = new Map<
    string,
    {
      productId: string
      name: string
      quantity: number
      revenue: number
    }
  >()

  for (const item of items) {
    const existing = grouped.get(
      item.productId
    )

    const quantity =
      existing?.quantity ?? 0

    const revenue =
      existing?.revenue ?? 0

    grouped.set(item.productId, {
      productId: item.productId,
      name: item.product.name,
      quantity:
        quantity + item.quantity,
      revenue:
        revenue +
        Number(item.subtotal),
    })
  }

  return Array.from(grouped.values()).sort(
    (a, b) => b.quantity - a.quantity
  )
}
