import { Amendment, Sale, SaleItem, TaxPayment } from "@prisma/client"

export function calculateTaxPosition({
  sales,
  amendments,
  taxPayments
}: {
  sales: (Sale & { items: SaleItem[] })[]
  amendments: Amendment[]
  taxPayments: TaxPayment[]
}): number {
  const amendmentsMap = buildAmendmentsMap(amendments)
  const appliedAmendmentIds = new Set<string>()

  const taxFromSales = calculateTaxFromSales(
    sales,
    amendmentsMap,
    appliedAmendmentIds
  )
  const taxFromRemainingAmendments = calculateTaxFromRemainingAmendments(
    amendmentsMap,
    appliedAmendmentIds
  )
  const totalTaxPayments = calculateTotalTaxPayments(taxPayments)

  return taxFromSales + taxFromRemainingAmendments - totalTaxPayments
}

function buildAmendmentsMap(
  amendments: Amendment[]
): Map<string, Map<string, Amendment>> {
  return amendments.reduce((map, amendment) => {
    if (!map.has(amendment.invoiceId)) {
      map.set(amendment.invoiceId, new Map())
    }
    const itemMap = map.get(amendment.invoiceId)!
    const existing = itemMap.get(amendment.itemId)
    if (!existing || existing.date < amendment.date) {
      itemMap.set(amendment.itemId, amendment)
    }
    return map
  }, new Map())
}

function calculateTaxFromSales(
  sales: (Sale & { items: SaleItem[] })[],
  amendmentsMap: Map<string, Map<string, Amendment>>,
  appliedAmendmentIds: Set<string>
): number {
  return sales.reduce((sum, sale) => {
    const saleAmendments = amendmentsMap.get(sale.invoiceId) ?? new Map()
    const saleItemsSum = sale.items.reduce((itemSum, item) => {
      const amendment = saleAmendments.get(item.itemId)
      if (amendment) {
        if (amendment.date > sale.date) {
          appliedAmendmentIds.add(amendment.id)
          return itemSum + amendment.cost * amendment.taxRate
        } else {
          appliedAmendmentIds.add(amendment.id)
        }
      }
      return itemSum + item.cost * item.taxRate
    }, 0)
    return sum + saleItemsSum
  }, 0)
}

function calculateTaxFromRemainingAmendments(
  amendmentsMap: Map<string, Map<string, Amendment>>,
  appliedAmendmentIds: Set<string>
): number {
  return Array.from(amendmentsMap.values()).reduce((sum, itemMap) => {
    const itemSum = Array.from(itemMap.values()).reduce(
      (innerSum, amendment) => {
        if (!appliedAmendmentIds.has(amendment.id)) {
          return innerSum + amendment.cost * amendment.taxRate
        }
        return innerSum
      },
      0
    )
    return sum + itemSum
  }, 0)
}

function calculateTotalTaxPayments(taxPayments: TaxPayment[]): number {
  return taxPayments.reduce((sum, payment) => sum + payment.amount, 0)
}
