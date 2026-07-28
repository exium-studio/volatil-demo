// src/design-system/components/map/ui/map.basemap.tsx

import { Box } from "@/design-system/components/layout/ui/box";
import {
  getBaseLayerStyle,
  OPENFREEMAP_LIBERTY_STYLE_URL,
} from "@/design-system/components/map/constants/map.basemap-options";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from "@/design-system/components/map/constants/map.config";
import { useMapDraw } from "@/design-system/components/map/hooks/use-map-draw";
import { useMapLayers } from "@/design-system/components/map/hooks/use-map-layers";
import { useMapResizeObserver } from "@/design-system/components/map/hooks/use-map-resize-observer";
import { useMapBaseMapStore } from "@/design-system/components/map/stores/map.base-map.store";
import type { BaseMapProps } from "@/design-system/components/map/types/map.basemap.type";
import { BaseMapContext } from "@/design-system/components/map/contexts/map.basemap.context";
import { MapOverlay } from "@/design-system/components/map/ui/map.overlay";
import { applyBasemapColorStyleOverride } from "@/design-system/components/map/utils/basemap-color-style-ovveride";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";

// -------------------------------------------------------------------------------------

export const BaseMap = ({ layers, styleUrl, onDrawFinish }: BaseMapProps) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const appliedStyleRef = useRef<string | maplibregl.StyleSpecification | null>(
    null,
  );

  // Hooks
  const { colorMode } = useColorMode();
  const { activeStyleKey } = useMapBaseMapStore();

  // States
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // Resolved Values
  const currentStyle =
    styleUrl ??
    (activeStyleKey === "color"
      ? OPENFREEMAP_LIBERTY_STYLE_URL
      : getBaseLayerStyle(activeStyleKey, colorMode));
  const contextValue = useMemo(
    () => ({
      map,
    }),
    [map],
  );

  // Track the active style key in a ref so the event listeners in the map init effect
  // can always access the freshest value without stale closures during HMR/updates.
  const activeStyleKeyRef = useRef(activeStyleKey);
  useEffect(() => {
    activeStyleKeyRef.current = activeStyleKey;
  }, [activeStyleKey]);

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

    // Seed the ref so the style-change effect skips the initial redundant call.
    appliedStyleRef.current = currentStyle;

    // Globe must be re-applied after every style swap (setStyle() triggers a
    // new style.load, which resets the projection back to mercator).
    // Also called on initial "load" so a hard-refresh never loses the globe.
    const applyGlobe = () => {
      instance.setProjection({ type: "globe" });
      applyBasemapColorStyleOverride(instance);

      const activeKey = activeStyleKeyRef.current;
      // Apply 3D terrain if the selected style is satellite
      if (activeKey === "satellite") {
        if (instance.getSource("terrain-dem")) {
          instance.setTerrain({
            source: "terrain-dem",
            exaggeration: 1.5,
          });
        }
      } else {
        instance.setTerrain(null);
      }
    };

    // fires after initial load AND after every map.setStyle() call.
    instance.on("style.load", applyGlobe);

    instance.once("load", () => {
      applyGlobe();
      setMap(instance);
    });

    return () => {
      instance.remove();
      setMap(null);
      appliedStyleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Change base layer style effect
  useEffect(() => {
    if (!map) return;
    // Skip if this style is already applied (e.g. first render after map init).
    if (appliedStyleRef.current === currentStyle) return;
    appliedStyleRef.current = currentStyle;
    map.setStyle(currentStyle);
  }, [map, currentStyle, activeStyleKey]);

  useMapLayers(map, layers);
  useMapDraw(map, onDrawFinish);
  useMapResizeObserver(map, containerRef);

  return (
    <BaseMapContext.Provider value={contextValue}>
      <Box position={"relative"} width={"100%"} height={"100%"}>
        <Box
          ref={containerRef}
          width={"100%"}
          height={"100%"}
          data-color-mode={colorMode}
        />

        <MapOverlay />
      </Box>
    </BaseMapContext.Provider>
  );
};
