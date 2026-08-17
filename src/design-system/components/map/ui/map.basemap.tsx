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
import { getGisAuthHeader } from "@/design-system/components/map/utils/gis-auth-header";
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
const STARRY_NIGHT_BG =
  "radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), " +
  "radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8) 75%, rgba(0,0,0,0)), " +
  "radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), " +
  "radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, rgba(0,0,0,0)), " +
  "radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7) 50%, rgba(0,0,0,0)), " +
  "radial-gradient(1.5px 1.5px at 160px 120px, #ffffff, rgba(0,0,0,0)), " +
  "radial-gradient(1px 1px at 210px 190px, rgba(255,255,255,0.9), rgba(0,0,0,0)), " +
  "radial-gradient(1.5px 1.5px at 260px 40px, #ffffff, rgba(0,0,0,0)), " +
  "radial-gradient(1px 1px at 310px 140px, rgba(255,255,255,0.8), rgba(0,0,0,0)), " +
  "radial-gradient(1px 1px at 370px 220px, #ffffff, rgba(0,0,0,0)), " +
  "radial-gradient(1.5px 1.5px at 420px 90px, rgba(255,255,255,0.9), rgba(0,0,0,0)), " +
  "radial-gradient(1px 1px at 470px 170px, #ffffff, rgba(0,0,0,0))";

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
      transformRequest: (url) => {
        if (url.includes("igtpr.atrbpn.go.id") || url.includes("geoserver")) {
          return {
            url,
            headers: {
              Authorization: getGisAuthHeader(),
            },
          };
        }
        return { url };
      },
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
     */
    const applyGlobe = () => {
      instance.setProjection({ type: "globe" });
      instance.setSky({
        "sky-color": "#020617",
        "horizon-color": "#0f172a",
        "fog-color": "#1e293b",
        "fog-ground-blend": 0.5,
        "horizon-fog-blend": 0.8,
        "sky-horizon-blend": 0.8,
        "atmosphere-blend": 0.8,
      });

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

      // Step 2: Handle 3D vs 2D building visibility state according to is3D setting
      const is3DActive = useMapBaseMapStore.getState().is3D;
      if (instance.getLayer("building-3d")) {
        instance.setLayoutProperty(
          "building-3d",
          "visibility",
          is3DActive ? "visible" : "none",
        );
      }
      if (instance.getLayer("building")) {
        if (is3DActive) {
          instance.setLayoutProperty("building", "visibility", "none");
        } else {
          instance.setLayerZoomRange("building", 13, 24);
          instance.setLayoutProperty("building", "visibility", "visible");
        }
      }

      // Signal that basemap + globe + paint overrides + 3D buildings are settled.
      instance.fire(MAP_EVENTS_MAP.styleReady);
    };

    // style.load fires for both the initial load and every subsequent setStyle() call with different URL
    instance.on("style.load", applyGlobe);

    // once("load") only commits the map instance to React state.
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
   */
  useEffect(() => {
    if (!map) return;

    if (map.isStyleLoaded()) {
      map.fire(MAP_EVENTS_MAP.styleReady);
    }
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

    // When switching between variants sharing the same style URL (e.g. Liberty color / plain-light / plain-dark),
    // MapLibre's setStyle does not trigger style.load. We MUST trigger style settlement only when style is fully loaded.
    if (isSameStyle) {
      const runStyleSettlement = () => {
        if (!map.isStyleLoaded()) return;

        const activeKey = activeStyleKey;
        const currentMode = colorMode;

        if (activeKey === "color") {
          applyBasemapColorStyleOverride(map);
        } else if (
          activeKey === "plain-light" ||
          activeKey === "plain-dark" ||
          activeKey === "plain-adaptive"
        ) {
          let overrideMode: "light" | "dark" = currentMode;
          if (activeKey === "plain-light") overrideMode = "light";
          if (activeKey === "plain-dark") overrideMode = "dark";

          if (overrideMode === "light") {
            applyBasemapPlainLightStyleOverride(map);
          } else {
            applyBasemapPlainDarkStyleOverride(map);
          }
        }

        const is3DActive = useMapBaseMapStore.getState().is3D;
        if (map.getLayer("building-3d")) {
          map.setLayoutProperty(
            "building-3d",
            "visibility",
            is3DActive ? "visible" : "none",
          );
        }
        if (map.getLayer("building")) {
          if (is3DActive) {
            map.setLayoutProperty("building", "visibility", "none");
          } else {
            map.setLayerZoomRange("building", 13, 24);
            map.setLayoutProperty("building", "visibility", "visible");
          }
        }

        map.fire(MAP_EVENTS_MAP.styleReady);
      };

      if (map.isStyleLoaded()) {
        runStyleSettlement();
      } else {
        map.once("styledata", runStyleSettlement);
      }
    }
  }, [map, currentStyle, activeStyleKey, colorMode]);

  return (
    <Box
      position={"relative"}
      width={"100%"}
      height={"100%"}
      bg={"#020617"}
      backgroundImage={STARRY_NIGHT_BG}
      backgroundRepeat={"repeat"}
      backgroundSize={"500px 300px"}
    >
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
