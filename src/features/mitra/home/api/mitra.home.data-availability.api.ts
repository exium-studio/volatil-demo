// src\features\mitra\home\api\mitra.home.data-availability.api.ts

// src\features\mitra\home\api\mitra.home.data-availability.api.ts

import type { MitraHomeDataAvailabilityResponse } from "@/features/mitra/home/types/mitra.home.data-availability.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const fetchMitraDataAvailabilityApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<MitraHomeDataAvailabilityResponse>> => {
  return apiClient.get<ApiResponse<MitraHomeDataAvailabilityResponse>>(
    "/api/mitra/home/data-availability",
    { signal },
  );
};
