import { createLogger, format, transports } from "winston"
import DailyRotateFile from "winston-daily-rotate-file"
import config from "../config"

type LogLevel = "error" | "warn" | "info" | "http" | "verbose" | "debug"

const environmentLevelMap: Record<typeof config.app.env, LogLevel> = {
  local: "debug",
  development: "debug",
  staging: "info",
  production: "error"
}

const logger = createLogger({
  level: environmentLevelMap[config.app.env],
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.metadata({
      key: "meta",
      fillExcept: ["message", "level", "timestamp"]
    }),
    format.printf(({ timestamp, level, message, meta, stack }) => {
      const requestId = meta?.requestId || "N/A"
      return `[${timestamp}] [${level}] [Request ID: ${requestId}] ${
        stack || message
      }`
    })
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    }),
    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d"
    })
  ]
})

export default logger
