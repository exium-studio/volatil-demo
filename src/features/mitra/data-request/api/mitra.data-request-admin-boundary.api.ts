import { apiClient } from "@/shared/libs/api-client/api-client";
import type { FetchAdminBoundaryParams } from "@/features/mitra/data-request/types/mitra.data-request-filter.type";
import type GeoJSON from "geojson";

/**
 * Queries backend administrative-catalog to securely resolve GeoJSON Polygon boundary.
 * Prevents client-side WFS scraping and ensures official server-side boundary resolution.
 */
export async function fetchAdminBoundaryPolygon(
  params: FetchAdminBoundaryParams,
): Promise<GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null> {
  const { level, name, provinsi, kabupaten, kecamatan, kelurahan, signal } =
    params;

  if (!level || !name || name.trim() === "") {
    return null;
  }

  try {
    const res = await apiClient.request<{
      success: boolean;
      data: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    }>("/api/administrative-catalog/resolve-boundary", {
      method: "POST",
      body: {
        level,
        name,
        provinsi,
        kabupaten,
        kecamatan,
        kelurahan,
      },
      signal,
    });

    if (res.success && res.data) {
      return res.data;
    }
    return null;
  } catch (err) {
    console.warn("[ADMIN_BOUNDARY:FETCH_ERROR]", err);
    return null;
  }
}

