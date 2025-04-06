import { Response } from "express"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { Logger } from "winston"
import { ParsedRequest } from "../../../../src/api/types"
import { createSaleEvent } from "../../../../src/v1/controllers/db/create-sale-event.db"
import { createTaxPaymentEvent } from "../../../../src/v1/controllers/db/create-tax-payment-event.db"
import { postTransactions } from "../../../../src/v1/controllers/post-transactions.controller"
import { postTransactionsSchema } from "../../../../src/v1/schemas/post-transactions.schema"

jest.mock("../../../../src/v1/controllers/db/create-sale-event.db", () => ({
  createSaleEvent: jest.fn()
}))

jest.mock(
  "../../../../src/v1/controllers/db/create-tax-payment-event.db",
  () => ({
    createTaxPaymentEvent: jest.fn()
  })
)

describe("postTransactions", () => {
  let req: ParsedRequest<typeof postTransactionsSchema> & { logger: Logger }
  let res: Response

  beforeEach(() => {
    req = {
      parsedData: { body: { eventType: "SALES" } },
      logger: { error: jest.fn() }
    } as unknown as ParsedRequest<typeof postTransactionsSchema> & {
      logger: Logger
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    } as unknown as Response
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should call createSaleEvent for SALES eventType", async () => {
    req.parsedData.body.eventType = "SALES"

    await postTransactions(req, res)

    expect(createSaleEvent).toHaveBeenCalledWith(req.parsedData.body)
    expect(createTaxPaymentEvent).not.toHaveBeenCalled()

    expect(res.status).toHaveBeenCalledWith(StatusCodes.ACCEPTED)
    expect(res.send).toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it("should call createTaxPaymentEvent for TAX_PAYMENT eventType", async () => {
    req.parsedData.body.eventType = "TAX_PAYMENT"

    await postTransactions(req, res)

    expect(createTaxPaymentEvent).toHaveBeenCalledWith(req.parsedData.body)
    expect(createSaleEvent).not.toHaveBeenCalled()

    expect(res.status).toHaveBeenCalledWith(StatusCodes.ACCEPTED)
    expect(res.send).toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it("should catch errors thrown by createSaleEvent and respond with INTERNAL_SERVER_ERROR", () => {
    const error = new Error("Sale event error")
    req.parsedData.body.eventType = "SALES"
    ;(createSaleEvent as jest.Mock).mockImplementationOnce(() => {
      throw error
    })

    postTransactions(req, res)

    expect(req.logger.error).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })

  it("should catch errors thrown by createTaxPaymentEvent and respond with INTERNAL_SERVER_ERROR", () => {
    const error = new Error("Tax payment event error")
    req.parsedData.body.eventType = "TAX_PAYMENT"
    ;(createTaxPaymentEvent as jest.Mock).mockImplementationOnce(() => {
      throw error
    })

    postTransactions(req, res)

    expect(req.logger.error).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })
})
