import { z } from "zod"

export const patchSaleSchema = z.object({
  body: z.object({
    date: z
      .string()
      .datetime()
      .transform((date) => new Date(date)),
    invoiceId: z.string(),
    itemId: z.string(),
    cost: z.number().min(0, "Cost must be at least 0"),
    taxRate: z
      .number()
      .min(0, "Tax rate must be at least 0")
      .max(1, "Tax rate must be at most 1")
  })
})
