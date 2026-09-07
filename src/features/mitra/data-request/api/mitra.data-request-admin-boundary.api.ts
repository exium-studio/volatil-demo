// src/features/mitra/data-request/api/mitra.data-request-admin-boundary.api.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { ADMIN_BOUNDARY_WFS_CONFIG } from "@/features/mitra/data-request/constants/igt.config";
import type { FetchAdminBoundaryParams } from "@/features/mitra/data-request/types/mitra.data-request-filter.type";
import { cleanAdministrativeValue } from "@/features/mitra/data-request/utils/build-igt-cql-filter";
import { unionGeoJsonPolygons } from "@/features/mitra/data-request/utils/union-geojson-polygons";
import type GeoJSON from "geojson";

/**
 * Queries GeoServer WFS via proxy to retrieve the GeoJSON Polygon boundary
 * of the deepest administrative region selected by the user.
 *
 * Example:
 * - level: "kelurahan", name: "TEMBALANG"
 *   -> CQL_FILTER: "WADMKD ILIKE '%TEMBALANG%'" on BATAS_DESA_KELURAHAN
 * - level: "provinsi", name: "BALI"
 *   -> CQL_FILTER: "WADMPR ILIKE '%BALI%'" on BATAS_PROVINSI
 */
export async function fetchAdminBoundaryPolygon(
  params: FetchAdminBoundaryParams,
): Promise<GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null> {
  const { level, name, signal } = params;
  const config = ADMIN_BOUNDARY_WFS_CONFIG[level];

  if (!config || !name || name.trim() === "") {
    return null;
  }

  const cleanName = cleanAdministrativeValue(name);
  if (!cleanName) return null;

  const cqlFilter = `${config.attributeKey} ILIKE '%${cleanName}%'`;

  try {
    const result = await fetchWfs({
      typeName: config.typeName,
      wfsUrl: config.wfsUrl,
      version: "2.0.0",
      srsName: "EPSG:4326",
      cqlFilter,
      signal,
    });

    const features = result.features ?? [];
    if (features.length === 0) {
      return null;
    }

    if (features.length === 1) {
      const single = features[0];
      if (
        single.geometry &&
        (single.geometry.type === "Polygon" ||
          single.geometry.type === "MultiPolygon")
      ) {
        return single as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
      }
    }

    // If multiple features returned (e.g. multi-part boundary / islands), union them
    return unionGeoJsonPolygons({
      type: "FeatureCollection",
      features,
    });
  } catch (error) {
    if (
      signal?.aborted ||
      (error instanceof DOMException && error.name === "AbortError") ||
      (error instanceof Error && error.name === "AbortError")
    ) {
      throw error;
    }
    console.warn(
      `Failed to fetch admin boundary polygon for ${level} "${name}":`,
      error,
    );
    return null;
  }
}
