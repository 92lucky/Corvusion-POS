type Props = {
  report: {
    omzet: number
    discount: number
    tax: number
    netSales: number
    hpp: number
    grossProfit: number
  }
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}

export default function LabaRugi({
  report,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">

      <div className="border-b border-border/60 px-4 py-3">
        <h3 className="text-sm font-semibold">
          Laba Rugi
        </h3>

        <p className="mt-0.5 text-xs text-muted-foreground">
          Ringkasan pendapatan dan laba
        </p>
      </div>

      <div className="divide-y divide-border/60 text-sm">

        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-muted-foreground">
            Penjualan
          </span>

          <span className="font-medium tabular-nums">
            {formatRupiah(report.omzet)}
          </span>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-muted-foreground">
            Diskon
          </span>

          <span className="tabular-nums">
            − {formatRupiah(report.discount)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-muted/20 px-4 py-3">
          <span className="font-semibold">
            Penjualan Bersih
          </span>

          <span className="font-semibold tabular-nums">
            {formatRupiah(report.netSales)}
          </span>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-muted-foreground">
            HPP
          </span>

          <span className="tabular-nums">
            − {formatRupiah(report.hpp)}
          </span>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold">
            Laba Kotor
          </span>

          <span className="font-bold text-primary tabular-nums">
            {formatRupiah(report.grossProfit)}
          </span>
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 text-xs">
          <span className="text-muted-foreground">
            Pajak
          </span>

          <span className="text-muted-foreground tabular-nums">
            {formatRupiah(report.tax)}
          </span>
        </div>

      </div>
    </div>
  )
}
