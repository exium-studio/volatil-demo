// src/design-system/components/map/hooks/use-map-draw.ts

import { useCallback, useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { toast } from "@/design-system/components/toast";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import {
  isNearFirstPoint,
  toPolygonFeature,
} from "@/design-system/components/map/utils/geometry";
import {
  MAP_CONFIG,
  MAP_EVENTS_MAP,
} from "@/design-system/components/map/constants/map.config";

const DRAW_SOURCE_ID = "map-draw-source";

/** Exported so useMapLayers can insert config layers below the draw stack using beforeId. */
export const DRAW_FILL_LAYER_ID = "map-draw-fill";

const DRAW_LINE_LAYER_ID = "map-draw-line";
const DRAW_VERTEX_LAYER_ID = "map-draw-vertex";

type DrawPoint = { lng: number; lat: number };

const buildSourceData = (
  pts: DrawPoint[],
  drawing: boolean,
): GeoJSON.FeatureCollection => {
  const vertexFeatures: GeoJSON.Feature<GeoJSON.Point>[] = pts.map((p) => ({
    type: "Feature",
    properties: {},
    geometry: { type: "Point", coordinates: [p.lng, p.lat] },
  }));

  const shapeFeatures: GeoJSON.Feature[] = drawing
    ? pts.length >= 2
      ? [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: pts.map((p) => [p.lng, p.lat]),
            },
          } as GeoJSON.Feature<GeoJSON.LineString>,
        ]
      : []
    : pts.length >= 3
      ? [toPolygonFeature(pts)]
      : [];

  return {
    type: "FeatureCollection",
    features: [...shapeFeatures, ...vertexFeatures],
  };
};

/**
 * Wires up click/dblclick handlers to build a polygon by accumulating vertices,
 * and syncs the in-progress geometry to a preview layer on the map.
 * Only "polygon" is exposed via the UI right now, but finalize() already branches
 * on geometryType so line/point can be added later without touching this hook.
 */
