// src/features/internal/batch-review/hooks/use-batch-review.ts

import {
  approveBatchApi,
  fetchInternalBatchDetailApi,
  fetchInternalBatchesApi,
  rejectBatchApi,
} from "@/features/internal/batch-review/api/batch-review.api";
import type {
  ApproveBatchPayload,
  InternalBatchListQueryParams,
  RejectBatchPayload,
} from "@/features/internal/batch-review/types/batch-review.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useInternalBatchesQuery = (params?: InternalBatchListQueryParams) => {
  const query = useQuery({
    queryKey: ["internal", "interop-batches", params],
    queryFn: ({ signal }) => fetchInternalBatchesApi(params, signal),
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    pagination: query.data?.pagination,
  };
};

export const useInternalBatchDetailQuery = (batchId?: string) => {
  return useQuery({
    queryKey: ["internal", "interop-batch", batchId],
    queryFn: ({ signal }) =>
      batchId ? fetchInternalBatchDetailApi(batchId, signal) : null,
    enabled: Boolean(batchId),
  });
};

export const useApproveBatch = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("approve-batch", {
    group: "Review Batch Interop",
    loadingMessage: {
      title: "Menyetujui batch...",
    },
    successMessage: {
      title: "Batch berhasil disetujui",
    },
    errorMessage: {
      title: "Gagal menyetujui batch",
    },
  });

  return useMutation({
    mutationFn: (payload: ApproveBatchPayload) => approveBatchApi(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["internal", "interop-batches"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useRejectBatch = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("reject-batch", {
    group: "Review Batch Interop",
    loadingMessage: {
      title: "Menolak batch...",
    },
    successMessage: {
      title: "Batch telah ditolak",
    },
    errorMessage: {
      title: "Gagal menolak batch",
    },
  });

  return useMutation({
    mutationFn: (payload: RejectBatchPayload) => rejectBatchApi(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["internal", "interop-batches"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: toastHandlers.onError,
  });
};
