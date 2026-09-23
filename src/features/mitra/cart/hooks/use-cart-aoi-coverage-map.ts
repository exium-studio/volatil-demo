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

/** Helper to generate isolated namespaced source & layer IDs per selection tab */
export const getCartAoiLayerIds = (selectionType?: string) => {
  const key = selectionType ?? "catalog";
  return {
    sourceId: `cart-aoi-${key}-source`,
    fillId: `cart-aoi-${key}-fill`,
    lineId: `cart-aoi-${key}-line`,
  };
};

export const getCartCoverageLayerIds = (selectionType?: string) => {
  const key = selectionType ?? "catalog";
  return {
    sourceId: `cart-coverage-${key}-source`,
    fillId: `cart-coverage-${key}-fill`,
    lineId: `cart-coverage-${key}-line`,
  };
};

// Compatibility aliases
export const CART_AOI_SOURCE_ID = "cart-aoi-catalog-source";
export const CART_AOI_FILL_ID = "cart-aoi-catalog-fill";
export const CART_AOI_LINE_ID = "cart-aoi-catalog-line";

export const CART_COVERAGE_SOURCE_ID = "cart-coverage-catalog-source";
export const CART_COVERAGE_FILL_ID = "cart-coverage-catalog-fill";
export const CART_COVERAGE_LINE_ID = "cart-coverage-catalog-line";

