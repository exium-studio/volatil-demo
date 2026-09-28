// src/features/internal/home/api/internal.home.mitra-registration.api.ts

import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import type { MitraRegistrationSummary } from "@/features/internal/home/types/internal.home.api.type";

export const fetchMitraRegistrationApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<MitraRegistrationSummary>> => {
  return apiClient.get<ApiResponse<MitraRegistrationSummary>>(
    "/api/internal/home/mitra-registration",
    { signal },
  );
};
