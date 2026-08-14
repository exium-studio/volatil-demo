// src/shared/constants/dummy-data/dummy-map-layers.ts

import type { IgtLayersResponse } from "@/design-system/components/map/types/map.type";

export const DUMMY_MAP_LAYERS: IgtLayersResponse = {
  wfs: [
    {
      id: "igt-bidang-tanah-wfs",
      type: "wfs-line",
      wfsTypeName: "igt:CONTOH_BIDANG_TANAH",
      wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/ows",
      visible: true,
    },
  ],
  wms: [
    {
      id: "igt-bidang-tanah-wms-raster",
      type: "wms-raster",
      wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/wms",
      layers: "igt:CONTOH_BIDANG_TANAH",
      visible: true,
    },
  ],
};
