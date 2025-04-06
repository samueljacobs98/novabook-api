import { StatusCodes, getReasonPhrase } from "http-status-codes"
import request from "supertest"
import { prisma } from "../../src/api/db"
import { createApp } from "../../src/create-app"

jest.mock("../../src/api/db", () => ({
  prisma: {
    amendment: {
      create: jest.fn()
    }
  }
}))

describe("PATCH /api/v1/sale", () => {
  const app = createApp()
  const validPayload = {
    date: "2024-02-22T17:29:39Z",
    invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791824",
    itemId: "02db47b6-fe68-4005-a827-24c6e962f3df",
    cost: 798,
    taxRate: 0.15
  }

  it("should return 202 Accepted when the sale amendment is created successfully", async () => {
    ;(prisma.amendment.create as jest.Mock).mockResolvedValueOnce(validPayload)

    const response = await request(app).patch("/api/v1/sale").send(validPayload)

    expect(response.status).toBe(StatusCodes.ACCEPTED)
    expect(response.text).toBe("")
  })

  it("should return 500 Internal Server Error when the creation fails", async () => {
    ;(prisma.amendment.create as jest.Mock).mockRejectedValueOnce(
      new Error("boom")
    )

    const response = await request(app).patch("/api/v1/sale").send(validPayload)

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(response.body).toEqual({
      status: "error",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })
})
