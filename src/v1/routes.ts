import { Router } from "express"
import { parsed } from "../api/utils"
import { validate } from "../api/validator"
import { getHealth } from "./controllers/get-health.controller"
import { getTaxPosition } from "./controllers/get-tax-position.controller"
import { patchSale } from "./controllers/patch-sale.controller"
import { postTransactions } from "./controllers/post-transactions.controller"
import { getTaxPositionSchema } from "./schemas/get-tax-position.schema"
import { patchSaleSchema } from "./schemas/patch-sale.schema"
import { postTransactionsSchema } from "./schemas/post-transactions.schema"

const router = Router()

router.get("/health", getHealth)

router.post(
  "/transactions",
  validate(postTransactionsSchema),
  parsed(postTransactions)
)

router.get(
  "/tax-position",
  validate(getTaxPositionSchema),
  parsed(getTaxPosition)
)

router.patch("/sale", validate(patchSaleSchema), parsed(patchSale))

export default router
