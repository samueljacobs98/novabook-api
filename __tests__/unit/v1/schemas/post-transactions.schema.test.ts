import { SafeParseError, SafeParseSuccess } from "zod"
import { postTransactionsSchema } from "../../../../src/v1/schemas/post-transactions.schema"

describe("postTransactionsSchema", () => {
  describe("should validate valid queries", () => {
    it("should validate a valid sale event", () => {
      const dateString = "2023-10-01T00:00:00Z"
      const date = new Date(dateString)

      const saleEvent = {
        eventType: "SALES",
        date: dateString,
        invoiceId: "INV-001",
        items: [
          { itemId: "item-001", cost: 100, taxRate: 0.1 },
          { itemId: "item-002", cost: 200, taxRate: 0.2 }
        ]
      }
      const validData = { body: saleEvent }
      const expectedParsedData = {
        body: { ...validData.body, date }
      }

      const result = postTransactionsSchema.safeParse(
        validData
      ) as SafeParseSuccess<typeof expectedParsedData>

      expect(result.success).toBe(true)
      expect(result.data).toEqual(expectedParsedData)
    })

    it("should validate a valid tax payment event", () => {
      const taxPaymentEvent = {
        eventType: "TAX_PAYMENT",
        date: "2023-10-02T00:00:00Z",
        amount: 150
      }
      const validData = { body: taxPaymentEvent }
      const result = postTransactionsSchema.safeParse(
        validData
      ) as SafeParseSuccess<typeof validData>

      expect(result.success).toBe(true)
      expect(result.data).toEqual(validData)
    })
  })

  describe("should invalidate invalid queries", () => {
    it("should invalidate a sale event with an invalid date", () => {
      const saleEvent = {
        eventType: "SALES",
        date: "invalid-date",
        invoiceId: "INV-001",
        items: [{ itemId: "item-001", cost: 100, taxRate: 0.1 }]
      }
      const invalidData = { body: saleEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Invalid datetime")
    })
    it("should invalidate a tax payment event with an invalid date", () => {
      const taxPaymentEvent = {
        eventType: "TAX_PAYMENT",
        date: "invalid-date",
        amount: 150
      }
      const invalidData = { body: taxPaymentEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Invalid datetime")
    })
    it("should invalidate a tax payment event with a negative amount", () => {
      const taxPaymentEvent = {
        eventType: "TAX_PAYMENT",
        date: "2023-10-02T00:00:00Z",
        amount: -1
      }
      const invalidData = { body: taxPaymentEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Amount must be at least 0")
    })
    it("should invalidate a tax payment event missing the amount field", () => {
      const taxPaymentEvent = {
        eventType: "TAX_PAYMENT",
        date: "2023-10-02T00:00:00Z"
      }
      const invalidData = { body: taxPaymentEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Invalid input")
    })
    it("should invalidate a sale event with a negative cost", () => {
      const saleEvent = {
        eventType: "SALES",
        date: "2023-10-01T00:00:00Z",
        invoiceId: "INV-001",
        items: [{ itemId: "item-001", cost: -1, taxRate: 0.1 }]
      }
      const invalidData = { body: saleEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Cost must be at least 0")
    })
    it("should invalidate a sale event with a negative cost", () => {
      const saleEvent = {
        eventType: "SALES",
        date: "2023-10-01T00:00:00Z",
        invoiceId: "INV-001",
        items: [{ itemId: "item-001", cost: -50, taxRate: 0.1 }]
      }
      const invalidData = { body: saleEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Cost must be at least 0")
    })
    it("should invalidate a sale event with a tax rate less than 0", () => {
      const saleEvent = {
        eventType: "SALES",
        date: "2023-10-01T00:00:00Z",
        invoiceId: "INV-001",
        items: [{ itemId: "item-001", cost: 100, taxRate: -0.1 }]
      }
      const invalidData = { body: saleEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Tax rate must be at least 0")
    })
    it("should invalidate a sale event with a tax rate greater than 1", () => {
      const saleEvent = {
        eventType: "SALES",
        date: "2023-10-01T00:00:00Z",
        invoiceId: "INV-001",
        items: [{ itemId: "item-001", cost: 100, taxRate: 1.5 }]
      }
      const invalidData = { body: saleEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Tax rate must be at most 1")
    })
    it("should invalidate a sale event missing the invoiceId", () => {
      const saleEvent = {
        eventType: "SALES",
        date: "2023-10-01T00:00:00Z",
        items: [{ itemId: "item-001", cost: 100, taxRate: 0.1 }]
      }
      const invalidData = { body: saleEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Invalid input")
    })
    it("should invalidate a sale event missing the items array", () => {
      const saleEvent = {
        eventType: "SALES",
        date: "2023-10-01T00:00:00Z",
        invoiceId: "INV-001"
      }
      const invalidData = { body: saleEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Invalid input")
    })
    it("should invalidate a sale event with an invalid item in the items array", () => {
      const saleEvent = {
        eventType: "SALES",
        date: "2023-10-01T00:00:00Z",
        invoiceId: "INV-001",
        items: [{ cost: 100, taxRate: 0.1 }]
      }
      const invalidData = { body: saleEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toBe("Invalid input")
    })
    it("should invalidate an event with an invalid eventType", () => {
      const invalidEvent = {
        eventType: "INVALID",
        date: "2023-10-02T00:00:00Z",
        amount: 150
      }
      const invalidData = { body: invalidEvent }

      const result = postTransactionsSchema.safeParse(
        invalidData
      ) as SafeParseError<typeof invalidData>

      expect(result.success).toBe(false)
      expect(result.error.errors[0].message).toContain("Invalid input")
    })
  })
})
