import { prisma } from "@/app/lib/prisma"

export async function getCategories(
  businessId: string
) {
  return prisma.category.findMany({
    where: {
      businessId,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })
}
