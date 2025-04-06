import { z } from "zod"

export const getTaxPositionSchema = z.object({
  query: z.object({
    date: z
      .string()
      .datetime()
      .transform((date) => new Date(date))
  })
})
