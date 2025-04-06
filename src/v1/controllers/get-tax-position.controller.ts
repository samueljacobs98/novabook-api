import { Response } from "express"
import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { ParsedRequest } from "../../api/types"
import { calculateTaxPosition } from "../../api/utils"
import { getTaxPositionSchema } from "../schemas/get-tax-position.schema"
import { getEvents } from "./db/get-events.db"

export async function getTaxPosition(
  req: ParsedRequest<typeof getTaxPositionSchema>,
  res: Response
) {
  try {
    const data = await getEvents(req.parsedData.query.date)
    const taxPosition = calculateTaxPosition(data)

    res
      .status(200)
      .json({ date: req.parsedData.query.date.toISOString(), taxPosition })
  } catch (error) {
    req.logger.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  }
}
