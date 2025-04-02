import { StatusCodes } from "http-status-codes"
import {
  BadRequestError,
  NotFoundError,
  ValidationError
} from "../../../../src/api/errors/errors"

const errorsTestData = [
  {
    name: "NotFoundError",
    ErrorClass: NotFoundError,
    args: [{ resource: "User" }],
    expectedStatusCode: StatusCodes.NOT_FOUND,
    expectedDetails: { resource: "User" }
  },
  {
    name: "BadRequestError",
    ErrorClass: BadRequestError,
    args: [],
    expectedStatusCode: StatusCodes.BAD_REQUEST,
    expectedDetails: undefined
  },
  {
    name: "ValidationError",
    ErrorClass: ValidationError,
    args: [
      [
        {
          code: "invalid_type",
          expected: "string",
          received: "number",
          path: ["email"],
          message: "Expected string, received number"
        }
      ]
    ],
    expectedStatusCode: StatusCodes.BAD_REQUEST,
    expectedDetails: [
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["email"],
        message: "Expected string, received number"
      }
    ]
  }
]

describe("Custom Errors", () => {
  errorsTestData.forEach(
    ({ name, ErrorClass, args, expectedStatusCode, expectedDetails }) => {
      describe(name, () => {
        it("should set status and optional details", () => {
          // @ts-expect-error - Testing dynamic class instantiation
          const err = new ErrorClass(...args)

          expect(err.statusCode).toBe(expectedStatusCode)
          expect(err.details).toEqual(expectedDetails)
          expect(err).toBeInstanceOf(Error)
        })
      })
    }
  )
})
