import { NextFunction, Request, Response } from "express"
import { v4 as uuid } from "uuid"
import { addRequestId } from "../../../../src/api/middleware"

jest.mock("uuid", () => ({
  v4: jest.fn()
}))

describe("requestId middleware", () => {
  let req: Partial<Request>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let res: Partial<Response> & { locals: Record<string, any> }
  let next: NextFunction

  beforeEach(() => {
    req = {}
    res = {
      locals: {},
      setHeader: jest.fn()
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should set res.locals.id and X-Request-Id header with a UUID", () => {
    const fakeUuid = "123e4567-e89b-12d3-a456-426614174000"

    ;(uuid as jest.Mock).mockReturnValue(fakeUuid)

    addRequestId(req as Request, res as Response, next)

    expect(res.locals.id).toBe(fakeUuid)
    expect(res.setHeader).toHaveBeenCalledWith("X-Request-Id", fakeUuid)
    expect(next).toHaveBeenCalled()
  })
})
