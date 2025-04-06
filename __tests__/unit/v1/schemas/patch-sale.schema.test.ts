import { SafeParseError, SafeParseSuccess } from "zod"
import { patchSaleSchema } from "../../../../src/v1/schemas/patch-sale.schema"

describe("patchSaleSchema", () => {
  it("should validate a valid query", () => {
    const dateString = "2023-10-01T00:00:00Z"
    const date = new Date(dateString)

    const validData = {
      body: {
        date: dateString,
        invoiceId: "123456",
        itemId: "item-123",
        cost: 100,
        taxRate: 0.2
      }
    }
    const expectedParsedData = {
      body: { ...validData.body, date }
    }

    const result = patchSaleSchema.safeParse(validData) as SafeParseSuccess<
      typeof expectedParsedData
    >

    expect(result.success).toBe(true)
    expect(result.data).toEqual(expectedParsedData)
  })

  describe("should invalidate an invalid query", () => {
    it("should invalidate an invalid date", () => {
      const invalidData = {
        body: {
          date: "invalid-date",
          invoiceId: "123456",
          itemId: "item-123",
          cost: 100,
          taxRate: 0.2
        }
      }

      const result = patchSaleSchema.safeParse(invalidData) as SafeParseError<
        typeof invalidData
      >

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Invalid datetime")
    })
    it("should invalidate a negative cost", () => {
      const invalidData = {
        body: {
          date: "2023-10-01T00:00:00Z",
          invoiceId: "123456",
          itemId: "item-123",
          cost: -100,
          taxRate: 0.2
        }
      }

      const result = patchSaleSchema.safeParse(invalidData) as SafeParseError<
        typeof invalidData
      >

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Cost must be at least 0")
    })
    it("should invalidate a tax rate less than 0", () => {
      const invalidData = {
        body: {
          date: "2023-10-01T00:00:00Z",
          invoiceId: "123456",
          itemId: "item-123",
          cost: 100,
          taxRate: -0.5
        }
      }

      const result = patchSaleSchema.safeParse(invalidData) as SafeParseError<
        typeof invalidData
      >

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Tax rate must be at least 0")
    })
    it("should invalidate a tax rate greater than 1", () => {
      const invalidData = {
        body: {
          date: "2023-10-01T00:00:00Z",
          invoiceId: "123456",
          itemId: "item-123",
          cost: 100,
          taxRate: 1.5
        }
      }

      const result = patchSaleSchema.safeParse(invalidData) as SafeParseError<
        typeof invalidData
      >

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Tax rate must be at most 1")
    })
    it("should invalidate a missing field", () => {
      const invalidData = {
        body: {
          date: "2023-10-01T00:00:00Z",
          itemId: "item-123",
          cost: 100,
          taxRate: 0.2
        }
      }

      const result = patchSaleSchema.safeParse(invalidData) as SafeParseError<
        typeof invalidData
      >

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Required")
    })
  })
})
