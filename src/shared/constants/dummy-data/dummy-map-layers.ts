// src/shared/constants/dummy-data/dummy-map-layers.ts

import type { IgtLayersResponse } from "@/design-system/components/map/types/map.type";

export const DUMMY_MAP_LAYERS: IgtLayersResponse = {
  layers: [
    {
      id: "testing_workspace:TEST_RTRW_BADUNG",
      title: "RTRW Badung",
      spatialBasis: "kawasan",
      bbox: [115.083839, -8.850038, 115.251388, -8.23944],
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
      bbox: [115.083839, -8.850038, 115.251388, -8.23944],
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
      bbox: [115.083839, -8.850038, 115.251388, -8.23944],
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
