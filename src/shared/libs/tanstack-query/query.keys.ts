// src/shared/libs/tanstack-query/query.keys.ts

import type GeoJSON from "geojson";

export const queryKeys = {
  dataRequest: {
    all: ["data-request"] as const,
    catalog: (params?: Record<string, unknown>) =>
      [...queryKeys.dataRequest.all, "catalog", params] as const,
    byAoi: (geometry: GeoJSON.Polygon) =>
      [...queryKeys.dataRequest.all, "by-aoi", geometry] as const,
    uploadedAoi: (fileName: string) =>
      [...queryKeys.dataRequest.all, "uploaded-aoi", fileName] as const,
    geometryById: (id: string) =>
      [...queryKeys.dataRequest.all, "geometry", id] as const,
  },
};
