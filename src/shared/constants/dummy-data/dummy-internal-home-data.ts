// src/shared/constants/dummy-data/dummy-internal-home-data.ts

import type { InternalHomeIgtDataViewItem } from "@/features/internal/home/types/internal.home.data-view.type";
import type { InternalHomeDataSummaryResponse } from "@/features/internal/home/types/internal.home.data-summary.type";
import type { ServiceRateItem } from "@/features/internal/home/types/internal.home.service-rate.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { TreesIcon, Layers2Icon } from "lucide-react";

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
    minPurchase: 1000,
    minUnit: "Ha",
    colorPalette: "orange",
  },
];

export const dummyInternalOrderSummary = {
  activeOrders: 990,
  completedOrders: 990,
  igtRequests: 990,
  totalRevenue: 990000000,
};

export const dummyInternalDataView: InternalHomeIgtDataViewItem[] = [
  {
    id: "data-1",
    layerFileName: "layerdataigtpr.zip",
    syncStatus: "connected",
    lastSyncTime: "09:00 · 24 Januari 2027",
    igtBasis: "bidang",
    wfsApiLink: "https://igtpr.atrbpn.go.id/wfs/layerdataigtpr1",
    wfsApiCode: "gepyt54y54wtjetuytt...",
  },
  {
    id: "data-2",
    layerFileName: "layerdataigtpr.zip",
    syncStatus: "connected",
    lastSyncTime: "09:00 · 24 Januari 2027",
    igtBasis: "kawasan",
    wfsApiLink: "https://igtpr.atrbpn.go.id/wfs/layerdataigtpr2",
    wfsApiCode: "gepyt54y54wtjetuytt...",
  },
  {
    id: "data-3",
    layerFileName: "layerdataigtpr.zip",
    syncStatus: "connected",
    lastSyncTime: "09:00 · 24 Januari 2027",
    igtBasis: "bidang",
    wfsApiLink: "https://igtpr.atrbpn.go.id/wfs/layerdataigtpr3",
    wfsApiCode: "gepyt54y54wtjetuytt...",
  },
];
