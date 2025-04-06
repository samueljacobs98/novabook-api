import { Response } from "express"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { Logger } from "winston"
import { ParsedRequest } from "../../../../src/api/types"
import { calculateTaxPosition } from "../../../../src/api/utils"
import { getEvents } from "../../../../src/v1/controllers/db/get-events.db"
import { getTaxPosition } from "../../../../src/v1/controllers/get-tax-position.controller"
import { getTaxPositionSchema } from "../../../../src/v1/schemas/get-tax-position.schema"

jest.mock("../../../../src/v1/controllers/db/get-events.db", () => ({
  getEvents: jest.fn()
}))

jest.mock("../../../../src/api/utils", () => ({
  calculateTaxPosition: jest.fn()
}))

describe("getTaxPosition", () => {
  let req: ParsedRequest<typeof getTaxPositionSchema> & { logger: Logger }
  let res: Response
  const sampleDate = new Date("2023-01-01T00:00:00.000Z")

  beforeEach(() => {
    req = {
      parsedData: { query: { date: sampleDate } },
      logger: { error: jest.fn() }
    } as unknown as ParsedRequest<typeof getTaxPositionSchema> & {
      logger: Logger
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should respond with status 200 and return the tax position", async () => {
    const taxData = {
      sales: [
        {
          invoiceId: "1",
          date: sampleDate,
          items: [{ itemId: "a", cost: 100, taxRate: 0.1 }]
        }
      ],
      amendments: [],
      taxPayments: []
    }
    const taxPosition = 10

    ;(getEvents as jest.Mock).mockResolvedValueOnce(taxData)
    ;(calculateTaxPosition as jest.Mock).mockReturnValueOnce(taxPosition)

    await getTaxPosition(req, res)

    expect(getEvents).toHaveBeenCalledWith(sampleDate)
    expect(calculateTaxPosition).toHaveBeenCalledWith(taxData)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({
      date: sampleDate.toISOString(),
      taxPosition: taxPosition
    })
  })

  it("should respond with status 500 if getEvents fails", async () => {
    const error = new Error("DB error")
    ;(getEvents as jest.Mock).mockRejectedValueOnce(error)

    await getTaxPosition(req, res)

    expect(req.logger.error).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })
})
