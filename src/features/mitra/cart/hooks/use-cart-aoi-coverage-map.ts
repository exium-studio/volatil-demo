// src/features/mitra/cart/hooks/use-cart-aoi-coverage-map.ts

import { MAP_EVENTS_MAP } from "@/design-system/components/map/constants/map.config";
import { DRAW_FILL_LAYER_ID } from "@/design-system/components/map/hooks/use-map-draw";
import { normalizePolygonFeature } from "@/features/mitra/data-request/utils/clip-and-union-kawasan";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import { getSelectionTypeMapColors } from "@/features/shared/constants/volatil.ssot-map";
import type { CartMapLayerOptions } from "@/features/mitra/cart/types/mitra.cart.order.type";
import type GeoJSON from "geojson";
import type maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

const EMPTY_FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

export const KNOWN_SELECTION_TYPE_KEYS = [
  "catalog",
  "upload",
  "draw",
  "cart",
] as const;

/** Normalizes selectionType key for independent per-tab layer & source namespacing */
export const normalizeSelectionTypeKey = (
  selectionType?: string | null,
): string => {
  if (!selectionType) return "catalog";
  if (selectionType === "upload" || selectionType === "upload_aoi")
    return "upload";
  if (selectionType === "draw" || selectionType === "draw_aoi") return "draw";
  if (selectionType === "cart") return "cart";
  return selectionType.toLowerCase().replace(/[^a-z0-9_-]/g, "");
};

/** Helper returning the independent recycled source & layer IDs per selectionType */
export const getCartAoiLayerIds = (selectionType?: string | null) => {
  const key = normalizeSelectionTypeKey(selectionType);
  return {
    sourceId: `${key}-aoi-source`,
    fillId: `${key}-aoi-fill`,
    lineId: `${key}-aoi-line`,
  };
};

export const getCartCoverageLayerIds = (selectionType?: string | null) => {
  const key = normalizeSelectionTypeKey(selectionType);
  return {
    sourceId: `${key}-coverage-source`,
    fillId: `${key}-coverage-fill`,
    lineId: `${key}-coverage-line`,
  };
};

export const getCartBidangLayerIds = (selectionType?: string | null) => {
  const key = normalizeSelectionTypeKey(selectionType);
  return {
    sourceId: `${key}-bidang-source`,
    fillId: `${key}-bidang-fill`,
    lineId: `${key}-bidang-line`,
  };
};

/** Backwards-compatible constants default to catalog */
export const CART_AOI_SOURCE_ID = "catalog-aoi-source";
export const CART_AOI_FILL_ID = "catalog-aoi-fill";
export const CART_AOI_LINE_ID = "catalog-aoi-line";

export const CART_COVERAGE_SOURCE_ID = "catalog-coverage-source";
export const CART_COVERAGE_FILL_ID = "catalog-coverage-fill";
export const CART_COVERAGE_LINE_ID = "catalog-coverage-line";

export const CART_BIDANG_SOURCE_ID = "catalog-bidang-source";
export const CART_BIDANG_FILL_ID = "catalog-bidang-fill";
export const CART_BIDANG_LINE_ID = "catalog-bidang-line";

/** Compatibility color helpers backed by SSOT */
export const getAoiColor = (selectionType?: string) =>
  getSelectionTypeMapColors(selectionType);

export const getCoverageColor = (selectionType?: string) =>
  getSelectionTypeMapColors(selectionType);

export const getBidangColor = (selectionType?: string) =>
  getSelectionTypeMapColors(selectionType);

export const BIDANG_MAP_COLOR = {
  fill: "#a855f7",
  line: "#7c3aed",
};

import { FEATURE_INFO_FILL_LAYER_ID } from "@/design-system/components/map/hooks/use-map-feature-info";
import { HIGHLIGHT_FILL_LAYER_ID } from "@/features/mitra/data-request/utils/highlight-feature-on-map";

/**
 * Returns the layer ID that Cart AOI/Coverage layers should be inserted before (below draw, feature info & highlight layers).
 * If no draw/highlight/feature-info layer exists, returns undefined to place on the top-most layer stack (above WMS/WFS).
 */
const getBeforeId = (map: maplibregl.Map): string | undefined => {
  if (map.getLayer(HIGHLIGHT_FILL_LAYER_ID)) return HIGHLIGHT_FILL_LAYER_ID;
  if (map.getLayer(FEATURE_INFO_FILL_LAYER_ID)) return FEATURE_INFO_FILL_LAYER_ID;
  if (map.getLayer(DRAW_FILL_LAYER_ID)) return DRAW_FILL_LAYER_ID;
  return undefined;
};

