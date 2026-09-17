// src/features/mitra/home/services/mitra.home.data-availability.service.ts

import { fetchMitraDataAvailabilityApi } from "@/features/mitra/home/api/mitra.home.data-availability.api";
import type { MitraHomeDataAvailabilityResponse } from "@/features/mitra/home/types/mitra.home.data-availability.type";
import { dummyMitraDataAvailability } from "@/shared/constants/dummy-data/dummy-mitra-home-data";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY_AVAILABILITY: MitraHomeDataAvailabilityResponse = {
  totalIgt: 0,
  bidang: 0,
  kawasan: 0,
};

const normalizeDataAvailability = (
  raw: unknown,
): MitraHomeDataAvailabilityResponse => {
  if (!raw || typeof raw !== "object") return EMPTY_AVAILABILITY;
  const obj = raw as Record<string, unknown>;

  const bidang = Number(obj.bidang ?? obj.field ?? 0);
  const kawasan = Number(obj.kawasan ?? obj.area ?? 0);
  const totalIgt = Number(
    obj.totalIgt ?? obj.total_igt ?? obj.total ?? bidang + kawasan,
  );

  return {
    totalIgt,
    bidang,
    kawasan,
  };
};

export const getMitraDataAvailability = async (
  signal?: AbortSignal,
): Promise<MitraHomeDataAvailabilityResponse> => {
  try {
    const response = await fetchMitraDataAvailabilityApi(signal);
    const rawData = response?.data ?? response;
    if (rawData && typeof rawData === "object") {
      return normalizeDataAvailability(rawData);
    }
    return isDummyDataEnabled()
      ? dummyMitraDataAvailability
      : EMPTY_AVAILABILITY;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (
      isDummyDataEnabled() ||
      (error instanceof ApiError && error.statusCode === 404)
    ) {
      return dummyMitraDataAvailability;
    }
    return EMPTY_AVAILABILITY;
  }
};
