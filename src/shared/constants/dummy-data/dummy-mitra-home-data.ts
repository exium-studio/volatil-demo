// src/shared/constants/dummy-data/dummy-mitra-home-data.ts

import type { HomeDataResponse } from "@/features/mitra/home/types/mitra.home.data-summary.type";

export const dummyMitraHomeData: HomeDataResponse = {
  dataSummary: {
    "1d": {
      field: { active: 10, almostExpired: 2, expired: 1 },
      area: { active: 5, almostExpired: 1, expired: 0 },
    },
    "1w": {
      field: { active: 25, almostExpired: 5, expired: 3 },
      area: { active: 12, almostExpired: 2, expired: 1 },
    },
    "1m": {
      field: { active: 60, almostExpired: 10, expired: 5 },
      area: { active: 30, almostExpired: 5, expired: 2 },
    },
    "1y": {
      field: { active: 150, almostExpired: 20, expired: 10 },
      area: { active: 80, almostExpired: 12, expired: 4 },
    },
    all: {
      field: { active: 220, almostExpired: 35, expired: 18 },
      area: { active: 110, almostExpired: 18, expired: 7 },
    },
  },
  financialFlow: {
    "1d": [{ sale: 1500000, label: "08:00" }],
    "1w": [{ sale: 10500000, label: "Sen" }],
    "1m": [{ sale: 45000000, label: "Minggu 1" }],
    "1y": [{ sale: 540000000, label: "Jan" }],
    all: [{ sale: 1200000000, label: "2024" }],
  },
  cartSummary: {
    totalField: 12,
    totalArea: 4,
    totalIgtData: 16,
    subtotalPrice: 15000000,
  },
  lastTransactions: [
    {
      id: "tx-1",
      transactionNo: "TRX-2024-001",
      username: "mitra_user",
      date: "2024-03-20",
      status: "success",
      dataName: "Batas Kawasan Hutan",
      themeType: "boundary",
      apiLink: "https://api.example.com/wps/1",
      apiWps: "WPS-001",
      timeLeft: "29 hari",
      dataStatus: "active",
      quota: "1000/1000",
      themeCategory: "spatial",
      description: "Data IGT Batas Kawasan Hutan Provinsi",
      amount: 2500000,
    },
  ],
};
