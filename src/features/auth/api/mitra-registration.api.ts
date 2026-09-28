// src/features/auth/api/mitra-registration.api.ts

import type {
  MitraRegistrationCreatedData,
  MitraRegistrationStatusData,
} from "@/features/auth/types/mitra-registration.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const postRegisterMitraApi = async (
  formData: FormData,
  signal?: AbortSignal,
): Promise<ApiResponse<MitraRegistrationCreatedData>> => {
  return apiClient.post<ApiResponse<MitraRegistrationCreatedData>>(
    "/api/auth/register",
    formData,
    { signal },
  );
};

export const fetchRegistrationStatusApi = async (
  registrationNumber: string,
  signal?: AbortSignal,
): Promise<ApiResponse<MitraRegistrationStatusData>> => {
  return apiClient.get<ApiResponse<MitraRegistrationStatusData>>(
    `/api/auth/registration-status/${registrationNumber}`,
    { signal },
  );
};
