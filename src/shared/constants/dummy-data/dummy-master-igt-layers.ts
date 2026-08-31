// src/shared/constants/dummy-data/dummy-master-igt-layers.ts

import type {
  GeoServerWorkspaceLayersResponse,
  GeoServerWorkspacesResponse,
  MasterIgtLayerItem,
  MasterIgtLayersResponse,
} from "@/features/internal/data-management/types/data-management.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";

export const DUMMY_MASTER_IGT_LAYERS: MasterIgtLayerItem[] = [
  {
    id: "testing_workspace:TEST_RTRW_BADUNG",
    title: "RTRW Badung",
    description:
      "Peta Rencana Tata Ruang Wilayah Kabupaten Badung (Pola Ruang & Struktur Ruang)",
    spatialBasis: "kawasan",
    bbox: [115.083839, -8.850039, 115.251389, -8.239441],
    isActive: true,
    zIndex: 1,
    geoserverId: "gs_prod_01",
    geoserver: {
      id: "gs_prod_01",
      name: "GeoServer Utama ATR/BPN",
      baseUrl: "https://geoserver.atrbpn.go.id/geoserver",
    },
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_RTRW_BADUNG",
    wfsUrl: "https://geoserver.atrbpn.go.id/geoserver/testing_workspace/ows",
    wmsUrl: "https://geoserver.atrbpn.go.id/geoserver/testing_workspace/wms",
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-02-15T10:30:00Z",
  },
  {
    id: "testing_workspace:TEST_ZNT_BADUNG",
    title: "ZNT Badung",
    description:
      "Zona Nilai Tanah Wilayah Kabupaten Badung untuk penilaian nilai pasar wajar",
    spatialBasis: "kawasan",
    bbox: [115.083839, -8.849308, 115.251534, -8.239852],
    isActive: true,
    zIndex: 2,
    geoserverId: "gs_prod_01",
    geoserver: {
      id: "gs_prod_01",
      name: "GeoServer Utama ATR/BPN",
      baseUrl: "https://geoserver.atrbpn.go.id/geoserver",
    },
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_ZNT_BADUNG",
    wfsUrl: "https://geoserver.atrbpn.go.id/geoserver/testing_workspace/ows",
    wmsUrl: "https://geoserver.atrbpn.go.id/geoserver/testing_workspace/wms",
    createdAt: "2025-01-12T09:00:00Z",
    updatedAt: "2025-02-18T14:20:00Z",
  },
  {
    id: "testing_workspace:TEST_BIDANG_TANAH",
    title: "Bidang Tanah",
    description: "Peta Pendaftaran Tanah Kadastral Bidang Persil Terdaftar",
    spatialBasis: "bidang",
    bbox: [115.134102, -8.685009, 115.183136, -8.622203],
    isActive: true,
    zIndex: 3,
    geoserverId: "gs_prod_01",
    geoserver: {
      id: "gs_prod_01",
      name: "GeoServer Utama ATR/BPN",
      baseUrl: "https://geoserver.atrbpn.go.id/geoserver",
    },
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_BIDANG_TANAH",
    wfsUrl: "https://geoserver.atrbpn.go.id/geoserver/testing_workspace/ows",
    wmsUrl: "https://geoserver.atrbpn.go.id/geoserver/testing_workspace/wms",
    createdAt: "2025-01-05T07:30:00Z",
    updatedAt: "2025-02-20T11:00:00Z",
  },
];

export const DUMMY_MASTER_IGT_LAYERS_RESPONSE: MasterIgtLayersResponse = {
  items: DUMMY_MASTER_IGT_LAYERS,
  pagination: createPaginationMeta(1, 10, DUMMY_MASTER_IGT_LAYERS.length),
};

export const DUMMY_GEOSERVER_WORKSPACES: Record<string, GeoServerWorkspacesResponse> = {
  gs_prod_01: {
    workspaces: ["testing_workspace", "atr_kawasan", "tataruang_nasional"],
  },
  gs_interop_02: {
    workspaces: ["volatil_provisioned", "mitra_batch_temp"],
  },
  gs_staging_03: {
    workspaces: ["uat_workspace", "staging_layers"],
  },
};

export const DUMMY_GEOSERVER_WORKSPACE_LAYERS: Record<
  string,
  GeoServerWorkspaceLayersResponse
