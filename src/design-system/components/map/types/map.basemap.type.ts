// src/design-system/components/map/types/map.basemap.type.ts

import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";
import type React from "react";

export type BaseMapProps = {
  styleUrl?: string;
  children?: React.ReactNode;
};

export type MapProps = BaseMapProps & {
  layers: MapLayerConfig[];
  onDrawFinish?: (
    feature: GeoJSON.Feature<GeoJSON.Polygon>,
    originalPoints: { lng: number; lat: number }[],
  ) => void;
};
