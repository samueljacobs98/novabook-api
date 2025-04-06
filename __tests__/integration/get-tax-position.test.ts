import { Amendment, Sale, SaleItem, TaxPayment } from "@prisma/client"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import request from "supertest"
import { prisma } from "../../src/api/db"
import { createApp } from "../../src/create-app"

jest.mock("../../src/api/db", () => ({
  prisma: {
    sale: { findMany: jest.fn() },
    amendment: { findMany: jest.fn() },
    taxPayment: { findMany: jest.fn() }
  }
}))

describe("GET /api/v1/tax-position", () => {
  const app = createApp()
  const validDate = "2024-02-22T17:29:39Z"

  it("should return 200 and the calculated tax position", async () => {
    const salesData: (Sale & { items: SaleItem[] })[] = [
      {
        id: "invoice1",
        invoiceId: "invoice1",
        date: new Date("2024-02-22T10:00:00Z"),
        createdAt: new Date("2024-02-22T10:00:00Z"),
        items: [
          {
            id: "i1",
            saleId: "invoice1",
            itemId: "item1",
            cost: 1000,
            taxRate: 0.1
          }
        ]
      }
    ]
    const amendmentsData: Amendment[] = []
    const taxPaymentsData: TaxPayment[] = []

    ;(prisma.sale.findMany as jest.Mock).mockResolvedValueOnce(salesData)
    ;(prisma.amendment.findMany as jest.Mock).mockResolvedValueOnce(
      amendmentsData
    )
    ;(prisma.taxPayment.findMany as jest.Mock).mockResolvedValueOnce(
      taxPaymentsData
    )

    const response = await request(app)
      .get("/api/v1/tax-position")
      .query({ date: validDate })

    expect(response.status).toBe(StatusCodes.OK)
    expect(response.body).toEqual({
      date: new Date(validDate).toISOString(),
      taxPosition: 100
    })
  })

  it("should return 500 if any of the database queries fail", async () => {
    ;(prisma.sale.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("boom")
    )
    ;(prisma.amendment.findMany as jest.Mock).mockResolvedValueOnce([])
    ;(prisma.taxPayment.findMany as jest.Mock).mockResolvedValueOnce([])

    const response = await request(app)
      .get("/api/v1/tax-position")
      .query({ date: validDate })

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(response.body).toEqual({
      status: "error",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })
})
