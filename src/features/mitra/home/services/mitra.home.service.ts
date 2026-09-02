// src/features/mitra/home/services/mitra.home.service.ts

import { fetchMitraHomeDataApi } from "@/features/mitra/home/api/mitra.home.api";
import type { MitraHomeTransactionItem } from "@/features/mitra/home/types/mitra.home.last-transaction.type";
import type {
  MitraHomeDataResponse,
  MitraHomeDataSummaryResponse,
  MitraHomePeriod,
} from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { dummyMitraHomeData } from "@/shared/constants/dummy-data/dummy-mitra-home-data";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const EMPTY_SUMMARY: MitraHomeDataSummaryResponse = {
  field: { active: 0, almostExpired: 0, expired: 0 },
  area: { active: 0, almostExpired: 0, expired: 0 },
};

export const EMPTY_MITRA_HOME_DATA: MitraHomeDataResponse = {
  dataSummary: {
    "1d": EMPTY_SUMMARY,
    "1w": EMPTY_SUMMARY,
    "1m": EMPTY_SUMMARY,
    "1y": EMPTY_SUMMARY,
    all: EMPTY_SUMMARY,
  },
  financialFlow: {
    "1d": [],
    "1w": [],
    "1m": [],
    "1y": [],
    all: [],
  },
  cartSummary: {
    totalField: 0,
    totalArea: 0,
    totalIgtData: 0,
    subtotalPrice: 0,
  },
  lastTransactions: [],
};

const normalizeSummaryItem = (
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
        field.almostExpired ?? field.almost_expired ?? field.hampirKadaluwarsa ?? 0,
      ),
      expired: Number(field.expired ?? field.kadaluwarsa ?? 0),
    },
    area: {
      active: Number(area.active ?? area.aktif ?? 0),
      almostExpired: Number(
        area.almostExpired ?? area.almost_expired ?? area.hampirKadaluwarsa ?? 0,
      ),
      expired: Number(area.expired ?? area.kadaluwarsa ?? 0),
    },
  };
};

const normalizeMitraHomeResponse = (
  rawData: unknown,
  period: MitraHomePeriod = "all",
): MitraHomeDataResponse => {
  if (!rawData || typeof rawData !== "object") {
    return isDummyDataEnabled() ? dummyMitraHomeData : EMPTY_MITRA_HOME_DATA;
  }

  const obj = rawData as Record<string, unknown>;

  // Handle dataSummary
  let dataSummary: Record<MitraHomePeriod, MitraHomeDataSummaryResponse> = {
    "1d": EMPTY_SUMMARY,
    "1w": EMPTY_SUMMARY,
    "1m": EMPTY_SUMMARY,
    "1y": EMPTY_SUMMARY,
    all: EMPTY_SUMMARY,
  };

  if (obj.dataSummary && typeof obj.dataSummary === "object") {
    const rawSummary = obj.dataSummary as Record<string, unknown>;
    if (
      "field" in rawSummary ||
      "area" in rawSummary ||
      "bidang" in rawSummary
    ) {
      const normalized = normalizeSummaryItem(rawSummary);
      dataSummary = {
        "1d": normalized,
        "1w": normalized,
        "1m": normalized,
        "1y": normalized,
        all: normalized,
        [period]: normalized,
      };
    } else {
      const periods: MitraHomePeriod[] = ["1d", "1w", "1m", "1y", "all"];
      periods.forEach((p) => {
        if (rawSummary[p]) {
          dataSummary[p] = normalizeSummaryItem(rawSummary[p]);
        }
      });
    }
  }

  // Handle financialFlow
  let financialFlow: Record<
    MitraHomePeriod,
    { sale: number; label: string }[]
  > = {
    "1d": [],
    "1w": [],
    "1m": [],
    "1y": [],
    all: [],
  };

  if (Array.isArray(obj.financialFlow)) {
    const list = obj.financialFlow.map((item: unknown) => {
      const itemObj = (item && typeof item === "object" ? item : {}) as Record<
        string,
        unknown
      >;
      return {
        sale: Number(itemObj.sale ?? itemObj.amount ?? itemObj.total ?? 0),
        label: String(itemObj.label ?? itemObj.date ?? itemObj.time ?? ""),
      };
    });
    financialFlow = {
      "1d": list,
      "1w": list,
      "1m": list,
      "1y": list,
      all: list,
      [period]: list,
    };
  } else if (obj.financialFlow && typeof obj.financialFlow === "object") {
    const rawFlow = obj.financialFlow as Record<string, unknown>;
    const periods: MitraHomePeriod[] = ["1d", "1w", "1m", "1y", "all"];
    periods.forEach((p) => {
      if (Array.isArray(rawFlow[p])) {
        financialFlow[p] = (rawFlow[p] as unknown[]).map((item: unknown) => {
          const itemObj = (item && typeof item === "object"
            ? item
            : {}) as Record<string, unknown>;
          return {
            sale: Number(itemObj.sale ?? itemObj.amount ?? itemObj.total ?? 0),
            label: String(itemObj.label ?? itemObj.date ?? itemObj.time ?? ""),
          };
        });
      }
    });
  }

  const rawCart = (obj.cartSummary && typeof obj.cartSummary === "object"
    ? obj.cartSummary
    : {}) as Record<string, unknown>;

  const rawTransactions = Array.isArray(obj.lastTransactions)
    ? (obj.lastTransactions as MitraHomeTransactionItem[])
    : Array.isArray(obj.last_transactions)
      ? (obj.last_transactions as MitraHomeTransactionItem[])
      : [];

  return {
    dataSummary,
    financialFlow,
    cartSummary: {
      totalField: Number(
        rawCart.totalField ?? rawCart.total_field ?? rawCart.totalBidang ?? 0,
      ),
      totalArea: Number(
        rawCart.totalArea ?? rawCart.total_area ?? rawCart.totalKawasan ?? 0,
      ),
      totalIgtData: Number(
        rawCart.totalIgtData ?? rawCart.total_igt_data ?? rawCart.totalData ?? 0,
      ),
      subtotalPrice: Number(
        rawCart.subtotalPrice ?? rawCart.subtotal_price ?? rawCart.price ?? 0,
      ),
    },
    lastTransactions: rawTransactions,
  };
};

export const getMitraHomeData = async (
  period: MitraHomePeriod = "all",
  signal?: AbortSignal,
): Promise<MitraHomeDataResponse> => {
  try {
    const response = await fetchMitraHomeDataApi(period, signal);
    const rawData =
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data
        ? response.data
        : response;

    if (rawData && typeof rawData === "object") {
      return normalizeMitraHomeResponse(rawData, period);
    }
    return isDummyDataEnabled() ? dummyMitraHomeData : EMPTY_MITRA_HOME_DATA;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return dummyMitraHomeData;
    }
    throw error;
  }
};
