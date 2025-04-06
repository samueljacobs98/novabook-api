import { prisma } from "../../../../../src/api/db"
import { createTaxPaymentEvent } from "../../../../../src/v1/controllers/db/create-tax-payment-event.db"

jest.mock("../../../../../src/api/db", () => ({
  prisma: {
    taxPayment: {
      create: jest.fn()
    }
  }
}))

describe("createTaxPaymentEvent", () => {
  it("should call prisma.taxPayment.create with the correct values", async () => {
    const testData = {
      date: new Date("2023-01-01"),
      amount: 100
    }

    await createTaxPaymentEvent(testData)

    expect(prisma.taxPayment.create).toHaveBeenCalledWith({
      data: {
        date: testData.date,
        amount: testData.amount
      }
    })
  })
})
