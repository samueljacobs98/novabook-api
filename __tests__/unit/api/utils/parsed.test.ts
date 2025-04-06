import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { ParsedRequest } from "../../../../src/api/types"
import { parsed } from "../../../../src/api/utils/parsed"

describe("parsed wrapper", () => {
  it("calls the handler with the casted request containing parsedData", () => {
    /* eslint-disable */
    const schema = z.object({ foo: z.string() })
    const handler = jest.fn(
      (
        req: ParsedRequest<typeof schema>,
        res: Response,
        next: NextFunction
      ) => {
        expect(req.parsedData).toEqual({ foo: "bar" })
      }
    )
    /* eslint-enable */

    const req = { parsedData: { foo: "bar" } } as unknown as Request
    const res = {} as Response
    const next = jest.fn() as NextFunction
    const wrappedHandler = parsed<typeof schema>(handler)

    wrappedHandler(req, res, next)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it("propagates asynchronous handler results", async () => {
    /* eslint-disable */
    const schema = z.object({ foo: z.string() })
    const asyncHandler = jest.fn(
      async (
        req: ParsedRequest<typeof schema>,
        res: Response,
        next: NextFunction
      ) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    )
    /* eslint-enable */

    const req = { parsedData: { foo: "bar" } } as unknown as Request
    const res = {} as Response
    const next = jest.fn() as NextFunction
    const wrappedHandler = parsed<typeof schema>(asyncHandler)

    await expect(wrappedHandler(req, res, next)).resolves.toBeUndefined()
    expect(asyncHandler).toHaveBeenCalledTimes(1)
  })

  it("passes through an undefined parsedData if not present", () => {
    /* eslint-disable */
    const schema = z.object({ foo: z.string() })
    const handler = jest.fn(
      (
        req: ParsedRequest<typeof schema>,
        res: Response,
        next: NextFunction
      ) => {
        expect(req.parsedData).toBeUndefined()
      }
    )
    /* eslint-enable */

    const req = {} as Request
    const res = {} as Response
    const next = jest.fn() as NextFunction
    const wrappedHandler = parsed<typeof schema>(handler)

    wrappedHandler(req, res, next)
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
