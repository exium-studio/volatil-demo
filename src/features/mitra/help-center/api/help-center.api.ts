// src/features/mitra/help-center/api/help-center.api.ts

import type {
  CreateHelpCenterApiResponse,
  CreateHelpCenterPayload,
  HelpCenterDetailApiResponse,
  HelpCenterListApiResponse,
  HelpCenterQueryParams,
  HelpCenterStatisticsApiResponse,
  ReplyHelpCenterApiResponse,
  ReplyHelpCenterPayload,
} from "@/features/mitra/help-center/types/help-center.type";
import { apiClient } from "@/shared/libs/api-client/api-client";

export const getHelpCenterStatisticsApi = async (
  scope?: "my" | "all",
  signal?: AbortSignal,
): Promise<HelpCenterStatisticsApiResponse> => {
  return apiClient.get<HelpCenterStatisticsApiResponse>(
    "/api/tickets/statistics",
    {
      params: scope ? { scope } : undefined,
      signal,
    },
  );
};

export const getHelpCenterTicketsApi = async (
  params?: HelpCenterQueryParams,
  signal?: AbortSignal,
): Promise<HelpCenterListApiResponse> => {
  return apiClient.get<HelpCenterListApiResponse>("/api/tickets", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal,
  });
};

export const getHelpCenterTicketByIdApi = async (
  id: number,
  signal?: AbortSignal,
): Promise<HelpCenterDetailApiResponse> => {
  return apiClient.get<HelpCenterDetailApiResponse>(`/api/tickets/${id}`, {
    signal,
  });
};

export const postCreateHelpCenterTicketApi = async (
  payload: CreateHelpCenterPayload,
  signal?: AbortSignal,
): Promise<CreateHelpCenterApiResponse> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);

  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return apiClient.post<CreateHelpCenterApiResponse>("/api/tickets", formData, {
    signal,
  });
};

export const postReplyHelpCenterTicketApi = async (
  id: number,
  payload: ReplyHelpCenterPayload,
  signal?: AbortSignal,
): Promise<ReplyHelpCenterApiResponse> => {
  const formData = new FormData();
  formData.append("message", payload.message);

  if (payload.status) {
    formData.append("status", payload.status);
  }

  if (payload.files && payload.files.length > 0) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return apiClient.post<ReplyHelpCenterApiResponse>(
    `/api/tickets/${id}/reply`,
    formData,
    { signal },
  );
};
