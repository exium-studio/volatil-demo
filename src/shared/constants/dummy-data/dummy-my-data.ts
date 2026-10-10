// src/shared/constants/dummy-data/dummy-my-data.ts

import type {
  MitraWorkspaceItem,
  MyDataItem,
} from "@/features/mitra/my-data/types/my-data.type";

export const dummyMitraMyDataItems: MyDataItem[] = [
  {
    id: "testing_workspace:TEST_RTRW_BADUNG",
    label: null,
    title: "RTRW Badung",
    spatialBasis: "kawasan",
    wfsUrl: "/api/proxy/wfs?layerId=testing_workspace:TEST_RTRW_BADUNG",
    wmsUrl: "/api/proxy/wms?layerId=testing_workspace:TEST_RTRW_BADUNG",
    externalWmsUrl:
      "https://geoportal.atrbpn.go.id/interop/wms?workspace=ws_ord_20260830_001&layer=TEST_RTRW_BADUNG",
    wfsTypeName: "testing_workspace:TEST_RTRW_BADUNG",
    wmsLayers: "testing_workspace:TEST_RTRW_BADUNG",
    status: "ready",
    expiresAt: "2026-12-31T23:59:59.000Z",
    bbox: [115.083839, -8.850039, 115.251389, -8.239441],
    invoiceUrl: "https://volatil-be.exium.web.id/invoices/INV-2026-0825-001.pdf",
    tteInvoiceUrl: "https://volatil-be.exium.web.id/invoices/TTE-INV-2026-0825-001.pdf",
    tte: true,
  },
  {
    id: "testing_workspace:TEST_ZNT_BADUNG",
    label: null,
    title: "ZNT Badung",
    spatialBasis: "kawasan",
    wfsUrl: "/api/proxy/wfs?layerId=testing_workspace:TEST_ZNT_BADUNG",
    wmsUrl: "/api/proxy/wms?layerId=testing_workspace:TEST_ZNT_BADUNG",
    externalWmsUrl:
      "https://geoportal.atrbpn.go.id/interop/wms?workspace=ws_ord_20260830_001&layer=TEST_ZNT_BADUNG",
    wfsTypeName: "testing_workspace:TEST_ZNT_BADUNG",
    wmsLayers: "testing_workspace:TEST_ZNT_BADUNG",
    status: "ready",
    expiresAt: "2026-11-30T23:59:59.000Z",
    bbox: [115.083839, -8.849308, 115.251534, -8.239852],
    invoiceUrl: "https://volatil-be.exium.web.id/invoices/INV-2026-0824-002.pdf",
    tteInvoiceUrl: null,
    tte: false,
  },
  {
    id: "testing_workspace:TEST_BIDANG_TANAH",
    label: null,
    title: "Bidang Tanah",
    spatialBasis: "bidang",
    wfsUrl: "/api/proxy/wfs?layerId=testing_workspace:TEST_BIDANG_TANAH",
    wmsUrl: "/api/proxy/wms?layerId=testing_workspace:TEST_BIDANG_TANAH",
    externalWmsUrl:
      "https://geoportal.atrbpn.go.id/interop/wms?workspace=ws_ord_20260829_003&layer=TEST_BIDANG_TANAH",
    wfsTypeName: "testing_workspace:TEST_BIDANG_TANAH",
    wmsLayers: "testing_workspace:TEST_BIDANG_TANAH",
    status: "ready",
    expiresAt: "2026-10-15T12:00:00.000Z",
    bbox: [115.134102, -8.685009, 115.183136, -8.622203],
    invoiceUrl: "https://volatil-be.exium.web.id/invoices/INV-2026-0820-003.pdf",
    tteInvoiceUrl: "https://volatil-be.exium.web.id/invoices/TTE-INV-2026-0820-003.pdf",
    tte: true,
  },
  {
    id: "testing_workspace:TEST_BIDANG_DENPASAR",
    label: null,
    title: "Bidang Tanah Denpasar Timur",
    spatialBasis: "bidang",
    wfsUrl: "/api/proxy/wfs?layerId=testing_workspace:TEST_BIDANG_DENPASAR",
    wmsUrl: "/api/proxy/wms?layerId=testing_workspace:TEST_BIDANG_DENPASAR",
    externalWmsUrl: null,
    status: "processing",
    expiresAt: "2026-10-03T10:25:00.000Z",
    bbox: [115.2, -8.65, 115.25, -8.6],
    invoiceUrl: "https://volatil-be.exium.web.id/invoices/INV-2026-0818-004.pdf",
    tteInvoiceUrl: null,
    tte: false,
  },
  {
    id: "testing_workspace:TEST_KAWASAN_SANUR",
    label: null,
    title: "Kawasan Pesisir Sanur",
    spatialBasis: "kawasan",
    wfsUrl: "/api/proxy/wfs?layerId=testing_workspace:TEST_KAWASAN_SANUR",
    wmsUrl: "/api/proxy/wms?layerId=testing_workspace:TEST_KAWASAN_SANUR",
    externalWmsUrl: null,
    status: "processing",
    expiresAt: "2026-10-03T10:25:00.000Z",
    bbox: [115.24, -8.7, 115.28, -8.66],
    invoiceUrl: null,
    tteInvoiceUrl: null,
    tte: false,
  },
  {
    id: "testing_workspace:TEST_RDTR_KUTA",
    label: null,
    title: "RDTR Kuta",
    spatialBasis: "kawasan",
    wfsUrl: "/api/proxy/wfs?layerId=testing_workspace:TEST_RDTR_KUTA",
    wmsUrl: "/api/proxy/wms?layerId=testing_workspace:TEST_RDTR_KUTA",
    externalWmsUrl: null,
    wfsTypeName: "testing_workspace:TEST_RDTR_KUTA",
    wmsLayers: "testing_workspace:TEST_RDTR_KUTA",
    status: "transaction_failed",
    expiresAt: "2026-01-01T00:00:00.000Z",
    bbox: [115.15, -8.75, 115.2, -8.68],
    invoiceUrl: null,
    tteInvoiceUrl: null,
    tte: false,
  },
];

