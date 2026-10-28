// src/features/user-guide/api/user-guide.api.ts

import type {
  UserGuideDetailApiResponse,
  UserGuideListApiResponse,
  UserGuideMutationApiResponse,
} from "@/features/user-guide/types/user-guide.api.type";
import type {
  CreateUserGuidePayload,
  UpdateUserGuidePayload,
  UserGuideQueryParams,
} from "@/features/user-guide/types/user-guide.type";
import { apiClient } from "@/shared/libs/api-client/api-client";

export const getUserGuidesApi = async (
  params?: UserGuideQueryParams,
  signal?: AbortSignal,
): Promise<UserGuideListApiResponse> => {
  return apiClient.get<UserGuideListApiResponse>("/api/user-guides", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal,
  });
};

export const getUserGuideByIdApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<UserGuideDetailApiResponse> => {
  return apiClient.get<UserGuideDetailApiResponse>(`/api/user-guides/${id}`, {
    signal,
  });
};

export const postCreateUserGuideApi = async (
  payload: CreateUserGuidePayload,
  signal?: AbortSignal,
): Promise<UserGuideMutationApiResponse> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("category", payload.category);
  formData.append("targetRole", payload.targetRole);
  formData.append("version", payload.version);
  formData.append("isPublished", String(payload.isPublished ?? true));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  return apiClient.post<UserGuideMutationApiResponse>(
    "/api/user-guides",
    formData,
    { signal },
  );
};

export const putUpdateUserGuideApi = async (
  id: string,
  payload: UpdateUserGuidePayload,
  signal?: AbortSignal,
): Promise<UserGuideMutationApiResponse> => {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }
  if (payload.category !== undefined) {
    formData.append("category", payload.category);
  }
  if (payload.targetRole !== undefined) {
    formData.append("targetRole", payload.targetRole);
  }
  if (payload.version !== undefined) {
    formData.append("version", payload.version);
  }
  if (payload.isPublished !== undefined) {
    formData.append("isPublished", String(payload.isPublished));
  }

  if (payload.file) {
    formData.append("file", payload.file);
  }

  return apiClient.put<UserGuideMutationApiResponse>(
    `/api/user-guides/${id}`,
    formData,
    { signal },
  );
};

export const deleteUserGuideApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<UserGuideMutationApiResponse> => {
  return apiClient.delete<UserGuideMutationApiResponse>(
    `/api/user-guides/${id}`,
    { signal },
  );
};

export const postTrackUserGuideDownloadApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<UserGuideMutationApiResponse> => {
  return apiClient.post<UserGuideMutationApiResponse>(
    `/api/user-guides/${id}/download`,
    {},
    { signal },
  );
};
