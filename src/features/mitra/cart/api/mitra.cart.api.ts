// src/features/mitra/cart/api/mitra.cart.api.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { fetchWfsCatalog } from "@/features/mitra/data-request/api/mitra.data-request-wfs.api";
import type { FetchWfsCatalogResult } from "@/features/mitra/data-request/api/mitra.data-request-wfs.api";
import type { CheckoutResponse } from "@/features/mitra/cart/types/cart.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import type GeoJSON from "geojson";

const WFS_ID_FIELD = "gid";

export type { FetchWfsCatalogResult };

function getPaginatedIds(ids: string[], page: number, pageSize: number) {
  const total = ids.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageIds = ids.slice(start, end);
  return { pageIds, total, totalPages };
}

/** Returns paginated WFS features for IDs passed into the function */
export async function fetchCartWfsPageApi(params: {
  ids: string[];
  page: number;
  pageSize: number;
  typeName: string;
  wfsUrl: string;
  search?: string;
  cqlFilter?: string;
  signal?: AbortSignal;
}): Promise<
  FetchWfsCatalogResult & {
    pageIds: string[];
    total: number;
    totalPages: number;
  }
> {
  const { ids, page, pageSize, typeName, wfsUrl, search, cqlFilter, signal } =
    params;

  if (isEmptyArray(ids) || !typeName || !wfsUrl) {
    return {
      features: [],
      totalFeatures: 0,
      totalLuas: 0,
      bidangCount: 0,
      kawasanCount: 0,
      pageIds: [],
      total: 0,
      totalPages: 0,
    };
  }

  // Build CQL: "gid" IN ('id1','id2',...)
  const idList = ids.map((id) => `'${id}'`).join(",");
  const baseFilter = `"${WFS_ID_FIELD}" IN (${idList})`;
  const mergedCqlFilter =
    [baseFilter, cqlFilter].filter(Boolean).join(" AND ") || undefined;

  const result = await fetchWfsCatalog({
    typeName,
    wfsUrl,
    page,
    pageSize,
    search,
    cqlFilter: mergedCqlFilter,
    signal,
  });

  const { pageIds, total, totalPages } = getPaginatedIds(ids, page, pageSize);

  return {
    ...result,
    pageIds,
    total,
    totalPages,
  };
}

/** Add specific feature IDs to cart via API. */
export async function postAddSelectedToCartApi(
  featureIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  await apiClient.post(
    "/api/mitra/cart/add-selected",
    { featureIds },
    { signal },
  );
}

/** Add ALL features matching the given WFS params to cart via WFS. */
export async function fetchAllFeatureIdsFromWfsApi(params: {
  typeName: string;
  wfsUrl: string;
  cqlFilter?: string;
  signal?: AbortSignal;
}): Promise<string[]> {
  const { typeName, wfsUrl, cqlFilter, signal } = params;

  if (!typeName || !wfsUrl) return [];

  const result = await fetchWfs({
    typeName,
    wfsUrl,
    version: "2.0.0",
    cqlFilter,
    resultType: "results",
    signal,
  });

  const features: GeoJSON.Feature[] = result.features ?? [];
  return features
    .map((f) => {
      const idVal = f.properties?.id ?? f.properties?.[WFS_ID_FIELD] ?? f.id;
      return idVal != null ? String(idVal) : null;
    })
    .filter((id): id is string => id !== null);
}

export async function postRemoveFromCartApi(
  itemIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  await apiClient.post("/api/mitra/cart/remove", { itemIds }, { signal });
}

export async function postClearCartApi(signal?: AbortSignal): Promise<void> {
  await apiClient.post("/api/mitra/cart/clear", {}, { signal });
}

export async function postCheckoutApi(
  signal?: AbortSignal,
): Promise<ApiResponse<CheckoutResponse>> {
  return apiClient.post<ApiResponse<CheckoutResponse>>(
    "/api/mitra/cart/checkout",
    {},
    { signal },
  );
}

// -------------------------------------------------------------
// Order Cart & Checkout API Endpoints (No /v1)
// -------------------------------------------------------------

import type {
  AddToCartOrderRequest,
  AddToCartOrderResponse,
  CartOrder,
  CartOrderListResponse,
  CheckoutOrderRequest,
  CheckoutOrderResponse,
  OrderPaymentStatusResponse,
} from "@/features/mitra/cart/types/mitra.cart.order.type";

export async function fetchOrderPaymentStatusApi(
  orderId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<OrderPaymentStatusResponse>> {
  return apiClient.get<ApiResponse<OrderPaymentStatusResponse>>(
    `/api/mitra/cart/orders/${orderId}/status`,
    { signal },
  );
}

export async function postCreateCartOrderApi(
  payload: AddToCartOrderRequest,
  signal?: AbortSignal,
): Promise<ApiResponse<AddToCartOrderResponse>> {
  return apiClient.post<ApiResponse<AddToCartOrderResponse>>(
    "/api/mitra/cart/orders",
    payload,
    { signal },
  );
}

export async function fetchCartOrdersApi(
  params?: { status?: string },
  signal?: AbortSignal,
): Promise<ApiResponse<CartOrderListResponse>> {
  return apiClient.get<ApiResponse<CartOrderListResponse>>(
    "/api/mitra/cart/orders",
    {
      params,
      signal,
    },
  );
}

export async function fetchExpiredCartOrdersApi(
  signal?: AbortSignal,
): Promise<ApiResponse<CartOrderListResponse>> {
  return apiClient.get<ApiResponse<CartOrderListResponse>>(
    "/api/mitra/cart/orders",
    {
      params: { status: "expired" },
      signal,
    },
  );
}

export async function postReorderCartOrderApi(
  orderId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<AddToCartOrderResponse>> {
  return apiClient.post<ApiResponse<AddToCartOrderResponse>>(
    `/api/mitra/cart/orders/${orderId}/reorder`,
    {},
    { signal },
  );
}

export async function fetchCartOrderDetailApi(
  orderId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<CartOrder | null>> {
  return apiClient.get<ApiResponse<CartOrder | null>>(
    `/api/mitra/cart/orders/${orderId}`,
    { signal },
  );
}

export async function fetchActiveCartOrderApi(
  signal?: AbortSignal,
): Promise<ApiResponse<CartOrder | null>> {
  return apiClient.get<ApiResponse<CartOrder | null>>(
    "/api/mitra/cart/orders/active",
    { signal },
  );
}

export async function deleteCartOrderApi(
  orderId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> {
  return apiClient.delete<ApiResponse<void>>(
    `/api/mitra/cart/orders/${orderId}`,
    {
      signal,
    },
  );
}

export async function postCheckoutOrderApi(
  orderId: string,
  payload?: CheckoutOrderRequest,
  signal?: AbortSignal,
): Promise<ApiResponse<CheckoutOrderResponse>> {
  return apiClient.post<ApiResponse<CheckoutOrderResponse>>(
    `/api/mitra/cart/orders/${orderId}/checkout`,
    payload ?? {},
    { signal },
  );
}

// Backwards-compatible aliases
export const postCreateCartBatchApi = postCreateCartOrderApi;
export const fetchCartBatchesApi = fetchCartOrdersApi;
export const fetchExpiredCartBatchesApi = fetchExpiredCartOrdersApi;
export const postReorderCartBatchApi = postReorderCartOrderApi;
export const fetchCartBatchDetailApi = fetchCartOrderDetailApi;
export const fetchActiveCartBatchApi = fetchActiveCartOrderApi;
export const deleteCartBatchApi = deleteCartOrderApi;
export const postCheckoutBatchApi = postCheckoutOrderApi;
