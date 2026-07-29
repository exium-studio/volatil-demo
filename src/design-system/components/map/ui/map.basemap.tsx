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
import { applyBasemapColorStyleOverride } from "@/design-system/components/map/utils/basemap-color-style-override";
import { applyBasemapPlainLightStyleOverride } from "@/design-system/components/map/utils/basemap-plain-light-style-override";
import { applyBasemapPlainDarkStyleOverride } from "@/design-system/components/map/utils/basemap-plain-dark-style-override";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";

// -------------------------------------------------------------------------------------

export const BaseMap = ({ layers, styleUrl, onDrawFinish }: BaseMapProps) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const appliedStyleRef = useRef<{
    style: string | maplibregl.StyleSpecification;
    key: string;
    mode: "light" | "dark";
  } | null>(null);

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

  // Track the active style key and color mode in refs so the event listeners in the map init effect
  // can always access the freshest values without stale closures during updates/theme changes.
  const activeStyleKeyRef = useRef(activeStyleKey);
  const colorModeRef = useRef(colorMode);
  useEffect(() => {
    activeStyleKeyRef.current = activeStyleKey;
    colorModeRef.current = colorMode;
  }, [activeStyleKey, colorMode]);

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
    appliedStyleRef.current = {
      style: currentStyle,
      key: activeStyleKey,
      mode: colorMode,
    };

    // Globe must be re-applied after every style swap (setStyle() triggers a
    // new style.load, which resets the projection back to mercator).
    // Also called on initial "load" so a hard-refresh never loses the globe.
    const applyGlobe = () => {
      instance.setProjection({ type: "globe" });

      const activeKey = activeStyleKeyRef.current;
      const currentMode = colorModeRef.current;

      if (activeKey === "color") {
        applyBasemapColorStyleOverride(instance);
      } else if (
        activeKey === "plain-light" ||
        activeKey === "plain-dark" ||
        activeKey === "plain-adaptive"
      ) {
        let overrideMode: "light" | "dark" = currentMode;
        if (activeKey === "plain-light") overrideMode = "light";
        if (activeKey === "plain-dark") overrideMode = "dark";

        if (overrideMode === "light") {
          applyBasemapPlainLightStyleOverride(instance);
        } else {
          applyBasemapPlainDarkStyleOverride(instance);
        }
      }

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

      // @ts-expect-error debug
      window.__map = instance;
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

    const previous = appliedStyleRef.current;
    const isSameStyle = previous?.style === currentStyle;
    const isSameKey = previous?.key === activeStyleKey;
    const isSameMode =
      activeStyleKey === "plain-adaptive" ? previous?.mode === colorMode : true;

    if (isSameStyle && isSameKey && isSameMode) return;

    appliedStyleRef.current = {
      style: currentStyle,
      key: activeStyleKey,
      mode: colorMode,
    };

    // If style URL is the same but key/mode changed, force style reload by setting diff: false.
    // This triggers "style.load" so we can re-apply paint overrides.
    const forceReload = isSameStyle && (!isSameKey || !isSameMode);
    map.setStyle(currentStyle, { diff: !forceReload });
  }, [map, currentStyle, activeStyleKey, colorMode]);

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
