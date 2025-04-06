import { NextFunction, Request, Response } from "express"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { BaseError } from "../errors"
import _logger from "../logger"

export function errorHandler(
  err: Error | BaseError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const logger = req?.logger || _logger
  logger.error(err)

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: getReasonPhrase(err.statusCode),
      details: err.details
    })
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
  })
}
