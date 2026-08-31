// src/features/internal/mitra-registration/api/mitra-registration.api.ts

import type {
  ApproveMitraRegistrationPayload,
  InternalMitraRegistrationItem,
  InternalMitraRegistrationQueryParams,
  RejectMitraRegistrationPayload,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type {
  ApiResponse,
  PaginationMeta,
} from "@/shared/types/common-response.type";

export const fetchMitraRegistrationsApi = async (
  params?: InternalMitraRegistrationQueryParams,
  signal?: AbortSignal,
): Promise<ApiResponse<InternalMitraRegistrationItem[]> & { pagination?: PaginationMeta }> => {
  return apiClient.get<
    ApiResponse<InternalMitraRegistrationItem[]> & { pagination?: PaginationMeta }
  >("/api/internal/mitra-registrations", {
    params: {
      page: params?.page,
      pageSize: params?.pageSize,
      search: params?.search,
      status: params?.status === "all" ? undefined : params?.status,
    },
    signal,
  });
};

export const fetchMitraRegistrationDetailApi = async (
  id: string | number,
  signal?: AbortSignal,
): Promise<ApiResponse<InternalMitraRegistrationItem>> => {
  return apiClient.get<ApiResponse<InternalMitraRegistrationItem>>(
    `/api/internal/mitra-registrations/${id}`,
    { signal },
  );
};

export const approveMitraRegistrationApi = async (
  payload: ApproveMitraRegistrationPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<InternalMitraRegistrationItem>> => {
  const formData = new FormData();
  formData.append("contractDocument", payload.contractDocument);

  return apiClient.post<ApiResponse<InternalMitraRegistrationItem>>(
    `/api/internal/mitra-registrations/${payload.id}/approve`,
    formData,
    { signal },
  );
};

export const rejectMitraRegistrationApi = async (
  payload: RejectMitraRegistrationPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<InternalMitraRegistrationItem>> => {
  return apiClient.post<ApiResponse<InternalMitraRegistrationItem>>(
    `/api/internal/mitra-registrations/${payload.id}/reject`,
    {
      rejectionReason: payload.rejectionReason,
    },
    { signal },
  );
};
