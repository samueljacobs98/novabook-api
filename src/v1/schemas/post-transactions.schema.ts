import { z } from "zod"

const saleItemSchema = z.object({
  itemId: z.string(),
  cost: z.number().min(0, "Cost must be at least 0"),
  taxRate: z
    .number()
    .min(0, "Tax rate must be at least 0")
    .max(1, "Tax rate must be at most 1")
})

const saleEventSchema = z.object({
  eventType: z.literal("SALES"),
  date: z
    .string()
    .datetime()
    .transform((date) => new Date(date)),
  invoiceId: z.string(),
  items: z.array(saleItemSchema)
})
const taxPaymentEventSchema = z.object({
  eventType: z.literal("TAX_PAYMENT"),
  date: z.string().datetime(),
  amount: z.number().min(0, "Amount must be at least 0")
})

export const postTransactionsSchema = z.object({
  body: z.union([saleEventSchema, taxPaymentEventSchema])
})
