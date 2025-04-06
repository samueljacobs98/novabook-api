import { Amendment, Sale, SaleItem, TaxPayment } from "@prisma/client"

type TaxData = {
  sales: (Sale & { items: SaleItem[] })[]
  amendments: Amendment[]
  taxPayments: TaxPayment[]
}

export const emptyTaxData: TaxData = {
  sales: [],
  amendments: [],
  taxPayments: []
}

export const singleItemSaleTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        }
      ]
    }
  ],
  amendments: [],
  taxPayments: []
}

export const multipleItemSaleTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        },
        {
          id: "item-2",
          saleId: "sale-1",
          itemId: "item-2",
          cost: 2000,
          taxRate: 0.1
        },
        {
          id: "item-3",
          saleId: "sale-1",
          itemId: "item-3",
          cost: 500,
          taxRate: 0.05
        }
      ]
    }
  ],
  amendments: [],
  taxPayments: []
}

export const singleItemSalesTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        }
      ]
    },
    {
      id: "sale-2",
      invoiceId: "inv-2",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-2",
          saleId: "sale-2",
          itemId: "item-2",
          cost: 2000,
          taxRate: 0.1
        }
      ]
    }
  ],
  amendments: [],
  taxPayments: []
}

export const multipleItemSalesTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        },
        {
          id: "item-2",
          saleId: "sale-1",
          itemId: "item-2",
          cost: 2000,
          taxRate: 0.1
        }
      ]
    },
    {
      id: "sale-2",
      invoiceId: "inv-2",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-3",
          saleId: "sale-2",
          itemId: "item-3",
          cost: 500,
          taxRate: 0.05
        }
      ]
    }
  ],
  amendments: [],
  taxPayments: []
}

export const singleAmendmentTaxData: TaxData = {
  sales: [],
  amendments: [
    {
      id: "amend-1",
      invoiceId: "inv-1",
      itemId: "item-1",
      cost: 500,
      taxRate: 0.1,
      date: new Date("2024-01-01")
    }
  ],
  taxPayments: []
}

export const multipleAmendmentsTaxData: TaxData = {
  sales: [],
  amendments: [
    {
      id: "amend-1",
      invoiceId: "inv-1",
      itemId: "item-1",
      cost: 500,
      taxRate: 0.1,
      date: new Date("2024-01-01")
    },
    {
      id: "amend-2",
      invoiceId: "inv-1",
      itemId: "item-2",
      cost: 200,
      taxRate: 0.05,
      date: new Date("2024-01-02")
    }
  ],
  taxPayments: []
}

export const amendmentOverrideSaleItemTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        }
      ]
    }
  ],
  amendments: [
    {
      id: "amend-1",
      invoiceId: "inv-1",
      itemId: "item-1",
      cost: 500,
      taxRate: 0.1,
      date: new Date("2024-01-02")
    }
  ],
  taxPayments: []
}

export const amendmentNonOverrideSaleItemTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        }
      ]
    }
  ],
  amendments: [
    {
      id: "amend-1",
      invoiceId: "inv-1",
      itemId: "item-2",
      cost: 500,
      taxRate: 0.1,
      date: new Date("2024-01-02")
    }
  ],
  taxPayments: []
}

export const multipleOverrideAmendmentsTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        }
      ]
    }
  ],
  amendments: [
    {
      id: "amend-1",
      invoiceId: "inv-1",
      itemId: "item-1",
      cost: 500,
      taxRate: 0.1,
      date: new Date("2024-01-01")
    },
    {
      id: "amend-2",
      invoiceId: "inv-1",
      itemId: "item-1",
      cost: 200,
      taxRate: 0.05,
      date: new Date("2024-01-02")
    }
  ],
  taxPayments: []
}

export const taxPaymentsTaxData: TaxData = {
  sales: [],
  amendments: [],
  taxPayments: [
    {
      id: "tax-1",
      amount: 300,
      date: new Date("2024-01-01")
    },
    {
      id: "tax-2",
      amount: 200,
      date: new Date("2024-01-02")
    }
  ]
}

export const saleAndTaxPaymentsTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        }
      ]
    }
  ],
  amendments: [],
  taxPayments: [
    {
      id: "tax-1",
      amount: 150,
      date: new Date("2024-01-01")
    }
  ]
}

export const overpaidTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        }
      ]
    }
  ],
  amendments: [],
  taxPayments: [
    {
      id: "tax-1",
      amount: 300,
      date: new Date("2024-01-01")
    }
  ]
}

export const complexTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-02"),
      createdAt: new Date("2024-01-02"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        }
      ]
    },
    {
      id: "sale-2",
      invoiceId: "inv-2",
      date: new Date("2024-01-03"),
      createdAt: new Date("2024-01-03"),
      items: [
        {
          id: "item-2",
          saleId: "sale-2",
          itemId: "item-2",
          cost: 2000,
          taxRate: 0.1
        }
      ]
    }
  ],
  amendments: [
    {
      id: "amend-1",
      invoiceId: "inv-1",
      itemId: "item-1",
      cost: 500,
      taxRate: 0.1,
      date: new Date("2024-01-01")
    },
    {
      id: "amend-2",
      invoiceId: "inv-1",
      itemId: "item-2",
      cost: 200,
      taxRate: 0.05,
      date: new Date("2024-01-03")
    },
    {
      id: "amend-2",
      invoiceId: "inv-1",
      itemId: "item-3",
      cost: 200,
      taxRate: 0.05,
      date: new Date("2024-01-03")
    }
  ],
  taxPayments: [
    {
      id: "tax-1",
      amount: 150,
      date: new Date("2024-01-04")
    },
    {
      id: "tax-2",
      amount: 100,
      date: new Date("2024-01-05")
    }
  ]
}

export const multipleItemOverrideAmendmentsTaxData: TaxData = {
  sales: [
    {
      id: "sale-1",
      invoiceId: "inv-1",
      date: new Date("2024-01-01"),
      createdAt: new Date("2024-01-01"),
      items: [
        {
          id: "item-1",
          saleId: "sale-1",
          itemId: "item-1",
          cost: 1000,
          taxRate: 0.2
        },
        {
          id: "item-2",
          saleId: "sale-1",
          itemId: "item-2",
          cost: 2000,
          taxRate: 0.1
        }
      ]
    }
  ],
  amendments: [
    {
      id: "amend-1",
      invoiceId: "inv-1",
      itemId: "item-1",
      cost: 500,
      taxRate: 0.1,
      date: new Date("2024-01-02")
    },
    {
      id: "amend-1",
      invoiceId: "inv-1",
      itemId: "item-1",
      cost: 500,
      taxRate: 0.2,
      date: new Date("2024-01-03")
    }
  ],
  taxPayments: []
}
