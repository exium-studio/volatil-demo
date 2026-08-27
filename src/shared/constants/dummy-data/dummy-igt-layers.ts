// src/shared/constants/dummy-data/dummy-igt-layers.ts

import type { IgtLayersResponse } from "@/design-system/components/map/types/map.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";

export const DUMMY_IGT_LAYERS: IgtLayersResponse = {
  items: [
    {
      id: "testing_workspace:TEST_BIDANG_TANAH",
      title: "Bidang Tanah",
      spatialBasis: "bidang",
      bbox: [115.134102, -8.685009, 115.183136, -8.622203],
      visible: true,
      wfs: {
        wfsTypeName: "testing_workspace:TEST_BIDANG_TANAH",
        wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows",
      },
      wms: {
        layers: "testing_workspace:TEST_BIDANG_TANAH",
        wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      },
    },
    {
      id: "testing_workspace:TEST_RTRW_BADUNG",
      title: "RTRW Badung",
      spatialBasis: "kawasan",
      bbox: [115.083839, -8.850039, 115.251389, -8.239441],
      visible: true,
      wfs: {
        wfsTypeName: "testing_workspace:TEST_RTRW_BADUNG",
        wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows",
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
      bbox: [115.083839, -8.849308, 115.251534, -8.239852],
      visible: true,
      wfs: {
        wfsTypeName: "testing_workspace:TEST_ZNT_BADUNG",
        wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/ows",
      },
      wms: {
        layers: "testing_workspace:TEST_ZNT_BADUNG",
        wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      },
    },
  ],
  pagination: createPaginationMeta(1, 50, 3),
};
