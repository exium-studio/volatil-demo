// src\features\mitra\home\services\mitra.home.data-summary.service.ts

import { fetchMitraDataSummaryApi } from "@/features/mitra/home/api/mitra.home.data-summary.api";
import type {
  MitraHomeDataSummaryResponse,
  MitraHomePeriod,
} from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { dummyMitraDataSummary } from "@/shared/constants/dummy-data/dummy-mitra-home-data";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const EMPTY_SUMMARY: MitraHomeDataSummaryResponse = {
  field: { active: 0, almostExpired: 0, expired: 0 },
  area: { active: 0, almostExpired: 0, expired: 0 },
};

export const normalizeSummaryItem = (
  raw: unknown,
): MitraHomeDataSummaryResponse => {
  if (!raw || typeof raw !== "object") return EMPTY_SUMMARY;
  const obj = raw as Record<string, unknown>;
  const field = (obj.field ?? obj.bidang ?? {}) as Record<string, unknown>;
  const area = (obj.area ?? obj.kawasan ?? {}) as Record<string, unknown>;
  return {
    field: {
      active: Number(field.active ?? field.aktif ?? 0),
      almostExpired: Number(
        field.almostExpired ??
          field.almost_expired ??
          field.hampirKadaluwarsa ??
          0,
      ),
      expired: Number(field.expired ?? field.kadaluwarsa ?? 0),
    },
    area: {
      active: Number(area.active ?? area.aktif ?? 0),
      almostExpired: Number(
        area.almostExpired ??
          area.almost_expired ??
          area.hampirKadaluwarsa ??
          0,
      ),
      expired: Number(area.expired ?? area.kadaluwarsa ?? 0),
    },
  };
};

export const getMitraDataSummary = async (
  period: MitraHomePeriod = "all",
  signal?: AbortSignal,
): Promise<MitraHomeDataSummaryResponse> => {
  try {
    const response = await fetchMitraDataSummaryApi(period, signal);
    const rawData = response?.data ?? response;

    if (rawData && typeof rawData === "object") {
      const obj = rawData as Record<string, unknown>;
      if ("field" in obj || "area" in obj || "bidang" in obj || "kawasan" in obj) {
        return normalizeSummaryItem(obj);
      }
      if (period in obj && obj[period]) {
        return normalizeSummaryItem(obj[period]);
      }
    }
    return isDummyDataEnabled()
      ? (dummyMitraDataSummary[period] ?? EMPTY_SUMMARY)
      : EMPTY_SUMMARY;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (
      isDummyDataEnabled() ||
      (error instanceof ApiError && error.statusCode === 404)
    ) {
      return dummyMitraDataSummary[period] ?? EMPTY_SUMMARY;
    }
    return EMPTY_SUMMARY;
  }
};
