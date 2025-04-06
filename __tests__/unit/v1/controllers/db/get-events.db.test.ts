import { prisma } from "../../../../../src/api/db"
import { getEvents } from "../../../../../src/v1/controllers/db/get-events.db"

jest.mock("../../../../../src/api/db", () => ({
  prisma: {
    sale: {
      findMany: jest.fn()
    },
    amendment: {
      findMany: jest.fn()
    },
    taxPayment: {
      findMany: jest.fn()
    }
  }
}))

describe("getEvents", () => {
  it("should call prisma methods with the correct values and return the expected events", async () => {
    const testDate = new Date("2023-01-01")
    const fakeSales = [{ id: 1, items: [] }]
    const fakeAmendments = [{ id: 2 }]
    const fakeTaxPayments = [{ id: 3 }]

    ;(prisma.sale.findMany as jest.Mock).mockResolvedValue(fakeSales)
    ;(prisma.amendment.findMany as jest.Mock).mockResolvedValue(fakeAmendments)
    ;(prisma.taxPayment.findMany as jest.Mock).mockResolvedValue(
      fakeTaxPayments
    )

    const result = await getEvents(testDate)

    expect(prisma.sale.findMany).toHaveBeenCalledWith({
      where: { date: { lte: testDate } },
      include: { items: true }
    })
    expect(prisma.amendment.findMany).toHaveBeenCalledWith({
      where: { date: { lte: testDate } }
    })
    expect(prisma.taxPayment.findMany).toHaveBeenCalledWith({
      where: { date: { lte: testDate } }
    })

    expect(result).toEqual({
      sales: fakeSales,
      amendments: fakeAmendments,
      taxPayments: fakeTaxPayments
    })
  })
})
