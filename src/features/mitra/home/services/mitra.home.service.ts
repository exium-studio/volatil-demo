// src/features/mitra/home/services/mitra.home.service.ts

import { fetchMitraHomeDataApi } from "@/features/mitra/home/api/mitra.home.api";
import type {
  MitraHomeDataResponse,
  MitraHomePeriod,
} from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { dummyMitraHomeData } from "@/shared/constants/dummy-data/dummy-mitra-home-data";

export const getMitraHomeData = async (
  period?: MitraHomePeriod,
  signal?: AbortSignal,
): Promise<MitraHomeDataResponse> => {
  try {
    const response = await fetchMitraHomeDataApi(period, signal);
    return response.data ?? dummyMitraHomeData;
  } catch {
    return dummyMitraHomeData;
  }
};
