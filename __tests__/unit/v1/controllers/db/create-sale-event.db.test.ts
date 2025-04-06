import { prisma } from "../../../../../src/api/db"
import { createSaleEvent } from "../../../../../src/v1/controllers/db/create-sale-event.db"

jest.mock("../../../../../src/api/db", () => ({
  prisma: {
    sale: {
      create: jest.fn()
    }
  }
}))

describe("createSaleEvent", () => {
  it("should call prisma.sale.create with the correct values", async () => {
    const testData = {
      invoiceId: "inv123",
      date: new Date("2023-01-01"),
      items: [
        {
          itemId: "item123",
          cost: 100,
          taxRate: 0.2
        }
      ]
    }

    await createSaleEvent(testData)

    expect(prisma.sale.create).toHaveBeenCalledWith({
      data: {
        invoiceId: testData.invoiceId,
        date: testData.date,
        items: {
          createMany: {
            data: testData.items
          }
        }
      }
    })
  })
})
