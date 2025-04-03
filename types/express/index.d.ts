import "express"
import { Logger } from "winston"

declare module "express-serve-static-core" {
  interface Request {
    logger: Logger
  }
}
