import { prisma } from "../../../api/db"

export async function createTaxPaymentEvent(data: {
  date: Date
  amount: number
}) {
  await prisma.taxPayment.create({
    data: {
      date: data.date,
      amount: data.amount
    }
  })
}
