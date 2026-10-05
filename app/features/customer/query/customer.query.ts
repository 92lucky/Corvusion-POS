import { prisma } from "@/app/lib/prisma"

export async function getCustomers(businessId: string) {
  return prisma.customer.findMany({
    where: {
      businessId,
    },
    include: {
      _count: {
        select: {
          sales: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })
}
