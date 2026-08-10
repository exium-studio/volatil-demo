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
  // {
  //   id: "igt-bidang-tanah-wfs-fill",
  //   type: "wfs-fill",
  //   wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/ows",
  //   wfsTypeName: "igt:CONTOH_BIDANG_TANAH",
  //   paint: {
  //     "fill-color": "#f59e0b",
  //     "fill-opacity": 0.15,
  //   },
  //   visible: true,
  // },
  // {
  //   id: "igt-bidang-tanah-wfs-line",
  //   type: "wfs-line",
  //   wfsUrl: "https://igtpr.atrbpn.go.id/geoserver/igt/ows",
  //   wfsTypeName: "igt:CONTOH_BIDANG_TANAH",
  //   paint: {
  //     "line-color": "#f59e0b",
  //     "line-width": 1,
  //     "line-opacity": 0.8,
  //   },
  //   visible: true,
  // },
];
