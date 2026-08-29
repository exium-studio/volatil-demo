// src/shared/libs/tanstack-query/query.keys.ts

import type GeoJSON from "geojson";

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  mitra: {
    home: {
      all: ["mitra", "home"] as const,
      data: (period?: string) =>
        [...queryKeys.mitra.home.all, "data", period] as const,
    },
    cart: {
      all: ["mitra", "cart"] as const,
      summary: () => [...queryKeys.mitra.cart.all, "summary"] as const,
      items: (params: { page: number; pageSize: number; search?: string }) =>
        [...queryKeys.mitra.cart.all, "items", params] as const,
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
    helpCenter: {
      all: ["mitra", "help-center"] as const,
      tickets: (params?: Record<string, unknown>) =>
        [...queryKeys.mitra.helpCenter.all, "tickets", params] as const,
      statistics: (scope?: string) =>
        [...queryKeys.mitra.helpCenter.all, "statistics", scope] as const,
      detail: (id: string | number) =>
        [...queryKeys.mitra.helpCenter.all, "detail", id] as const,
      transactions: () =>
        [...queryKeys.mitra.helpCenter.all, "transactions"] as const,
    },
    notification: {
      all: ["mitra", "notification"] as const,
      inbox: () => [...queryKeys.mitra.notification.all, "inbox"] as const,
      inboxList: (params?: Record<string, unknown>) =>
        [...queryKeys.mitra.notification.all, "inbox", "list", params] as const,
    },
  },
  internal: {
    home: {
      all: ["internal", "home"] as const,
      spatialBasis: () =>
        [...queryKeys.internal.home.all, "spatial-basis"] as const,
      publishStatus: () =>
        [...queryKeys.internal.home.all, "publish-status"] as const,
      mitraRegistration: () =>
        [...queryKeys.internal.home.all, "mitra-registration"] as const,
      trends: (period?: string) =>
        [...queryKeys.internal.home.all, "trends", period] as const,
      leaderboardMitra: () =>
        [...queryKeys.internal.home.all, "leaderboard", "mitra"] as const,
      leaderboardLayers: () =>
        [...queryKeys.internal.home.all, "leaderboard", "layers"] as const,
    },
    userManagement: {
      all: ["internal", "user-management"] as const,
      data: (params?: Record<string, unknown>) =>
        [...queryKeys.internal.userManagement.all, "data", params] as const,
      statistics: () =>
        [...queryKeys.internal.userManagement.all, "statistics"] as const,
      detail: (id: string | number) =>
        [...queryKeys.internal.userManagement.all, "detail", id] as const,
    },
    pricing: {
      all: ["internal", "pricing"] as const,
      list: (params?: Record<string, unknown>) =>
        [...queryKeys.internal.pricing.all, "list", params] as const,
    },
    dataManagement: {
      all: ["internal", "data-management"] as const,
      layers: (params?: Record<string, unknown>) =>
        [...queryKeys.internal.dataManagement.all, "layers", params] as const,
      workspaces: (geoserverId: string) =>
        [
          ...queryKeys.internal.dataManagement.all,
          "workspaces",
          geoserverId,
        ] as const,
      workspaceLayers: (geoserverId: string, workspaceName: string) =>
        [
          ...queryKeys.internal.dataManagement.all,
          "workspace-layers",
          geoserverId,
          workspaceName,
        ] as const,
    },
    masterGeoserver: {
      all: ["internal", "master-geoserver"] as const,
      list: (params?: Record<string, unknown>) =>
        [...queryKeys.internal.masterGeoserver.all, "list", params] as const,
      detail: (id: string) =>
        [...queryKeys.internal.masterGeoserver.all, "detail", id] as const,
    },
  },
  map: {
    all: ["map"] as const,
    layers: () => [...queryKeys.map.all, "layers"] as const,
  },
};
