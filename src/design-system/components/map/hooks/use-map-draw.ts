// src/design-system/components/map/hooks/use-map-draw.ts

import { useEffect, useRef } from "react";
import type maplibregl from "maplibre-gl";
import { useMapDrawStore } from "@/design-system/components/map/stores/map-draw.store";
import {
  isNearFirstPoint,
  toPolygonFeature,
} from "@/design-system/components/map/utils/geometry";
import { DRAW_CLOSE_HIT_RADIUS_PX } from "@/design-system/components/map/constants/map.constant";

const DRAW_SOURCE_ID = "map-draw-source";
const DRAW_FILL_LAYER_ID = "map-draw-fill";
const DRAW_LINE_LAYER_ID = "map-draw-line";
const DRAW_VERTEX_LAYER_ID = "map-draw-vertex";

/**
 * Wires up click/dblclick handlers to build a polygon by accumulating vertices,
 * and syncs the in-progress geometry to a preview layer on the map.
 * Only "polygon" is exposed via the UI right now, but finalize() already branches
 * on geometryType so line/point can be added later without touching this hook.
 */
export const useMapDraw = (
  map: maplibregl.Map | null,
  onFinish?: (feature: GeoJSON.Feature<GeoJSON.Polygon>) => void,
) => {
  const { geometryType, isDrawing, points, addPoint, finish } =
    useMapDrawStore();

  // Mirrors the latest points so the click handler (registered once per map/isDrawing change)
  // always reads fresh state. Synced via effect, never written during render.
  const pointsRef = useRef(points);
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  const finalize = () => {
    if (geometryType !== "polygon" || pointsRef.current.length < 3) return;

    onFinish?.(toPolygonFeature(pointsRef.current));
    finish();
    // TODO: call toast.success("Area berhasil digambar")
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

        if (isNearFirstPoint(clickPx, firstPx, DRAW_CLOSE_HIT_RADIUS_PX)) {
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

  // Set up the preview source/layers once per map instance.
  useEffect(() => {
    if (!map) return;

    const setupPreviewLayers = () => {
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
    };

    if (map.isStyleLoaded()) {
      setupPreviewLayers();
    }
    map.on("style.load", setupPreviewLayers);

    return () => {
      map.off("style.load", setupPreviewLayers);
      [DRAW_VERTEX_LAYER_ID, DRAW_LINE_LAYER_ID, DRAW_FILL_LAYER_ID].forEach(
        (id) => {
          if (map.getLayer(id)) map.removeLayer(id);
        },
      );
      if (map.getSource(DRAW_SOURCE_ID)) map.removeSource(DRAW_SOURCE_ID);
    };
  }, [map]);

  // Sync in-progress geometry to the preview source whenever points/isDrawing change.
  useEffect(() => {
    if (!map) return;

    const source = map.getSource(DRAW_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!source) return;

    const vertexFeatures: GeoJSON.Feature<GeoJSON.Point>[] = points.map(
      (p) => ({
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      }),
    );

    // While drawing: show an open line path. After finalize: show the closed polygon.
    const shapeFeatures: GeoJSON.Feature[] = isDrawing
      ? points.length >= 2
        ? [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: points.map((p) => [p.lng, p.lat]),
              },
            } as GeoJSON.Feature<GeoJSON.LineString>,
          ]
        : []
      : points.length >= 3
        ? [toPolygonFeature(points)]
        : [];

    source.setData({
      type: "FeatureCollection",
      features: [...shapeFeatures, ...vertexFeatures],
    });
  }, [map, points, isDrawing]);
};
