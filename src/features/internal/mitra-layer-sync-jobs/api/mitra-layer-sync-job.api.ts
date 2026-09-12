// src/features/internal/mitra-layer-sync-jobs/api/mitra-layer-sync-job.api.ts

import type {
  MitraLayerSyncJobItem,
  MitraLayerSyncJobsQueryParams,
  MitraLayerSyncJobsResponse,
  TriggerMitraLayerSyncPayload,
  TriggerMitraLayerSyncResponse,
} from "@/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type";
import {
  createDummyMitraLayerSyncJobsResponse,
  DUMMY_MITRA_LAYER_SYNC_JOBS,
} from "@/shared/constants/dummy-data/dummy-mitra-layer-sync-jobs";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const fetchMitraLayerSyncJobsApi = async (
  params?: MitraLayerSyncJobsQueryParams,
  signal?: AbortSignal,
): Promise<MitraLayerSyncJobsResponse> => {
  try {
    const response = await apiClient.get<
      ApiResponse<MitraLayerSyncJobsResponse> | MitraLayerSyncJobsResponse
    >("/api/internal/mitra-layer-sync-jobs", {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        search: params?.search,
        status: params?.status,
      },
      signal,
    });

    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as MitraLayerSyncJobsResponse);

    if (resultData && Array.isArray(resultData.items)) {
      return resultData;
    }

    if (isDummyDataEnabled()) {
      return createDummyMitraLayerSyncJobsResponse(params);
    }

    return {
      items: [],
      pagination: {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return createDummyMitraLayerSyncJobsResponse(params);
    }
    throw error;
  }
};

export const fetchMitraLayerSyncJobByIdApi = async (
  jobId: string,
  signal?: AbortSignal,
): Promise<MitraLayerSyncJobItem> => {
  try {
    const response = await apiClient.get<
      ApiResponse<MitraLayerSyncJobItem> | MitraLayerSyncJobItem
    >(`/api/internal/mitra-layer-sync-jobs/${jobId}`, { signal });

    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as MitraLayerSyncJobItem);

    if (resultData && resultData.id) {
      return resultData;
    }

    if (isDummyDataEnabled()) {
      const match = DUMMY_MITRA_LAYER_SYNC_JOBS.find((j) => j.id === jobId);
      if (match) return match;
    }

    throw new Error(`Job ${jobId} not found`);
  } catch (error) {
    if (isDummyDataEnabled()) {
      const match = DUMMY_MITRA_LAYER_SYNC_JOBS.find((j) => j.id === jobId);
      if (match) return match;
    }
    throw error;
  }
};

export const triggerMitraLayerSyncApi = async (
  payload: TriggerMitraLayerSyncPayload,
  signal?: AbortSignal,
): Promise<TriggerMitraLayerSyncResponse> => {
  const resolvedLayerIds =
    payload.layerIds && payload.layerIds.length > 0
      ? payload.layerIds
      : payload.layerId
        ? [payload.layerId]
        : [];

  try {
    const isSingle = resolvedLayerIds.length === 1 && Boolean(payload.layerId);
    const endpoint = isSingle
      ? `/api/internal/igt-layers/${payload.layerId}/sync-mitra`
      : `/api/internal/igt-layers/sync-mitra`;

    const requestBody = isSingle
      ? {}
      : { layerIds: resolvedLayerIds };

    const response = await apiClient.post<
      | ApiResponse<TriggerMitraLayerSyncResponse>
      | TriggerMitraLayerSyncResponse
    >(endpoint, requestBody, { signal });

    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as TriggerMitraLayerSyncResponse);

    if (resultData && resultData.jobId) {
      return resultData;
    }

    const fallbackJob: TriggerMitraLayerSyncResponse = {
      jobId: `sync_job_${Date.now()}`,
      layerId: payload.layerId ?? resolvedLayerIds[0],
      layerIds: resolvedLayerIds,
      status: "queued",
      message:
        "Job antrean pembaruan layer mitra telah dijadwalkan di latar belakang.",
      createdAt: new Date().toISOString(),
    };

    return fallbackJob;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return {
        jobId: `sync_job_${Date.now()}`,
        layerId: payload.layerId ?? resolvedLayerIds[0],
        layerIds: resolvedLayerIds,
        status: "queued",
        message:
          "Job antrean pembaruan layer mitra telah dijadwalkan di latar belakang.",
        createdAt: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const createMitraLayerSyncJobEventSource = (
  jobId?: string,
): EventSource => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const endpoint = jobId
    ? `/api/internal/mitra-layer-sync-jobs/${jobId}/stream`
    : "/api/internal/mitra-layer-sync-jobs/stream";

  // EventSource does not support custom headers — send auth token as query param
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const query = token ? `?token=${encodeURIComponent(token)}` : "";

  const fullUrl = `${baseUrl}${endpoint}${query}`;
  return new EventSource(fullUrl, { withCredentials: true });
};