export const useMapDraw = (
  map: maplibregl.Map | null,
  onFinish?: (
    feature: GeoJSON.Feature<GeoJSON.Polygon>,
    originalPoints: { lng: number; lat: number }[],
  ) => void,
  densify = false,
) => {
  const { geometryType, isDrawing, points, addPoint, finish, cancel } =
    useMapDrawStore();

  // Mirrors the latest points so the click handler (registered once per map/isDrawing change)
  // always reads fresh state. Synced via effect, never written during render.
  const pointsRef = useRef(points);
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  // Mirrors isDrawing for use inside style.load callback (registered once per map)
  const isDrawingRef = useRef(isDrawing);
  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);

  const finalize = () => {
    if (geometryType !== "polygon" || pointsRef.current.length < 3) return;

    const feature = densify
      ? toPolygonFeature(pointsRef.current)
      : {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                ...pointsRef.current.map((p) => [p.lng, p.lat]),
                [pointsRef.current[0].lng, pointsRef.current[0].lat],
              ],
            ],
          },
        };

    onFinish?.(feature, pointsRef.current);
    finish();
    toast.success("Area berhasil digambar");
  };

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      if (!isDrawing) return;

      const clickPoint = { lng: e.lngLat.lng, lat: e.lngLat.lat };
      const first = pointsRef.current[0];

      if (
        geometryType === "polygon" &&
        first &&
        pointsRef.current.length >= 3
      ) {
        const firstPx = map.project([first.lng, first.lat]);
        const clickPx = map.project([clickPoint.lng, clickPoint.lat]);

        if (
          isNearFirstPoint(clickPx, firstPx, MAP_CONFIG.draw.closeHitRadiusPx)
        ) {
          finalize();
          return;
        }
      }

      addPoint(clickPoint);
    };

    const handleDblClick = (e: maplibregl.MapMouseEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      finalize();
    };

    map.on("click", handleClick);
    map.on("dblclick", handleDblClick);

    return () => {
      map.off("click", handleClick);
      map.off("dblclick", handleDblClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finalize/addPoint intentionally read via pointsRef, not re-bound every point
  }, [map, isDrawing, geometryType]);

  // Set map canvas cursor to crosshair (GIS precision draw mode) during drawing mode
  useEffect(() => {
    if (!map) return;

    const canvas = map.getCanvas();
    if (isDrawing) {
      canvas.style.cursor = "crosshair";
    } else {
      canvas.style.cursor = "";
    }

    return () => {
      if (canvas) {
        canvas.style.cursor = "";
      }
    };
  }, [map, isDrawing]);

  // Robust helper to ensure source and layers are present on the map.
  // Can be called safely multiple times.
  const ensureLayersExist = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!map || !(map as any).style) return false;

    if (!map.getSource(DRAW_SOURCE_ID)) {
      map.addSource(DRAW_SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
    }
    if (!map.getLayer(DRAW_FILL_LAYER_ID)) {
      map.addLayer({
        id: DRAW_FILL_LAYER_ID,
        type: "fill",
        source: DRAW_SOURCE_ID,
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: { "fill-color": "#3b82f6", "fill-opacity": 0.2 },
      } as maplibregl.LayerSpecification);
    }
    if (!map.getLayer(DRAW_LINE_LAYER_ID)) {
      map.addLayer({
        id: DRAW_LINE_LAYER_ID,
        type: "line",
        source: DRAW_SOURCE_ID,
        paint: { "line-color": "#3b82f6", "line-width": 2 },
      } as maplibregl.LayerSpecification);
    }
    if (!map.getLayer(DRAW_VERTEX_LAYER_ID)) {
      map.addLayer({
        id: DRAW_VERTEX_LAYER_ID,
        type: "circle",
        source: DRAW_SOURCE_ID,
        filter: ["==", ["geometry-type"], "Point"],
        paint: { "circle-radius": 5, "circle-color": "#3b82f6" },
      } as maplibregl.LayerSpecification);
    }

    return true;
  }, [map]);

  // Sync draw layers setup with map-layers-ready event
  useEffect(() => {
    if (!map) return;

    const onLayersReady = () => {
      // Re-initialize layers whenever the map layer stack is ready
      ensureLayersExist();
      if (pointsRef.current.length > 0) {
        const source = map.getSource(
          DRAW_SOURCE_ID,
        ) as maplibregl.GeoJSONSource | null;
        source?.setData(
          buildSourceData(pointsRef.current, isDrawingRef.current),
        );
      }
    };

    if (map.isStyleLoaded()) {
      onLayersReady();
    }
    map.on(MAP_EVENTS_MAP.layersReady as string, onLayersReady);

    return () => {
      map.off(MAP_EVENTS_MAP.layersReady as string, onLayersReady);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style) return;
      [DRAW_VERTEX_LAYER_ID, DRAW_LINE_LAYER_ID, DRAW_FILL_LAYER_ID].forEach(
        (id) => {
          if (map.getLayer(id)) map.removeLayer(id);
        },
      );
      if (map.getSource(DRAW_SOURCE_ID)) map.removeSource(DRAW_SOURCE_ID);
    };
  }, [map, ensureLayersExist]);

  // Sync drawn shape to the map source whenever points or isDrawing state changes.
  useEffect(() => {
    if (!map) return;
    // Guard: map.style becomes undefined after map.remove() (unmounting)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style) return;

    // Ensure layers exist before trying to set data. This guarantees that if the
    // layers were somehow removed (e.g. style change races), they are instantly recreated.
    ensureLayersExist();

    const source = map.getSource(DRAW_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!source) return;

    source.setData(buildSourceData(points, isDrawing));
  }, [map, points, isDrawing, ensureLayersExist]);

  /**
   * The ONLY way to clear a finished drawing from the map.
   * Resets store state (via cancel) AND clears the map source data.
   */
  const clearDraw = () => {
    cancel();
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style) return;
    const source = map.getSource(DRAW_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (source) {
      source.setData({ type: "FeatureCollection", features: [] });
    }
  };

  return { clearDraw };
};
