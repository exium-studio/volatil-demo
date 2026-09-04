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
      zIndex: 3,
      wfs: {
        wfsTypeName: "testing_workspace:TEST_BIDANG_TANAH",
        wfsUrl: "/api/proxy/wfs?layerId=testing_workspace:TEST_BIDANG_TANAH",
      },
      wms: {
        layers: "testing_workspace:TEST_BIDANG_TANAH",
        wmsUrl: "/api/proxy/wms?layerId=testing_workspace:TEST_BIDANG_TANAH",
      },
    },
    {
      id: "testing_workspace:TEST_RTRW_BADUNG",
      title: "RTRW Badung",
      spatialBasis: "kawasan",
      bbox: [115.083839, -8.850039, 115.251389, -8.239441],
      visible: true,
      zIndex: 1,
      wfs: {
        wfsTypeName: "testing_workspace:TEST_RTRW_BADUNG",
        wfsUrl: "/api/proxy/wfs?layerId=testing_workspace:TEST_RTRW_BADUNG",
      },
      wms: {
        layers: "testing_workspace:TEST_RTRW_BADUNG",
        wmsUrl: "/api/proxy/wms?layerId=testing_workspace:TEST_RTRW_BADUNG",
      },
    },
    {
      id: "testing_workspace:TEST_ZNT_BADUNG",
      title: "ZNT Badung",
      spatialBasis: "kawasan",
      bbox: [115.083839, -8.849308, 115.251534, -8.239852],
      visible: true,
      zIndex: 2,
      wfs: {
        wfsTypeName: "testing_workspace:TEST_ZNT_BADUNG",
        wfsUrl: "/api/proxy/wfs?layerId=testing_workspace:TEST_ZNT_BADUNG",
      },
      wms: {
        layers: "testing_workspace:TEST_ZNT_BADUNG",
        wmsUrl: "/api/proxy/wms?layerId=testing_workspace:TEST_ZNT_BADUNG",
      },
    },
  ],
  pagination: createPaginationMeta(1, 50, 3),
};
