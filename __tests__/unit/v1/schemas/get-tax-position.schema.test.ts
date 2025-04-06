import { SafeParseError, SafeParseSuccess } from "zod"
import { getTaxPositionSchema } from "../../../../src/v1/schemas/get-tax-position.schema"

describe("getTaxPositionSchema", () => {
  it("should validate a valid query", () => {
    const dateString = "2023-10-01T00:00:00Z"
    const date = new Date(dateString)

    const validData = { query: { date: dateString } }
    const expectedParsedData = { query: { date } }

    const result = getTaxPositionSchema.safeParse(
      validData
    ) as SafeParseSuccess<typeof expectedParsedData>

    expect(result.success).toBe(true)
    expect(result.data).toEqual(expectedParsedData)
  })

  it("should invalidate an invalid query", () => {
    const invalidData = { query: { date: "invalid-date" } }

    const result = getTaxPositionSchema.safeParse(
      invalidData
    ) as SafeParseError<typeof invalidData>

    expect(result.success).toBe(false)
    expect(result.error.errors[0].message).toBe("Invalid datetime")
  })
})
