import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { ping } from "../../../../src/v1/controllers/ping.controller"

describe("ping endpoint", () => {
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  })

  it("should respond with status 200 and 'pong'", () => {
    ping(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.send).toHaveBeenCalledWith({ message: "pong" })
  })
})
