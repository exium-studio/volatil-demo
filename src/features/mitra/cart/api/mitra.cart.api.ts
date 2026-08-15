// src/features/mitra/cart/api/mitra.cart.api.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { fetchWfsCatalog } from "@/features/mitra/data-request/api/mitra.data-request-wfs.api";
import type { FetchWfsCatalogResult } from "@/features/mitra/data-request/api/mitra.data-request-wfs.api";
import type { CheckoutResponse } from "@/features/mitra/cart/types/cart.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import type GeoJSON from "geojson";

const DEFAULT_WFS_TYPE_NAME = "igt:CONTOH_BIDANG_TANAH";
const DEFAULT_WFS_URL = "https://igtpr.atrbpn.go.id/geoserver/igt/ows";
const WFS_ID_FIELD = "gid";

export type { FetchWfsCatalogResult };

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

  if (ids.length === 0) {
    return {
      features: [],
      totalFeatures: 0,
      bidangCount: 0,
      kawasanCount: 0,
      pageIds: [],
      total: 0,
      totalPages: 0,
    };
  }

  // Build CQL: "gid" IN ('id1','id2',...) or "id" IN (...)
  const idList = ids.map((id) => `'${id}'`).join(",");
  const baseFilter = `"${WFS_ID_FIELD}" IN (${idList})`;
  const mergedCqlFilter =
    [baseFilter, cqlFilter].filter(Boolean).join(" AND ") || undefined;

  const result = await fetchWfsCatalog({
    typeName,
    wfsUrl,
    page,
    pageSize,
    cqlFilter: mergedCqlFilter,
    search,
    signal,
  });

  const total = result.totalFeatures;

  return {
    ...result,
    pageIds: [],
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

/** Add specific feature IDs to cart via API. */
export async function postAddSelectedToCartApi(
  featureIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  await apiClient.post("/mitra/cart/add-selected", { featureIds }, { signal });
}

/** Add ALL features matching the given WFS params to cart via WFS. */
export async function fetchAllFeatureIdsFromWfsApi(params: {
  typeName?: string;
  wfsUrl?: string;
  cqlFilter?: string;
  signal?: AbortSignal;
}): Promise<string[]> {
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
  await apiClient.post("/mitra/cart/remove", { itemIds }, { signal });
}

export async function postClearCartApi(signal?: AbortSignal): Promise<void> {
  await apiClient.post("/mitra/cart/clear", {}, { signal });
}

export async function postCheckoutApi(
  signal?: AbortSignal,
): Promise<ApiResponse<CheckoutResponse>> {
  return apiClient.post<ApiResponse<CheckoutResponse>>(
    "/mitra/cart/checkout",
    {},
    { signal },
  );
}
