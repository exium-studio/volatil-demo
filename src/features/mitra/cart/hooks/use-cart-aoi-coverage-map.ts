import { MAP_EVENTS_MAP } from "@/design-system/components/map/constants/map.config";
import {
  DRAW_FILL_LAYER_ID,
  DRAW_LINE_LAYER_ID,
  DRAW_VERTEX_LAYER_ID,
} from "@/design-system/components/map/hooks/use-map-draw";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import { normalizePolygonFeature } from "@/features/mitra/data-request/utils/clip-and-union-kawasan";
import type { CartMapLayerOptions } from "@/features/mitra/cart/types/mitra.cart.order.type";
import type GeoJSON from "geojson";
import type maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

export const CART_AOI_SOURCE_ID = "cart-aoi-source";
export const CART_AOI_FILL_ID = "cart-aoi-fill";
export const CART_AOI_LINE_ID = "cart-aoi-line";

export const CART_COVERAGE_SOURCE_ID = "cart-coverage-source";
export const CART_COVERAGE_FILL_ID = "cart-coverage-fill";
export const CART_COVERAGE_LINE_ID = "cart-coverage-line";

const getAoiColor = (selectionType?: string) => {
  switch (selectionType) {
    case "catalog":
      return {
        fill: "#a855f7",
        line: "#7c3aed",
      };
    case "upload_aoi":
      return {
        fill: "#f97316",
        line: "#ea580c",
      };
    case "draw_aoi":
      return {
        fill: "#3b82f6",
        line: "#2563eb",
      };
    default:
      return {
        fill: "#a855f7",
        line: "#7c3aed",
      };
  }
};

const COVERAGE_COLOR = {
  fill: "#10b981",
  line: "#059669",
};

/**
 * Returns the layer ID that Cart AOI/Coverage layers should be inserted before (below draw layer).
 */
const getBeforeId = (map: maplibregl.Map): string | undefined => {
  if (map.getLayer(DRAW_FILL_LAYER_ID)) return DRAW_FILL_LAYER_ID;
  const styleLayers = map.getStyle()?.layers;
  if (styleLayers) {
    const building3dIdx = styleLayers.findIndex((l) => l.id === "building-3d");
    const buildingIdx = styleLayers.findIndex((l) => l.id === "building");
    const maxBuildingIdx = Math.max(building3dIdx, buildingIdx);

    if (maxBuildingIdx !== -1) {
      for (let i = maxBuildingIdx + 1; i < styleLayers.length; i++) {
        if (styleLayers[i].type === "symbol") {
          return styleLayers[i].id;
        }
      }
    }

    const firstSymbol = styleLayers.find((l) => l.type === "symbol");
    if (firstSymbol) return firstSymbol.id;
  }
  return undefined;
};

/** Removes all Cart AOI and Coverage layers & sources from map. */
export const removeCartMapLayers = (map: maplibregl.Map | null) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!map || !(map as any).style) return;

  try {
    if (map.getLayer(CART_COVERAGE_FILL_ID)) map.removeLayer(CART_COVERAGE_FILL_ID);
    if (map.getLayer(CART_COVERAGE_LINE_ID)) map.removeLayer(CART_COVERAGE_LINE_ID);
    if (map.getSource(CART_COVERAGE_SOURCE_ID)) map.removeSource(CART_COVERAGE_SOURCE_ID);

    if (map.getLayer(CART_AOI_FILL_ID)) map.removeLayer(CART_AOI_FILL_ID);
    if (map.getLayer(CART_AOI_LINE_ID)) map.removeLayer(CART_AOI_LINE_ID);
    if (map.getSource(CART_AOI_SOURCE_ID)) map.removeSource(CART_AOI_SOURCE_ID);
  } catch (err) {
    console.warn("Failed to remove cart map layers:", err);
  }
};

/**
 * Renders or updates Cart AOI & Coverage polygon layers on MapLibre.
 */
