// src/features/mitra/billing/api/simponi-status.api.ts

import type { PublicSimponiStatus } from "@/features/mitra/billing/types/simponi-status.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchPublicSimponiStatusApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<PublicSimponiStatus>> => {
  return apiClient.get<ApiResponse<PublicSimponiStatus>>(
    "/api/integrations/simponi/status",
    { signal },
  );
};
