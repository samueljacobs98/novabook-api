-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amendment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cost" INTEGER NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Amendment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxPayment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "TaxPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sale_invoiceId_idx" ON "Sale"("invoiceId");

-- CreateIndex
CREATE INDEX "SaleItem_itemId_idx" ON "SaleItem"("itemId");

-- CreateIndex
CREATE INDEX "Amendment_invoiceId_itemId_idx" ON "Amendment"("invoiceId", "itemId");

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
