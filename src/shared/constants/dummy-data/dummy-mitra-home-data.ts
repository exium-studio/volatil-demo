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
    "1d": [
      { sale: 200000, label: "00:00" },
      { sale: 400000, label: "03:00" },
      { sale: 900000, label: "06:00" },
      { sale: 1500000, label: "09:00" },
      { sale: 1200000, label: "12:00" },
      { sale: 2000000, label: "15:00" },
      { sale: 2500000, label: "18:00" },
      { sale: 1800000, label: "21:00" },
    ],
    "1w": [
      { sale: 4500000, label: "Sen" },
      { sale: 5200000, label: "Sel" },
      { sale: 3800000, label: "Rab" },
      { sale: 6000000, label: "Kam" },
      { sale: 7500000, label: "Jum" },
      { sale: 9000000, label: "Sab" },
      { sale: 8200000, label: "Min" },
    ],
    "1m": [
      { sale: 12000000, label: "Minggu 1" },
      { sale: 15000000, label: "Minggu 2" },
      { sale: 18000000, label: "Minggu 3" },
      { sale: 22000000, label: "Minggu 4" },
    ],
    "1y": [
      { sale: 45000000, label: "Jan" },
      { sale: 50000000, label: "Feb" },
      { sale: 48000000, label: "Mar" },
      { sale: 55000000, label: "Apr" },
      { sale: 62000000, label: "Mei" },
      { sale: 58000000, label: "Jun" },
      { sale: 70000000, label: "Jul" },
      { sale: 75000000, label: "Agu" },
      { sale: 80000000, label: "Sep" },
      { sale: 85000000, label: "Okt" },
      { sale: 90000000, label: "Nov" },
      { sale: 95000000, label: "Des" },
    ],
    all: [
      { sale: 320000000, label: "2020" },
      { sale: 450000000, label: "2021" },
      { sale: 600000000, label: "2022" },
      { sale: 850000000, label: "2023" },
      { sale: 1100000000, label: "2024" },
      { sale: 1450000000, label: "2025" },
    ],
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
