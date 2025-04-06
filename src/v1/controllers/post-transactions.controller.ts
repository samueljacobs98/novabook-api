import { Response } from "express"
import { StatusCodes } from "http-status-codes"
import { ParsedRequest } from "../../api/types"
import { postTransactionsSchema } from "../schemas/post-transactions.schema"

export function postTransactions(
  req: ParsedRequest<typeof postTransactionsSchema>,
  res: Response
) {
  res.status(StatusCodes.ACCEPTED).send()
}
