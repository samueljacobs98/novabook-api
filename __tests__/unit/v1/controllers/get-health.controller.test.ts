import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { Logger } from "winston"
import { prisma } from "../../../../src/api/db"
import { getHealth } from "../../../../src/v1/controllers/get-health.controller"

jest.mock("../../../../src/api/db", () => ({
  prisma: {
    $queryRaw: jest.fn()
  }
}))

describe("getHealth", () => {
  let req: Request
  let res: Response

  beforeEach(() => {
    req = {
      logger: {
        error: jest.fn()
      }
    } as unknown as Request
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response
  })

  it("should respond with status 200 and 'database: connected'", async () => {
    ;(prisma.$queryRaw as jest.Mock).mockResolvedValueOnce(1)

    await getHealth(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({ database: "connected" })
  })

  it("should respond with status 500 if DB check fails", async () => {
    const error = new Error("DB down")
    ;(prisma.$queryRaw as jest.Mock).mockRejectedValueOnce(error)

    await getHealth(req, res)

    expect(
      (req as Request & { logger: Logger }).logger.error
    ).toHaveBeenCalledWith("Health check failed:", error)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      status: "error",
      database: "unreachable"
    })
  })
})