/** Removes recycled Cart AOI, Coverage, and Bidang layers & sources for a given selectionType (or all if omitted) from map. */
export const removeCartMapLayers = (
  map: maplibregl.Map | null,
  selectionType?: string | null,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!map || !(map as any).style) return;

  const typesToRemove = selectionType
    ? [normalizeSelectionTypeKey(selectionType)]
    : KNOWN_SELECTION_TYPE_KEYS;

  for (const key of typesToRemove) {
    const aoiIds = getCartAoiLayerIds(key);
    const covIds = getCartCoverageLayerIds(key);
    const bidIds = getCartBidangLayerIds(key);

    try {
      if (map.getLayer(bidIds.fillId)) map.removeLayer(bidIds.fillId);
      if (map.getLayer(bidIds.lineId)) map.removeLayer(bidIds.lineId);
      if (map.getSource(bidIds.sourceId)) map.removeSource(bidIds.sourceId);

      if (map.getLayer(covIds.fillId)) map.removeLayer(covIds.fillId);
      if (map.getLayer(covIds.lineId)) map.removeLayer(covIds.lineId);
      if (map.getSource(covIds.sourceId)) map.removeSource(covIds.sourceId);

      if (map.getLayer(aoiIds.fillId)) map.removeLayer(aoiIds.fillId);
      if (map.getLayer(aoiIds.lineId)) map.removeLayer(aoiIds.lineId);
      if (map.getSource(aoiIds.sourceId)) map.removeSource(aoiIds.sourceId);
    } catch (err) {
      console.warn("Failed to remove cart map layers:", err);
    }
  }
};

