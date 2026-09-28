// src/features/mitra/home/services/mitra.home.financial-flow.service.ts

import { fetchMitraFinancialFlowApi } from "@/features/mitra/home/api/mitra.home.financial-flow.api";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import type { FinancialFlowItem } from "@/features/mitra/home/types/mitra.home.financial-flow.type";
import { dummyMitraFinancialFlow } from "@/shared/constants/dummy-data/dummy-mitra-home-data";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const normalizeFlowItems = (list: unknown[]): FinancialFlowItem[] => {
  return list.map((item) => {
    const obj = (item && typeof item === "object" ? item : {}) as Record<
      string,
      unknown
    >;
    return {
      sale: Number(obj.sale ?? obj.amount ?? obj.total ?? 0),
      label: String(obj.label ?? obj.date ?? obj.time ?? ""),
    };
  });
};

const normalizeFinancialFlow = (
  raw: unknown,
  period: MitraHomePeriod,
): FinancialFlowItem[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return normalizeFlowItems(raw);
  }
  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.breakdown)) {
      return normalizeFlowItems(obj.breakdown);
    }
    if (Array.isArray(obj.items)) {
      return normalizeFlowItems(obj.items);
    }
    if (period in obj && Array.isArray(obj[period])) {
      return normalizeFlowItems(obj[period] as unknown[]);
    }
    if (Array.isArray(obj.all)) {
      return normalizeFlowItems(obj.all);
    }
  }
  return [];
};

export const getMitraFinancialFlow = async (
  period: MitraHomePeriod = "all",
  signal?: AbortSignal,
): Promise<FinancialFlowItem[]> => {
  try {
    const response = await fetchMitraFinancialFlowApi(period, signal);
    const rawData = response?.data ?? response;

    if (rawData) {
      return normalizeFinancialFlow(rawData, period);
    }
    return isDummyDataEnabled()
      ? (dummyMitraFinancialFlow[period] ?? [])
      : [];
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (
      isDummyDataEnabled() ||
      (error instanceof ApiError && error.statusCode === 404)
    ) {
      return dummyMitraFinancialFlow[period] ?? [];
    }
    return [];
  }
};