> = {
  "gs_prod_01:testing_workspace": {
    layers: [
      {
        name: "LBS2024_BADUNG",
        title: "Lahan Baku Sawah (LBS) Badung 2024",
        typeName: "testing_workspace:LBS2024_BADUNG",
        abstract: "Peta Lahan Baku Sawah Kabupaten Badung",
        srs: "EPSG:3975",
        geometryType: "MultiPolygon",
        spatialBasis: "kawasan",
        bbox: [115.0838, -8.8500, 115.2513, -8.2394],
      },
      {
        name: "TEST_BIDANG_TANAH",
        title: "Bidang Tanah Persil",
        typeName: "testing_workspace:TEST_BIDANG_TANAH",
        abstract: "Peta Pendaftaran Tanah Kadastral Bidang Persil Terdaftar",
        srs: "EPSG:4326",
        geometryType: "Polygon",
        spatialBasis: "bidang",
        bbox: [115.134102, -8.685009, 115.183136, -8.622203],
      },
      {
        name: "TEST_RTRW_BADUNG",
        title: "RTRW Kabupaten Badung",
        typeName: "testing_workspace:TEST_RTRW_BADUNG",
        abstract: "Peta Rencana Tata Ruang Wilayah Kabupaten Badung",
        srs: "EPSG:4326",
        geometryType: "MultiPolygon",
        spatialBasis: "kawasan",
        bbox: [115.083839, -8.850039, 115.251389, -8.239441],
      },
      {
        name: "TEST_ZNT_BADUNG",
        title: "Zona Nilai Tanah Badung",
        typeName: "testing_workspace:TEST_ZNT_BADUNG",
        abstract: "Zona Nilai Tanah Wilayah Kabupaten Badung",
        srs: "EPSG:4326",
        geometryType: "MultiPolygon",
        spatialBasis: "kawasan",
        bbox: [115.083839, -8.849308, 115.251534, -8.239852],
      },
    ],
  },
  "gs_prod_01:atr_kawasan": {
    layers: [
      {
        name: "KAWASAN_HUTAN_BALI",
        title: "Kawasan Hutan Lindung Bali",
        typeName: "atr_kawasan:KAWASAN_HUTAN_BALI",
        abstract: "Batas kawasan hutan lindung provinsi Bali",
        srs: "EPSG:4326",
        geometryType: "MultiPolygon",
        spatialBasis: "kawasan",
        bbox: [114.431, -8.852, 115.712, -8.061],
      },
    ],
  },
  "gs_staging_03:uat_workspace": {
    layers: [
      {
        name: "UAT_LBS_SAWAH",
        title: "Lahan Baku Sawah UAT",
        typeName: "uat_workspace:UAT_LBS_SAWAH",
        abstract: "Peta LBS Sawah untuk uji coba",
        srs: "EPSG:4326",
        geometryType: "MultiPolygon",
        spatialBasis: "kawasan",
        bbox: [115.1, -8.8, 115.3, -8.3],
      },
    ],
  },
};

export const getGeoServerWorkspaceLayersFallback = (
  geoserverId: string,
  workspaceName: string,
): GeoServerWorkspaceLayersResponse => {
  const exactKey = `${geoserverId}:${workspaceName}`;
  if (DUMMY_GEOSERVER_WORKSPACE_LAYERS[exactKey]) {
    return DUMMY_GEOSERVER_WORKSPACE_LAYERS[exactKey];
  }
  const matchByWorkspace = Object.keys(DUMMY_GEOSERVER_WORKSPACE_LAYERS).find(
    (key) => key.endsWith(`:${workspaceName}`),
  );
  if (matchByWorkspace) {
    return DUMMY_GEOSERVER_WORKSPACE_LAYERS[matchByWorkspace];
  }
  if (workspaceName === "testing_workspace") {
    return (
      DUMMY_GEOSERVER_WORKSPACE_LAYERS["gs_prod_01:testing_workspace"] ?? {
        layers: [],
      }
    );
  }
  return {
    layers: [
      {
        name: "LBS2024_BADUNG",
        title: "Lahan Baku Sawah (LBS) Badung 2024",
        typeName: `${workspaceName}:LBS2024_BADUNG`,
        srs: "EPSG:3975",
        geometryType: "MultiPolygon",
        spatialBasis: "kawasan",
        bbox: [115.08, -8.85, 115.25, -8.23],
      },
      {
        name: "TEST_BIDANG_TANAH",
        title: "Bidang Tanah Persil",
        typeName: `${workspaceName}:TEST_BIDANG_TANAH`,
        srs: "EPSG:4326",
        geometryType: "Polygon",
        spatialBasis: "bidang",
        bbox: [115.134, -8.685, 115.183, -8.622],
      },
      {
        name: "TEST_RTRW_BADUNG",
        title: "RTRW Kabupaten Badung",
        typeName: `${workspaceName}:TEST_RTRW_BADUNG`,
        srs: "EPSG:4326",
        geometryType: "MultiPolygon",
        spatialBasis: "kawasan",
        bbox: [115.083, -8.85, 115.251, -8.239],
      },
      {
        name: "TEST_ZNT_BADUNG",
        title: "Zona Nilai Tanah Badung",
        typeName: `${workspaceName}:TEST_ZNT_BADUNG`,
        srs: "EPSG:4326",
        geometryType: "MultiPolygon",
        spatialBasis: "kawasan",
        bbox: [115.083, -8.849, 115.251, -8.239],
      },
    ],
  };
};