/**
 * Renders or updates recycled Cart AOI & Coverage polygon layers on MapLibre.
 * Each tab/selectionType has independent, recycled source and layer IDs to avoid collisions and flickering.
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
    bidangFeatures,
    selectionType = "catalog",
    isAoiVisible = true,
    isCoverageVisible = true,
    isBidangVisible = true,
    isActive = true,
    exclusive = false,
  } = options;

  const aoiIds = getCartAoiLayerIds(selectionType);
  const covIds = getCartCoverageLayerIds(selectionType);
  const bidIds = getCartBidangLayerIds(selectionType);
  const colors = getSelectionTypeMapColors(selectionType);
  const beforeId = getBeforeId(map);
  const aoiFeature = normalizePolygonFeature(aoiPolygon);
  const coverageFeature = normalizePolygonFeature(coveragePolygon);

  // When exclusive mode is enabled (e.g. Cart page), hide / clear layers of all other selection types
  if (exclusive) {
    const currentKey = normalizeSelectionTypeKey(selectionType);
    KNOWN_SELECTION_TYPE_KEYS.filter((k) => k !== currentKey).forEach(
      (otherKey) => {
        const otherAoi = getCartAoiLayerIds(otherKey);
        const otherCov = getCartCoverageLayerIds(otherKey);
        const otherBid = getCartBidangLayerIds(otherKey);

        const aoiSource = map.getSource(otherAoi.sourceId) as
          | maplibregl.GeoJSONSource
          | undefined;
        if (aoiSource) aoiSource.setData(EMPTY_FEATURE_COLLECTION);
        if (map.getLayer(otherAoi.fillId)) {
          map.setLayoutProperty(otherAoi.fillId, "visibility", "none");
        }
        if (map.getLayer(otherAoi.lineId)) {
          map.setLayoutProperty(otherAoi.lineId, "visibility", "none");
        }

        const covSource = map.getSource(otherCov.sourceId) as
          | maplibregl.GeoJSONSource
          | undefined;
        if (covSource) covSource.setData(EMPTY_FEATURE_COLLECTION);
        if (map.getLayer(otherCov.fillId)) {
          map.setLayoutProperty(otherCov.fillId, "visibility", "none");
        }
        if (map.getLayer(otherCov.lineId)) {
          map.setLayoutProperty(otherCov.lineId, "visibility", "none");
        }

        const bidSource = map.getSource(otherBid.sourceId) as
          | maplibregl.GeoJSONSource
          | undefined;
        if (bidSource) bidSource.setData(EMPTY_FEATURE_COLLECTION);
        if (map.getLayer(otherBid.fillId)) {
          map.setLayoutProperty(otherBid.fillId, "visibility", "none");
        }
        if (map.getLayer(otherBid.lineId)) {
          map.setLayoutProperty(otherBid.lineId, "visibility", "none");
        }
      },
    );
  }

  // 1. Manage Recycled AOI layer for this selectionType
  const shouldShowAoi = isActive && isAoiVisible && Boolean(aoiFeature);

  if (shouldShowAoi && aoiFeature) {
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
        console.warn(`Failed to add source ${aoiIds.sourceId}:`, err);
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
              "fill-color": colors.fill,
              "fill-opacity": 0.2,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn(`Failed to add layer ${aoiIds.fillId}:`, err);
      }
    } else {
      map.setPaintProperty(aoiIds.fillId, "fill-color", colors.fill);
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
              "line-color": colors.line,
              "line-width": 2.5,
              "line-opacity": 0.9,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn(`Failed to add layer ${aoiIds.lineId}:`, err);
      }
    } else {
      map.setPaintProperty(aoiIds.lineId, "line-color", colors.line);
      map.setLayoutProperty(aoiIds.lineId, "visibility", "visible");
    }

    // Guarantee AOI layers stay on top
    try {
      const resolvedBefore =
        beforeId && map.getLayer(beforeId) ? beforeId : undefined;
      if (map.getLayer(aoiIds.fillId)) {
        map.moveLayer(aoiIds.fillId, resolvedBefore);
      }
      if (map.getLayer(aoiIds.lineId)) {
        map.moveLayer(aoiIds.lineId, resolvedBefore);
      }
    } catch (err) {
      console.warn("Failed to move AOI layers to top:", err);
    }
  } else {
    // Hide or clear AOI layers for this selectionType
    const existingSource = map.getSource(aoiIds.sourceId) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (existingSource) {
      existingSource.setData(EMPTY_FEATURE_COLLECTION);
    }
    if (map.getLayer(aoiIds.fillId)) {
      map.setLayoutProperty(aoiIds.fillId, "visibility", "none");
    }
    if (map.getLayer(aoiIds.lineId)) {
      map.setLayoutProperty(aoiIds.lineId, "visibility", "none");
    }
  }

  // 2. Manage Recycled Coverage layer for this selectionType (colors match selectionType SSOT)
  const shouldShowCoverage =
    isActive && isCoverageVisible && Boolean(coverageFeature);

  if (shouldShowCoverage && coverageFeature) {
    const existingSource = map.getSource(covIds.sourceId) as
      | maplibregl.GeoJSONSource
      | undefined;

    if (existingSource) {
      existingSource.setData(coverageFeature);
    } else {
      try {
        map.addSource(covIds.sourceId, {
          type: "geojson",
          data: coverageFeature,
        });
      } catch (err) {
        console.warn(`Failed to add source ${covIds.sourceId}:`, err);
      }
    }

    if (!map.getLayer(covIds.fillId)) {
      try {
        map.addLayer(
          {
            id: covIds.fillId,
            type: "fill",
            source: covIds.sourceId,
            paint: {
              "fill-color": colors.fill,
              "fill-opacity": 0.35,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn(`Failed to add layer ${covIds.fillId}:`, err);
      }
    } else {
      map.setPaintProperty(covIds.fillId, "fill-color", colors.fill);
      map.setLayoutProperty(covIds.fillId, "visibility", "visible");
    }

    if (!map.getLayer(covIds.lineId)) {
      try {
        map.addLayer(
          {
            id: covIds.lineId,
            type: "line",
            source: covIds.sourceId,
            paint: {
              "line-color": colors.line,
              "line-width": 2.5,
              "line-opacity": 1.0,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn(`Failed to add layer ${covIds.lineId}:`, err);
      }
    } else {
      map.setPaintProperty(covIds.lineId, "line-color", colors.line);
      map.setLayoutProperty(covIds.lineId, "visibility", "visible");
    }

    // Guarantee Coverage layers stay above WMS/WFS but below AOI
    try {
      const covBefore = map.getLayer(aoiIds.fillId)
        ? aoiIds.fillId
        : beforeId && map.getLayer(beforeId)
          ? beforeId
          : undefined;
      if (map.getLayer(covIds.fillId)) {
        map.moveLayer(covIds.fillId, covBefore);
      }
      if (map.getLayer(covIds.lineId)) {
        map.moveLayer(covIds.lineId, covBefore);
      }
    } catch (err) {
      console.warn("Failed to move Coverage layers:", err);
    }
  } else {
    // Hide or clear Coverage layers for this selectionType
    const existingSource = map.getSource(covIds.sourceId) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (existingSource) {
      existingSource.setData(EMPTY_FEATURE_COLLECTION);
    }
    if (map.getLayer(covIds.fillId)) {
      map.setLayoutProperty(covIds.fillId, "visibility", "none");
    }
    if (map.getLayer(covIds.lineId)) {
      map.setLayoutProperty(covIds.lineId, "visibility", "none");
    }
  }

  // 3. Manage Recycled Bidang features layer for this selectionType
  const shouldShowBidang =
    isActive &&
    isBidangVisible &&
    Boolean(bidangFeatures?.features && bidangFeatures.features.length > 0);

  if (shouldShowBidang && bidangFeatures) {
    const existingSource = map.getSource(bidIds.sourceId) as
      | maplibregl.GeoJSONSource
      | undefined;

    if (existingSource) {
      existingSource.setData(bidangFeatures);
    } else {
      try {
        map.addSource(bidIds.sourceId, {
          type: "geojson",
          data: bidangFeatures,
        });
      } catch (err) {
        console.warn(`Failed to add source ${bidIds.sourceId}:`, err);
      }
    }

    if (!map.getLayer(bidIds.fillId)) {
      try {
        map.addLayer(
          {
            id: bidIds.fillId,
            type: "fill",
            source: bidIds.sourceId,
            paint: {
              "fill-color": colors.fill,
              "fill-opacity": 0.25,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn(`Failed to add layer ${bidIds.fillId}:`, err);
      }
    } else {
      map.setPaintProperty(bidIds.fillId, "fill-color", colors.fill);
      map.setLayoutProperty(bidIds.fillId, "visibility", "visible");
    }

    if (!map.getLayer(bidIds.lineId)) {
      try {
        map.addLayer(
          {
            id: bidIds.lineId,
            type: "line",
            source: bidIds.sourceId,
            paint: {
              "line-color": colors.line,
              "line-width": 1.8,
              "line-opacity": 0.9,
            },
          } as maplibregl.LayerSpecification,
          beforeId,
        );
      } catch (err) {
        console.warn(`Failed to add layer ${bidIds.lineId}:`, err);
      }
    } else {
      map.setPaintProperty(bidIds.lineId, "line-color", colors.line);
      map.setLayoutProperty(bidIds.lineId, "visibility", "visible");
    }

    // Stack Bidang below Coverage and AOI
    try {
      const bidBefore = map.getLayer(covIds.fillId)
        ? covIds.fillId
        : map.getLayer(aoiIds.fillId)
          ? aoiIds.fillId
          : beforeId && map.getLayer(beforeId)
            ? beforeId
            : undefined;
      if (map.getLayer(bidIds.fillId)) {
        map.moveLayer(bidIds.fillId, bidBefore);
      }
      if (map.getLayer(bidIds.lineId)) {
        map.moveLayer(bidIds.lineId, bidBefore);
      }
    } catch (err) {
      console.warn("Failed to move Bidang layers:", err);
    }
  } else {
    // Hide or clear Bidang layers for this selectionType
    const existingSource = map.getSource(bidIds.sourceId) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (existingSource) {
      existingSource.setData(EMPTY_FEATURE_COLLECTION);
    }
    if (map.getLayer(bidIds.fillId)) {
      map.setLayoutProperty(bidIds.fillId, "visibility", "none");
    }
    if (map.getLayer(bidIds.lineId)) {
      map.setLayoutProperty(bidIds.lineId, "visibility", "none");
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
 * Hook to manage independent recycled AOI, Coverage, and Bidang layers per tab/selectionType with cleanup on unmount.
 */
