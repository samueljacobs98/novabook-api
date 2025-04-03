import "express-async-errors"
import config from "./api/config"
import logger from "./api/logger"
import { createApp } from "./create-app"

const app = createApp()

app.listen(config.app.port, () => {
  logger.info(`Server is running on port ${config.app.port}`)
})
