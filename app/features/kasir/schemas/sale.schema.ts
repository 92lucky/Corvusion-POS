import { z } from "zod"

export const saleItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  sellingPrice: z.number().nonnegative(),
})

export const saleSchema = z.object({
  customerId: z.string().optional(),

  paymentMethod: z.string().min(1),

  discount: z.number().nonnegative().default(0),

  tax: z.number().nonnegative().default(0),

  paidAmount: z.number().nonnegative(),

  notes: z.string().optional(),

  items: z.array(saleItemSchema).min(1),
})

export type SaleInput = z.infer<typeof saleSchema>
