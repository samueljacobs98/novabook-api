import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod"
import { ValidationError } from "../../../src/api/errors"
import { ParsedRequest } from "../../../src/api/types"
import { validate } from "../../../src/api/validator"

describe("validate middleware", () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = {} as Request
    res = {} as Response
    next = jest.fn()
  })

  it("attaches parsedData to req and calls next() when validation succeeds", () => {
    const data = { foo: "bar" }
    const schema = {
      safeParse: jest.fn().mockReturnValue({
        success: true,
        data
      })
    } as unknown as ZodSchema

    const middleware = validate(schema)
    middleware(req, res, next)

    expect(schema.safeParse).toHaveBeenCalledWith(req)
    expect((req as ParsedRequest).parsedData).toEqual(data)
    expect(next).toHaveBeenCalledWith()
  })

  it("calls next() with a ValidationError when validation fails", () => {
    const errorDetails = [{ message: "Invalid value", path: ["foo"] }]
    const schema = {
      safeParse: jest.fn().mockReturnValue({
        success: false,
        error: { errors: errorDetails }
      })
    } as unknown as ZodSchema

    const middleware = validate(schema)
    middleware(req as Request, res as Response, next)

    expect(schema.safeParse).toHaveBeenCalledWith(req)
    expect(next).toHaveBeenCalledWith(expect.any(ValidationError))

    const errorArg = (next as jest.Mock).mock.calls[0][0]
    expect(errorArg.details).toEqual(errorDetails)
  })
})
