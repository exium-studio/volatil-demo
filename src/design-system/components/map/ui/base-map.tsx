// src/design-system/components/map/ui/base-map.tsx

import { Box } from "@/design-system/components/layout/ui/box";
import {
  getBaseLayerOption,
  getBaseLayerStyle,
  OPENFREEMAP_LIBERTY_STYLE_URL,
} from "@/design-system/components/map/constants/base-layer-style.constant";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from "@/design-system/components/map/constants/map.constant";
import { useMapDraw } from "@/design-system/components/map/hooks/use-map-draw";
import { useMapLayers } from "@/design-system/components/map/hooks/use-map-layers";
import { useMapResizeObserver } from "@/design-system/components/map/hooks/use-map-resize-observer";
import { useMapBaseLayerStore } from "@/design-system/components/map/stores/map-base-layer.store";
import type { BaseMapProps } from "@/design-system/components/map/types/base-map.type";
import { MapAttribution } from "@/design-system/components/map/ui/map-attribution";
import { MapControls } from "@/design-system/components/map/ui/map-controls";
import { MapDrawControls } from "@/design-system/components/map/ui/map-draw-controls";
import { applyCustomPaintOverrides } from "@/design-system/components/map/utils/apply-custom-paint-overrides";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

export const BaseMap = ({ layers, styleUrl, onDrawFinish }: BaseMapProps) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { colorMode } = useColorMode();
  const { activeStyleKey } = useMapBaseLayerStore();

  // States
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // Resolved Values
  const currentStyle =
    styleUrl ??
    (activeStyleKey === "color"
      ? OPENFREEMAP_LIBERTY_STYLE_URL
      : getBaseLayerStyle(activeStyleKey, colorMode));

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new maplibregl.Map({
      container: containerRef.current,
      style: currentStyle,
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      // maxZoom:currentStyle,
      dragRotate: true,
      touchZoomRotate: true,
      pitchWithRotate: true,
      attributionControl: false,
    });

    // fires after initial load AND after every map.setStyle() call.
    instance.on("style.load", () => {
      instance.setProjection({ type: "globe" });
      applyCustomPaintOverrides(instance);
    });

    instance.once("load", () => setMap(instance));

    return () => {
      instance.remove();
      setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Change base layer style effect
  useEffect(() => {
    if (!map) return;
    map.setStyle(currentStyle);

    const targetMaxZoom = getBaseLayerOption(activeStyleKey).maxZoom;
    map.setMaxZoom(targetMaxZoom);

    if (map.getZoom() > targetMaxZoom) {
      map.easeTo({ zoom: targetMaxZoom, duration: 300 });
    }
  }, [map, currentStyle, activeStyleKey]);

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
