import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("paymentId")

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID wajib diisi" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        businessId: true,
      },
    })

    if (!user?.businessId) {
      return NextResponse.json(
        { error: "Business tidak ditemukan" },
        { status: 404 }
      )
    }

    const payment = await prisma.subscriptionPayment.findFirst({
      where: {
        id: paymentId,
        businessId: user.businessId,
      },
      select: {
        status: true,
        paidAt: true,
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Payment tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: payment.status,
      paidAt: payment.paidAt,
    })
  } catch (error) {
    console.error("SUBSCRIPTION STATUS ERROR:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
