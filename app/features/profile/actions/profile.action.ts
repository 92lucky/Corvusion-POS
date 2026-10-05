
"use server"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"
import { profileSchema } from "../schemas/profile.schema"

const defaultUnits = {
  APOTEK: [
    "tablet",
    "kapsul",
    "botol",
    "strip",
    "box",
    "tube",
    "sachet",
  ],

  BANGUNAN: [
    "kg",
    "gram",
    "liter",
    "meter",
    "pcs",
    "sak",
    "batang",
  ],

  KLONTONG: [
    "pcs",
    "bungkus",
    "botol",
    "dus",
    "kg",
    "liter",
  ],
} as const

export async function completeProfile(formData: unknown) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const data = profileSchema.parse(formData)

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      businessId: true,
    },
  })

  await prisma.$transaction(async (tx) => {
    if (user?.businessId) {
      await tx.business.update({
        where: {
          id: user.businessId,
        },
        data: {
          name: data.businessName,
          type: data.businessType,
        },
      })
    } else {
      const trialStartedAt = new Date()

      const trialEndsAt = new Date(trialStartedAt)
      trialEndsAt.setDate(trialEndsAt.getDate() + 14)
      const business = await tx.business.create({
        data: {
          name: data.businessName,
          type: data.businessType,
          trialStartedAt,
             trialEndsAt,
        },
      })

      await tx.unit.createMany({
        data: defaultUnits[data.businessType].map(
          (name) => ({
            businessId: business.id,
            name,
          })
        ),
      })

      await tx.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          businessId: business.id,
        },
      })
    }

    await tx.profile.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        ownerName: data.ownerName,
        phone: data.phone,
        address: data.address,
        isCompleted: true,
      },
      create: {
        userId: session.user.id,
        ownerName: data.ownerName,
        phone: data.phone,
        address: data.address,
        isCompleted: true,
      },
    })
  })

  redirect("/dashboard")
}

export async function deleteAccount() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  await prisma.user.delete({
    where: {
      id: session.user.id,
    },
  })

  redirect("/login")
}
