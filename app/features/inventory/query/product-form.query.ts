import { prisma } from "@/app/lib/prisma"

export async function getProductFormData(businessId: string) {
  const [categories, suppliers, units] = await Promise.all([
    prisma.category.findMany({
      where: { businessId },
      orderBy: { name: "asc" },
    }),

    prisma.supplier.findMany({
      where: { businessId },
      orderBy: { name: "asc" },
    }),

    prisma.unit.findMany({
      where: { businessId },
      orderBy: { name: "asc" },
    }),
  ])

  return {
    categories,
    suppliers,
    units,
  }
}
