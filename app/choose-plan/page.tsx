"use client"

import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"

type Plan = "MONTHLY" | "QUARTERLY" | "YEARLY"

type PlanItem = {
  id: Plan
  name: string
  amount: number
  label: string
}

type PaymentData = {
  paymentId: string
  txnId: string
  amount: number
  qrString: string
  expiredAt: string
  plan: Plan
}

const PLANS: PlanItem[] = [
  {
    id: "MONTHLY",
    name: "1 Bulan",
    amount: 37000,
    label: "Rp37.000",
  },
  {
    id: "QUARTERLY",
    name: "3 Bulan",
    amount: 99000,
    label: "Rp99.000",
  },
  {
    id: "YEARLY",
    name: "12 Bulan",
    amount: 360000,
    label: "Rp360.000",
  },
]

export default function ChoosePlanPage() {
  const [loading, setLoading] = useState<Plan | null>(null)
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [error, setError] = useState("")
  const [checkingPayment, setCheckingPayment] = useState(false)

  async function handleSubscribe(plan: Plan) {
    setLoading(plan)
    setError("")

    try {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal membuat pembayaran"
        )
      }

      setPayment({
        ...data,
        plan,
      })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan"
      )
    } finally {
      setLoading(null)
    }
  }

  useEffect(() => {
    if (!payment?.paymentId) {
      return
    }

    let cancelled = false

    const checkPayment = async () => {
      try {
        const response = await fetch(
          `/api/subscription/status?paymentId=${payment.paymentId}`,
          {
            cache: "no-store",
          }
        )

        if (!response.ok || cancelled) {
          return
        }

        const data = await response.json()

        if (data.status === "PAID") {
          setCheckingPayment(true)

          window.location.href = "/dashboard"
        }
      } catch {
        // Jangan tampilkan error untuk polling.
      }
    }

    const interval = setInterval(checkPayment, 3000)

    checkPayment()

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [payment?.paymentId])

  if (payment) {
    const selectedPlan = PLANS.find(
      (plan) => plan.id === payment.plan
    )

    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Bayar Corvusion
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Paket {selectedPlan?.name}
            </p>

            <div className="mt-6 flex justify-center rounded-xl border border-slate-100 bg-white p-5">
              <QRCodeSVG
                value={payment.qrString}
                size={240}
                level="M"
              />
            </div>

            <div className="mt-6">
              <p className="text-sm text-slate-500">
                Total pembayaran
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                Rp{payment.amount.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="mt-6 rounded-lg bg-violet-50 px-4 py-3">
              {checkingPayment ? (
                <p className="text-sm font-semibold text-violet-600">
                  Pembayaran berhasil. Mengarahkan...
                </p>
              ) : (
                <p className="text-sm text-violet-600">
                  Menunggu pembayaran...
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Setelah pembayaran berhasil, halaman akan otomatis
              melanjutkan ke dashboard.
            </p>

            <button
              onClick={() => setPayment(null)}
              disabled={checkingPayment}
              className="mt-6 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Kembali
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Pilih Paket Corvusion
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Pilih paket sesuai kebutuhan bisnis Anda.
          </p>
        </div>

        {error && (
          <div className="mx-auto mt-6 max-w-md rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-violet-600">
                Corvusion
              </p>

              <h2 className="mt-3 text-xl font-bold text-slate-900">
                {plan.name}
              </h2>

              <div className="mt-4">
                <span className="text-3xl font-bold text-slate-900">
                  {plan.label}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {plan.id === "MONTHLY"
                  ? "per bulan"
                  : plan.id === "QUARTERLY"
                    ? "untuk 3 bulan"
                    : "untuk 12 bulan"}
              </p>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className="mt-7 w-full rounded-lg bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading === plan.id
                  ? "Memproses..."
                  : `Bayar ${plan.label}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
