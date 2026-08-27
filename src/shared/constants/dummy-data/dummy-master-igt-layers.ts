// src/shared/constants/dummy-data/dummy-master-igt-layers.ts

import type {
  MasterIgtLayerItem,
  MasterIgtLayersResponse,
} from "@/features/internal/data-management/types/data-management.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";

export const DUMMY_MASTER_IGT_LAYERS: MasterIgtLayerItem[] = [
  {
    id: "testing_workspace:TEST_RTRW_BADUNG",
    title: "RTRW Badung",
    description: "Peta Rencana Tata Ruang Wilayah Kabupaten Badung (Pola Ruang & Struktur Ruang)",
    spatialBasis: "kawasan",
    bbox: [115.083839, -8.850039, 115.251389, -8.239441],
    isActive: true,
    zIndex: 1,
    wfs: {
      wfsTypeName: "testing_workspace:TEST_RTRW_BADUNG",
      wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows",
    },
    wms: {
      layers: "testing_workspace:TEST_RTRW_BADUNG",
      wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
    },
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-02-15T10:30:00Z",
  },
  {
    id: "testing_workspace:TEST_ZNT_BADUNG",
    title: "ZNT Badung",
    description: "Zona Nilai Tanah Wilayah Kabupaten Badung untuk penilaian nilai pasar wajar",
    spatialBasis: "kawasan",
    bbox: [115.083839, -8.849308, 115.251534, -8.239852],
    isActive: true,
    zIndex: 2,
    wfs: {
      wfsTypeName: "testing_workspace:TEST_ZNT_BADUNG",
      wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows",
    },
    wms: {
      layers: "testing_workspace:TEST_ZNT_BADUNG",
      wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
    },
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
    wfs: {
      wfsTypeName: "testing_workspace:TEST_BIDANG_TANAH",
      wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows",
    },
    wms: {
      layers: "testing_workspace:TEST_BIDANG_TANAH",
      wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
    },
    createdAt: "2025-01-05T07:30:00Z",
    updatedAt: "2025-02-20T11:00:00Z",
  },
  {
    id: "testing_workspace:TEST_RDTR_KUTA",
    title: "RDTR Kawasan Kuta",
    description: "Rencana Detail Tata Ruang dan Zonasi Wilayah Perkotaan Kuta Selatan & Kuta Utara",
    spatialBasis: "kawasan",
    bbox: [115.120000, -8.780000, 115.210000, -8.690000],
    isActive: false,
    wfs: {
      wfsTypeName: "testing_workspace:TEST_RDTR_KUTA",
      wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows",
    },
    wms: {
      layers: "testing_workspace:TEST_RDTR_KUTA",
      wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
    },
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-24T16:45:00Z",
  },
];

export const DUMMY_MASTER_IGT_LAYERS_RESPONSE: MasterIgtLayersResponse = {
  items: DUMMY_MASTER_IGT_LAYERS,
  pagination: createPaginationMeta(1, 10, DUMMY_MASTER_IGT_LAYERS.length),
};
