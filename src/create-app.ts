import cors from "cors"
import express, { Application } from "express"
import "express-async-errors"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./api/docs"
import { addLogger, addRequestId, errorHandler } from "./api/middleware"
import routes from "./routes"

export function createApp(): Application {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(addRequestId)
  app.use(addLogger)

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  app.use("/api", routes)

  app.use(errorHandler)

  return app
}
