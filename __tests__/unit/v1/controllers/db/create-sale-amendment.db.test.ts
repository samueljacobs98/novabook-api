import { prisma } from "../../../../../src/api/db"
import { createSaleAmendment } from "../../../../../src/v1/controllers/db/create-sale-amendment.db"

jest.mock("../../../../../src/api/db", () => ({
  prisma: {
    amendment: {
      create: jest.fn()
    }
  }
}))

describe("createSaleAmendment", () => {
  it("should call prisma.amendment.create with the correct values", async () => {
    const testData = {
      date: new Date("2023-01-01"),
      invoiceId: "inv123",
      itemId: "item123",
      cost: 100,
      taxRate: 0.2
    }

    await createSaleAmendment(testData)

    expect(prisma.amendment.create).toHaveBeenCalledWith({
      data: {
        date: testData.date,
        invoiceId: testData.invoiceId,
        itemId: testData.itemId,
        cost: testData.cost,
        taxRate: testData.taxRate
      }
    })
  })
})
