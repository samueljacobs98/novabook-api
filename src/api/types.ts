import { Request } from "express"
import { ZodSchema, z } from "zod"

export type ParsedRequest<Schema = undefined> = Request & {
  parsedData: Schema extends ZodSchema ? z.output<Schema> : undefined
}
