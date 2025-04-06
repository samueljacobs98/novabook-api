import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod"
import { ValidationError } from "./errors"
import type { ParsedRequest } from "./types"

export const validate =
  <Schema extends ZodSchema>(schema: Schema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsedData = schema.safeParse(req)
    if (parsedData.success) {
      ;(req as ParsedRequest<Schema>).parsedData = parsedData.data
      next()
    } else {
      next(new ValidationError(parsedData.error.errors))
    }
  }
