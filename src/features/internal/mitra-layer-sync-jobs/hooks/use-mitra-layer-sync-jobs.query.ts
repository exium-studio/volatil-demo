// src/features/internal/mitra-layer-sync-jobs/hooks/use-mitra-layer-sync-jobs.query.ts

import {
  getMitraLayerSyncJobById,
  getMitraLayerSyncJobs,
  triggerMitraLayerSync,
} from "@/features/internal/mitra-layer-sync-jobs/services/mitra-layer-sync-job.service";
import type {
  MitraLayerSyncJobItem,
  MitraLayerSyncJobsQueryParams,
  TriggerMitraLayerSyncPayload,
} from "@/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createMitraLayerSyncJobEventSource } from "@/features/internal/mitra-layer-sync-jobs/api/mitra-layer-sync-job.api";

export const useMitraLayerSyncJobsQuery = (
  params?: MitraLayerSyncJobsQueryParams,
) => {
  const query = useQuery({
    queryKey: queryKeys.internal.mitraLayerSyncJobs.list(
      params as Record<string, unknown>,
    ),
    queryFn: ({ signal }) => getMitraLayerSyncJobs(params, signal),
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    pagination: query.data?.pagination,
  };
};

export const useMitraLayerSyncJobDetailQuery = (jobId: string) => {
  return useQuery({
    queryKey: queryKeys.internal.mitraLayerSyncJobs.detail(jobId),
    queryFn: ({ signal }) => getMitraLayerSyncJobById(jobId, signal),
    enabled: Boolean(jobId),
  });
};

export const useMitraLayerSyncJobsQuickViewQuery = () => {
  const query = useQuery({
    queryKey: queryKeys.internal.mitraLayerSyncJobs.quickView(),
    queryFn: ({ signal }) =>
      getMitraLayerSyncJobs({ page: 1, pageSize: 10 }, signal),
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    totalCount: query.data?.pagination.totalItems ?? 0,
  };
};

export const useTriggerMitraLayerSyncMutation = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("trigger-mitra-layer-sync", {
    group: "Pembaruan Layer Mitra",
    loadingMessage: {
      title: "Menjadwalkan job pembaruan layer mitra...",
      description: "Memasukkan permintaan sinkronisasi ke antrean sistem.",
    },
    successMessage: {
      title: "Job pembaruan dijadwalkan di latar belakang",
      description:
        "Proses pembaruan layer mitra berjalan secara asinkron. Cek menu Antrean Job untuk memantau progres.",
    },
    errorMessage: {
      title: "Gagal menjadwalkan pembaruan layer mitra",
    },
  });

  return useMutation({
    mutationFn: (payload: TriggerMitraLayerSyncPayload) =>
      triggerMitraLayerSync(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: (_data) => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.mitraLayerSyncJobs.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.dataManagement.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

/**
 * SSE hook for listening to real-time status updates of mitra layer sync jobs.
 * Automatically invalidates queries when job stream events arrive.
 */
export const useMitraLayerSyncJobsStream = (options?: {
  jobId?: string;
  onEvent?: (event: { event: string; data: MitraLayerSyncJobItem }) => void;
}) => {
  const queryClient = useQueryClient();
  const { jobId, onEvent } = options ?? {};

  useEffect(() => {
    if (typeof window === "undefined") return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = createMitraLayerSyncJobEventSource(jobId);

      eventSource.addEventListener("job_progress", (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data) as MitraLayerSyncJobItem;
          onEvent?.({ event: "job_progress", data: parsed });
          void queryClient.invalidateQueries({
            queryKey: queryKeys.internal.mitraLayerSyncJobs.all,
          });
        } catch {
          // ignore parsing error
        }
      });

      eventSource.addEventListener("job_completed", (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data) as MitraLayerSyncJobItem;
          onEvent?.({ event: "job_completed", data: parsed });
          void queryClient.invalidateQueries({
            queryKey: queryKeys.internal.mitraLayerSyncJobs.all,
          });
        } catch {
          // ignore parsing error
        }
      });

      eventSource.addEventListener("job_failed", (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data) as MitraLayerSyncJobItem;
          onEvent?.({ event: "job_failed", data: parsed });
          void queryClient.invalidateQueries({
            queryKey: queryKeys.internal.mitraLayerSyncJobs.all,
          });
        } catch {
          // ignore parsing error
        }
      });

      eventSource.onerror = () => {
        // Silently close on connection drop; SSE reconnects or falls back to regular query invalidation
        eventSource?.close();
      };
    } catch {
      // EventSource not supported or failed to instantiate
    }

    return () => {
      eventSource?.close();
    };
  }, [jobId, onEvent, queryClient]);
};
