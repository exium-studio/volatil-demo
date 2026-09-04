// src/features/internal/order-review/api/order-review.api.ts

import type {
  ApproveOrderPayload,
  InternalOrderItem,
  InternalOrderListQueryParams,
  InternalOrderListResponse,
  ProvisionOrderPayload,
  ProvisionOrderResponse,
  RejectOrderPayload,
} from "@/features/internal/order-review/types/order-review.type";
import type { CartOrderItem } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { DUMMY_INTERNAL_ORDERS } from "@/shared/constants/dummy-data/dummy-internal-order-review";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeCartOrderItem = (raw: any): CartOrderItem => {
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
      (raw.sourceLayerId
        ? `/api/proxy/wms?layerId=${raw.sourceLayerId}`
        : undefined),
    previewWfsUrl:
      raw.previewWfsUrl ??
      raw.preview_wfs_url ??
      raw.wfsUrl ??
      raw.wfs_url ??
      (raw.sourceLayerId
        ? `/api/proxy/wfs?layerId=${raw.sourceLayerId}`
        : undefined),
    externalWfsUrl: raw.externalWfsUrl ?? raw.external_wfs_url ?? null,
    externalWmsUrl: raw.externalWmsUrl ?? raw.external_wfs_url ?? null,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeInternalOrderItem = (raw: any): InternalOrderItem => {
  if (!raw || typeof raw !== "object") return raw;
  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items: CartOrderItem[] = rawItems.map(normalizeCartOrderItem);
  const calculatedTotalPrice = items.reduce(
    (acc: number, it: CartOrderItem) => acc + (it.subtotalPrice || 0),
    0,
  );
  const idVal = raw.orderId ?? raw.order_id ?? raw.id ?? "";

  return {
    orderId: idVal,
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

export const fetchInternalOrdersApi = async (
  params?: InternalOrderListQueryParams,
  signal?: AbortSignal,
): Promise<InternalOrderListResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await apiClient.get("/api/internal/interop/orders", {
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
    let rawOrders: any[] = [];
    let totalItems = 0;

    if (Array.isArray(rawData)) {
      rawOrders = rawData;
      totalItems = rawData.length;
    } else if (rawData && typeof rawData === "object") {
      if (Array.isArray(rawData.orders)) {
        rawOrders = rawData.orders;
        totalItems = Number(
          rawData.total ?? rawData.totalItems ?? rawOrders.length,
        );
      } else if (Array.isArray(rawData.items)) {
        rawOrders = rawData.items;
        totalItems = Number(
          rawData.total ?? rawData.totalItems ?? rawOrders.length,
        );
      } else if (Array.isArray(rawData.data)) {
        rawOrders = rawData.data;
        totalItems = Number(
          rawData.total ?? rawData.totalItems ?? rawOrders.length,
        );
      }
    } else if (response && Array.isArray(response.orders)) {
      rawOrders = response.orders;
      totalItems = Number(response.total ?? rawOrders.length);
    } else if (response && Array.isArray(response.items)) {
      rawOrders = response.items;
      totalItems = Number(response.total ?? rawOrders.length);
    }

    if (
      rawOrders.length > 0 ||
      (rawData &&
        typeof rawData === "object" &&
        ("orders" in rawData || "items" in rawData))
    ) {
      const items = rawOrders.map(normalizeInternalOrderItem);
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
      return getDummyOrderList(params);
    }

    return {
      items: [],
      pagination: createPaginationMeta(1, 10, 0),
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return getDummyOrderList(params);
    }
    throw error;
  }
};

export const fetchInternalOrderDetailApi = async (
  orderId: string,
  signal?: AbortSignal,
): Promise<InternalOrderItem | null> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await apiClient.get(
      `/api/internal/interop/orders/${orderId}`,
      { signal },
    );

    const rawData =
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data
        ? response.data
        : response;

    if (
      rawData &&
      (rawData.orderId || rawData.order_id || rawData.id)
    ) {
      return normalizeInternalOrderItem(rawData);
    }

    if (isDummyDataEnabled()) {
      return (
        DUMMY_INTERNAL_ORDERS.find((b) => b.orderId === orderId) ?? null
      );
    }

    return null;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return (
        DUMMY_INTERNAL_ORDERS.find((b) => b.orderId === orderId) ?? null
      );
    }
    throw error;
  }
};

export const provisionOrderApi = async (
  payload: ProvisionOrderPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<ProvisionOrderResponse>> => {
  const { orderId } = payload;
  try {
    return await apiClient.post<ApiResponse<ProvisionOrderResponse>>(
      `/api/mitra/orders/${orderId}/provision`,
      {},
      { signal },
    );
  } catch (error) {
    if (isDummyDataEnabled()) {
      const targetOrder = DUMMY_INTERNAL_ORDERS.find(
        (b) => b.orderId === orderId,
      );
      if (targetOrder) {
        targetOrder.status = "pending_review";
      }
      return {
        success: true,
        data: {
          orderId,
          transactionStatus: "processing",
          orderStatus: "pending_review",
        },
        message: "Proses provisioning layer AOI ke GeoServer berhasil dimulai.",
        timestamp: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const approveOrderApi = async (
  payload: ApproveOrderPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  const { orderId, items } = payload;
  return apiClient.put<ApiResponse<void>>(
    `/api/internal/interop/orders/${orderId}/approve`,
    items ? { items } : {},
    { signal },
  );
};

export const rejectOrderApi = async (
  payload: RejectOrderPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  const { orderId, reason } = payload;
  return apiClient.put<ApiResponse<void>>(
    `/api/internal/interop/orders/${orderId}/reject`,
    { reason },
    { signal },
  );
};

const getDummyOrderList = (
  params?: InternalOrderListQueryParams,
): InternalOrderListResponse => {
  let filtered = [...DUMMY_INTERNAL_ORDERS];
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
        b.orderId.toLowerCase().includes(q) ||
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
