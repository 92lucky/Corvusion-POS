import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().min(2, "Nama customer minimal 2 karakter"),
  phone: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
})

export type CustomerInput = z.infer<typeof customerSchema>
