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

  const currentStyle =
    styleUrl ??
    (activeStyleId === "color"
      ? OPENFREEMAP_LIBERTY_STYLE_URL
      : getBasemapStyle(activeStyleId, colorMode));

  function applyCustomPaintOverrides(map: maplibregl.Map) {
    const setIfExists = (
      layerId: string,
      prop: string,
      value: string | number | unknown[],
    ) => {
      if (!map.getLayer(layerId)) return;
      try {
        map.setPaintProperty(layerId, prop, value);
      } catch {
        // layer exists but property type doesn't match — skip silently
      }
    };

    // Roads → abu-abu netral, bukan kuning
    setIfExists("road_motorway", "line-color", "#e8e8e8");
    setIfExists("road_motorway_casing", "line-color", "#9ca3af");
    setIfExists("road_trunk_primary", "line-color", "#f2f2f2");
    setIfExists("road_trunk_primary_casing", "line-color", "#a1a1aa");
    setIfExists("road_secondary_tertiary", "line-color", "#ffffff");
    setIfExists("road_secondary_tertiary_casing", "line-color", "#c4c4c8");

    // Laut → variasi tone by zoom
    setIfExists("water", "fill-color", [
      "interpolate",
      ["linear"],
      ["zoom"],
      4,
      "#82d4fe",
      10,
      "#98dcfe",
      16,
      "#98dcfe",
    ]);

    // Pulau/daratan → hijau (#bbe6b3) saat zoom out (globe view),
    // fade ke warna tanah natural saat zoom in.
    const landColorByZoom = [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      "#bbe6b3",
      4,
      "#cbedc5",
      8,
      "#f2ede8",
    ];
    // OpenFreeMap Liberty / OpenMapTiles kemungkinan layer IDs untuk land
    setIfExists("land", "fill-color", landColorByZoom);
    // background layer pakai background-color, bukan fill-color
    setIfExists("background", "background-color", landColorByZoom);
    setIfExists("landcover-land", "fill-color", landColorByZoom);

    // Park/wood lebih seger
    setIfExists("landcover_wood", "fill-color", "#bbe6b3");
    setIfExists("park", "fill-color", "#bbe6b3");
  }

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
