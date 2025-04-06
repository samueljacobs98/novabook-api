import { prisma } from "../../../api/db"

export async function getEvents(date: Date) {
  const [sales, amendments, taxPayments] = await Promise.all([
    prisma.sale.findMany({
      where: {
        date: {
          lte: date
        }
      },
      include: {
        items: true
      }
    }),
    prisma.amendment.findMany({
      where: {
        date: {
          lte: date
        }
      }
    }),
    prisma.taxPayment.findMany({
      where: {
        date: {
          lte: date
        }
      }
    })
  ])

  return {
    sales,
    amendments,
    taxPayments
  }
}
