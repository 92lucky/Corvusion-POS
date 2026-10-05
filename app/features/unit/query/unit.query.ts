import { prisma } from "@/app/lib/prisma"

export async function getUnits(businessId: string) {
  return prisma.unit.findMany({
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
