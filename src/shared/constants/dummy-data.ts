// src/shared/constants/dummy-data.ts

import type { HomeDataResponse } from "@/features/home/types/home.data-summary.type";

export const homeData: HomeDataResponse = {
  dataSummary: {
    field: {
      active: 12000,
      almostExpired: 4000,
      expired: 2000,
    },
    area: {
      active: 8500,
      almostExpired: 3000,
      expired: 1500,
    },
  },
  cartSummary: {
    totalField: 150,
    totalArea: 45,
    totalIgtData: 195,
    subtotalPrice: 15000000,
  },
  lastTransactions: [
    {
      id: "1",
      transactionNo: "TX-10029301",
      date: "31 Jul 2026",
      description: "Pembelian Data IGT Bidang - Kawasan A",
      paymentMethod: "QRIS",
      amount: 1500000,
      status: "success",
    },
    {
      id: "2",
      transactionNo: "TX-10029302",
      date: "30 Jul 2026",
      description: "Pembelian Data IGT Kawasan - Kawasan B",
      paymentMethod: "Virtual Account Mandiri",
      amount: 3500000,
      status: "pending",
    },
    {
      id: "3",
      transactionNo: "TX-10029303",
      date: "28 Jul 2026",
      description: "Pembelian Data IGT Bidang - Kawasan C",
      paymentMethod: "Virtual Account BCA",
      amount: 1200000,
      status: "success",
    },
    {
      id: "4",
      transactionNo: "TX-10029304",
      date: "25 Jul 2026",
      description: "Pembelian Data IGT Bidang - Kawasan D",
      paymentMethod: "Virtual Account BNI",
      amount: 2500000,
      status: "failed",
    },
    {
      id: "5",
      transactionNo: "TX-10029305",
      date: "22 Jul 2026",
      description: "Pembelian Data IGT Kawasan - Kawasan E",
      paymentMethod: "QRIS",
      amount: 4500000,
      status: "success",
    },
  ],
};
