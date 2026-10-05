import { z } from "zod"

export const unitSchema = z.object({
  name: z.string().min(1, "Nama satuan wajib diisi"),
  symbol: z.string().optional(),
})

export type UnitInput = z.infer<typeof unitSchema>
