// src/features/internal/home/types/internal.home.api.type.ts

import type {
  TopIgtLayerItem,
  TopMitraAcquisitionItem,
} from "@/features/internal/home/types/internal.home.leaderboard.type";
import type { InternalHomeServiceRateItem } from "@/features/internal/home/types/internal.home.service-rate.type";
import type { InternalHomeTrendItem } from "@/features/internal/home/types/internal.home.trend.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";

export type InternalHomeDataSummaryResponse = {
  // Donut 1: perbandingan basis spasial
  basisSpasial: {
    bidang: number;
    kawasan: number;
  };
  // Donut 2: status publikasi layer IGT
  statusPublikasi: {
    aktif: number;
    nonAktif: number;
  };
};

export type InternalHomeMitraRegistrationResponse = {
  active: number;
  pendingVerification: number;
};

export type InternalHomeDataResponse = {
  dataSummary: InternalHomeDataSummaryResponse;
  mitraRegistration: InternalHomeMitraRegistrationResponse;
  serviceRates: InternalHomeServiceRateItem[];
  acquisitionTrends: Record<HomePeriod, InternalHomeTrendItem[]>;
  topMitraList: TopMitraAcquisitionItem[];
  topIgtLayers: TopIgtLayerItem[];
};
