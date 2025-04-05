import { NextFunction, Request, Response } from "express"
import { Logger } from "winston"
import logger from "../../../../src/api/logger"
import { addLogger } from "../../../../src/api/middleware"

describe("addLogger middleware", () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction
  let mockLogger: Logger

  beforeEach(() => {
    mockLogger = { info: jest.fn() } as unknown as Logger

    jest.spyOn(logger, "child").mockReturnValue(mockLogger)

    req = {
      method: "GET",
      url: "/test",
      headers: { "x-test": "value" }
    }

    res = { locals: {} }

    next = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should attach logger to request with provided request id", () => {
    // @ts-expect-error - mocking express Request object
    res.locals.id = "12345"

    addLogger(req as Request, res as Response, next)

    expect(logger.child).toHaveBeenCalledWith({ requestId: "12345" })
    expect((req as Request & { logger: Logger }).logger).toBe(mockLogger)
    expect(mockLogger.info).toHaveBeenCalledWith("Incoming request:", {
      method: req.method,
      url: req.url,
      headers: req.headers
    })
    expect(next).toHaveBeenCalled()
  })

  it("should attach logger to request with default request id when none is provided", () => {
    // @ts-expect-error - mocking express
    delete res.locals.id

    addLogger(req as Request, res as Response, next)

    expect(logger.child).toHaveBeenCalledWith({ requestId: "N/A" })
    expect((req as Request & { logger: Logger }).logger).toBe(mockLogger)
    expect(mockLogger.info).toHaveBeenCalledWith("Incoming request:", {
      method: req.method,
      url: req.url,
      headers: req.headers
    })
    expect(next).toHaveBeenCalled()
  })
})
