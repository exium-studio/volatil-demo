// src/shared/constants/dummy-data/dummy-map-layers.ts

import type { IgtLayersResponse } from "@/design-system/components/map/types/map.type";

export const DUMMY_MAP_LAYERS: IgtLayersResponse = {
  wfs: [
    {
      id: "testing_workspace:TEST_RTRW_BADUNG",
      type: "wfs-fill",
      spatialBasis: "kawasan",
      wfsTypeName: "testing_workspace:TEST_RTRW_BADUNG",
      wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      visible: true,
    },
    {
      id: "testing_workspace:TEST_ZNT_BADUNG",
      type: "wfs-fill",
      spatialBasis: "kawasan",
      wfsTypeName: "testing_workspace:TEST_ZNT_BADUNG",
      wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      visible: true,
    },
    {
      id: "testing_workspace:TEST_BIDANG_TANAH",
      type: "wfs-line",
      spatialBasis: "bidang",
      wfsTypeName: "testing_workspace:TEST_BIDANG_TANAH",
      wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      visible: true,
    },
  ],
  wms: [
    {
      id: "testing_workspace:TEST_RTRW_BADUNG-wms",
      type: "wms-raster",
      spatialBasis: "kawasan",
      wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      layers: "testing_workspace:TEST_RTRW_BADUNG",
      visible: true,
    },
    {
      id: "testing_workspace:TEST_ZNT_BADUNG-wms",
      type: "wms-raster",
      spatialBasis: "kawasan",
      wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      layers: "testing_workspace:TEST_ZNT_BADUNG",
      visible: true,
    },
    {
      id: "testing_workspace:TEST_BIDANG_TANAH-wms",
      type: "wms-raster",
      spatialBasis: "bidang",
      wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/testing_workspace/wms",
      layers: "testing_workspace:TEST_BIDANG_TANAH",
      visible: true,
    },
  ],
};
