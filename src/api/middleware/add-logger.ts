import { NextFunction, Request, Response } from "express"
import logger from "../logger"

export function addLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = res.locals.id || "N/A"

  req.logger = logger.child({ requestId })
  req.logger.info("Incoming request:", {
    method: req.method,
    url: req.url,
    headers: req.headers
  })

  next()
}
