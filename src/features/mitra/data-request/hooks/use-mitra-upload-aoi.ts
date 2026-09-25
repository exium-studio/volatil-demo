// src\features\mitra\data-request\hooks\use-mitra-upload-aoi.ts

// src\features\mitra\data-request\hooks\use-mitra-upload-aoi.ts

import { MAP_EVENTS_MAP } from "@/design-system/components/map/constants/map.config";
import { DRAW_FILL_LAYER_ID } from "@/design-system/components/map/hooks/use-map-draw";
import type GeoJSON from "geojson";
import type maplibregl from "maplibre-gl";
import { useCallback, useEffect, useRef } from "react";

/** MapLibre source & layer ID prefixes for Upload AOI polygon layers. */
export const UPLOAD_AOI_SOURCE_PREFIX = "upload-aoi-source-";
export const UPLOAD_AOI_FILL_PREFIX = "upload-aoi-fill-";
export const UPLOAD_AOI_LINE_PREFIX = "upload-aoi-line-";

/** Orange theme color — visually distinct from Draw AOI (blue). */
const AOI_FILL_COLOR = "#f97316";
const AOI_FILL_OPACITY = 0.25;
const AOI_LINE_COLOR = "#ea580c";
const AOI_LINE_WIDTH = 2.5;

/**
 * Returns the layer ID that Upload AOI layers should be inserted before (below draw layers),
 * satisfying rule: basemap → wms-raster → wfs-* → upload-aoi → draw.
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

/** Safely adds or updates a GeoJSON source. */
const safeAddSource = (
  map: maplibregl.Map,
  id: string,
  data: GeoJSON.Feature,
) => {
  if (map.getSource(id)) {
    (map.getSource(id) as maplibregl.GeoJSONSource).setData(data);
    return;
  }
  try {
    map.addSource(id, { type: "geojson", data });
  } catch (err) {
    console.error(`[upload-aoi] Failed to add source "${id}"`, err);
  }
};

/** Safely adds a MapLibre layer before the target beforeId layer. */
const safeAddLayer = (
  map: maplibregl.Map,
  spec: maplibregl.LayerSpecification,
  beforeId?: string,
) => {
  if (map.getLayer(spec.id)) return;
  const resolvedBefore =
    beforeId && map.getLayer(beforeId) ? beforeId : undefined;
  try {
    map.addLayer(spec, resolvedBefore);
  } catch (err) {
    console.warn(
      `[upload-aoi] Fallback addLayer for "${spec.id}" without beforeId`,
      err,
    );
    try {
      map.addLayer(spec);
    } catch (e) {
      console.error(`[upload-aoi] Failed to add layer "${spec.id}"`, e);
    }
  }
};

/** Removes source + fill + line layers for a given id. */
const removeAoiLayer = (map: maplibregl.Map, id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(map as any).style) return;

  const fillId = `${UPLOAD_AOI_FILL_PREFIX}${id}`;
  const lineId = `${UPLOAD_AOI_LINE_PREFIX}${id}`;
  const sourceId = `${UPLOAD_AOI_SOURCE_PREFIX}${id}`;

  if (map.getLayer(fillId)) map.removeLayer(fillId);
  if (map.getLayer(lineId)) map.removeLayer(lineId);
  if (map.getSource(sourceId)) map.removeSource(sourceId);
};

/** Adds or updates source + fill + line layer pair for a single polygon feature. */
const addAoiLayer = (
  map: maplibregl.Map,
  id: string,
  polygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
  beforeId: string | undefined,
) => {
  const sourceId = `${UPLOAD_AOI_SOURCE_PREFIX}${id}`;
  const fillId = `${UPLOAD_AOI_FILL_PREFIX}${id}`;
  const lineId = `${UPLOAD_AOI_LINE_PREFIX}${id}`;

  safeAddSource(map, sourceId, polygon);

  safeAddLayer(
    map,
    {
      id: fillId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": AOI_FILL_COLOR,
        "fill-opacity": AOI_FILL_OPACITY,
      },
    } as maplibregl.LayerSpecification,
    beforeId,
  );

  safeAddLayer(
    map,
    {
      id: lineId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": AOI_LINE_COLOR,
        "line-width": AOI_LINE_WIDTH,
      },
    } as maplibregl.LayerSpecification,
    beforeId,
  );
};

/**
 * Manages MapLibre fill & line layers for uploaded AOI polygons (orange, distinct from draw).
 * Supports:
 * 1. Active confirmed AOI polygon.
 * 2. Toggleable visible features from the uploaded file list.
 */
export const useMitraUploadAoi = (
  map: maplibregl.Map | null,
  activeFeatures: Array<{
    id: string;
    polygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  }>,
  isActive: boolean = true,
) => {
  const activeFeaturesRef = useRef(activeFeatures);
  useEffect(() => {
    activeFeaturesRef.current = activeFeatures;
  }, [activeFeatures]);

  const syncAllActiveLayers = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!map || !(map as any).style) return;

    if (!isActive) {
      const style = map.getStyle();
      style?.layers?.forEach((l) => {
        if (l.id.startsWith(UPLOAD_AOI_FILL_PREFIX)) {
          const featureId = l.id.replace(UPLOAD_AOI_FILL_PREFIX, "");
          removeAoiLayer(map, featureId);
        }
      });
      return;
    }

    const beforeId = getBeforeId(map);
    const currentFeatures = activeFeaturesRef.current;
    const currentIds = new Set(currentFeatures.map((f) => f.id));

    // 1. Add or ensure active features are added
    currentFeatures.forEach((feat) => {
      addAoiLayer(map, feat.id, feat.polygon, beforeId);
    });

    // 2. Remove obsolete layers that are no longer in activeFeatures
    const style = map.getStyle();
    style?.layers?.forEach((l) => {
      if (l.id.startsWith(UPLOAD_AOI_FILL_PREFIX)) {
        const featureId = l.id.replace(UPLOAD_AOI_FILL_PREFIX, "");
        if (!currentIds.has(featureId)) {
          removeAoiLayer(map, featureId);
        }
      }
    });
  }, [map, isActive]);

  // Rebuild / resync all layers on style ready & layers ready
  useEffect(() => {
    if (!map) return;

    const handleReady = () => {
      syncAllActiveLayers();
    };

    map.on(MAP_EVENTS_MAP.styleReady as string, handleReady);
    map.on(MAP_EVENTS_MAP.layersReady as string, handleReady);
    syncAllActiveLayers();

    return () => {
      map.off(MAP_EVENTS_MAP.styleReady as string, handleReady);
      map.off(MAP_EVENTS_MAP.layersReady as string, handleReady);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!map || !(map as any).style) return;
      try {
        const style = map.getStyle();
        style?.layers?.forEach((l) => {
          if (l.id.startsWith(UPLOAD_AOI_FILL_PREFIX)) {
            const featureId = l.id.replace(UPLOAD_AOI_FILL_PREFIX, "");
            removeAoiLayer(map, featureId);
          }
        });
        activeFeaturesRef.current.forEach((feat) => removeAoiLayer(map, feat.id));
      } catch (err) {
        console.warn("Failed to cleanup upload AOI layers:", err);
      }
    };
  }, [map, syncAllActiveLayers]);

  // Reactive sync when activeFeatures or isActive state updates
  useEffect(() => {
    syncAllActiveLayers();
  }, [syncAllActiveLayers, activeFeatures, isActive]);
};

export const useUploadAoi = useMitraUploadAoi;



