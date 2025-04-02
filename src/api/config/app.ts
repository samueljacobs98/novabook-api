import { z } from "zod"

const schema = z.object({
  port: z.coerce.number().default(3000),
  env: z.enum(["local", "development", "staging", "production"])
})

const config = schema.parse({
  port: process.env.PORT,
  env: process.env.NODE_ENV
})

export default config
