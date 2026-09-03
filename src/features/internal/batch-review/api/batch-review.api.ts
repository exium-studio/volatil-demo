// src/features/internal/batch-review/api/batch-review.api.ts

import type {
  ApproveBatchPayload,
  InternalBatchItem,
  InternalBatchListQueryParams,
  InternalBatchListResponse,
  ProvisionOrderPayload,
  ProvisionOrderResponse,
  RejectBatchPayload,
} from "@/features/internal/batch-review/types/batch-review.type";
import type { CartBatchItem } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { DUMMY_INTERNAL_BATCHES } from "@/shared/constants/dummy-data/dummy-internal-batch-review";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeCartBatchItem = (raw: any): CartBatchItem => {
  if (!raw || typeof raw !== "object") return raw;
  return {
    id: raw.id ?? raw._id ?? "",
    sourceLayerId:
      raw.sourceLayerId ??
      raw.source_layer_id ??
      raw.layerId ??
      raw.layer_id ??
      "",
    sourceLayerTitle:
      raw.sourceLayerTitle ??
      raw.source_layer_title ??
      raw.layerTitle ??
      raw.title ??
      raw.sourceLayerId ??
      "",
    spatialBasis: raw.spatialBasis ?? raw.spatial_basis ?? "bidang",
    featuresCount: Number(
      raw.featuresCount ?? raw.features_count ?? raw.count ?? 0,
    ),
    areaHa:
      raw.areaHa != null
        ? Number(raw.areaHa)
        : raw.area_ha != null
          ? Number(raw.area_ha)
          : undefined,
    unitPrice: Number(raw.unitPrice ?? raw.unit_price ?? 0),
    subtotalPrice: Number(
      raw.subtotalPrice ??
        raw.subtotal_price ??
        raw.price ??
        raw.total_price ??
        0,
    ),
    wfsUrl: raw.wfsUrl ?? raw.wfs_url,
    wmsUrl: raw.wmsUrl ?? raw.wms_url,
    previewWmsUrl:
      raw.previewWmsUrl ??
      raw.preview_wms_url ??
      raw.wmsUrl ??
      raw.wms_url ??
      (raw.sourceLayerId ? `/api/proxy/wms?layerId=${raw.sourceLayerId}` : undefined),
    previewWfsUrl:
      raw.previewWfsUrl ??
      raw.preview_wfs_url ??
      raw.wfsUrl ??
      raw.wfs_url ??
      (raw.sourceLayerId ? `/api/proxy/wfs?layerId=${raw.sourceLayerId}` : undefined),
    externalWfsUrl: raw.externalWfsUrl ?? raw.external_wfs_url ?? null,
    externalWmsUrl: raw.externalWmsUrl ?? raw.external_wms_url ?? null,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeInternalBatchItem = (raw: any): InternalBatchItem => {
  if (!raw || typeof raw !== "object") return raw;
  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items: CartBatchItem[] = rawItems.map(normalizeCartBatchItem);
  const calculatedTotalPrice = items.reduce(
    (acc: number, it: CartBatchItem) => acc + (it.subtotalPrice || 0),
    0,
  );

  return {
    batchId: raw.batchId ?? raw.batch_id ?? raw.id ?? "",
    orderId: raw.orderId ?? raw.order_id ?? undefined,
    mitraId: String(raw.mitraId ?? raw.mitra_id ?? ""),
    mitraName:
      raw.mitraName ?? raw.mitra_name ?? raw.userName ?? raw.name ?? "Mitra",
    status: raw.status ?? "pending_review",
    selectionType: raw.selectionType ?? raw.selection_type ?? "catalog",
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    readyAt: raw.readyAt ?? raw.ready_at ?? undefined,
    expiredAt: raw.expiredAt ?? raw.expired_at ?? undefined,
    totalPrice: Number(
      raw.totalPrice ?? raw.total_price ?? calculatedTotalPrice,
    ),
    items,
  };
};

export const fetchInternalBatchesApi = async (
  params?: InternalBatchListQueryParams,
  signal?: AbortSignal,
): Promise<InternalBatchListResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await apiClient.get("/api/internal/interop/batches", {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        search: params?.search,
        status: params?.status === "all" ? undefined : params?.status,
      },
      signal,
    });

    let rawData = response;
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data
    ) {
      rawData = response.data;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawBatches: any[] = [];
    let totalItems = 0;

    if (Array.isArray(rawData)) {
      rawBatches = rawData;
      totalItems = rawData.length;
    } else if (rawData && typeof rawData === "object") {
      if (Array.isArray(rawData.batches)) {
        rawBatches = rawData.batches;
        totalItems = Number(
          rawData.total ?? rawData.totalItems ?? rawBatches.length,
        );
      } else if (Array.isArray(rawData.items)) {
        rawBatches = rawData.items;
        totalItems = Number(
          rawData.total ?? rawData.totalItems ?? rawBatches.length,
        );
      } else if (Array.isArray(rawData.data)) {
        rawBatches = rawData.data;
        totalItems = Number(
          rawData.total ?? rawData.totalItems ?? rawBatches.length,
        );
      }
    } else if (response && Array.isArray(response.batches)) {
      rawBatches = response.batches;
      totalItems = Number(response.total ?? rawBatches.length);
    } else if (response && Array.isArray(response.items)) {
      rawBatches = response.items;
      totalItems = Number(response.total ?? rawBatches.length);
    }

    if (
      rawBatches.length > 0 ||
      (rawData &&
        typeof rawData === "object" &&
        ("batches" in rawData || "items" in rawData))
    ) {
      const items = rawBatches.map(normalizeInternalBatchItem);
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;

      return {
        items,
        pagination: createPaginationMeta(
          page,
          pageSize,
          totalItems || items.length,
        ),
      };
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await apiClient.get(
      `/api/internal/interop/batches/${batchId}`,
      { signal },
    );

    const rawData =
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data
        ? response.data
        : response;

    if (rawData && (rawData.batchId || rawData.batch_id || rawData.id)) {
      return normalizeInternalBatchItem(rawData);
    }

    if (isDummyDataEnabled()) {
      return DUMMY_INTERNAL_BATCHES.find((b) => b.batchId === batchId) ?? null;
    }

    return null;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return DUMMY_INTERNAL_BATCHES.find((b) => b.batchId === batchId) ?? null;
    }
    throw error;
  }
};

export const provisionOrderApi = async (
  payload: ProvisionOrderPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<ProvisionOrderResponse>> => {
  try {
    return await apiClient.post<ApiResponse<ProvisionOrderResponse>>(
      `/api/mitra/orders/${payload.orderId}/provision`,
      {},
      { signal },
    );
  } catch (error) {
    if (isDummyDataEnabled()) {
      const targetBatch = DUMMY_INTERNAL_BATCHES.find(
        (b) => b.orderId === payload.orderId || b.batchId === payload.batchId,
      );
      if (targetBatch) {
        targetBatch.status = "pending_review";
      }
      return {
        success: true,
        data: {
          orderId: payload.orderId,
          batchId: payload.batchId,
          transactionStatus: "processing",
          batchStatus: "pending_review",
        },
        message: "Proses provisioning layer AOI ke GeoServer berhasil dimulai.",
        timestamp: new Date().toISOString(),
      };
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
    payload.items ? { items: payload.items } : {},
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
  } else {
    // Default: review permohonan hanya menampilkan status paid dan pending_review
    filtered = filtered.filter(
      (b) => b.status === "paid" || b.status === "pending_review",
    );
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
