// src/design-system/components/map/hooks/use-map-feature-info.ts

import { MAP_EVENTS_MAP } from "@/design-system/components/map/constants/map.config";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import { useMapFeatureInfoStore } from "@/design-system/components/map/stores/map.feature-info.store";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { fetchWmsGetFeatureInfo } from "@/design-system/components/map/utils/wms-get-feature-info";
import { useThemeStore } from "@/design-system/stores/theme-store";
import * as turf from "@turf/turf";
import type GeoJSON from "geojson";
import type maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

export const FEATURE_INFO_SOURCE_ID = "map-feature-info-source";
export const FEATURE_INFO_FILL_LAYER_ID = "map-feature-info-fill";
export const FEATURE_INFO_LINE_LAYER_ID = "map-feature-info-line";
export const FEATURE_INFO_CIRCLE_LAYER_ID = "map-feature-info-circle";

const FEATURE_INFO_FILL_COLOR = "#64748b";
const FEATURE_INFO_FILL_OPACITY = 0.35;
const FEATURE_INFO_LINE_COLOR = "#334155";
const FEATURE_INFO_LINE_WIDTH = 3.5;
const FEATURE_INFO_CIRCLE_COLOR = "#475569";
const FEATURE_INFO_CIRCLE_STROKE_COLOR = "#ffffff";

const HIGHLIGHT_FILL_LAYER_ID = "map-feature-highlight-fill";

/** Dynamically computes spatial degree radius from map zoom (approx 16 pixels on screen) */
const calculateSpatialSearchDelta = (
  map: maplibregl.Map,
  pixelRadius = 16,
): number => {
  const zoom = map.getZoom();
  const centerLat = map.getCenter().lat;
  const degPerPixel =
    (360 / (256 * Math.pow(2, zoom))) * Math.cos((centerLat * Math.PI) / 180);
  return Math.max(0.00005, degPerPixel * pixelRadius);
};

/** Resolves WFS query URL from layer configuration dynamically without hardcoding */
const resolveWfsUrl = (layer: MapLayerConfig): string => {
  if ("wfsUrl" in layer && layer.wfsUrl) return layer.wfsUrl;
  if ("wmsUrl" in layer && layer.wmsUrl) {
    return layer.wmsUrl.replace(/\/wms\b/i, "/wfs");
  }
  return `/api/proxy/wfs?layerId=${encodeURIComponent(layer.id)}`;
};

/** Resolves WFS typename from layer configuration dynamically */
const resolveWfsTypeName = (layer: MapLayerConfig): string => {
  if ("wfsTypeName" in layer && layer.wfsTypeName) return layer.wfsTypeName;
  if ("layers" in layer && layer.layers) return layer.layers;
  return layer.id;
};

