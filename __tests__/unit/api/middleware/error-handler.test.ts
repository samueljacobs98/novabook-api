import { Request, Response } from "express"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { BaseError } from "../../../../src/api/errors"
import logger from "../../../../src/api/logger"
import { errorHandler } from "../../../../src/api/middleware/error-handler"

class TestError extends BaseError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(statusCode: number, details?: any) {
    super(statusCode, details)
  }
}

describe("errorHandler middleware", () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    req = {}
    next = jest.fn()

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { id: "test-request-id" }
    }

    // @ts-expect-error - Testing dynamic class instantiation
    jest.spyOn(logger, "error").mockImplementation(() => {})
  })

  it("should handle BaseError instances with details", () => {
    const details = { resource: "User" }
    const error = new TestError(StatusCodes.NOT_FOUND, details)

    errorHandler(error, req as Request, res as Response, next)

    expect(logger.error).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledWith(error.statusCode)
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: getReasonPhrase(error.statusCode),
      details
    })
  })

  it("should handle BaseError instances without details", () => {
    const error = new TestError(StatusCodes.BAD_REQUEST)

    errorHandler(error, req as Request, res as Response, next)

    expect(logger.error).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledWith(error.statusCode)
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: getReasonPhrase(error.statusCode)
    })
  })

  it("should handle non-BaseError errors", () => {
    const error = new Error("Some error")

    errorHandler(error, req as Request, res as Response, next)

    expect(logger.error).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })
})
