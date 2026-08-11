// src/features/mitra/data-request/hooks/use-mitra-upload-aoi.ts

import { MAP_EVENTS_MAP } from "@/design-system/components/map/constants/map.config";
import { DRAW_FILL_LAYER_ID } from "@/design-system/components/map/hooks/use-map-draw";
import type { MitraDataRequestUploadAoiLayer } from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
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

/** Removes source + fill + line layers for a given MitraDataRequestUploadAoiLayer id. */
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

/** Adds or updates source + fill + line layer pair for a single MitraDataRequestUploadAoiLayer. */
const addAoiLayer = (
  map: maplibregl.Map,
  aoi: MitraDataRequestUploadAoiLayer,
  beforeId: string | undefined,
) => {
  const sourceId = `${UPLOAD_AOI_SOURCE_PREFIX}${aoi.id}`;
  const fillId = `${UPLOAD_AOI_FILL_PREFIX}${aoi.id}`;
  const lineId = `${UPLOAD_AOI_LINE_PREFIX}${aoi.id}`;

  safeAddSource(map, sourceId, aoi.polygon);

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
 * - Reactively renders layers as MitraDataRequestUploadAoiLayer items complete parsing ("done").
 * - Cleanly removes layers when MitraDataRequestUploadAoiLayer items are deleted.
 * - Survives map style reload via MAP_EVENTS_MAP.styleReady.
 */
export const useMitraUploadAoi = (
  map: maplibregl.Map | null,
  aoiLayers: MitraDataRequestUploadAoiLayer[],
) => {
  const aoiLayersRef = useRef(aoiLayers);
  useEffect(() => {
    aoiLayersRef.current = aoiLayers;
  }, [aoiLayers]);

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
      aoiLayersRef.current
        .filter((a) => a.status === "done")
        .forEach((aoi) => addAoiLayer(map, aoi, beforeId));
    };

    map.on(MAP_EVENTS_MAP.styleReady as string, rebuildAll);
    if (map.isStyleLoaded()) rebuildAll();

    return () => {
      map.off(MAP_EVENTS_MAP.styleReady as string, rebuildAll);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style) return;
      aoiLayersRef.current.forEach((aoi) => removeAoiLayer(map, aoi.id));
    };
  }, [map]);

  // Reactive sync when aoiLayers state updates
  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style || !map.isStyleLoaded()) return;

    const beforeId = getBeforeId(map);

    // Add new "done" layers
    aoiLayers
      .filter((a) => a.status === "done")
      .forEach((aoi) => {
        const fillId = `${UPLOAD_AOI_FILL_PREFIX}${aoi.id}`;
        if (!map.getLayer(fillId)) {
          addAoiLayer(map, aoi, beforeId);
        }
      });

    // Remove deleted layers
    const currentIds = new Set(aoiLayers.map((a) => a.id));
    const style = map.getStyle();
    style?.layers?.forEach((l) => {
      if (l.id.startsWith(UPLOAD_AOI_FILL_PREFIX)) {
        const aoiId = l.id.replace(UPLOAD_AOI_FILL_PREFIX, "");
        if (!currentIds.has(aoiId)) {
          removeAoiLayer(map, aoiId);
        }
      }
    });
  }, [map, aoiLayers]);
};

export const useUploadAoi = useMitraUploadAoi;

