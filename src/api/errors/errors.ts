import { StatusCodes } from "http-status-codes"
import { ZodIssue } from "zod"
import { BaseError } from "./base-error"

export class NotFoundError extends BaseError<Record<string, unknown>> {
  constructor(details?: Record<string, unknown>) {
    super(StatusCodes.NOT_FOUND, details)
  }
}

export class BadRequestError extends BaseError<void> {
  constructor() {
    super(StatusCodes.BAD_REQUEST)
  }
}

export class ValidationError extends BaseError<ZodIssue[]> {
  constructor(details: ZodIssue[]) {
    super(StatusCodes.BAD_REQUEST, details)
  }
}
