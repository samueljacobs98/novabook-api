import { Request, Response } from "express"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { prisma } from "../../api/db"

export async function getHealth(req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({ database: "connected" })
  } catch (error) {
    req.logger.error("Health check failed:", error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      database: "unreachable",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  }
}
