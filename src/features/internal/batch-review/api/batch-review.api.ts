// src/features/internal/batch-review/api/batch-review.api.ts

import type {
  ApproveBatchPayload,
  InternalBatchItem,
  InternalBatchListQueryParams,
  InternalBatchListResponse,
  RejectBatchPayload,
} from "@/features/internal/batch-review/types/batch-review.type";
import { DUMMY_INTERNAL_BATCHES } from "@/shared/constants/dummy-data/dummy-internal-batch-review";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const fetchInternalBatchesApi = async (
  params?: InternalBatchListQueryParams,
  signal?: AbortSignal,
): Promise<InternalBatchListResponse> => {
  try {
    const response = await apiClient.get<
      ApiResponse<InternalBatchListResponse> | InternalBatchListResponse
    >("/api/internal/interop/batches", {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        search: params?.search,
        status: params?.status === "all" ? undefined : params?.status,
      },
      signal,
    });

    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as InternalBatchListResponse);

    if (resultData && Array.isArray(resultData.items)) {
      return resultData;
    }

    if (isDummyDataEnabled()) {
      return getDummyBatchList(params);
    }

    return {
      items: [],
      pagination: createPaginationMeta(1, 10, 0),
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return getDummyBatchList(params);
    }
    throw error;
  }
};

export const fetchInternalBatchDetailApi = async (
  batchId: string,
  signal?: AbortSignal,
): Promise<InternalBatchItem | null> => {
  try {
    const response = await apiClient.get<
      ApiResponse<InternalBatchItem> | InternalBatchItem
    >(`/api/internal/interop/batches/${batchId}`, { signal });

    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as InternalBatchItem);

    if (resultData && resultData.batchId) {
      return resultData;
    }

    if (isDummyDataEnabled()) {
      return (
        DUMMY_INTERNAL_BATCHES.find((b) => b.batchId === batchId) ?? null
      );
    }

    return null;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return (
        DUMMY_INTERNAL_BATCHES.find((b) => b.batchId === batchId) ?? null
      );
    }
    throw error;
  }
};

export const approveBatchApi = async (
  payload: ApproveBatchPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return apiClient.put<ApiResponse<void>>(
    `/api/internal/interop/batches/${payload.batchId}/approve`,
    {},
    { signal },
  );
};

export const rejectBatchApi = async (
  payload: RejectBatchPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return apiClient.put<ApiResponse<void>>(
    `/api/internal/interop/batches/${payload.batchId}/reject`,
    { reason: payload.reason },
    { signal },
  );
};

const getDummyBatchList = (
  params?: InternalBatchListQueryParams,
): InternalBatchListResponse => {
  let filtered = [...DUMMY_INTERNAL_BATCHES];
  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((b) => b.status === params.status);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.batchId.toLowerCase().includes(q) ||
        b.mitraName.toLowerCase().includes(q) ||
        b.items.some((it) => it.sourceLayerTitle.toLowerCase().includes(q)),
    );
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const paginatedItems = filtered.slice(start, start + pageSize);

  return {
    items: paginatedItems,
    pagination: createPaginationMeta(page, pageSize, filtered.length),
  };
};
