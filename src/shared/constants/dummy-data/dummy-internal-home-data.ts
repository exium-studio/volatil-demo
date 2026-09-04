// src/shared/constants/dummy-data/dummy-internal-home-data.ts

import type {
  IgtBasisSummary,
  IgtPublicationStatusSummary,
  MitraRegistrationSummary,
} from "@/features/internal/home/types/internal.home.api.type";
import type {
  SystemHealthMetricItem,
  TopIgtLayerItem,
  TopMitraAcquisitionItem,
} from "@/features/internal/home/types/internal.home.leaderboard.type";
import type { ServiceRateItem } from "@/features/internal/home/types/internal.home.service-rate.type";
import type { InternalHomeTrendItem } from "@/features/internal/home/types/internal.home.trend.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { Layers2Icon, Grid2X2Icon } from "lucide-react";

export const dummyIgtBasis: IgtBasisSummary = {
  field: 325,
  area: 125,
};

export const dummyIgtPublicationStatus: IgtPublicationStatusSummary = {
  active: 324,
  inactive: 126,
};

export const dummyMitraRegistration: MitraRegistrationSummary = {
  active: 48,
  pendingVerification: 12,
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
    icon: Grid2X2Icon,
    price: 15000,
    unit: "Ha",
    kodePnbp: "PNBP-IGT-02",
    minPurchase: 1000,
    minUnit: "Ha",
    colorPalette: "orange",
  },
];

export const dummyInternalTrends: Record<HomePeriod, InternalHomeTrendItem[]> =
  {
    "1d": [
      { label: "00:00", field: 120, area: 45, revenue: 1575000 },
      { label: "04:00", field: 80, area: 30, revenue: 1050000 },
      { label: "08:00", field: 450, area: 180, revenue: 6075000 },
      { label: "12:00", field: 780, area: 320, revenue: 10650000 },
      { label: "16:00", field: 620, area: 240, revenue: 8250000 },
      { label: "20:00", field: 310, area: 110, revenue: 3975000 },
    ],
    "1w": [
      { label: "Sen", field: 2400, area: 950, revenue: 32250000 },
      { label: "Sel", field: 3100, area: 1200, revenue: 41250000 },
      { label: "Rab", field: 2800, area: 1100, revenue: 37500000 },
      { label: "Kam", field: 3500, area: 1450, revenue: 48000000 },
      { label: "Jum", field: 4200, area: 1600, revenue: 55500000 },
      { label: "Sab", field: 1800, area: 600, revenue: 22500000 },
      { label: "Min", field: 1200, area: 450, revenue: 15750000 },
    ],
    "1m": [
      { label: "Mgg 1", field: 14500, area: 5800, revenue: 195750000 },
      { label: "Mgg 2", field: 18200, area: 7200, revenue: 244500000 },
      { label: "Mgg 3", field: 16900, area: 6800, revenue: 228750000 },
      { label: "Mgg 4", field: 21400, area: 8500, revenue: 288000000 },
    ],
    "1y": [
      { label: "Jan", field: 65000, area: 25000, revenue: 862500000 },
      { label: "Feb", field: 72000, area: 28000, revenue: 960000000 },
      { label: "Mar", field: 81000, area: 32000, revenue: 1087500000 },
      { label: "Apr", field: 78000, area: 31000, revenue: 1050000000 },
      { label: "Mei", field: 92000, area: 36000, revenue: 1230000000 },
      { label: "Jun", field: 88000, area: 34000, revenue: 1170000000 },
      { label: "Jul", field: 95000, area: 38000, revenue: 1282500000 },
      { label: "Agu", field: 102000, area: 41000, revenue: 1380000000 },
      { label: "Sep", field: 98000, area: 39000, revenue: 1320000000 },
      { label: "Okt", field: 110000, area: 44000, revenue: 1485000000 },
      { label: "Nov", field: 105000, area: 42000, revenue: 1417500000 },
      { label: "Des", field: 115000, area: 46000, revenue: 1552500000 },
    ],
    all: [
      { label: "2022", field: 450000, area: 180000, revenue: 6075000000 },
      { label: "2023", field: 720000, area: 290000, revenue: 9750000000 },
      { label: "2024", field: 950000, area: 380000, revenue: 12825000000 },
      { label: "2025", field: 1180000, area: 470000, revenue: 15900000000 },
      { label: "2026", field: 1420000, area: 560000, revenue: 19050000000 },
    ],
  };

