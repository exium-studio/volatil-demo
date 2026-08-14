// src/design-system/components/map/services/map-endpoints.api.ts

import type { MapServerEndpoint } from "@/design-system/components/map/types/map.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

const DUMMY_MAP_SERVER_ENDPOINTS: MapServerEndpoint[] = [
  {
    id: "igt-geoserver",
    name: "GeoServer IGT Workspace",
    wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/ows",
    wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/wms",
    wfsVersion: "1.0.0",
    wmsVersion: "1.1.1",
    outputFormat: "application/json",
    srsName: "EPSG:4326",
  },
  {
    id: "testing-geoserver",
    name: "GeoServer Testing Workspace",
    wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/ows",
    wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/wms",
    wfsVersion: "1.0.0",
    wmsVersion: "1.1.1",
    outputFormat: "application/json",
    srsName: "EPSG:4326",
  },
];

export async function getMapServerEndpoints(
  signal?: AbortSignal,
): Promise<MapServerEndpoint[]> {
  try {
    const response = await apiClient.get<ApiResponse<MapServerEndpoint[]>>(
      "/map/endpoints",
      {
        signal,
      },
    );
    return response.data ?? DUMMY_MAP_SERVER_ENDPOINTS;
  } catch (error) {
    console.warn(
      "getMapServerEndpoints API error, falling back to dummy data:",
      error,
    );
    return DUMMY_MAP_SERVER_ENDPOINTS;
  }
}
