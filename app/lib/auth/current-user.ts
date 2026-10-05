import { getServerSession } from "next-auth"

import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      business: true,
      profile: true,
    },
  })
}
