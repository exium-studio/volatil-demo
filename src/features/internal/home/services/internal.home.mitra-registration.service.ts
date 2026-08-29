// src/features/internal/home/services/internal.home.mitra-registration.service.ts

import { fetchMitraRegistrationApi } from "@/features/internal/home/api/internal.home.mitra-registration.api";
import type { MitraRegistrationSummary } from "@/features/internal/home/types/internal.home.api.type";
import { dummyMitraRegistration } from "@/shared/constants/dummy-data/dummy-internal-home-data";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY: MitraRegistrationSummary = { active: 0, pendingVerification: 0 };

export const getMitraRegistration = async (
  signal?: AbortSignal,
): Promise<MitraRegistrationSummary> => {
  try {
    const response = await fetchMitraRegistrationApi(signal);
    if (response?.data) return response.data;
    return isDummyDataEnabled() ? dummyMitraRegistration : EMPTY;
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (isDummyDataEnabled() && error instanceof ApiError && error.statusCode === 404) {
      return dummyMitraRegistration;
    }
    console.warn("getMitraRegistration error, returning empty", error);
    return isDummyDataEnabled() ? dummyMitraRegistration : EMPTY;
  }
};
