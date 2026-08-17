// src/shared/constants/dummy-data/dummy-igt-layers.ts

import type { IgtLayersResponse } from "@/design-system/components/map/types/map.type";

export const DUMMY_IGT_LAYERS: IgtLayersResponse = {
  layers: [
    {
      id: "testing_workspace:TEST_RTRW_BADUNG",
      title: "RTRW Badung",
      spatialBasis: "kawasan",
      bbox: [115.099352, -8.822746, 115.251131, -8.30164],
      visible: true,
      wfs: {
        wfsTypeName: "testing_workspace:TEST_RTRW_BADUNG",
        wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
        type: "wfs-fill",
      },
      wms: {
        layers: "testing_workspace:TEST_RTRW_BADUNG",
        wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      },
    },
    {
      id: "testing_workspace:TEST_ZNT_BADUNG",
      title: "ZNT Badung",
      spatialBasis: "kawasan",
      bbox: [115.170693, -8.831414, 115.251529, -8.239852],
      visible: true,
      wfs: {
        wfsTypeName: "testing_workspace:TEST_ZNT_BADUNG",
        wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
        type: "wfs-fill",
      },
      wms: {
        layers: "testing_workspace:TEST_ZNT_BADUNG",
        wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      },
    },
    {
      id: "testing_workspace:TEST_BIDANG_TANAH",
      title: "Bidang Tanah",
      spatialBasis: "bidang",
      bbox: [115.14834, -8.68055, 115.17612, -8.658097],
      visible: true,
      wfs: {
        wfsTypeName: "testing_workspace:TEST_BIDANG_TANAH",
        wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
        type: "wfs-line",
      },
      wms: {
        layers: "testing_workspace:TEST_BIDANG_TANAH",
        wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      },
    },
  ],
};
