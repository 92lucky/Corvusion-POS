import { z } from "zod"

export const purchaseItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  purchasePrice: z.number().nonnegative(),
})

export const purchaseSchema = z.object({
  supplierId: z.string().optional(),
  invoiceNumber: z
    .string()
    .min(1, "Nomor invoice wajib diisi"),
  purchaseDate: z.string().optional(),
  paymentMethod: z.string().min(1),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  notes: z.string().optional(),
  items: z.array(purchaseItemSchema).min(1),
})

export type PurchaseInput = z.infer<typeof purchaseSchema>
