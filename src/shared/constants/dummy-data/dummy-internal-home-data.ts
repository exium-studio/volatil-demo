// src/shared/constants/dummy-data/dummy-internal-home-data.ts

import type { InternalHomeDataSummaryResponse } from "@/features/internal/home/types/internal.home.data-summary.type";
import type {
  SystemHealthMetricItem,
  TopIgtLayerItem,
  TopMitraAcquisitionItem,
} from "@/features/internal/home/types/internal.home.leaderboard.type";
import type { ServiceRateItem } from "@/features/internal/home/types/internal.home.service-rate.type";
import type { InternalHomeTrendItem } from "@/features/internal/home/types/internal.home.trend.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { Layers2Icon, TreesIcon } from "lucide-react";

export const dummyInternalDataSummary: Record<
  HomePeriod,
  InternalHomeDataSummaryResponse
> = {
  "1d": {
    field: { active: 10000, inactive: 2000 },
    area: { active: 5000, inactive: 1000 },
  },
  "1w": {
    field: { active: 50000, inactive: 10000 },
    area: { active: 25000, inactive: 5000 },
  },
  "1m": {
    field: { active: 150000, inactive: 30000 },
    area: { active: 80000, inactive: 12000 },
  },
  "1y": {
    field: { active: 300000, inactive: 70000 },
    area: { active: 150000, inactive: 20000 },
  },
  all: {
    field: { active: 325000, inactive: 75000 },
    area: { active: 175000, inactive: 25000 },
  },
};

export const dummyInternalServiceRates: ServiceRateItem[] = [
  {
    id: "rate-bidang",
    title: "IGT Berbasis Bidang",
    icon: Layers2Icon,
    price: 7500,
    unit: "Bidang",
    kodePnbp: "PNBP-IGT-01",
    minPurchase: 1000,
    minUnit: "Bidang",
    colorPalette: "blue",
  },
  {
    id: "rate-kawasan",
    title: "IGT Berbasis Kawasan",
    icon: TreesIcon,
    price: 20000,
    unit: "Ha",
    kodePnbp: "PNBP-IGT-02",
    minPurchase: 1000,
    minUnit: "Ha",
    colorPalette: "orange",
  },
];

export const dummyInternalTrends: Record<HomePeriod, InternalHomeTrendItem[]> = {
  "1d": [
    { label: "00:00", field: 120, area: 45, revenue: 1800000 },
    { label: "04:00", field: 90, area: 30, revenue: 1275000 },
    { label: "08:00", field: 450, area: 180, revenue: 6975000 },
    { label: "12:00", field: 680, area: 290, revenue: 10900000 },
    { label: "16:00", field: 520, area: 210, revenue: 8100000 },
    { label: "20:00", field: 280, area: 110, revenue: 4300000 },
  ],
  "1w": [
    { label: "Sen", field: 2400, area: 950, revenue: 37000000 },
    { label: "Sel", field: 3100, area: 1200, revenue: 47250000 },
    { label: "Rab", field: 2800, area: 1100, revenue: 43000000 },
    { label: "Kam", field: 3500, area: 1450, revenue: 55250000 },
    { label: "Jum", field: 4200, area: 1600, revenue: 63500000 },
    { label: "Sab", field: 1800, area: 700, revenue: 27500000 },
    { label: "Min", field: 1400, area: 550, revenue: 21500000 },
  ],
  "1m": [
    { label: "Mgg 1", field: 12500, area: 4800, revenue: 189750000 },
    { label: "Mgg 2", field: 16800, area: 6200, revenue: 250000000 },
    { label: "Mgg 3", field: 14200, area: 5400, revenue: 214500000 },
    { label: "Mgg 4", field: 19500, area: 7800, revenue: 302250000 },
  ],
  "1y": [
    { label: "Q1", field: 65000, area: 24000, revenue: 967500000 },
    { label: "Q2", field: 82000, area: 31000, revenue: 1235000000 },
    { label: "Q3", field: 94000, area: 36500, revenue: 1435000000 },
    { label: "Q4", field: 112000, area: 44000, revenue: 1720000000 },
  ],
  all: [
    { label: "Jan", field: 22000, area: 8500, revenue: 335000000 },
    { label: "Feb", field: 26000, area: 10200, revenue: 399000000 },
    { label: "Mar", field: 31000, area: 12100, revenue: 474500000 },
    { label: "Apr", field: 28500, area: 11400, revenue: 441750000 },
    { label: "Mei", field: 34000, area: 13500, revenue: 525000000 },
    { label: "Jun", field: 38500, area: 15200, revenue: 592750000 },
    { label: "Jul", field: 42000, area: 16800, revenue: 651000000 },
    { label: "Agu", field: 46500, area: 18400, revenue: 716750000 },
  ],
};

