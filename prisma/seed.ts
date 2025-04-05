import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.sale.create({
    data: {
      invoiceId: "inv-001",
      date: new Date("2024-02-20T12:00:00Z"),
      items: {
        create: [
          {
            itemId: "item-001",
            cost: 1099,
            taxRate: 0.2
          },
          {
            itemId: "item-002",
            cost: 499,
            taxRate: 0.1
          }
        ]
      }
    }
  })

  await prisma.taxPayment.create({
    data: {
      date: new Date("2024-02-21T10:00:00Z"),
      amount: 300
    }
  })

  await prisma.amendment.create({
    data: {
      invoiceId: "inv-001",
      itemId: "item-001",
      date: new Date("2024-02-22T09:00:00Z"),
      cost: 899,
      taxRate: 0.15
    }
  })

  console.log("✅ Seed completed.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
