// src/features/mitra/data-request/hooks/use-mitra-upload-aoi.ts

import { MAP_EVENTS_MAP } from "@/design-system/components/map/constants/map.config";
import { DRAW_FILL_LAYER_ID } from "@/design-system/components/map/hooks/use-map-draw";
import type GeoJSON from "geojson";
import type maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

/** MapLibre source & layer ID prefixes for Upload AOI polygon layers. */
export const UPLOAD_AOI_SOURCE_PREFIX = "upload-aoi-source-";
export const UPLOAD_AOI_FILL_PREFIX = "upload-aoi-fill-";
export const UPLOAD_AOI_LINE_PREFIX = "upload-aoi-line-";

/** Orange theme color — visually distinct from Draw AOI (blue). */
const AOI_FILL_COLOR = "#f97316";
const AOI_FILL_OPACITY = 0.15;
const AOI_LINE_COLOR = "#f97316";
const AOI_LINE_WIDTH = 2;

/**
 * Returns the layer ID that Upload AOI layers should be inserted before (below draw layers),
 * satisfying rule: basemap → wms-raster → wfs-* → upload-aoi → draw.
 */
const getBeforeId = (map: maplibregl.Map): string | undefined => {
  if (map.getLayer(DRAW_FILL_LAYER_ID)) return DRAW_FILL_LAYER_ID;
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
  activeFeatures: Array<{ id: string; polygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> }>,
) => {
  const activeFeaturesRef = useRef(activeFeatures);
  useEffect(() => {
    activeFeaturesRef.current = activeFeatures;
  }, [activeFeatures]);

  // Rebuild all layers from scratch on mount & style reload
  useEffect(() => {
    if (!map) return;

    const rebuildAll = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style) return;

      const style = map.getStyle();
      style?.layers?.forEach((l) => {
        if (
          l.id.startsWith(UPLOAD_AOI_FILL_PREFIX) ||
          l.id.startsWith(UPLOAD_AOI_LINE_PREFIX)
        ) {
          if (map.getLayer(l.id)) map.removeLayer(l.id);
        }
      });

      if (style?.sources) {
        Object.keys(style.sources).forEach((sid) => {
          if (sid.startsWith(UPLOAD_AOI_SOURCE_PREFIX) && map.getSource(sid)) {
            map.removeSource(sid);
          }
        });
      }

      const beforeId = getBeforeId(map);
      activeFeaturesRef.current.forEach((feat) =>
        addAoiLayer(map, feat.id, feat.polygon, beforeId),
      );
    };

    map.on(MAP_EVENTS_MAP.styleReady as string, rebuildAll);
    if (map.isStyleLoaded()) rebuildAll();

    return () => {
      map.off(MAP_EVENTS_MAP.styleReady as string, rebuildAll);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style) return;
      activeFeaturesRef.current.forEach((feat) => removeAoiLayer(map, feat.id));
    };
  }, [map]);

  // Reactive sync when activeFeatures state updates
  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style || !map.isStyleLoaded()) return;

    const beforeId = getBeforeId(map);

    // Add new active features
    activeFeatures.forEach((feat) => {
      const fillId = `${UPLOAD_AOI_FILL_PREFIX}${feat.id}`;
      if (!map.getLayer(fillId)) {
        addAoiLayer(map, feat.id, feat.polygon, beforeId);
      }
    });

    // Remove deleted features
    const currentIds = new Set(activeFeatures.map((f) => f.id));
    const style = map.getStyle();
    style?.layers?.forEach((l) => {
      if (l.id.startsWith(UPLOAD_AOI_FILL_PREFIX)) {
        const featureId = l.id.replace(UPLOAD_AOI_FILL_PREFIX, "");
        if (!currentIds.has(featureId)) {
          removeAoiLayer(map, featureId);
        }
      }
    });
  }, [map, activeFeatures]);
};

export const useUploadAoi = useMitraUploadAoi;


