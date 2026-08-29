// src/features/internal/home/services/internal.home.publication-status.service.ts

import { fetchPublicationStatusApi } from "@/features/internal/home/api/internal.home.publication-status.api";
import type { IgtPublicationStatusSummary } from "@/features/internal/home/types/internal.home.api.type";
import { dummyIgtPublicationStatus } from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY: IgtPublicationStatusSummary = { active: 0, inactive: 0 };

export const getPublicationStatus = async (
  signal?: AbortSignal,
): Promise<IgtPublicationStatusSummary> => {
  try {
    const response = await fetchPublicationStatusApi(signal);
    if (response?.data) return response.data;
    return isDummyDataEnabled() ? dummyIgtPublicationStatus : EMPTY;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (isDummyDataEnabled() && error instanceof ApiError && error.statusCode === 404) {
      return dummyIgtPublicationStatus;
    }
    console.warn("getPublicationStatus error, returning empty", error);
    return isDummyDataEnabled() ? dummyIgtPublicationStatus : EMPTY;
  }
};
