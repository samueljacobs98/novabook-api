import { Request, Response } from "express"
import { prisma } from "../../api/db"

export async function getHealth(req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`

    return res.status(200).json({ database: "connected" })
  } catch (error) {
    req.logger.error("Health check failed:", error)
    return res.status(500).json({ database: "unreachable" })
  }
}
