// src/design-system/components/map/ui/map.tsx

import { useMapDraw } from "@/design-system/components/map/hooks/use-map-draw";
import { useMapLayers } from "@/design-system/components/map/hooks/use-map-layers";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import type { MapProps } from "@/design-system/components/map/types/map.basemap.type";
import { BaseMap } from "@/design-system/components/map/ui/map.basemap";
import { MapOverlay } from "@/design-system/components/map/ui/map.overlay";

/**
 * Shell rendered inside BaseMap — reads the map instance from Zustand store
 * and orchestrates all feature-level concerns.
 */
const MapShell = ({
  layers,
  onDrawFinish,
  children,
}: Omit<MapProps, "styleUrl">) => {
  const map = useMapInstanceStore((state) => state.map);

  useMapLayers(map, layers);
  useMapDraw(map, onDrawFinish);

  return (
    <>
      <MapOverlay />
      {children}
    </>
  );
};

/**
 * High-level Map component — composes BaseMap (basemap engine) and an
 * internal shell that wires up layers, drawing, and overlay controls.
 */
export const Map = (props: MapProps) => {
  // Props
  const { layers, styleUrl, onDrawFinish, children } = props;

  return (
    <BaseMap styleUrl={styleUrl}>
      <MapShell layers={layers} onDrawFinish={onDrawFinish}>
        {children}
      </MapShell>
    </BaseMap>
  );
};
