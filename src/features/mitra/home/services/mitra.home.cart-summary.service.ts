// src\features\mitra\home\services\mitra.home.cart-summary.service.ts

// src\features\mitra\home\services\mitra.home.cart-summary.service.ts

import { fetchMitraCartSummaryApi } from "@/features/mitra/home/api/mitra.home.cart-summary.api";
import type { MitraHomeCartSummaryResponse } from "@/features/mitra/home/types/mitra.home.cart-summary.type";
import { dummyMitraCartSummary } from "@/shared/constants/dummy-data/dummy-mitra-home-data";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY_CART_SUMMARY: MitraHomeCartSummaryResponse = {
  totalField: 0,
  totalArea: 0,
  totalIgtData: 0,
  subtotalPrice: 0,
};

const normalizeCartSummary = (raw: unknown): MitraHomeCartSummaryResponse => {
  if (!raw || typeof raw !== "object") return EMPTY_CART_SUMMARY;
  const obj = raw as Record<string, unknown>;

  return {
    totalField: Number(
      obj.totalField ?? obj.total_field ?? obj.totalBidang ?? obj.total_bidang ?? 0,
    ),
    totalArea: Number(
      obj.totalArea ?? obj.total_area ?? obj.totalKawasan ?? obj.total_kawasan ?? 0,
    ),
    totalIgtData: Number(
      obj.totalIgtData ??
        obj.total_igt_data ??
        obj.totalItems ??
        obj.total_items ??
        obj.totalData ??
        obj.total_data ??
        0,
    ),
    subtotalPrice: Number(
      obj.subtotalPrice ??
        obj.subtotal_price ??
        obj.totalPrice ??
        obj.total_price ??
        obj.price ??
        0,
    ),
  };
};

export const getMitraCartSummary = async (
  signal?: AbortSignal,
): Promise<MitraHomeCartSummaryResponse> => {
  try {
    const response = await fetchMitraCartSummaryApi(signal);
    const rawData = response?.data ?? response;

    if (rawData && typeof rawData === "object") {
      return normalizeCartSummary(rawData);
    }
    return isDummyDataEnabled() ? dummyMitraCartSummary : EMPTY_CART_SUMMARY;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (
      isDummyDataEnabled() ||
      (error instanceof ApiError && error.statusCode === 404)
    ) {
      return dummyMitraCartSummary;
    }
    return EMPTY_CART_SUMMARY;
  }
};
