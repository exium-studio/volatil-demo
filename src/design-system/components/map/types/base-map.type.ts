import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";

export type BaseMapProps = {
  layers: MapLayerConfig[];
  styleUrl?: string;
  onDrawFinish?: (feature: GeoJSON.Feature<GeoJSON.Polygon>) => void;
};
