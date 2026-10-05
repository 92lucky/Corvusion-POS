import { z } from "zod"

export const profileSchema = z.object({
  businessName: z.string().min(2, "Nama toko minimal 2 karakter"),
  businessType: z.enum(["APOTEK", "KLONTONG", "BANGUNAN"]),
  ownerName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>
