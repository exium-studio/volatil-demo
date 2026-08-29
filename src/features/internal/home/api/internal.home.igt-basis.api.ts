// src/features/internal/home/api/internal.home.igt-basis.api.ts

import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import type { IgtBasisSummary } from "@/features/internal/home/types/internal.home.api.type";

export const fetchIgtBasisApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<IgtBasisSummary>> => {
  return apiClient.get<ApiResponse<IgtBasisSummary>>(
    "/api/internal/home/igt-basis",
    { signal },
  );
};
