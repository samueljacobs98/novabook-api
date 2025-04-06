import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod"
import { ParsedRequest } from "../types"

export function parsed<Schema extends ZodSchema>(
  handler: (
    req: ParsedRequest<Schema>,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>
) {
  return function (req: Request, res: Response, next: NextFunction) {
    return handler(req as ParsedRequest<Schema>, res, next)
  }
}
