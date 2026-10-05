
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Product = {
  productId: string
  name: string
  quantity: number
  revenue: number
}

type Props = {
  products: Product[]
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}

export default function ProdukTerlaris({
  products,
}: Props) {
  const totalRevenue = products.reduce(
    (sum, product) => sum + product.revenue,
    0
  )

  const totalQuantity = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  )

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        <div className="rounded-lg border border-border/60 bg-card px-2.5 py-2">
          <p className="text-[10px] font-medium text-muted-foreground">
            Produk Terlaris
          </p>

          <p className="mt-0.5 text-base font-semibold tracking-tight">
            {products.length}
          </p>

          <p className="text-[10px] text-muted-foreground">
            produk terjual
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card px-2.5 py-2">
          <p className="text-[10px] font-medium text-muted-foreground">
            Total Terjual
          </p>

          <p className="mt-0.5 text-base font-semibold tracking-tight tabular-nums">
            {totalQuantity.toLocaleString("id-ID")}
          </p>

          <p className="text-[10px] text-muted-foreground">
            unit
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 px-2.5 py-2">
          <div className="min-w-0">
            <h3 className="text-xs font-semibold">
              Ranking Produk
            </h3>

            <p className="text-[10px] text-muted-foreground">
              Berdasarkan jumlah produk terjual
            </p>
          </div>

          <Badge
            variant="secondary"
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-normal"
          >
            {products.length} produk
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full table-fixed text-xs">
            <TableHeader>
              <TableRow className="border-border/60 bg-muted/30 hover:bg-muted/30">
                <TableHead className="h-8 w-8 whitespace-nowrap px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  #
                </TableHead>

                <TableHead className="h-8 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Produk
                </TableHead>

                <TableHead className="h-8 w-[60px] whitespace-nowrap px-2 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Terjual
                </TableHead>

                <TableHead className="h-8 w-[95px] whitespace-nowrap px-2 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Omzet
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product, index) => {
                const rank = index + 1

                return (
                  <TableRow
                    key={product.productId}
                    className="h-9 border-border/50 transition-colors hover:bg-muted/20"
                  >
                    <TableCell className="px-2 py-1.5">
                      {rank <= 3 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
                          {rank}
                        </span>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center text-[11px] text-muted-foreground">
                          {rank}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="max-w-[220px] px-2 py-1.5">
                      <p className="truncate text-xs font-medium">
                        {product.name}
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        {formatRupiah(product.revenue)}
                      </p>
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-2 py-1.5 text-right">
                      <span className="font-medium tabular-nums">
                        {product.quantity.toLocaleString("id-ID")}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-2 py-1.5 text-right">
                      <span className="text-xs font-semibold tabular-nums">
                        {formatRupiah(product.revenue)}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}

              {products.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-20 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                        —
                      </div>

                      <p className="text-xs font-medium">
                        Belum ada data
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        Belum ada penjualan produk.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {products.length > 0 && (
          <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-2.5 py-2">
            <span className="text-[10px] text-muted-foreground">
              Total omzet
            </span>

            <span className="text-xs font-semibold tabular-nums">
              {formatRupiah(totalRevenue)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
