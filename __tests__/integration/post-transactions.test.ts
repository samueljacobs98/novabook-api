import { StatusCodes, getReasonPhrase } from "http-status-codes"
import request from "supertest"
import { prisma } from "../../src/api/db"
import { createApp } from "../../src/create-app"

jest.mock("../../src/api/db", () => ({
  prisma: {
    sale: { create: jest.fn() },
    taxPayment: { create: jest.fn() }
  }
}))

describe("POST /api/v1/transactions", () => {
  const app = createApp()

  describe("Sales event", () => {
    const salesPayload = {
      eventType: "SALES",
      date: "2024-02-22T17:29:39Z",
      invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791824",
      items: [
        {
          itemId: "02db47b6-fe68-4005-a827-24c6e962f3df",
          cost: 1099,
          taxRate: 0.2
        }
      ]
    }

    it("should return 202 Accepted when a sale event is processed successfully", async () => {
      ;(prisma.sale.create as jest.Mock).mockResolvedValueOnce(salesPayload)

      const response = await request(app)
        .post("/api/v1/transactions")
        .send(salesPayload)

      expect(response.status).toBe(StatusCodes.ACCEPTED)
      expect(response.text).toBe("")
      expect(prisma.sale.create).toHaveBeenCalledWith({
        data: {
          invoiceId: salesPayload.invoiceId,
          date: new Date(salesPayload.date),
          items: {
            createMany: {
              data: salesPayload.items
            }
          }
        }
      })
    })

    it("should return 500 Internal Server Error if the sale event processing fails", async () => {
      ;(prisma.sale.create as jest.Mock).mockImplementationOnce(() => {
        throw new Error("boom")
      })

      const response = await request(app)
        .post("/api/v1/transactions")
        .send(salesPayload)

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toEqual({
        status: "error",
        message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
      })
    })
  })

  describe("Tax Payment event", () => {
    const taxPaymentPayload = {
      eventType: "TAX_PAYMENT",
      date: "2024-02-22T17:29:39Z",
      amount: 74901
    }

    it("should return 202 Accepted when a tax payment event is processed successfully", async () => {
      ;(prisma.taxPayment.create as jest.Mock).mockResolvedValueOnce(
        taxPaymentPayload
      )
      const response = await request(app)
        .post("/api/v1/transactions")
        .send(taxPaymentPayload)

      expect(response.status).toBe(StatusCodes.ACCEPTED)
      expect(response.text).toBe("")
      expect(prisma.taxPayment.create).toHaveBeenCalledWith({
        data: {
          date: new Date(taxPaymentPayload.date),
          amount: taxPaymentPayload.amount
        }
      })
    })

    it("should return 500 Internal Server Error if the tax payment event processing fails", async () => {
      ;(prisma.taxPayment.create as jest.Mock).mockImplementationOnce(() => {
        throw new Error("boom")
      })
      const response = await request(app)
        .post("/api/v1/transactions")
        .send(taxPaymentPayload)

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.body).toEqual({
        status: "error",
        message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
      })
    })
  })
})
