// src/design-system/components/map/hooks/use-map-feature-info.ts

import { MAP_EVENTS_MAP } from "@/design-system/components/map/constants/map.config";
import { DRAW_FILL_LAYER_ID } from "@/design-system/components/map/hooks/use-map-draw";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import { useMapFeatureInfoStore } from "@/design-system/components/map/stores/map.feature-info.store";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { fetchWmsGetFeatureInfo } from "@/design-system/components/map/utils/wms-get-feature-info";
import { useThemeStore } from "@/design-system/stores/theme-store";
import * as turf from "@turf/turf";
import type maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

const HIGHLIGHT_SOURCE_ID = "map-feature-highlight-source";
const HIGHLIGHT_FILL_LAYER_ID = "map-feature-highlight-fill";
const HIGHLIGHT_LINE_LAYER_ID = "map-feature-highlight-line";
const HIGHLIGHT_CIRCLE_LAYER_ID = "map-feature-highlight-circle";

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

  const layersRef = useRef(layers);
  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);

  const cqlFilterRef = useRef(cqlFilter);
  useEffect(() => {
    cqlFilterRef.current = cqlFilter;
  }, [cqlFilter]);

  // Manage highlight source & layers on map
  useEffect(() => {
    if (!map) return;

    const setupHighlightLayers = () => {
      if (!map.getSource(HIGHLIGHT_SOURCE_ID)) {
        map.addSource(HIGHLIGHT_SOURCE_ID, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
      }

      const beforeId = map.getLayer(DRAW_FILL_LAYER_ID)
        ? DRAW_FILL_LAYER_ID
        : undefined;

      if (!map.getLayer(HIGHLIGHT_FILL_LAYER_ID)) {
        map.addLayer(
          {
            id: HIGHLIGHT_FILL_LAYER_ID,
            type: "fill",
            source: HIGHLIGHT_SOURCE_ID,
            filter: ["==", "$type", "Polygon"],
            paint: {
              "fill-color": "#3b82f6",
              "fill-opacity": 0.4,
            },
          },
          beforeId,
        );
      }

      if (!map.getLayer(HIGHLIGHT_LINE_LAYER_ID)) {
        map.addLayer(
          {
            id: HIGHLIGHT_LINE_LAYER_ID,
            type: "line",
            source: HIGHLIGHT_SOURCE_ID,
            filter: ["any", ["==", "$type", "Polygon"], ["==", "$type", "LineString"]],
            paint: {
              "line-color": "#1d4ed8",
              "line-width": 3.5,
              "line-opacity": 1,
            },
          },
          beforeId,
        );
      }

      if (!map.getLayer(HIGHLIGHT_CIRCLE_LAYER_ID)) {
        map.addLayer(
          {
            id: HIGHLIGHT_CIRCLE_LAYER_ID,
            type: "circle",
            source: HIGHLIGHT_SOURCE_ID,
            filter: ["==", "$type", "Point"],
            paint: {
              "circle-color": "#2563eb",
              "circle-radius": 8,
              "circle-stroke-width": 3,
              "circle-stroke-color": "#ffffff",
              "circle-opacity": 0.95,
            },
          },
          beforeId,
        );
      }
    };

    if (map.isStyleLoaded()) {
      setupHighlightLayers();
    } else {
      map.once("style.load", setupHighlightLayers);
    }

    const onStyleReady = () => {
      setupHighlightLayers();
    };
    const onLayersReady = () => {
      setupHighlightLayers();
    };

    map.on(MAP_EVENTS_MAP.styleReady, onStyleReady);
    map.on(MAP_EVENTS_MAP.layersReady, onLayersReady);

    return () => {
      map.off(MAP_EVENTS_MAP.styleReady, onStyleReady);
      map.off(MAP_EVENTS_MAP.layersReady, onLayersReady);
    };
  }, [map, theme]);

  // Update highlight geometry when selectedFeature changes
  useEffect(() => {
    if (!map) return;
    const source = map.getSource(
      HIGHLIGHT_SOURCE_ID,
    ) as maplibregl.GeoJSONSource | undefined;
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
    } else {
      source.setData({
        type: "FeatureCollection",
        features: [],
      });
    }
  }, [map, selectedFeature]);

  // Handle map click
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
          const result = await fetchWmsGetFeatureInfo({
            map,
            wmsUrl: layer.wmsUrl,
            layers: layerName,
            point: e.point,
            cqlFilter: cqlFilterRef.current,
          });

          let feat = result?.features?.[0];

          // Fallback to WFS point buffer if WMS GetFeatureInfo was empty
          if (!feat) {
            try {
              const delta = 0.0003;
              const wfsRes = await fetchWfs({
                typeName: layerName,
                wfsUrl: layer.wmsUrl ? layer.wmsUrl.replace(/\/wms\b/i, "/wfs") : "",
                bbox: [
                  e.lngLat.lng - delta,
                  e.lngLat.lat - delta,
                  e.lngLat.lng + delta,
                  e.lngLat.lat + delta,
                ],
                cqlFilter: cqlFilterRef.current,
                maxFeatures: 1,
              });
              if (wfsRes.features && wfsRes.features.length > 0) {
                feat = wfsRes.features[0];
              }
            } catch {
              // ignore
            }
          }

          if (feat) {
            // If feature has no geometry (standard GeoServer GetFeatureInfo behavior), fetch from WFS
            if (!feat.geometry && feat.id) {
              try {
                const wfsRes = await fetchWfs({
                  typeName: layerName,
                  wfsUrl: layer.wmsUrl ? layer.wmsUrl.replace(/\/wms\b/i, "/wfs") : "",
                  cqlFilter: `IN('${feat.id}')`,
                  maxFeatures: 1,
                });
                if (wfsRes.features && wfsRes.features[0]?.geometry) {
                  feat = {
                    ...feat,
                    geometry: wfsRes.features[0].geometry,
                    properties: {
                      ...feat.properties,
                      ...wfsRes.features[0].properties,
                    },
                  };
                }
              } catch {
                try {
                  const delta = 0.0003;
                  const wfsRes = await fetchWfs({
                    typeName: layerName,
                    wfsUrl: layer.wmsUrl ? layer.wmsUrl.replace(/\/wms\b/i, "/wfs") : "",
                    bbox: [
                      e.lngLat.lng - delta,
                      e.lngLat.lat - delta,
                      e.lngLat.lng + delta,
                      e.lngLat.lat + delta,
                    ],
                    maxFeatures: 1,
                  });
                  if (wfsRes.features && wfsRes.features[0]?.geometry) {
                    feat = {
                      ...feat,
                      geometry: wfsRes.features[0].geometry,
                      properties: {
                        ...feat.properties,
                        ...wfsRes.features[0].properties,
                      },
                    };
                  }
                } catch {
                  // ignore
                }
              }
            }

            setSelectedFeature({
              id: feat.id,
              layerId: layer.id,
              layerTitle: layer.layers ?? layer.id,
              properties: (feat.properties as Record<string, unknown>) ?? {},
              geometry: feat.geometry,
              coordinate: [e.lngLat.lng, e.lngLat.lat],
            });
            foundFeature = true;

            if (feat.geometry) {
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
  }, [map, isDrawing, clearFeatureInfo, setIsLoading, setError, setSelectedFeature]);
};