export const getAoiColor = (selectionType?: string) => {
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

export const getCoverageColor = (selectionType?: string) => {
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

/** Removes Cart AOI and Coverage layers & sources from map for specified selectionType or all types. */
export const removeCartMapLayers = (
  map: maplibregl.Map | null,
  selectionType?: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!map || !(map as any).style) return;

  const types = selectionType
    ? [selectionType]
    : ["catalog", "draw_aoi", "upload_aoi"];

  try {
    types.forEach((typeKey) => {
      const cov = getCartCoverageLayerIds(typeKey);
      const aoi = getCartAoiLayerIds(typeKey);

      if (map.getLayer(cov.fillId)) map.removeLayer(cov.fillId);
      if (map.getLayer(cov.lineId)) map.removeLayer(cov.lineId);
      if (map.getSource(cov.sourceId)) map.removeSource(cov.sourceId);

      if (map.getLayer(aoi.fillId)) map.removeLayer(aoi.fillId);
      if (map.getLayer(aoi.lineId)) map.removeLayer(aoi.lineId);
      if (map.getSource(aoi.sourceId)) map.removeSource(aoi.sourceId);
    });
  } catch (err) {
    console.warn("Failed to remove cart map layers:", err);
  }
};

/**
 * Renders or updates Cart AOI & Coverage polygon layers on MapLibre independently per tab.
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
    selectionType = "catalog",
    isAoiVisible = true,
    isCoverageVisible = true,
    isActive = true,
  } = options;

  const aoiIds = getCartAoiLayerIds(selectionType);
  const coverageIds = getCartCoverageLayerIds(selectionType);
  const aoiColors = getAoiColor(selectionType);
  const coverageColors = getCoverageColor(selectionType);
  const beforeId = getBeforeId(map);
  const aoiFeature = normalizePolygonFeature(aoiPolygon);
  const coverageFeature = normalizePolygonFeature(coveragePolygon);

  // 1. Manage AOI layer
  if (selectionType === "draw_aoi") {
    // Draw AOI uses MapLibre native draw stack (useMapDraw)
    const isVisible = isActive && isAoiVisible;
    if (map.getLayer(DRAW_FILL_LAYER_ID)) {
      map.setLayoutProperty(
        DRAW_FILL_LAYER_ID,
        "visibility",
        isVisible ? "visible" : "none",
      );
    }
    if (map.getLayer(DRAW_LINE_LAYER_ID)) {
      map.setLayoutProperty(
        DRAW_LINE_LAYER_ID,
        "visibility",
        isVisible ? "visible" : "none",
      );
    }
    if (map.getLayer(DRAW_VERTEX_LAYER_ID)) {
      map.setLayoutProperty(
        DRAW_VERTEX_LAYER_ID,
        "visibility",
        isVisible ? "visible" : "none",
      );
    }
  } else if (isActive && aoiFeature && isAoiVisible) {
    const existingSource = map.getSource(aoiIds.sourceId) as
      | maplibregl.GeoJSONSource
      | undefined;

    if (existingSource) {
      existingSource.setData(aoiFeature);
    } else {
      try {
        map.addSource(aoiIds.sourceId, {
          type: "geojson",
          data: aoiFeature,
        });
      } catch (err) {
        console.warn(`Failed to add ${aoiIds.sourceId}:`, err);
      }
    }

    if (!map.getLayer(aoiIds.fillId)) {
      try {
        map.addLayer(
          {
            id: aoiIds.fillId,
            type: "fill",
            source: aoiIds.sourceId,
            paint: {
              "fill-color": aoiColors.fill,
              "fill-opacity": 0.2,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn(`Failed to add ${aoiIds.fillId}:`, err);
      }
    } else {
      map.setPaintProperty(aoiIds.fillId, "fill-color", aoiColors.fill);
      map.setLayoutProperty(aoiIds.fillId, "visibility", "visible");
    }

    if (!map.getLayer(aoiIds.lineId)) {
      try {
        map.addLayer(
          {
            id: aoiIds.lineId,
            type: "line",
            source: aoiIds.sourceId,
            paint: {
              "line-color": aoiColors.line,
              "line-width": 2.5,
              "line-opacity": 0.9,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn(`Failed to add ${aoiIds.lineId}:`, err);
      }
    } else {
      map.setPaintProperty(aoiIds.lineId, "line-color", aoiColors.line);
      map.setLayoutProperty(aoiIds.lineId, "visibility", "visible");
    }
  } else {
    // Hide AOI layers for this tab
    if (map.getLayer(aoiIds.fillId)) {
      map.setLayoutProperty(aoiIds.fillId, "visibility", "none");
    }
    if (map.getLayer(aoiIds.lineId)) {
      map.setLayoutProperty(aoiIds.lineId, "visibility", "none");
    }
  }

  // 2. Manage Coverage layer (independent per tab)
  if (isActive && coverageFeature && isCoverageVisible) {
    const existingSource = map.getSource(coverageIds.sourceId) as
      | maplibregl.GeoJSONSource
      | undefined;

    if (existingSource) {
      existingSource.setData(coverageFeature);
    } else {
      try {
        map.addSource(coverageIds.sourceId, {
          type: "geojson",
          data: coverageFeature,
        });
      } catch (err) {
        console.warn(`Failed to add ${coverageIds.sourceId}:`, err);
      }
    }

    if (!map.getLayer(coverageIds.fillId)) {
      try {
        map.addLayer(
          {
            id: coverageIds.fillId,
            type: "fill",
            source: coverageIds.sourceId,
            paint: {
              "fill-color": coverageColors.fill,
              "fill-opacity": 0.35,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn(`Failed to add ${coverageIds.fillId}:`, err);
      }
    } else {
      map.setPaintProperty(
        coverageIds.fillId,
        "fill-color",
        coverageColors.fill,
      );
      map.setLayoutProperty(coverageIds.fillId, "visibility", "visible");
    }

    if (!map.getLayer(coverageIds.lineId)) {
      try {
        map.addLayer(
          {
            id: coverageIds.lineId,
            type: "line",
            source: coverageIds.sourceId,
            paint: {
              "line-color": coverageColors.line,
              "line-width": 2.5,
              "line-opacity": 1.0,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn(`Failed to add ${coverageIds.lineId}:`, err);
      }
    } else {
      map.setPaintProperty(
        coverageIds.lineId,
        "line-color",
        coverageColors.line,
      );
      map.setLayoutProperty(coverageIds.lineId, "visibility", "visible");
    }
  } else {
    // Hide Coverage layers for this tab
    if (map.getLayer(coverageIds.fillId)) {
      map.setLayoutProperty(coverageIds.fillId, "visibility", "none");
    }
    if (map.getLayer(coverageIds.lineId)) {
      map.setLayoutProperty(coverageIds.lineId, "visibility", "none");
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
    isActive = true,
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
      removeCartMapLayers(map, optionsRef.current.selectionType);
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
      isActive,
    });
  }, [
    map,
    aoiPolygon,
    coveragePolygon,
    selectionType,
    isAoiVisible,
    isCoverageVisible,
    isActive,
  ]);
};
