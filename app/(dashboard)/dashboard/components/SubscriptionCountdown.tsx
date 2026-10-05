"use client"

import { useEffect, useState } from "react"

type Props = {
  endDate: string
}

function getRemaining(endDate: string) {
  const difference =
    new Date(endDate).getTime() - Date.now()

  if (difference <= 0) {
    return {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const totalSeconds = Math.floor(difference / 1000)

  return {
    expired: false,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(
      (totalSeconds % 86400) / 3600
    ),
    minutes: Math.floor(
      (totalSeconds % 3600) / 60
    ),
    seconds: totalSeconds % 60,
  }
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

export default function SubscriptionCountdown({
  endDate,
}: Props) {
  const [remaining, setRemaining] = useState(() =>
    getRemaining(endDate)
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(getRemaining(endDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  const formattedDate = new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "long",
      timeStyle: "short",
    }
  ).format(new Date(endDate))

  if (remaining.expired) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <p className="text-xs font-medium text-red-500">
          Masa akses
        </p>

        <p className="mt-1 text-lg font-bold text-red-700">
          Sudah berakhir
        </p>

        <p className="mt-1 text-xs text-red-600/70">
          Berakhir {formattedDate}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-medium text-violet-500">
            Masa akses Corvusion
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {remaining.days} hari{" "}
            {pad(remaining.hours)}:
            {pad(remaining.minutes)}:
            {pad(remaining.seconds)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Berakhir {formattedDate}
          </p>
        </div>

        <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">
          <p className="text-[11px] text-slate-400">
            Waktu tersisa
          </p>

          <p className="mt-1 text-sm font-bold text-violet-600">
            {remaining.days} hari lagi
          </p>
        </div>

      </div>
    </div>
  )
}
