// src/design-system/components/map/hooks/use-map-feature-info.ts

import { MAP_EVENTS_MAP } from "@/design-system/components/map/constants/map.config";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import { useMapFeatureInfoStore } from "@/design-system/components/map/stores/map.feature-info.store";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type { MapLayerConfig } from "@/design-system/components/map/types/map.type";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { normalizeGeometryCoordinates } from "@/design-system/components/map/utils/geometry";
import { fetchWmsGetFeatureInfo } from "@/design-system/components/map/utils/wms-get-feature-info";
import { useThemeStore } from "@/design-system/stores/theme-store";

import * as turf from "@turf/turf";
import type GeoJSON from "geojson";
import maplibregl from "maplibre-gl";
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

const createLoadingMarkerElement = (): HTMLElement => {
  const isDark =
    document.documentElement.classList.contains("dark") ||
    document.body.classList.contains("dark") ||
    document.documentElement.getAttribute("data-theme") === "dark";

  const container = document.createElement("div");
  container.className = "map-feature-loading-marker";
  container.style.cssText = isDark
    ? "display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; pointer-events: none; border-radius: 50%; background-color: rgba(24, 24, 27, 0.95); box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.7);"
    : "display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; pointer-events: none; border-radius: 50%; background-color: rgba(255, 255, 255, 0.95); box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.35);";

  const ring = document.createElement("div");
  ring.style.cssText = isDark
    ? "width: 22px; height: 22px; border-radius: 50%; border: 3px solid rgba(148, 163, 184, 0.25); border-top-color: #94a3b8; animation: spin 0.75s linear infinite;"
    : "width: 22px; height: 22px; border-radius: 50%; border: 3px solid rgba(148, 163, 184, 0.35); border-top-color: #64748b; animation: spin 0.75s linear infinite;";

  const dot = document.createElement("div");
  dot.style.cssText = isDark
    ? "position: absolute; width: 8px; height: 8px; border-radius: 50%; background-color: #94a3b8; border: 1.5px solid #18181b; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);"
    : "position: absolute; width: 8px; height: 8px; border-radius: 50%; background-color: #64748b; border: 1.5px solid #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);";

  // Inject keyframes for spin animation if not already injected
  if (!document.getElementById("map-marker-spin-keyframes")) {
    const style = document.createElement("style");
    style.id = "map-marker-spin-keyframes";
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(ring);
  container.appendChild(dot);
  return container;
};

const createStandardMarkerElement = (
  color: string,
  onToggleOff: () => void,
): HTMLElement => {
  const marker = new maplibregl.Marker({ color });
  const element = marker.getElement();
  element.style.cursor = "pointer";
  element.onclick = (e) => {
    e.stopPropagation();
    onToggleOff();
  };
  return element;
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

  const clickMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Effects — Synchronize click pin marker with selectedFeature coordinate
  useEffect(() => {
    if (!map) return;

    if (selectedFeature?.coordinate) {
      clickMarkerRef.current?.remove();
      const rawBasis = (
        selectedFeature.spatialBasis ??
        selectedFeature.basis ??
        ""
      )
        .toString()
        .toLowerCase();
      const pinColor = rawBasis === "bidang" ? "#3b82f6" : "#f97316";

      const standardEl = createStandardMarkerElement(
        pinColor,
        clearFeatureInfo,
      );
      clickMarkerRef.current = new maplibregl.Marker({ element: standardEl })
        .setLngLat(selectedFeature.coordinate)
        .addTo(map);
    } else {
      clickMarkerRef.current?.remove();
      clickMarkerRef.current = null;
    }
  }, [map, selectedFeature, clearFeatureInfo]);

  // Clean up click marker on unmount
  useEffect(() => {
    return () => {
      clickMarkerRef.current?.remove();
      clickMarkerRef.current = null;
    };
  }, []);

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
      const drawState = useMapDrawStore.getState();
      if (drawState.isDrawing || drawState.points.length > 0) return;

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

      // Immediately display loading indicator marker at clicked location
      clickMarkerRef.current?.remove();
      const loadingEl = createLoadingMarkerElement();
      clickMarkerRef.current = new maplibregl.Marker({ element: loadingEl })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map);

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
            // Find feature strictly containing clicked point
            const clickPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);
            const matchedPolygon = wmsResult.features.find((f) => {
              if (
                f.geometry &&
                (f.geometry.type === "Polygon" ||
                  f.geometry.type === "MultiPolygon")
              ) {
                try {
                  const normalizedGeom = normalizeGeometryCoordinates(
                    f.geometry,
                  );
                  return turf.booleanPointInPolygon(clickPoint, {
                    type: "Feature",
                    properties: f.properties ?? {},
                    geometry: normalizedGeom as
                      | GeoJSON.Polygon
                      | GeoJSON.MultiPolygon,
                  });
                } catch {
                  return false;
                }
              }
              return false;
            });

            if (matchedPolygon) {
              feat = {
                ...matchedPolygon,
                geometry: matchedPolygon.geometry
                  ? normalizeGeometryCoordinates(matchedPolygon.geometry)
                  : matchedPolygon.geometry,
              };
            }
          }

          // 2. If WMS returned a feature but without full polygon geometry, query WFS for the exact feature by ID
          if (feat && (!feat.geometry || feat.geometry.type === "Point")) {
            const props = (feat.properties as Record<string, unknown>) ?? {};
            const rawId =
              props.id ?? props.gid ?? props.OBJECTID ?? props.ID ?? feat.id;
            const featureIdStr = rawId != null ? String(rawId) : "";

            if (featureIdStr) {
              try {
                // Try 1: WFS standard featureID / resourceId query
                let wfsByIdRes = await fetchWfs({
                  typeName: wfsTypeName,
                  wfsUrl: wfsEndpoint,
                  featureID: feat.id ? String(feat.id) : undefined,
                  resourceId: feat.id ? String(feat.id) : undefined,
                  srsName: "EPSG:4326",
                  version: "2.0.0",
                  maxFeatures: 1,
                });

                // Try 2: If no result and property id exists, filter by property in CQL
                if (
                  (!wfsByIdRes.features || wfsByIdRes.features.length === 0) &&
                  props.id != null
                ) {
                  const idFilter =
                    typeof props.id === "number"
                      ? `id = ${props.id}`
                      : `id = '${props.id}'`;
                  wfsByIdRes = await fetchWfs({
                    typeName: wfsTypeName,
                    wfsUrl: wfsEndpoint,
                    cqlFilter: idFilter,
                    srsName: "EPSG:4326",
                    version: "1.1.0",
                    maxFeatures: 1,
                  });
                }

                // Try 3: If gid exists, filter by gid
                if (
                  (!wfsByIdRes.features || wfsByIdRes.features.length === 0) &&
                  props.gid != null
                ) {
                  const gidFilter =
                    typeof props.gid === "number"
                      ? `gid = ${props.gid}`
                      : `gid = '${props.gid}'`;
                  wfsByIdRes = await fetchWfs({
                    typeName: wfsTypeName,
                    wfsUrl: wfsEndpoint,
                    cqlFilter: gidFilter,
                    srsName: "EPSG:4326",
                    version: "1.1.0",
                    maxFeatures: 1,
                  });
                }

                if (wfsByIdRes.features && wfsByIdRes.features[0]?.geometry) {
                  feat = {
                    ...feat,
                    geometry: normalizeGeometryCoordinates(
                      wfsByIdRes.features[0].geometry,
                    ),
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
          }

          // 3. If WMS GetFeatureInfo was empty or didn't yield polygon, query WFS using spatial point intersection
          if (!feat || !feat.geometry || feat.geometry.type === "Point") {
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
                maxFeatures: 5,
              });

              if (wfsPointRes.features && wfsPointRes.features.length > 0) {
                const clickPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);
                const matchingFeature = wfsPointRes.features.find((f) => {
                  if (
                    f.geometry &&
                    (f.geometry.type === "Polygon" ||
                      f.geometry.type === "MultiPolygon")
                  ) {
                    try {
                      return turf.booleanPointInPolygon(clickPoint, {
                        type: "Feature",
                        properties: f.properties ?? {},
                        geometry: f.geometry as
                          | GeoJSON.Polygon
                          | GeoJSON.MultiPolygon,
                      });
                    } catch {
                      return false;
                    }
                  }
                  return false;
                });

                if (matchingFeature) {
                  feat = {
                    ...matchingFeature,
                    geometry: matchingFeature.geometry
                      ? normalizeGeometryCoordinates(matchingFeature.geometry)
                      : matchingFeature.geometry,
                  };
                }
              }
            } catch {
              // Try fallback with the_geom if geom is not the column name
              try {
                const pointCql = `INTERSECTS(the_geom, POINT(${e.lngLat.lng} ${e.lngLat.lat}))`;
                const combinedCql = cqlFilterRef.current
                  ? `(${cqlFilterRef.current}) AND (${pointCql})`
                  : pointCql;

                const wfsPointRes = await fetchWfs({
                  typeName: wfsTypeName,
                  wfsUrl: wfsEndpoint,
                  cqlFilter: combinedCql,
                  srsName: "EPSG:4326",
                  version: "1.1.0",
                  maxFeatures: 5,
                });

                if (wfsPointRes.features && wfsPointRes.features.length > 0) {
                  const clickPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);
                  const matchingFeature = wfsPointRes.features.find((f) => {
                    if (
                      f.geometry &&
                      (f.geometry.type === "Polygon" ||
                        f.geometry.type === "MultiPolygon")
                    ) {
                      try {
                        return turf.booleanPointInPolygon(clickPoint, {
                          type: "Feature",
                          properties: f.properties ?? {},
                          geometry: f.geometry as
                            | GeoJSON.Polygon
                            | GeoJSON.MultiPolygon,
                        });
                      } catch {
                        return false;
                      }
                    }
                    return false;
                  });

                  if (matchingFeature) {
                    feat = {
                      ...matchingFeature,
                      geometry: matchingFeature.geometry
                        ? normalizeGeometryCoordinates(matchingFeature.geometry)
                        : matchingFeature.geometry,
                    };
                  }
                }
              } catch {
                // Ignore
              }
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
          clickMarkerRef.current?.remove();
          clickMarkerRef.current = null;
          clearFeatureInfo();
        }
      } catch (err) {
        clickMarkerRef.current?.remove();
        clickMarkerRef.current = null;
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
