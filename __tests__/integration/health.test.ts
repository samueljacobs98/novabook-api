import { StatusCodes } from "http-status-codes"
import request from "supertest"
import { prisma } from "../../src/api/db"
import { createApp } from "../../src/create-app"

jest.mock("../../src/api/db", () => ({
  prisma: {
    $queryRaw: jest.fn()
  }
}))

describe("GET /api/v1/health", () => {
  const app = createApp()

  it("should return OK 200 and a database connected message", async () => {
    ;(prisma.$queryRaw as jest.Mock).mockResolvedValueOnce(1)

    const response = await request(app).get("/api/v1/health")

    expect(response.status).toBe(StatusCodes.OK)
    expect(response.body).toEqual({ database: "connected" })
  })

  it("should return 500 if database is unreachable", async () => {
    ;(prisma.$queryRaw as jest.Mock).mockRejectedValueOnce(new Error("boom"))

    const response = await request(app).get("/api/v1/health")

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(response.body).toEqual({ database: "unreachable" })
  })
})
