// src/features/internal/mitra-layer-sync-jobs/services/mitra-layer-sync-job.service.ts

import {
  fetchMitraLayerSyncJobByIdApi,
  fetchMitraLayerSyncJobsApi,
  triggerMitraLayerSyncApi,
} from "@/features/internal/mitra-layer-sync-jobs/api/mitra-layer-sync-job.api";
import type {
  MitraLayerSyncJobItem,
  MitraLayerSyncJobsQueryParams,
  MitraLayerSyncJobsResponse,
  TriggerMitraLayerSyncPayload,
  TriggerMitraLayerSyncResponse,
} from "@/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type";

export const getMitraLayerSyncJobs = async (
  params?: MitraLayerSyncJobsQueryParams,
  signal?: AbortSignal,
): Promise<MitraLayerSyncJobsResponse> => {
  return fetchMitraLayerSyncJobsApi(params, signal);
};

export const getMitraLayerSyncJobById = async (
  jobId: string,
  signal?: AbortSignal,
): Promise<MitraLayerSyncJobItem> => {
  return fetchMitraLayerSyncJobByIdApi(jobId, signal);
};

export const triggerMitraLayerSync = async (
  payload: TriggerMitraLayerSyncPayload,
  signal?: AbortSignal,
): Promise<TriggerMitraLayerSyncResponse> => {
  return triggerMitraLayerSyncApi(payload, signal);
};
