// src/design-system/components/map/ui/map.basemap.tsx

import { Box } from "@/design-system/components/layout/ui/box";
import {
  getBaseLayerStyle,
  OPENFREEMAP_LIBERTY_STYLE_URL,
} from "@/design-system/components/map/constants/map.basemap-options";
import {
  MAP_CONFIG,
  MAP_EVENTS_MAP,
} from "@/design-system/components/map/constants/map.config";
import { useMapResizeObserver } from "@/design-system/components/map/hooks/use-map-resize-observer";
import { useMapBaseMapStore } from "@/design-system/components/map/stores/map.base-map.store";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import type { BaseMapProps } from "@/design-system/components/map/types/map.basemap.type";
import { applyBasemapColorStyleOverride } from "@/design-system/components/map/utils/basemap-color-style-override";
import { applyBasemapPlainDarkStyleOverride } from "@/design-system/components/map/utils/basemap-plain-dark-style-override";
import { applyBasemapPlainLightStyleOverride } from "@/design-system/components/map/utils/basemap-plain-light-style-override";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

/**
 * Pure basemap component — initializes MapLibre GL, manages tile styles,
 * globe projection, paint overrides.
 *
 * Responsibility boundary:
 *  - Init maplibregl.Map
 *  - Handle style switching + applyGlobe (paint overrides, setLight, setTerrain)
 *  - Fire MAP_STYLE_READY_EVENT AFTER React commits map state, so consumers
 *    (useMapLayers etc.) have had a chance to register their listeners first.
 *  - Expose map instance via BaseMapContext
 *
 * All feature-level hooks (useMapLayers, useMapDraw) live in MapShell, not here.
 */
export const BaseMap = ({ styleUrl, children }: BaseMapProps) => {
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

  useMapResizeObserver(map, containerRef);

  // Track the active style key and color mode in refs for event listeners
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
      center: MAP_CONFIG.viewport.center,
      zoom: MAP_CONFIG.viewport.zoom,
      dragRotate: true,
      touchZoomRotate: true,
      pitchWithRotate: true,
      attributionControl: false,
    });

    appliedStyleRef.current = {
      style: currentStyle,
      key: activeStyleKey,
      mode: colorMode,
    };

    /**
     * Applies globe projection + paint/light/terrain overrides for the
     * current basemap style key. Called on every style.load (initial load
     * AND style switches).
     *
     * For style switches: fires MAP_STYLE_READY_EVENT here because
     * useMapLayers is already mounted and its listener is registered.
     *
     * For initial load: MAP_STYLE_READY_EVENT fired here is missed by
     * useMapLayers (setMap not called yet → listener not registered).
     * The post-commit useEffect([map]) below covers the initial load case.
     */
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

      // Signal that basemap + globe + paint overrides are settled.
      // For style switches this is received by useMapLayers immediately.
      // For the initial load this fires before setMap() → useMapLayers
      // misses it. The post-commit useEffect([map]) in this component
      // fires a second MAP_STYLE_READY_EVENT after React commits, ensuring
      // useMapLayers always receives at least one event.
      instance.fire(MAP_EVENTS_MAP.styleReady);
    };

    // style.load fires for both the initial load and every subsequent
    // setStyle() call — covers all basemap switches.
    instance.on("style.load", applyGlobe);

    // once("load") only commits the map instance to React state.
    // applyGlobe is NOT called here; style.load already ran it.
    instance.once("load", () => {
      setMap(instance);
      useMapInstanceStore.getState().setMap(instance);
    });

    return () => {
      instance.remove();
      setMap(null);
      useMapInstanceStore.getState().setMap(null);
      appliedStyleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Post-commit MAP_STYLE_READY_EVENT for the initial mount.
   *
   * By the time this effect runs, React has committed the map state update,
   * so useMapLayers (which depends on [map]) has already mounted and
   * registered its MAP_STYLE_READY_EVENT listener. Firing the event here
   * guarantees useMapLayers always receives the initial ready signal,
   * even when the style.load → applyGlobe → fire sequence happened before
   * setMap() was called.
   *
   * For style switches, applyGlobe fires the event directly and this effect
   * does not re-run (map reference is stable), so there's no double-fire.
   */
  useEffect(() => {
    if (!map) return;

    // Style may still be loading in rare edge cases — only fire if ready.
    if (map.isStyleLoaded()) {
      map.fire(MAP_EVENTS_MAP.styleReady);
    }
    // If style is not yet loaded, the on("style.load") → applyGlobe path
    // will fire the event once the style finishes loading.
  }, [map]);

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

    const forceReload = isSameStyle && (!isSameKey || !isSameMode);
    map.setStyle(currentStyle, { diff: !forceReload });
  }, [map, currentStyle, activeStyleKey, colorMode]);

  return (
    <Box position={"relative"} width={"100%"} height={"100%"}>
      <Box
        ref={containerRef}
        width={"100%"}
        height={"100%"}
        data-color-mode={colorMode}
      />

      {children}
    </Box>
  );
};
