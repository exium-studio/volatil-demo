// src/shared/constants/dummy-data/dummy-master-geoserver.ts

import type {
  MasterGeoserverItem,
  MasterGeoserverListResponse,
} from "@/features/internal/master-geoserver/types/master-geoserver.type";

export const DUMMY_MASTER_GEOSERVER_ITEMS: MasterGeoserverItem[] = [
  {
    id: "gs_prod_01",
    name: "GeoServer Produksi ATR/BPN",
    baseUrl: "https://geoserver.atrbpn.go.id/geoserver",
    username: "admin_spatial",
    password: "••••••••••••",
    description: "Server utama untuk publikasi layer spasial nasional dan IGT aktif.",
    deletedAt: null,
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-08-15T14:30:00.000Z",
  },
  {
    id: "gs_interop_02",
    name: "GeoServer Interop Provisioning",
    baseUrl: "https://interop-geo.atrbpn.go.id/geoserver",
    username: "interop_engine",
    password: "••••••••••••",
    description: "Server khusus auto-publishing layer PostGIS hasil provisioning batch transaksi Mitra.",
    deletedAt: null,
    createdAt: "2026-02-01T09:15:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "gs_staging_03",
    name: "GeoServer Staging & UAT",
    baseUrl: "https://staging-geoserver.atrbpn.go.id/geoserver",
    username: "uat_tester",
    password: "••••••••••••",
    description: "Server staging untuk uji coba layer baru sebelum rilis ke publik.",
    deletedAt: null,
    createdAt: "2026-03-05T11:20:00.000Z",
    updatedAt: "2026-07-28T16:45:00.000Z",
  },
];

export const DUMMY_MASTER_GEOSERVER_RESPONSE: MasterGeoserverListResponse = {
  items: DUMMY_MASTER_GEOSERVER_ITEMS,
  pagination: {
    totalItems: DUMMY_MASTER_GEOSERVER_ITEMS.length,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
};
