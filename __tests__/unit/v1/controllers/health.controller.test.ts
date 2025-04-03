import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../../../../src/api/db"
import { health } from "../../../../src/v1/controllers/health.controller"

jest.mock("../../../../src/api/db", () => ({
  prisma: {
    $queryRaw: jest.fn()
  }
}))

describe("ping endpoint", () => {
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

    await health(req, res)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({ database: "connected" })
  })

  it("should respond with status 500 if DB check fails", async () => {
    const error = new Error("DB down")
    ;(prisma.$queryRaw as jest.Mock).mockRejectedValueOnce(error)

    await health(req, res)

    expect(req.logger.error).toHaveBeenCalledWith("Health check failed:", error)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({ database: "unreachable" })
  })
})
