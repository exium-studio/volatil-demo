// src/features/internal/home/api/internal.home.publication-status.api.ts

import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import type { IgtPublicationStatusSummary } from "@/features/internal/home/types/internal.home.api.type";

export const fetchPublicationStatusApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<IgtPublicationStatusSummary>> => {
  return apiClient.get<ApiResponse<IgtPublicationStatusSummary>>(
    "/api/internal/home/publication-status",
    { signal },
  );
};
