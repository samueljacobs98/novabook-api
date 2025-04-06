import { prisma } from "../../../api/db"

export async function createSaleEvent(data: {
  invoiceId: string
  date: Date
  items: {
    itemId: string
    cost: number
    taxRate: number
  }[]
}) {
  await prisma.sale.create({
    data: {
      invoiceId: data.invoiceId,
      date: data.date,
      items: {
        createMany: {
          data: data.items
        }
      }
    }
  })
}
