import { Response } from "express"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { Logger } from "winston"
import { ParsedRequest } from "../../../../src/api/types"
import { createSaleAmendment } from "../../../../src/v1/controllers/db/create-sale-amendment.db"
import { patchSale } from "../../../../src/v1/controllers/patch-sale.controller"
import { patchSaleSchema } from "../../../../src/v1/schemas/patch-sale.schema"

jest.mock("../../../../src/v1/controllers/db/create-sale-amendment.db", () => ({
  createSaleAmendment: jest.fn()
}))

const amendment = {
  date: new Date("2023-01-01T00:00:00.000Z"),
  invoiceId: "inv-1",
  itemId: "item-1",
  cost: 100,
  taxRate: 0.1
}

describe("patchSale", () => {
  let req: ParsedRequest<typeof patchSaleSchema> & { logger: Logger }
  let res: Response

  beforeEach(() => {
    req = {
      parsedData: {
        body: amendment
      },
      logger: {
        error: jest.fn()
      }
    } as unknown as ParsedRequest<typeof patchSaleSchema> & { logger: Logger }

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    } as unknown as Response
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should call createSaleAmendment and respond with ACCEPTED", async () => {
    ;(createSaleAmendment as jest.Mock).mockResolvedValueOnce(amendment)

    await patchSale(req, res)

    expect(createSaleAmendment).toHaveBeenCalledWith(req.parsedData.body)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.ACCEPTED)
    expect(res.send).toHaveBeenCalled()
  })

  it("should catch errors, log them and respond with INTERNAL_SERVER_ERROR", async () => {
    const error = new Error("DB error")
    ;(createSaleAmendment as jest.Mock).mockRejectedValueOnce(error)

    await patchSale(req, res)

    expect(req.logger.error).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })
})
