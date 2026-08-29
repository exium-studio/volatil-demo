// src/features/internal/home/hooks/use-internal-home.query.ts

import { getIgtBasis } from "@/features/internal/home/services/internal.home.igt-basis.service";
import { getInternalLeaderboard } from "@/features/internal/home/services/internal.home.leaderboard.service";
import { getMitraRegistration } from "@/features/internal/home/services/internal.home.mitra-registration.service";
import { getPublicationStatus } from "@/features/internal/home/services/internal.home.publication-status.service";
import { getInternalTrend } from "@/features/internal/home/services/internal.home.trend.service";
import type {
  IgtBasisSummary,
  IgtPublicationStatusSummary,
  MitraRegistrationSummary,
} from "@/features/internal/home/types/internal.home.api.type";
import type {
  TopIgtLayerItem,
  TopMitraAcquisitionItem,
} from "@/features/internal/home/types/internal.home.leaderboard.type";
import type { InternalHomeTrendItem } from "@/features/internal/home/types/internal.home.trend.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import {
  dummyIgtBasis,
  dummyIgtPublicationStatus,
  dummyMitraRegistration,
} from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";

const defaultBasis: IgtBasisSummary = dummyIgtBasis;
const defaultPublish: IgtPublicationStatusSummary = dummyIgtPublicationStatus;
const defaultMitraReg: MitraRegistrationSummary = dummyMitraRegistration;

// 1. Hook Basis Spasial (Bidang vs Kawasan)
export const useInternalSpatialBasisQuery = () => {
  const query = useQuery({
    queryKey: queryKeys.internal.home.spatialBasis(),
    queryFn: ({ signal }) => getIgtBasis(signal),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    igtBasis: query.data ?? defaultBasis,
  };
};

// 2. Hook Status Publikasi
export const useInternalPublishStatusQuery = () => {
  const query = useQuery({
    queryKey: queryKeys.internal.home.publishStatus(),
    queryFn: ({ signal }) => getPublicationStatus(signal),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    igtPublicationStatus: query.data ?? defaultPublish,
  };
};

// 3. Hook Registrasi Mitra
export const useInternalMitraRegistrationQuery = () => {
  const query = useQuery({
    queryKey: queryKeys.internal.home.mitraRegistration(),
    queryFn: ({ signal }) => getMitraRegistration(signal),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    mitraRegistration: query.data ?? defaultMitraReg,
  };
};

// 4. Hook Tren Akuisisi
export const useInternalAcquisitionTrendsQuery = (period: HomePeriod = "all") => {
  const query = useQuery({
    queryKey: queryKeys.internal.home.trends(period),
    queryFn: ({ signal }) => getInternalTrend(period, signal),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    acquisitionTrends: (query.data ?? []) as InternalHomeTrendItem[],
  };
};

// 5. Hook Leaderboard (Mitra & Layer)
export const useInternalLeaderboardQuery = (period?: HomePeriod) => {
  const query = useQuery({
    queryKey: queryKeys.internal.home.leaderboardMitra(),
    queryFn: ({ signal }) => getInternalLeaderboard(period, signal),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    topMitraList: (query.data?.topMitraList ?? []) as TopMitraAcquisitionItem[],
    topIgtLayers: (query.data?.topIgtLayers ?? []) as TopIgtLayerItem[],
  };
};


