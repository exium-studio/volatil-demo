// src/shared/libs/tanstack-query/query.keys.ts

import type GeoJSON from "geojson";

export const queryKeys = {
  mitra: {
    home: {
      all: ["mitra", "home"] as const,
      data: (period?: string) =>
        [...queryKeys.mitra.home.all, "data", period] as const,
    },
    cart: {
      all: ["mitra", "cart"] as const,
      summary: () => [...queryKeys.mitra.cart.all, "summary"] as const,
      items: (params: {
        page: number;
        pageSize: number;
        search?: string;
      }) => [...queryKeys.mitra.cart.all, "items", params] as const,
    },
    dataRequest: {
      all: ["mitra", "data-request"] as const,
      catalog: (params?: Record<string, unknown>) =>
        [...queryKeys.mitra.dataRequest.all, "catalog", params] as const,
      byAoi: (geometry: GeoJSON.Polygon) =>
        [...queryKeys.mitra.dataRequest.all, "by-aoi", geometry] as const,
      uploadedAoi: (fileName: string) =>
        [...queryKeys.mitra.dataRequest.all, "uploaded-aoi", fileName] as const,
      geometryById: (id: string) =>
        [...queryKeys.mitra.dataRequest.all, "geometry", id] as const,
    },
  },
  internal: {
    home: {
      all: ["internal", "home"] as const,
      data: (period?: string) =>
        [...queryKeys.internal.home.all, "data", period] as const,
    },
    userManagement: {
      all: ["internal", "user-management"] as const,
      data: (params?: Record<string, unknown>) =>
        [...queryKeys.internal.userManagement.all, "data", params] as const,
    },
  },
};