export const useCartAoiCoverageMap = (
  map: maplibregl.Map | null,
  options: CartMapLayerOptions,
) => {
  // Destructure options for precise dependencies
  const {
    aoiPolygon,
    coveragePolygon,
    bidangFeatures,
    selectionType,
    isAoiVisible = true,
    isCoverageVisible = true,
    isBidangVisible = true,
    isActive = true,
    exclusive = false,
  } = options;

  // Refs — Hold latest options for event callbacks without re-triggering unmount/remount
  const optionsRef = useRef(options);
  const prevSelectionTypeRef = useRef(selectionType);

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
      if (optionsRef.current.exclusive) {
        removeCartMapLayers(map);
      } else {
        removeCartMapLayers(map, optionsRef.current.selectionType);
      }
    };
  }, [map]);

  // Effects — Synchronize map layers whenever options properties change
  useEffect(() => {
    if (!map) return;

    // If selectionType changed, remove previous selectionType layers immediately
    if (
      prevSelectionTypeRef.current &&
      prevSelectionTypeRef.current !== selectionType
    ) {
      removeCartMapLayers(map, prevSelectionTypeRef.current);
    }
    prevSelectionTypeRef.current = selectionType;

    renderCartMapLayers(map, {
      aoiPolygon,
      coveragePolygon,
      bidangFeatures,
      selectionType,
      isAoiVisible,
      isCoverageVisible,
      isBidangVisible,
      isActive,
      exclusive,
    });
  }, [
    map,
    aoiPolygon,
    coveragePolygon,
    bidangFeatures,
    selectionType,
    isAoiVisible,
    isCoverageVisible,
    isBidangVisible,
    isActive,
    exclusive,
  ]);
};
