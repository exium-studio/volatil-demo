// src/features/mitra/data-request/api/mitra.data-request-igt-layers.api.ts

import type {
  IgtLayerItem,
  IgtLayersResponse,
} from "@/design-system/components/map/types/map.type";
import type { IgtLayersApiResponse } from "@/features/mitra/data-request/types/mitra.data-request.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { normalizeApiUrl } from "@/shared/utils/env/env.utils";
import { getUserSession } from "@/shared/utils/user/user-session.utils";

export async function getIgtLayers(
  signal?: AbortSignal,
): Promise<IgtLayersResponse> {
  const user = getUserSession();
  if (!user?.id) {
    throw new Error("Sesi pengguna tidak valid. Silakan login kembali.");
  }

  const isInternal = user.role === "internal";
  const endpoint = isInternal
    ? "/api/internal/igt-layers"
    : "/api/mitra/igt-layers";

  const response = await apiClient.get<IgtLayersApiResponse>(endpoint, {
    signal,
  });

  const resolvedData = response.data ?? response;
  const rawItems = resolvedData.items;

  if (Array.isArray(rawItems)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: IgtLayerItem[] = rawItems.map((raw: any) => ({
      id: raw.id,
      title: raw.title,
      spatialBasis: raw.spatialBasis,
      bbox: raw.bbox as [number, number, number, number],
      visible: raw.visible ?? raw.isActive ?? true,
      defaultVisible: Boolean(
        raw.defaultVisible ?? raw.default_visible ?? false,
      ),
      zIndex: raw.zIndex ?? 1,
      wms: raw.wms
        ? {
            ...raw.wms,
            wmsUrl: normalizeApiUrl(raw.wms.wmsUrl ?? raw.wmsUrl),
          }
        : {
            layers: raw.typeName || raw.id,
            wmsUrl: normalizeApiUrl(raw.wmsUrl),
            format: raw.format ?? "image/png",
            transparent: raw.transparent ?? true,
            tileSize: raw.tileSize ?? 512,
            version: raw.version ?? "1.1.1",
            srs: raw.srs ?? "EPSG:3857",
            styles: raw.styles ?? "",
          },
      wfs: raw.wfs
        ? {
            ...raw.wfs,
            wfsUrl: normalizeApiUrl(raw.wfs.wfsUrl ?? raw.wfsUrl),
          }
        : {
            wfsTypeName: raw.typeName || raw.id,
            wfsUrl: normalizeApiUrl(raw.wfsUrl),
            type: raw.spatialBasis === "kawasan" ? "wfs-line" : "wfs-fill",
            version: "2.0.0",
            srsName: "EPSG:4326",
          },
    }));

    const rawPag = resolvedData.pagination;
    const pagination = rawPag
      ? {
          totalItems: rawPag.totalItems,
          totalPages: rawPag.totalPages,
          currentPage: rawPag.currentPage,
          itemsPerPage: rawPag.itemsPerPage,
          hasNextPage: rawPag.currentPage < rawPag.totalPages,
          hasPrevPage: rawPag.currentPage > 1,
        }
      : createPaginationMeta(1, items.length || 10, items.length);

    return {
      items,
      pagination,
    };
  }

  throw new Error(
    response.message || "Gagal memuat data layer IGT dari server.",
  );
}
