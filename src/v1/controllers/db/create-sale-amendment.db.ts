import { prisma } from "../../../api/db"

export async function createSaleAmendment(data: {
  date: Date
  invoiceId: string
  itemId: string
  cost: number
  taxRate: number
}) {
  await prisma.amendment.create({ data })
}
