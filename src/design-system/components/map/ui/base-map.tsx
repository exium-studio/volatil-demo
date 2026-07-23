// src/features/map/ui/base-map.tsx

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from "@/design-system/components/map/constants/map.constant";
import { useMapLayers } from "@/design-system/components/map/hooks/use-map-layers";
import { useMapDraw } from "@/design-system/components/map/hooks/use-map-draw";
import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";
import { MapControls } from "@/design-system/components/map/ui/map-controls";
import { MapDrawControls } from "@/design-system/components/map/ui/map-draw-controls";
import { Box } from "@/design-system/components/layout/ui/box";
import { useMapResizeObserver } from "@/design-system/components/map/hooks/use-map-resize-observer";

interface BaseMapProps {
  layers: MapLayerConfig[];
  styleUrl: string;
  onDrawFinish?: (feature: GeoJSON.Feature<GeoJSON.Polygon>) => void;
  // TODO: wire this up to the design system's color mode (e.g. useColorMode()/useThemeStore())
  colorMode?: "light" | "dark";
}

export const BaseMap = ({
  layers,
  styleUrl,
  onDrawFinish,
  colorMode = "light",
}: BaseMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      dragRotate: true,
      touchZoomRotate: true,
      pitchWithRotate: true,
      attributionControl: false,
    });

    instance.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-left",
    );

    instance.once("load", () => setMap(instance));

    return () => {
      instance.remove();
      setMap(null);
    };
  }, [styleUrl]);

  useMapLayers(map, layers);
  useMapDraw(map, onDrawFinish);
  useMapResizeObserver(map, containerRef);

  // tempel sementara di base-map.tsx, di dalam useMapRotationLock atau langsung di component, buat debug

  return (
    <Box position={"relative"} width={"100%"} height={"100%"}>
      <Box
        ref={containerRef}
        width={"100%"}
        height={"100%"}
        data-color-mode={colorMode}
      />
      <MapControls map={map} />
      <MapDrawControls />
    </Box>
  );
};
