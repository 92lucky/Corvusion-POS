import { z } from "zod"

export const supplierSchema = z.object({
  name: z.string().min(2, "Nama supplier minimal 2 karakter"),
  phone: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
})

export type SupplierInput = z.infer<typeof supplierSchema>
