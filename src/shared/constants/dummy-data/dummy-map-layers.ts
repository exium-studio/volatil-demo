// src/shared/constants/dummy-data/dummy-map-layers.ts

import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";

export const DUMMY_MAP_LAYERS: MapLayerConfig[] = [
  {
    id: "igt-bidang-tanah-wms-raster",
    type: "wms-raster",
    wmsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/wms",
    layers: "igt:CONTOH_BIDANG_TANAH",
    visible: true,
  },
];
