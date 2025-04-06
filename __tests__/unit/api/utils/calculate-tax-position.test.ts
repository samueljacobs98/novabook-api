import { calculateTaxPosition } from "../../../../src/api/utils"
import {
  amendmentNonOverrideSaleItemTaxData,
  amendmentOverrideSaleItemTaxData,
  complexTaxData,
  emptyTaxData,
  multipleAmendmentsTaxData,
  multipleItemOverrideAmendmentsTaxData,
  multipleItemSaleTaxData,
  multipleItemSalesTaxData,
  multipleOverrideAmendmentsTaxData,
  overpaidTaxData,
  saleAndTaxPaymentsTaxData,
  singleAmendmentTaxData,
  singleItemSaleTaxData,
  singleItemSalesTaxData,
  taxPaymentsTaxData
} from "./calculate-tax-position.fixtures"

describe("calculateTaxPosition", () => {
  it("returns 0 when no sales or payments exist", () => {
    const result = calculateTaxPosition(emptyTaxData)

    expect(result).toBe(0)
  })

  it("calculates tax from a single sale with a single item", () => {
    const result = calculateTaxPosition(singleItemSaleTaxData)

    expect(result).toBe(200)
  })

  it("calculates tax from a single sale with a multiple items", () => {
    const result = calculateTaxPosition(multipleItemSaleTaxData)

    expect(result).toBe(425)
  })

  it("calculates tax from multiple sales with single items", () => {
    const result = calculateTaxPosition(singleItemSalesTaxData)

    expect(result).toBe(400)
  })

  it("calculates tax from multiple sales with multiple items", () => {
    const result = calculateTaxPosition(multipleItemSalesTaxData)

    expect(result).toBe(425)
  })

  it("calculates tax from a single amendment", () => {
    const result = calculateTaxPosition(singleAmendmentTaxData)

    expect(result).toBe(50)
  })

  it("calculates tax from a multiple amendments", () => {
    const result = calculateTaxPosition(multipleAmendmentsTaxData)

    expect(result).toBe(60)
  })

  it("calculates tax from a sale with a single overriding amendment", () => {
    const result = calculateTaxPosition(amendmentOverrideSaleItemTaxData)

    expect(result).toBe(50)
  })

  it("calculates tax from a sale with a single non-overriding amendment", () => {
    const result = calculateTaxPosition(amendmentNonOverrideSaleItemTaxData)

    expect(result).toBe(250)
  })

  it("calculates tax from a sale with multiple overriding amendments", () => {
    const result = calculateTaxPosition(multipleOverrideAmendmentsTaxData)

    expect(result).toBe(10)
  })

  it("calculates negative tax from only tax payments", () => {
    const result = calculateTaxPosition(taxPaymentsTaxData)

    expect(result).toBe(-500)
  })

  it("calculates remaining tax for sales with a tax payment", () => {
    const result = calculateTaxPosition(saleAndTaxPaymentsTaxData)

    expect(result).toBe(50)
  })

  it("calculates a negative tax position when overpaid", () => {
    const result = calculateTaxPosition(overpaidTaxData)

    expect(result).toBe(-100)
  })

  it("handles complex scenarios with amendments, sales, and tax payments", () => {
    const result = calculateTaxPosition(complexTaxData)

    expect(result).toBe(170)
  })

  it("calculates correct tax for multiple overrides of the same item", () => {
    const result = calculateTaxPosition(multipleItemOverrideAmendmentsTaxData)

    expect(result).toBe(300)
  })
})
