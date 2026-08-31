// src/features/mitra/data-request/api/mitra.data-request-igt-layers.api.ts

import type {
  IgtLayerItem,
  IgtLayersResponse,
} from "@/design-system/components/map/types/map.type";
import { DUMMY_IGT_LAYERS } from "@/shared/constants/dummy-data/dummy-igt-layers";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";
import { getUserSession } from "@/shared/utils/user/user-session.utils";

const EMPTY_LAYERS_RESPONSE: IgtLayersResponse = {
  items: [],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeIgtLayer = (raw: any): IgtLayerItem => {
  const id = String(raw.id ?? raw._id ?? raw.typeName ?? raw.type_name ?? "");
  const typeName = String(
    raw.typeName ?? raw.type_name ?? raw.wfsTypeName ?? id,
  );
  const wmsUrl = String(raw.wms?.wmsUrl ?? raw.wmsUrl ?? raw.wms_url ?? "");
  const wfsUrl = String(raw.wfs?.wfsUrl ?? raw.wfsUrl ?? raw.wfs_url ?? "");
  const spatialBasis = raw.spatialBasis ?? raw.spatial_basis ?? "bidang";

  return {
    id,
    title: raw.title ?? raw.name ?? id,
    spatialBasis,
    bbox: Array.isArray(raw.bbox) ? raw.bbox : undefined,
    visible: raw.visible ?? raw.isActive ?? true,
    zIndex: raw.zIndex != null ? Number(raw.zIndex) : 1,
    wms: {
      layers: raw.wms?.layers ?? typeName ?? id,
      wmsUrl,
      format: raw.wms?.format ?? "image/png",
      transparent: raw.wms?.transparent ?? true,
      tileSize: raw.wms?.tileSize ?? 512,
      styles: raw.wms?.styles ?? "",
      version: raw.wms?.version ?? "1.1.1",
      srs: raw.wms?.srs ?? "EPSG:3857",
    },
    wfs: {
      wfsTypeName: raw.wfs?.wfsTypeName ?? typeName ?? id,
      wfsUrl,
      type:
        raw.wfs?.type ?? (spatialBasis === "kawasan" ? "wfs-line" : "wfs-fill"),
      version: raw.wfs?.version ?? "2.0.0",
      srsName: raw.wfs?.srsName ?? "EPSG:4326",
    },
  };
};

export async function getIgtLayers(
  signal?: AbortSignal,
): Promise<IgtLayersResponse> {
  const user = getUserSession();
  const isInternal = user?.role === "internal";
  const endpoint = isInternal
    ? "/api/internal/igt-layers"
    : "/api/mitra/igt-layers";

  try {
    const response = await apiClient.get<
      ApiResponse<IgtLayersResponse> | IgtLayersResponse
    >(endpoint, {
      signal,
    });

    let rawList: unknown[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyResp = response as any;

    if (Array.isArray(anyResp)) {
      rawList = anyResp;
    } else if (anyResp && typeof anyResp === "object") {
      if (Array.isArray(anyResp.items)) {
        rawList = anyResp.items;
      } else if (Array.isArray(anyResp.data?.items)) {
        rawList = anyResp.data.items;
      } else if (Array.isArray(anyResp.layers)) {
        rawList = anyResp.layers;
      } else if (Array.isArray(anyResp.data)) {
        rawList = anyResp.data;
      }
    }

    if (rawList.length > 0) {
      const items = rawList.map(normalizeIgtLayer);
      return {
        items,
        pagination: anyResp.pagination ?? anyResp.data?.pagination,
      };
    }

    return isDummyDataEnabled() ? DUMMY_IGT_LAYERS : EMPTY_LAYERS_RESPONSE;
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn(
        "Failed to fetch IGT layers from API, fallback to dummy data",
        error,
      );
      return DUMMY_IGT_LAYERS;
    }
    throw error;
  }
}
