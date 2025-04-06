import { Response } from "express"
import { ParsedRequest } from "../../api/types"
import { calculateTaxPosition } from "../../api/utils"
import { getTaxPositionSchema } from "../schemas/get-tax-position.schema"
import { getEvents } from "./db/get-events.db"

export async function getTaxPosition(
  req: ParsedRequest<typeof getTaxPositionSchema>,
  res: Response
) {
  const data = await getEvents(req.parsedData.query.date)
  const taxPosition = calculateTaxPosition(data)
  res
    .status(200)
    .send({ date: req.parsedData.query.date.toISOString(), taxPosition })
}