export const dummyTopMitraList: TopMitraAcquisitionItem[] = [
  {
    rank: 1,
    mitraId: "mitra-01",
    mitraName: "PT Graha Spatial Mandiri",
    agencyOrCompany: "PT Graha Spatial Mandiri (Swasta)",
    totalOrders: 142,
    totalVolume: "185.000 Bidang",
    totalSpending: 1387500000,
  },
  {
    rank: 2,
    mitraId: "mitra-02",
    mitraName: "Dinas PUPR Provinsi Jawa Barat",
    agencyOrCompany: "Pemerintah Provinsi Jawa Barat",
    totalOrders: 98,
    totalVolume: "92.000 Ha",
    totalSpending: 1380000000,
  },
  {
    rank: 3,
    mitraId: "mitra-03",
    mitraName: "PT Nusantara Agraria Konsultan",
    agencyOrCompany: "PT Nusantara Agraria Konsultan (Swasta)",
    totalOrders: 76,
    totalVolume: "84.500 Bidang",
    totalSpending: 633750000,
  },
  {
    rank: 4,
    mitraId: "mitra-04",
    mitraName: "Bappeda Kota Surabaya",
    agencyOrCompany: "Pemerintah Kota Surabaya",
    totalOrders: 64,
    totalVolume: "42.000 Ha",
    totalSpending: 630000000,
  },
  {
    rank: 5,
    mitraId: "mitra-05",
    mitraName: "PT Telko Infrastruktur Spasial",
    agencyOrCompany: "PT Telko Infrastruktur Spasial (BUMN)",
    totalOrders: 51,
    totalVolume: "65.000 Bidang",
    totalSpending: 487500000,
  },
];

export const dummyTopIgtLayers: TopIgtLayerItem[] = [
  {
    rank: 1,
    layerId: "layer-01",
    layerTitle: "Batas Administrasi Kelurahan/Desa Terverifikasi",
    spatialBasis: "bidang",
    totalAcquisitions: 342,
    totalVolume: 420000,
    unit: "bidang",
    totalPnbpRevenue: 3150000000,
  },
  {
    rank: 2,
    layerId: "layer-02",
    layerTitle: "Tutupan Lahan & Pola Ruang RDTR Kawasan Strategis",
    spatialBasis: "kawasan",
    totalAcquisitions: 285,
    totalVolume: 185000,
    unit: "ha",
    totalPnbpRevenue: 2775000000,
  },
  {
    rank: 3,
    layerId: "layer-03",
    layerTitle: "Peta Kawasan Hutan & Konservasi Alam SK.MenLHK",
    spatialBasis: "kawasan",
    totalAcquisitions: 210,
    totalVolume: 140000,
    unit: "ha",
    totalPnbpRevenue: 2100000000,
  },
  {
    rank: 4,
    layerId: "layer-04",
    layerTitle: "Zona Nilai Tanah (ZNT) Perkotaan Skala 1:1.000",
    spatialBasis: "bidang",
    totalAcquisitions: 198,
    totalVolume: 245000,
    unit: "bidang",
    totalPnbpRevenue: 183750000,
  },
  {
    rank: 5,
    layerId: "layer-05",
    layerTitle: "Jaringan Utilitas & Koridor Pipa Gas Bawah Tanah",
    spatialBasis: "bidang",
    totalAcquisitions: 165,
    totalVolume: 180000,
    unit: "bidang",
    totalPnbpRevenue: 135000000,
  },
];

export const dummySystemHealth: SystemHealthMetricItem[] = [
  {
    key: "cpu",
    title: "Beban CPU Cluster",
    status: "healthy",
    value: "28.4%",
    subValue: "32 Cores · Normal",
    colorPalette: "green",
  },
  {
    key: "ram",
    title: "Penggunaan Memori (RAM)",
    status: "healthy",
    value: "41.2 GB / 128 GB",
    subValue: "Utilisasi 32.1%",
    colorPalette: "blue",
  },
  {
    key: "storage",
    title: "Storage Spasial (NVMe)",
    status: "healthy",
    value: "1.84 TB / 8.0 TB",
    subValue: "Free 6.16 TB PostGIS",
    colorPalette: "purple",
  },
  {
    key: "throughput",
    title: "Bandwidth & Throughput",
    status: "healthy",
    value: "45.2 MB/s",
    subValue: "WFS / WMS GeoServer",
    colorPalette: "teal",
  },
];