export const dummyMitraWorkspaces: MitraWorkspaceItem[] = [
  {
    id: "22a298d6-e948-49a7-a8ac-4374c3f3f063",
    workspaceName: "ws_ord_20260830_001",
    orderId: "ord-2026-0830-001",
    orderNumber: "ORD-20260830-001",
    transactionNumber: "TRX-20260830-001",
    userId: 42,
    status: "ready",
    wmsUrl:
      "https://geoportal.atrbpn.go.id/interop/wms?workspace=ws_ord_20260830_001",
    wfsUrl:
      "https://geoportal.atrbpn.go.id/interop/wfs?workspace=ws_ord_20260830_001",
    qgisWmsUrl:
      "https://geoportal.atrbpn.go.id/interop/wms?workspace=ws_ord_20260830_001",
    bbox: [115.083839, -8.850039, 115.251534, -8.239441],
    layersCount: 2,
    layers: [dummyMitraMyDataItems[0], dummyMitraMyDataItems[1]],
    createdAt: "2026-08-30T09:15:00.000Z",
    expiresAt: "2026-12-31T23:59:59.000Z",
    invoiceUrl:
      "https://volatil-be.exium.web.id/invoices/INV-2026-0825-001.pdf",
    tteInvoiceUrl:
      "https://volatil-be.exium.web.id/invoices/TTE-INV-2026-0825-001.pdf",
    tte: true,
  },
  {
    id: "ws_ord_20260829_003",
    workspaceName: "ws_ord_20260829_003",
    orderId: "ord-2026-0829-003",
    orderNumber: "ORD-20260829-003",
    transactionNumber: "TRX-20260829-003",
    userId: 42,
    status: "ready",
    wmsUrl:
      "https://geoportal.atrbpn.go.id/interop/wms?workspace=ws_ord_20260829_003",
    wfsUrl:
      "https://geoportal.atrbpn.go.id/interop/wfs?workspace=ws_ord_20260829_003",
    qgisWmsUrl:
      "https://geoportal.atrbpn.go.id/interop/wms?workspace=ws_ord_20260829_003",
    bbox: [115.134102, -8.685009, 115.183136, -8.622203],
    layersCount: 1,
    layers: [dummyMitraMyDataItems[2]],
    createdAt: "2026-08-29T14:30:00.000Z",
    expiresAt: "2026-10-15T12:00:00.000Z",
    invoiceUrl:
      "https://volatil-be.exium.web.id/invoices/INV-2026-0820-003.pdf",
    tteInvoiceUrl:
      "https://volatil-be.exium.web.id/invoices/TTE-INV-2026-0820-003.pdf",
    tte: true,
  },
  {
    id: "ws_ord_20260818_004",
    workspaceName: "ws_ord_20260818_004",
    orderId: "ord-2026-0818-004",
    orderNumber: "ORD-20260818-004",
    transactionNumber: "TRX-20260818-004",
    userId: 42,
    status: "processing",
    wmsUrl: null,
    bbox: [115.2, -8.65, 115.25, -8.6],
    layersCount: 1,
    layers: [dummyMitraMyDataItems[3]],
    createdAt: "2026-08-18T10:25:00.000Z",
    expiresAt: "2026-10-03T10:25:00.000Z",
    invoiceUrl:
      "https://volatil-be.exium.web.id/invoices/INV-2026-0818-004.pdf",
    tteInvoiceUrl: null,
    tte: false,
  },
];

export const dummyWorkspaceUrl = {
  workspaceName: "volatil_mitra_budi_santoso_42",
  wmsUrl:
    "https://geoportal.atrbpn.go.id/interop/wms?workspace=volatil_mitra_budi_santoso_42",
  wfsUrl:
    "https://geoportal.atrbpn.go.id/interop/wfs?workspace=volatil_mitra_budi_santoso_42",
  qgisWmsUrl:
    "https://geoportal.atrbpn.go.id/interop/wms?workspace=volatil_mitra_budi_santoso_42",
  qgisWfsUrl:
    "https://geoportal.atrbpn.go.id/interop/wfs?workspace=volatil_mitra_budi_santoso_42",
  note: "URL Workspace Resmi melalui INTEROP Pusdatin ATR/BPN.",
};

export const dummyApiKey = "vlt_a1b2c3d4e5f67890abcdef123456";

