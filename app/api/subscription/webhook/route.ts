import { prisma } from "@/app/lib/prisma"

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("X-Secret")

    if (
      !secret ||
      secret !== process.env.PAKASIR_WEBHOOK_SECRET
    ) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      txn_id,
      order_id,
      amount,
      status,
      completed_at,
      is_sandbox,
    } = body

    if (!txn_id || !order_id || !amount || !status) {
      return Response.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      )
    }

    // Webhook Pakasir hanya diproses ketika transaksi berhasil
    if (status !== "completed") {
      return Response.json({
        success: true,
        message: "Webhook ignored",
      })
    }

    const payment = await prisma.subscriptionPayment.findUnique({
      where: {
        id: order_id,
      },
    })

    if (!payment) {
      return Response.json(
        { error: "Subscription payment not found" },
        { status: 404 }
      )
    }

    // Idempotent:
    // Jika webhook dikirim ulang, jangan memproses pembayaran dua kali.
    if (payment.status === "PAID") {
      return Response.json({
        success: true,
        message: "Payment already processed",
      })
    }

    // Pastikan nominal sesuai
    if (Number(payment.amount) !== Number(amount)) {
      return Response.json(
        { error: "Payment amount mismatch" },
        { status: 400 }
      )
    }

    const completedAt = completed_at
      ? new Date(completed_at)
      : new Date()

    await prisma.$transaction(async (tx) => {
      // 1. Tandai pembayaran lunas
      await tx.subscriptionPayment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "PAID",
          reference: txn_id,
          paidAt: completedAt,
        },
      })

      // 2. Ambil subscription lama
      const subscription =
        await tx.subscription.findUnique({
          where: {
            businessId: payment.businessId,
          },
        })

      const startDate = new Date()

      // Kalau subscription lama masih aktif,
      // perpanjangan dimulai dari endDate lama.
      const baseDate =
        subscription &&
        subscription.status === "ACTIVE" &&
        subscription.endDate > startDate
          ? subscription.endDate
          : startDate

      const durationDays =
        payment.plan === "MONTHLY"
          ? 30
          : payment.plan === "QUARTERLY"
            ? 90
            : 365

      const endDate = new Date(baseDate)

      endDate.setDate(
        endDate.getDate() + durationDays
      )

      // 3. Buat / perbarui subscription
      await tx.subscription.upsert({
        where: {
          businessId: payment.businessId,
        },
        create: {
          businessId: payment.businessId,
          plan: payment.plan,
          status: "ACTIVE",
          startDate,
          endDate,
        },
        update: {
          plan: payment.plan,
          status: "ACTIVE",
          startDate,
          endDate,
        },
      })
    })

    return Response.json({
      success: true,
    })
  } catch (error) {
    console.error("PAKASIR WEBHOOK ERROR:", error)

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
