import { prisma } from "@/app/lib/prisma"

export async function getSuppliers(businessId: string) {
  return prisma.supplier.findMany({
    where: {
      businessId,
    },
    include: {
      _count: {
        select: {
          products: true,
          purchases: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })
}
