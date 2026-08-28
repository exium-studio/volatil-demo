// src/features/internal/home/types/internal.home.api.type.ts

import type {
  TopIgtLayerItem,
  TopMitraAcquisitionItem,
} from "@/features/internal/home/types/internal.home.leaderboard.type";
import type { InternalHomeServiceRateItem } from "@/features/internal/home/types/internal.home.service-rate.type";
import type { InternalHomeTrendItem } from "@/features/internal/home/types/internal.home.trend.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";

export type IgtBasisSummary = {
  field: number;
  area: number;
};

export type IgtPublicationStatusSummary = {
  active: number;
  inactive: number;
};

export type MitraRegistrationSummary = {
  active: number;
  pendingVerification: number;
};

export type InternalHomeDataResponse = {
  igtBasis: IgtBasisSummary;
  igtPublicationStatus: IgtPublicationStatusSummary;
  mitraRegistration: MitraRegistrationSummary;
  serviceRates: InternalHomeServiceRateItem[];
  acquisitionTrends: Record<HomePeriod, InternalHomeTrendItem[]>;
  topMitraList: TopMitraAcquisitionItem[];
  topIgtLayers: TopIgtLayerItem[];
};
