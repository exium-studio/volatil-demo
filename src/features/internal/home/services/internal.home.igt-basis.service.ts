// src/features/internal/home/services/internal.home.igt-basis.service.ts

import { fetchIgtBasisApi } from "@/features/internal/home/api/internal.home.igt-basis.api";
import type { IgtBasisSummary } from "@/features/internal/home/types/internal.home.api.type";
import { dummyIgtBasis } from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY: IgtBasisSummary = { field: 0, area: 0 };

export const getIgtBasis = async (
  signal?: AbortSignal,
): Promise<IgtBasisSummary> => {
  try {
    const response = await fetchIgtBasisApi(signal);
    if (response?.data) return response.data;
    return EMPTY;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (isDummyDataEnabled() && error instanceof ApiError && error.statusCode === 404) {
      return dummyIgtBasis;
    }
    return EMPTY;
  }
};