export const dummyTopMitraList: TopMitraAcquisitionItem[] = [
  {
    rank: 1,
    mitraId: "mitra-01",
    mitraName: "PT Graha Tata Ruang Nusantara",
    agencyOrCompany: "Konsultan Perencana Wilayah",
    totalOrders: 42,
    totalVolume: "84.500 Bidang",
    totalSpending: 633750000,
  },
  {
    rank: 2,
    mitraId: "mitra-02",
    mitraName: "PT Agraria Mandiri Sejahtera",
    agencyOrCompany: "Pengembang Kawasan Industri",
    totalOrders: 31,
    totalVolume: "52.000 Ha",
    totalSpending: 1040000000,
  },
  {
    rank: 3,
    mitraId: "mitra-03",
    mitraName: "CV Geo Spasial Solusindo",
    agencyOrCompany: "Surveyor & Pemetaan",
    totalOrders: 28,
    totalVolume: "38.200 Bidang",
    totalSpending: 286500000,
  },
  {
    rank: 4,
    mitraId: "mitra-04",
    mitraName: "PT Infrastruktur Prima Jaya",
    agencyOrCompany: "BUMN Karya Konstruksi",
    totalOrders: 19,
    totalVolume: "24.600 Ha",
    totalSpending: 492000000,
  },
  {
    rank: 5,
    mitraId: "mitra-05",
    mitraName: "PT Bumi Lestari Hijau",
    agencyOrCompany: "Konservasi & Kehutanan",
    totalOrders: 14,
    totalVolume: "19.800 Ha",
    totalSpending: 396000000,
  },
];

export const dummyTopIgtLayers: TopIgtLayerItem[] = [
  {
    rank: 1,
    layerId: "layer-rtrw-kabupaten",
    layerTitle: "Rencana Tata Ruang Wilayah (RTRW) Kabupaten",
    spatialBasis: "kawasan",
    totalAcquisitions: 84,
    totalVolume: 124500,
    unit: "ha",
    totalPnbpRevenue: 2490000000,
  },
  {
    rank: 2,
    layerId: "layer-bidang-kadastral",
    layerTitle: "Batas Bidang Tanah Kadastral Terdaftar",
    spatialBasis: "bidang",
    totalAcquisitions: 126,
    totalVolume: 215000,
    unit: "bidang",
    totalPnbpRevenue: 1612500000,
  },
  {
    rank: 3,
    layerId: "layer-lpp2b",
    layerTitle: "Lahan Pertanian Pangan Berkelanjutan (LP2B)",
    spatialBasis: "kawasan",
    totalAcquisitions: 52,
    totalVolume: 68400,
    unit: "ha",
    totalPnbpRevenue: 1368000000,
  },
  {
    rank: 4,
    layerId: "layer-zona-nilai-tanah",
    layerTitle: "Zona Nilai Tanah (ZNT) Perkotaan",
    spatialBasis: "bidang",
    totalAcquisitions: 91,
    totalVolume: 142000,
    unit: "bidang",
    totalPnbpRevenue: 1065000000,
  },
  {
    rank: 5,
    layerId: "layer-kawasan-hutan",
    layerTitle: "Peta Kawasan Hutan dan Konservasi ATR",
    spatialBasis: "kawasan",
    totalAcquisitions: 38,
    totalVolume: 42000,
    unit: "ha",
    totalPnbpRevenue: 840000000,
  },
];

export const dummySystemHealth: SystemHealthMetricItem[] = [
  {
    key: "cpu-compute",
    title: "Beban CPU Cluster",
    status: "healthy",
    value: "24.5%",
    subValue: "32 Cores · Epyc 7763 Dedicated",
    colorPalette: "blue",
  },
  {
    key: "ram-usage",
    title: "Penggunaan Memori (RAM)",
    status: "healthy",
    value: "42.8 GB / 128 GB",
    subValue: "Buffer Cache: 18.2 GB · Swap 0%",
    colorPalette: "teal",
  },
  {
    key: "storage-postgis",
    title: "Kapasitas Storage Spasial (NVMe)",
    status: "healthy",
    value: "382 GB / 2.0 TB",
    subValue: "19.1% Terpakai · IOPS: 12.4k/s",
    colorPalette: "purple",
  },
  {
    key: "network-throughput",
    title: "Bandwidth & Throughput WFS",
    status: "healthy",
    value: "148 Mbps",
    subValue: "Peak: 450 Mbps · Avg Latency: 28ms",
    colorPalette: "green",
  },
];

