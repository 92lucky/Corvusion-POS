
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

const PLANS = {
  MONTHLY: {
    amount: 37000,
    days: 30,
  },
  QUARTERLY: {
    amount: 99000,
    days: 90,
  },
  YEARLY: {
    amount: 360000,
    days: 365,
  },
} as const

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const plan = body.plan as keyof typeof PLANS

    if (!plan || !PLANS[plan]) {
      return NextResponse.json(
        { error: "Plan tidak valid" },
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

    const selectedPlan = PLANS[plan]

    const payment = await prisma.subscriptionPayment.create({
      data: {
        businessId: user.businessId,
        plan,
        amount: selectedPlan.amount,
        status: "PENDING",
      },
    })

    const slug = process.env.PAKASIR_PROJECT
    const apiKey = process.env.PAKASIR_API_KEY

    if (!slug || !apiKey) {
      return NextResponse.json(
        { error: "Konfigurasi Pakasir belum tersedia" },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://app.pakasir.com/api/v2/create-transaction/${slug}/${payment.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({
          method: "qris",
          amount: selectedPlan.amount,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Gagal membuat transaksi Pakasir",
          detail: data,
        },
        { status: response.status }
      )
    }

    await prisma.subscriptionPayment.update({
      where: {
        id: payment.id,
      },
      data: {
        reference: data.txn_id,
      },
    })

    return NextResponse.json({
      paymentId: payment.id,
      txnId: data.txn_id,
      amount: data.amount,
      fee: data.fee,
      totalPayment: data.total_payment,
      qrString: data.qr_string,
      expiredAt: data.expired_at,
      status: data.status,
    })
  } catch (error) {
    console.error("SUBSCRIPTION_CREATE_ERROR:", error)

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
