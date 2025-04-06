import { prisma } from "../../../api/db"

export async function createSaleAmendment({
  date,
  invoiceId,
  itemId,
  cost,
  taxRate
}: {
  date: Date
  invoiceId: string
  itemId: string
  cost: number
  taxRate: number
}) {
  await prisma.amendment.create({
    data: {
      date,
      invoiceId,
      itemId,
      cost,
      taxRate
    }
  })
}
