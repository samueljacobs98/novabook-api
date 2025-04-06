import { Response } from "express"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { ParsedRequest } from "../../api/types"
import { postTransactionsSchema } from "../schemas/post-transactions.schema"
import { createSaleEvent } from "./db/create-sale-event.db"
import { createTaxPaymentEvent } from "./db/create-tax-payment-event.db"

export async function postTransactions(
  req: ParsedRequest<typeof postTransactionsSchema>,
  res: Response
) {
  try {
    if (req.parsedData.body.eventType === "SALES") {
      await createSaleEvent(req.parsedData.body)
    }

    if (req.parsedData.body.eventType === "TAX_PAYMENT") {
      await createTaxPaymentEvent(req.parsedData.body)
    }

    res.status(StatusCodes.ACCEPTED).send()
  } catch (error) {
    req.logger.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  }
}