export const useMapFeatureInfo = (
  map: maplibregl.Map | null,
  layers: MapLayerConfig[],
  cqlFilter?: string,
) => {
  // Stores
  const { theme } = useThemeStore();
  const isDrawing = useMapDrawStore((s) => s.isDrawing);
  const selectedFeature = useMapFeatureInfoStore((s) => s.selectedFeature);
  const setSelectedFeature = useMapFeatureInfoStore(
    (s) => s.setSelectedFeature,
  );
  const setIsLoading = useMapFeatureInfoStore((s) => s.setIsLoading);
  const setError = useMapFeatureInfoStore((s) => s.setError);
  const clearFeatureInfo = useMapFeatureInfoStore((s) => s.clearFeatureInfo);

  // Refs
  const layersRef = useRef(layers);
  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);

  const cqlFilterRef = useRef(cqlFilter);
  useEffect(() => {
    cqlFilterRef.current = cqlFilter;
  }, [cqlFilter]);

  // Effects — Manage feature info source & layers on map
  useEffect(() => {
    if (!map) return;

    const setupFeatureInfoLayers = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(map as any).style) return;

      if (!map.getSource(FEATURE_INFO_SOURCE_ID)) {
        map.addSource(FEATURE_INFO_SOURCE_ID, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
      }

      // Feature Info stays right below temporary highlight layer, above draw/aoi/wms
      const beforeId = map.getLayer(HIGHLIGHT_FILL_LAYER_ID)
        ? HIGHLIGHT_FILL_LAYER_ID
        : undefined;

      if (!map.getLayer(FEATURE_INFO_FILL_LAYER_ID)) {
        map.addLayer(
          {
            id: FEATURE_INFO_FILL_LAYER_ID,
            type: "fill",
            source: FEATURE_INFO_SOURCE_ID,
            paint: {
              "fill-color": FEATURE_INFO_FILL_COLOR,
              "fill-opacity": FEATURE_INFO_FILL_OPACITY,
            },
          },
          beforeId,
        );
      }

      if (!map.getLayer(FEATURE_INFO_LINE_LAYER_ID)) {
        map.addLayer(
          {
            id: FEATURE_INFO_LINE_LAYER_ID,
            type: "line",
            source: FEATURE_INFO_SOURCE_ID,
            paint: {
              "line-color": FEATURE_INFO_LINE_COLOR,
              "line-width": FEATURE_INFO_LINE_WIDTH,
              "line-opacity": 1,
            },
          },
          beforeId,
        );
      }

      if (!map.getLayer(FEATURE_INFO_CIRCLE_LAYER_ID)) {
        map.addLayer(
          {
            id: FEATURE_INFO_CIRCLE_LAYER_ID,
            type: "circle",
            source: FEATURE_INFO_SOURCE_ID,
            filter: ["==", "$type", "Point"],
            paint: {
              "circle-color": FEATURE_INFO_CIRCLE_COLOR,
              "circle-radius": 8,
              "circle-stroke-width": 3,
              "circle-stroke-color": FEATURE_INFO_CIRCLE_STROKE_COLOR,
              "circle-opacity": 0.95,
            },
          },
          beforeId,
        );
      }
    };

    if (map.isStyleLoaded()) {
      setupFeatureInfoLayers();
    } else {
      map.once("style.load", setupFeatureInfoLayers);
    }

    const onStyleReady = () => {
      setupFeatureInfoLayers();
    };
    const onLayersReady = () => {
      setupFeatureInfoLayers();
    };

    map.on(MAP_EVENTS_MAP.styleReady, onStyleReady);
    map.on(MAP_EVENTS_MAP.layersReady, onLayersReady);

    return () => {
      map.off(MAP_EVENTS_MAP.styleReady, onStyleReady);
      map.off(MAP_EVENTS_MAP.layersReady, onLayersReady);
    };
  }, [map, theme]);

  // Effects — Update highlight geometry and ensure top layer stack when selectedFeature changes
  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style) return;

    if (!map.getSource(FEATURE_INFO_SOURCE_ID)) {
      map.addSource(FEATURE_INFO_SOURCE_ID, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }

    const beforeId = map.getLayer(HIGHLIGHT_FILL_LAYER_ID)
      ? HIGHLIGHT_FILL_LAYER_ID
      : undefined;

    if (!map.getLayer(FEATURE_INFO_FILL_LAYER_ID)) {
      map.addLayer(
        {
          id: FEATURE_INFO_FILL_LAYER_ID,
          type: "fill",
          source: FEATURE_INFO_SOURCE_ID,
          paint: {
            "fill-color": FEATURE_INFO_FILL_COLOR,
            "fill-opacity": FEATURE_INFO_FILL_OPACITY,
          },
        },
        beforeId,
      );
    }

    if (!map.getLayer(FEATURE_INFO_LINE_LAYER_ID)) {
      map.addLayer(
        {
          id: FEATURE_INFO_LINE_LAYER_ID,
          type: "line",
          source: FEATURE_INFO_SOURCE_ID,
          paint: {
            "line-color": FEATURE_INFO_LINE_COLOR,
            "line-width": FEATURE_INFO_LINE_WIDTH,
            "line-opacity": 1,
          },
        },
        beforeId,
      );
    }

    if (!map.getLayer(FEATURE_INFO_CIRCLE_LAYER_ID)) {
      map.addLayer(
        {
          id: FEATURE_INFO_CIRCLE_LAYER_ID,
          type: "circle",
          source: FEATURE_INFO_SOURCE_ID,
          filter: ["==", "$type", "Point"],
          paint: {
            "circle-color": FEATURE_INFO_CIRCLE_COLOR,
            "circle-radius": 8,
            "circle-stroke-width": 3,
            "circle-stroke-color": FEATURE_INFO_CIRCLE_STROKE_COLOR,
            "circle-opacity": 0.95,
          },
        },
        beforeId,
      );
    }

    const source = map.getSource(FEATURE_INFO_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!source) return;

    if (selectedFeature?.geometry) {
      source.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: selectedFeature.properties ?? {},
            geometry: selectedFeature.geometry,
          },
        ],
      });

      // Move feature info layers to top priority (right below highlight)
      try {
        if (map.getLayer(FEATURE_INFO_FILL_LAYER_ID)) {
          map.moveLayer(FEATURE_INFO_FILL_LAYER_ID, beforeId);
        }
        if (map.getLayer(FEATURE_INFO_LINE_LAYER_ID)) {
          map.moveLayer(FEATURE_INFO_LINE_LAYER_ID, beforeId);
        }
        if (map.getLayer(FEATURE_INFO_CIRCLE_LAYER_ID)) {
          map.moveLayer(FEATURE_INFO_CIRCLE_LAYER_ID, beforeId);
        }
      } catch (err) {
        console.warn("Failed to re-order feature info layers:", err);
      }
    } else {
      source.setData({
        type: "FeatureCollection",
        features: [],
      });
    }
  }, [map, selectedFeature]);

  // Effects — Handle map click for feature inspection
  useEffect(() => {
    if (!map) return;

    const handleMapClick = async (e: maplibregl.MapMouseEvent) => {
      if (useMapDrawStore.getState().isDrawing) return;

      const activeEnabledIds = useMapLayerStore.getState().enabledLayerIds;
      const wmsVisible = useMapLayerStore.getState().wmsVisible;
      if (!wmsVisible) return;

      const currentLayers = layersRef.current;
      const visibleWmsLayers = currentLayers.filter(
        (l) =>
          l.type === "wms-raster" &&
          (l.visible !== false || activeEnabledIds[l.id]),
      );

      if (visibleWmsLayers.length === 0) {
        clearFeatureInfo();
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let foundFeature = false;
        // Query top-most layer first (reverse order)
        for (let i = visibleWmsLayers.length - 1; i >= 0; i--) {
          const layer = visibleWmsLayers[i];
          if (layer.type !== "wms-raster") continue;

          const layerName = layer.layers ?? layer.id;
          const wfsTypeName = resolveWfsTypeName(layer);
          const wfsEndpoint = resolveWfsUrl(layer);

          let feat: GeoJSON.Feature | undefined = undefined;

          // 1. WMS GetFeatureInfo on exact clicked pixel (accurate targeting on WMS raster)
          const wmsResult = await fetchWmsGetFeatureInfo({
            map,
            wmsUrl: layer.wmsUrl,
            layerId: layer.id,
            layers: layerName,
            point: e.point,
            lngLat: { lng: e.lngLat.lng, lat: e.lngLat.lat },
            cqlFilter: cqlFilterRef.current,
          });

          if (wmsResult?.features && wmsResult.features.length > 0) {
            feat = wmsResult.features[0];
          }

          // 2. If WMS returned a feature but without full polygon geometry, query WFS for the exact feature by ID
          if (feat && (!feat.geometry || feat.geometry.type === "Point") && feat.id) {
            try {
              const wfsByIdRes = await fetchWfs({
                typeName: wfsTypeName,
                wfsUrl: wfsEndpoint,
                cqlFilter: `IN('${feat.id}')`,
                srsName: "EPSG:4326",
                version: "1.1.0",
                maxFeatures: 1,
              });
              if (wfsByIdRes.features && wfsByIdRes.features[0]?.geometry) {
                feat = {
                  ...feat,
                  geometry: wfsByIdRes.features[0].geometry,
                  properties: {
                    ...feat.properties,
                    ...wfsByIdRes.features[0].properties,
                  },
                };
              }
            } catch {
              // Ignore
            }
          }

          // 3. If WMS GetFeatureInfo was empty, query WFS using spatial point intersection INTERSECTS(geom, POINT(lon lat))
          if (!feat) {
            try {
              const pointCql = `INTERSECTS(geom, POINT(${e.lngLat.lng} ${e.lngLat.lat}))`;
              const combinedCql = cqlFilterRef.current
                ? `(${cqlFilterRef.current}) AND (${pointCql})`
                : pointCql;

              const wfsPointRes = await fetchWfs({
                typeName: wfsTypeName,
                wfsUrl: wfsEndpoint,
                cqlFilter: combinedCql,
                srsName: "EPSG:4326",
                version: "1.1.0",
                maxFeatures: 1,
              });

              if (wfsPointRes.features && wfsPointRes.features.length > 0) {
                feat = wfsPointRes.features[0];
              }
            } catch {
              // Ignore
            }
          }

          // 4. Fallback to dynamic zoom-aware bounding box if point search yielded nothing
          if (!feat) {
            try {
              const delta = calculateSpatialSearchDelta(map, 10);
              const wfsBboxRes = await fetchWfs({
                typeName: wfsTypeName,
                wfsUrl: wfsEndpoint,
                bbox: [
                  e.lngLat.lng - delta,
                  e.lngLat.lat - delta,
                  e.lngLat.lng + delta,
                  e.lngLat.lat + delta,
                ],
                version: "1.1.0",
                cqlFilter: cqlFilterRef.current,
                maxFeatures: 1,
              });
              if (wfsBboxRes.features && wfsBboxRes.features.length > 0) {
                feat = wfsBboxRes.features[0];
              }
            } catch {
              // Ignore
            }
          }

          if (feat) {
            const humanTitle = layer.title ?? layer.layers ?? layer.id;
            const typeName = layer.layers ?? layer.id;

            setSelectedFeature({
              id: feat.id,
              layerId: layer.id,
              title: humanTitle,
              layerTitle: humanTitle,
              spatialBasis: layer.spatialBasis,
              basis: layer.spatialBasis,
              typeName,
              properties: (feat.properties as Record<string, unknown>) ?? {},
              geometry: feat.geometry ?? null,
              coordinate: [e.lngLat.lng, e.lngLat.lat],
            });
            foundFeature = true;

            if (feat.geometry && feat.geometry.type !== "Point") {
              try {
                const bbox = turf.bbox({
                  type: "Feature",
                  properties: {},
                  geometry: feat.geometry,
                });
                map.fitBounds(
                  [
                    [bbox[0], bbox[1]],
                    [bbox[2], bbox[3]],
                  ],
                  {
                    padding: { top: 80, bottom: 80, left: 80, right: 380 },
                    maxZoom: 18,
                    duration: 1000,
                  },
                );
              } catch {
                map.flyTo({
                  center: [e.lngLat.lng, e.lngLat.lat],
                  zoom: 17,
                  duration: 1000,
                });
              }
            } else {
              map.flyTo({
                center: [e.lngLat.lng, e.lngLat.lat],
                zoom: 17,
                duration: 1000,
              });
            }
            break;
          }
        }

        if (!foundFeature) {
          clearFeatureInfo();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengambil data");
      } finally {
        setIsLoading(false);
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [
    map,
    isDrawing,
    clearFeatureInfo,
    setIsLoading,
    setError,
    setSelectedFeature,
  ]);
};
