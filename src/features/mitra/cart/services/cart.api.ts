// src/features/mitra/cart/services/cart.api.ts

import {
  getLocalCartIds,
  addIdsToCart,
  removeIdsFromCart,
  clearCartIds,
  calculateCartSummary,
  getPaginatedIds,
} from "@/features/mitra/cart/services/cart.service";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { fetchWfsCatalog } from "@/features/mitra/data-request/services/fetch-wfs-catalog";
import type {
  CartSummaryResponse,
  CheckoutResponse,
} from "@/features/mitra/cart/types/cart.type";
import type { FetchWfsCatalogResult } from "@/features/mitra/data-request/services/fetch-wfs-catalog";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import type GeoJSON from "geojson";

const DEFAULT_WFS_TYPE_NAME = "igt:CONTOH_BIDANG_TANAH";
const DEFAULT_WFS_URL = "https://igtpr.atrbpn.go.id/geoserver/igt/ows";
const WFS_ID_FIELD = "gid";

// -------------------------------------------------------------------------------------
// GET

/** Returns paginated WFS features for IDs currently stored in cart localStorage. */
export async function getCartWfsPage(params: {
  page: number;
  pageSize: number;
  typeName?: string;
  wfsUrl?: string;
  signal?: AbortSignal;
}): Promise<
  FetchWfsCatalogResult & {
    pageIds: string[];
    total: number;
    totalPages: number;
  }
> {
  const {
    page,
    pageSize,
    typeName = DEFAULT_WFS_TYPE_NAME,
    wfsUrl = DEFAULT_WFS_URL,
    signal,
  } = params;
  const ids = getLocalCartIds();

  const { pageIds, total, totalPages } = getPaginatedIds(ids, page, pageSize);

  if (pageIds.length === 0) {
    return {
      features: [],
      totalFeatures: 0,
      bidangCount: 0,
      kawasanCount: 0,
      pageIds,
      total,
      totalPages,
    };
  }

  // Build CQL: "gid" IN ('id1','id2',...) or "id" IN (...)
  const idList = pageIds.map((id) => `'${id}'`).join(",");
  const cqlFilter = `"${WFS_ID_FIELD}" IN (${idList})`;

  const result = await fetchWfsCatalog({
    typeName,
    wfsUrl,
    page: 1,
    pageSize,
    cqlFilter,
    signal,
  });

  return {
    ...result,
    // Override totalFeatures to reflect the full cart size, not just this page
    totalFeatures: total,
    pageIds,
    total,
    totalPages,
  };
}

/** Returns the cart summary calculated from stored IDs. No API call needed. */
export function getCartSummaryLocal(): CartSummaryResponse {
  return calculateCartSummary(getLocalCartIds());
}

// -------------------------------------------------------------------------------------
// MUTATIONS — write-first to localStorage, fire-and-forget to API

/** Add specific feature IDs to cart. */
export async function addSelectedToCart(
  featureIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  addIdsToCart(featureIds);
  try {
    await apiClient.post(
      "/mitra/cart/add-selected",
      { featureIds },
      { signal },
    );
  } catch {
    // No backend yet — localStorage already updated above
  }
}

/**
 * Add ALL features matching the given WFS params to cart.
 * Fetches all feature IDs from WFS (no pagination limit) and stores them.
 */
export async function addAllToCartFromWfs(params: {
  typeName?: string;
  wfsUrl?: string;
  cqlFilter?: string;
  signal?: AbortSignal;
}): Promise<number> {
  const {
    typeName = DEFAULT_WFS_TYPE_NAME,
    wfsUrl = DEFAULT_WFS_URL,
    cqlFilter,
    signal,
  } = params;

  const result = await fetchWfs({
    typeName,
    wfsUrl,
    version: "2.0.0",
    cqlFilter,
    resultType: "results",
    signal,
  });

  const features: GeoJSON.Feature[] = result.features ?? [];
  const ids = features
    .map((f) => {
      const idVal = f.properties?.id ?? f.properties?.[WFS_ID_FIELD] ?? f.id;
      return idVal != null ? String(idVal) : null;
    })
    .filter((id): id is string => id !== null);

  addIdsToCart(ids);
  return ids.length;
}

export async function removeFromCart(
  itemIds: string[],
  _signal?: AbortSignal,
): Promise<void> {
  removeIdsFromCart(itemIds);
  try {
    await apiClient.post("/mitra/cart/remove", { itemIds });
  } catch {
    // No backend yet
  }
}

export async function clearCart(_signal?: AbortSignal): Promise<void> {
  clearCartIds();
  try {
    await apiClient.post("/mitra/cart/clear", {});
  } catch {
    // No backend yet
  }
}

export async function checkout(
  _signal?: AbortSignal,
): Promise<CheckoutResponse> {
  try {
    const response = await apiClient.post<ApiResponse<CheckoutResponse>>(
      "/mitra/cart/checkout",
      {},
    );
    return (
      response.data ?? {
        billingCode: `BILL-${Math.floor(100000 + Math.random() * 900000)}`,
      }
    );
  } catch {
    return {
      billingCode: `BILL-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  }
}
