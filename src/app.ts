import dotenvx from "@dotenvx/dotenvx"
import "express-async-errors"
import path from "path"
import config from "./api/config"
import logger from "./api/logger"
import { createApp } from "./create-app"

dotenvx.config({
  path: path.resolve(__dirname, "..", `.env.${process.env.NODE_ENV}`)
})

const app = createApp()

app.listen(config.app.port, () => {
  logger.info(`Server is running on port ${config.app.port}`)
})
