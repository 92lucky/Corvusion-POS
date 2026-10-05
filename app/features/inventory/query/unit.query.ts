import { prisma } from "@/app/lib/prisma"

export async function getUnits(businessId: string) {
  return prisma.unit.findMany({
    where: {
      businessId,
    },
    orderBy: {
      name: "asc",
    },
  })
}
