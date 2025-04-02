import { NextFunction, Request, Response } from "express"
import { Logger } from "winston"
import logger from "../logger"

export function addLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = res.locals.id || "N/A"

  ;(req as Request & { logger: Logger }).logger = logger.child({ requestId })
  ;(req as Request & { logger: Logger }).logger.debug({
    message: "Incoming request:",
    method: req.method,
    url: req.url,
    headers: req.headers
  })

  next()
}
