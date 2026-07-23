// src/features/map/ui/base-map.tsx

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from "@/design-system/components/map/constants/map.constant";
import {
  getBasemapStyle,
  OPENFREEMAP_LIBERTY_STYLE_URL,
} from "@/design-system/components/map/constants/basemap.constant";
import { useMapBasemapStore } from "@/design-system/components/map/stores/map-basemap.store";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { useMapLayers } from "@/design-system/components/map/hooks/use-map-layers";
import { useMapDraw } from "@/design-system/components/map/hooks/use-map-draw";
import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";
import { MapControls } from "@/design-system/components/map/ui/map-controls";
import { MapDrawControls } from "@/design-system/components/map/ui/map-draw-controls";
import { Box } from "@/design-system/components/layout/ui/box";
import { useMapResizeObserver } from "@/design-system/components/map/hooks/use-map-resize-observer";
import { MapAttribution } from "@/design-system/components/map/ui/map-attribution";

type BaseMapProps = {
  layers: MapLayerConfig[];
  styleUrl?: string;
  onDrawFinish?: (feature: GeoJSON.Feature<GeoJSON.Polygon>) => void;
};

export const BaseMap = ({ layers, styleUrl, onDrawFinish }: BaseMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  const { colorMode } = useColorMode();

  const { activeStyleId } = useMapBasemapStore();

  // "color" uses a string URL (OpenFreeMap Liberty vector style);
  // all other IDs return a StyleSpecification object.
  const currentStyle =
    styleUrl ??
    (activeStyleId === "color"
      ? OPENFREEMAP_LIBERTY_STYLE_URL
      : getBasemapStyle(activeStyleId, colorMode));

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new maplibregl.Map({
      container: containerRef.current,
      style: currentStyle,
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      dragRotate: true,
      touchZoomRotate: true,
      pitchWithRotate: true,
      attributionControl: false,
    });

    // instance.addControl(
    //   new maplibregl.AttributionControl({
    //     compact: true,
    //     customAttribution: [
    //       '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    //       '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
    //       '&copy; <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a>',
    //     ],
    //   }),
    //   "bottom-left",
    // );

    instance.once("load", () => {
      setMap(instance);
    });

    return () => {
      instance.remove();
      setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Map instance initialized once
  }, []);

  useEffect(() => {
    if (!map) return;
    map.setStyle(currentStyle);
  }, [map, currentStyle]);

  useMapLayers(map, layers);
  useMapDraw(map, onDrawFinish);
  useMapResizeObserver(map, containerRef);

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

      <MapAttribution />
    </Box>
  );
};
