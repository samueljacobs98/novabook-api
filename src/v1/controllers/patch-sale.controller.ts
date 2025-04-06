import { Response } from "express"
import { StatusCodes } from "http-status-codes"
import { ParsedRequest } from "../../api/types"
import { patchSaleSchema } from "../schemas/patch-sale.schema"
import { createSaleAmendment } from "./db/create-sale-amendment.db"

export async function patchSale(
  req: ParsedRequest<typeof patchSaleSchema>,
  res: Response
) {
  try {
    await createSaleAmendment(req.parsedData.body)

    res.status(StatusCodes.ACCEPTED).send()
  } catch (error) {
    req.logger.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
  }
}
