// src/shared/constants/dummy-data/dummy-my-data.ts

import type { MyDataItem } from "@/features/mitra/my-data/types/my-data.type";

export const dummyMitraMyDataItems: MyDataItem[] = [
  {
    id: "testing_workspace:TEST_RTRW_BADUNG",
    title: "RTRW Badung",
    spatialBasis: "kawasan",
    wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows?service=WFS&request=GetCapabilities",
    wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms?service=WMS&request=GetCapabilities",
    wfsTypeName: "testing_workspace:TEST_RTRW_BADUNG",
    wmsLayers: "testing_workspace:TEST_RTRW_BADUNG",
    status: "active",
    expiresAt: "2026-12-31T23:59:59.000Z",
    bbox: [115.083839, -8.850039, 115.251389, -8.239441],
  },
  {
    id: "testing_workspace:TEST_ZNT_BADUNG",
    title: "ZNT Badung",
    spatialBasis: "kawasan",
    wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows?service=WFS&request=GetCapabilities",
    wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms?service=WMS&request=GetCapabilities",
    wfsTypeName: "testing_workspace:TEST_ZNT_BADUNG",
    wmsLayers: "testing_workspace:TEST_ZNT_BADUNG",
    status: "active",
    expiresAt: "2026-11-30T23:59:59.000Z",
    bbox: [115.083839, -8.849308, 115.251534, -8.239852],
  },
  {
    id: "testing_workspace:TEST_BIDANG_TANAH",
    title: "Bidang Tanah",
    spatialBasis: "bidang",
    wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows?service=WFS&request=GetCapabilities",
    wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms?service=WMS&request=GetCapabilities",
    wfsTypeName: "testing_workspace:TEST_BIDANG_TANAH",
    wmsLayers: "testing_workspace:TEST_BIDANG_TANAH",
    status: "active",
    expiresAt: "2026-10-15T12:00:00.000Z",
    bbox: [115.134102, -8.685009, 115.183136, -8.622203],
  },
  {
    id: "testing_workspace:TEST_RDTR_KUTA",
    title: "RDTR Kuta",
    spatialBasis: "kawasan",
    wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows?service=WFS&request=GetCapabilities",
    wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms?service=WMS&request=GetCapabilities",
    wfsTypeName: "testing_workspace:TEST_RDTR_KUTA",
    wmsLayers: "testing_workspace:TEST_RDTR_KUTA",
    status: "expired",
    expiresAt: "2026-01-01T00:00:00.000Z",
    bbox: [115.15, -8.75, 115.2, -8.68],
  },
];
