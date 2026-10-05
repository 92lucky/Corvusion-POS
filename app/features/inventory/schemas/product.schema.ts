import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  barcode: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  unitId: z.string().optional(),

  purchasePrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),

  stock: z.coerce.number().int().min(0),
  minimumStock: z.coerce.number().int().min(0),

  expiredAt: z.string().optional(),
  dosage: z.string().optional(),
volume: z.string().optional(),
  weight: z.coerce.number().min(0).optional(),

  notes: z.string().optional(),
})

export type ProductInput = z.infer<typeof productSchema>