export const renderCartMapLayers = (
  map: maplibregl.Map | null,
  options: CartMapLayerOptions,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!map || !(map as any).style) return;

  const {
    aoiPolygon,
    coveragePolygon,
    selectionType,
    isAoiVisible = true,
    isCoverageVisible = true,
  } = options;

  const beforeId = getBeforeId(map);
  const aoiFeature = normalizePolygonFeature(aoiPolygon);
  const coverageFeature = normalizePolygonFeature(coveragePolygon);

  // 1. Manage AOI layer (useMapDraw natively renders the drawn polygon for draw_aoi)
  if (selectionType === "draw_aoi") {
    // Remove duplicate cart-aoi layers if present
    if (map.getLayer(CART_AOI_FILL_ID)) map.removeLayer(CART_AOI_FILL_ID);
    if (map.getLayer(CART_AOI_LINE_ID)) map.removeLayer(CART_AOI_LINE_ID);
    if (map.getSource(CART_AOI_SOURCE_ID)) map.removeSource(CART_AOI_SOURCE_ID);

    // Sync visibility directly to the draw layers
    if (map.getLayer(DRAW_FILL_LAYER_ID)) {
      map.setLayoutProperty(
        DRAW_FILL_LAYER_ID,
        "visibility",
        isAoiVisible ? "visible" : "none",
      );
    }
    if (map.getLayer(DRAW_LINE_LAYER_ID)) {
      map.setLayoutProperty(
        DRAW_LINE_LAYER_ID,
        "visibility",
        isAoiVisible ? "visible" : "none",
      );
    }
    if (map.getLayer(DRAW_VERTEX_LAYER_ID)) {
      map.setLayoutProperty(
        DRAW_VERTEX_LAYER_ID,
        "visibility",
        isAoiVisible ? "visible" : "none",
      );
    }
  } else if (aoiFeature && isAoiVisible) {
    const colors = getAoiColor(selectionType);
    const existingSource = map.getSource(CART_AOI_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;

    if (existingSource) {
      existingSource.setData(aoiFeature);
    } else {
      try {
        map.addSource(CART_AOI_SOURCE_ID, {
          type: "geojson",
          data: aoiFeature,
        });
      } catch (err) {
        console.warn("Failed to add CART_AOI_SOURCE_ID:", err);
      }
    }

    if (!map.getLayer(CART_AOI_FILL_ID)) {
      try {
        map.addLayer(
          {
            id: CART_AOI_FILL_ID,
            type: "fill",
            source: CART_AOI_SOURCE_ID,
            paint: {
              "fill-color": colors.fill,
              "fill-opacity": 0.2,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn("Failed to add CART_AOI_FILL_ID:", err);
      }
    } else {
      map.setPaintProperty(CART_AOI_FILL_ID, "fill-color", colors.fill);
      map.setLayoutProperty(CART_AOI_FILL_ID, "visibility", "visible");
    }

    if (!map.getLayer(CART_AOI_LINE_ID)) {
      try {
        map.addLayer(
          {
            id: CART_AOI_LINE_ID,
            type: "line",
            source: CART_AOI_SOURCE_ID,
            paint: {
              "line-color": colors.line,
              "line-width": 2.5,
              "line-opacity": 0.9,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn("Failed to add CART_AOI_LINE_ID:", err);
      }
    } else {
      map.setPaintProperty(CART_AOI_LINE_ID, "line-color", colors.line);
      map.setLayoutProperty(CART_AOI_LINE_ID, "visibility", "visible");
    }
  } else {
    // Hide or remove AOI
    if (map.getLayer(CART_AOI_FILL_ID)) {
      map.setLayoutProperty(CART_AOI_FILL_ID, "visibility", "none");
    }
    if (map.getLayer(CART_AOI_LINE_ID)) {
      map.setLayoutProperty(CART_AOI_LINE_ID, "visibility", "none");
    }
  }

  // 2. Manage Coverage layer (Green)
  if (coverageFeature && isCoverageVisible) {
    const existingSource = map.getSource(CART_COVERAGE_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;

    if (existingSource) {
      existingSource.setData(coverageFeature);
    } else {
      try {
        map.addSource(CART_COVERAGE_SOURCE_ID, {
          type: "geojson",
          data: coverageFeature,
        });
      } catch (err) {
        console.warn("Failed to add CART_COVERAGE_SOURCE_ID:", err);
      }
    }

    if (!map.getLayer(CART_COVERAGE_FILL_ID)) {
      try {
        map.addLayer(
          {
            id: CART_COVERAGE_FILL_ID,
            type: "fill",
            source: CART_COVERAGE_SOURCE_ID,
            paint: {
              "fill-color": COVERAGE_COLOR.fill,
              "fill-opacity": 0.35,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn("Failed to add CART_COVERAGE_FILL_ID:", err);
      }
    } else {
      map.setLayoutProperty(CART_COVERAGE_FILL_ID, "visibility", "visible");
    }

    if (!map.getLayer(CART_COVERAGE_LINE_ID)) {
      try {
        map.addLayer(
          {
            id: CART_COVERAGE_LINE_ID,
            type: "line",
            source: CART_COVERAGE_SOURCE_ID,
            paint: {
              "line-color": COVERAGE_COLOR.line,
              "line-width": 2.5,
              "line-opacity": 1.0,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn("Failed to add CART_COVERAGE_LINE_ID:", err);
      }
    } else {
      map.setLayoutProperty(CART_COVERAGE_LINE_ID, "visibility", "visible");
    }
  } else {
    // Hide or remove Coverage
    if (map.getLayer(CART_COVERAGE_FILL_ID)) {
      map.setLayoutProperty(CART_COVERAGE_FILL_ID, "visibility", "none");
    }
    if (map.getLayer(CART_COVERAGE_LINE_ID)) {
      map.setLayoutProperty(CART_COVERAGE_LINE_ID, "visibility", "none");
    }
  }
};

/**
 * Fly / zoom map camera safely to a GeoJSON polygon or multi-polygon with highlight overlay.
 */
export const flyToCartGeometry = (
  map: maplibregl.Map | null,
  geometry?:
    | GeoJSON.MultiPolygon
    | GeoJSON.Polygon
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | null,
  options?: {
    zoom?: number;
    timeoutMs?: number;
  },
) => {
  if (!map || !geometry) return;
  const feat = normalizePolygonFeature(geometry);
  if (!feat || !feat.geometry) return;

  const { zoom = 16, timeoutMs = 1500 } = options ?? {};

  highlightFeatureOnMap(map, feat, {
    zoom,
    fitCamera: true,
    timeoutMs,
  });
};

/**
 * Hook to manage Cart AOI and Coverage layers with cleanup on unmount.
 */
export const useCartAoiCoverageMap = (
  map: maplibregl.Map | null,
  options: CartMapLayerOptions,
) => {
  // Destructure options for precise dependencies
  const {
    aoiPolygon,
    coveragePolygon,
    selectionType,
    isAoiVisible = true,
    isCoverageVisible = true,
  } = options;

  // Refs — Hold latest options for event callbacks without re-triggering unmount/remount
  const optionsRef = useRef(options);

  // Effects — Keep optionsRef synchronized without mutating ref during render
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Effects — Setup map event listeners and unmount cleanup
  useEffect(() => {
    if (!map) return;

    const handleReady = () => {
      renderCartMapLayers(map, optionsRef.current);
    };

    map.on(MAP_EVENTS_MAP.styleReady as string, handleReady);
    map.on(MAP_EVENTS_MAP.layersReady as string, handleReady);

    return () => {
      map.off(MAP_EVENTS_MAP.styleReady as string, handleReady);
      map.off(MAP_EVENTS_MAP.layersReady as string, handleReady);
      removeCartMapLayers(map);
    };
  }, [map]);

  // Effects — Synchronize map layers whenever options properties change
  useEffect(() => {
    if (!map) return;
    renderCartMapLayers(map, {
      aoiPolygon,
      coveragePolygon,
      selectionType,
      isAoiVisible,
      isCoverageVisible,
    });
  }, [
    map,
    aoiPolygon,
    coveragePolygon,
    selectionType,
    isAoiVisible,
    isCoverageVisible,
  ]);
};
