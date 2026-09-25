// src\features\mitra\data-request\api\mitra.data-request-admin-boundary.api.ts

import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { ADMIN_BOUNDARY_WFS_CONFIG } from "@/features/mitra/data-request/constants/igt.config";
import type { FetchAdminBoundaryParams } from "@/features/mitra/data-request/types/mitra.data-request-filter.type";
import { unionGeoJsonPolygons } from "@/features/mitra/data-request/utils/union-geojson-polygons";
import type GeoJSON from "geojson";

const escapeCql = (val: string): string => val.trim().replace(/'/g, "''");

/**
 * Queries GeoServer WFS via proxy to retrieve the GeoJSON Polygon boundary
 * of the deepest administrative region selected by the user.
 *
 * Uses cascading strict case-insensitive matching (`column ILIKE 'value'`) across all parent levels
 * to guarantee that exactly 1 administrative boundary feature (or a union of its multi-parts) is returned.
 *
 * Example:
 * - level: "kecamatan", name: "Kuta", provinsi: "Bali", kabupaten: "Badung"
 *   -> CQL_FILTER: "WADMPR ILIKE 'Bali' AND WADMKK ILIKE 'Badung' AND WADMKC ILIKE 'Kuta'" on BATAS_ADMIN_KECAMATAN
 */
export async function fetchAdminBoundaryPolygon(
  params: FetchAdminBoundaryParams,
): Promise<GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null> {
  const { level, name, provinsi, kabupaten, kecamatan, kelurahan, signal } =
    params;
  const config = ADMIN_BOUNDARY_WFS_CONFIG[level];

  if (!config || !name || name.trim() === "") {
    return null;
  }

  // Build cascading strict CQL filter matching all parent levels + target level
  const clauses: string[] = [];

  if (provinsi && provinsi.trim() !== "") {
    clauses.push(`WADMPR ILIKE '${escapeCql(provinsi)}'`);
  }

  if (
    (level === "kabupaten" || level === "kecamatan" || level === "kelurahan") &&
    kabupaten &&
    kabupaten.trim() !== ""
  ) {
    clauses.push(`WADMKK ILIKE '${escapeCql(kabupaten)}'`);
  }

  if (
    (level === "kecamatan" || level === "kelurahan") &&
    kecamatan &&
    kecamatan.trim() !== ""
  ) {
    clauses.push(`WADMKC ILIKE '${escapeCql(kecamatan)}'`);
  }

  if (level === "kelurahan" && kelurahan && kelurahan.trim() !== "") {
    clauses.push(`WADMKD ILIKE '${escapeCql(kelurahan)}'`);
  }

  // Fallback if no hierarchical clauses were added
  if (clauses.length === 0) {
    clauses.push(`${config.attributeKey} ILIKE '${escapeCql(name)}'`);
  }

  const cqlFilter = clauses.join(" AND ");

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

  // If multiple features returned (e.g. multi-part boundary / islands), union them into a single Feature
  return unionGeoJsonPolygons({
    type: "FeatureCollection",
    features,
  });
}

