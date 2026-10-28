// src/design-system/components/map/utils/basemap-opacity.ts

import type maplibregl from "maplibre-gl";

/**
 * Standard known basemap source IDs.
 */
export const BASEMAP_SOURCE_IDS = new Set([
  "openmaptiles",
  "natural_earth_shaded_relief",
  "esri-satellite",
  "opentopomap",
  "petadasar",
  "grid-petadasar",
  "rbi",
]);

/**
 * Checks whether a layer belongs strictly to the basemap style.
 *
 * A layer is a basemap layer if:
 * 1. It is explicitly present in the known basemap layer IDs set (captured at style.load), OR
 * 2. Its source is one of the known basemap source IDs (or it is a background layer with no source).
 */
export const isBasemapLayer = (
  layer: maplibregl.LayerSpecification,
  basemapLayerIds?: Set<string>,
): boolean => {
  if (basemapLayerIds && basemapLayerIds.size > 0) {
    return basemapLayerIds.has(layer.id);
  }

  // Fallback if basemapLayerIds set is not available
  if (layer.type === "background") return true;

  const source = "source" in layer ? (layer.source as string) : undefined;
  if (!source) return false;

  return BASEMAP_SOURCE_IDS.has(source);
};

/**
 * Applies opacity to all basemap layers in the active MapLibre instance.
 */
export const applyBasemapOpacity = (
  map: maplibregl.Map,
  opacity: number,
  basemapLayerIds?: Set<string>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(map as any).style) return;

  const style = map.getStyle();
  if (!style?.layers) return;

  const clampedOpacity = Math.max(0, Math.min(1, opacity));

  for (const layer of style.layers) {
    if (!isBasemapLayer(layer, basemapLayerIds)) continue;

    try {
      if (layer.type === "raster") {
        map.setPaintProperty(layer.id, "raster-opacity", clampedOpacity);
      } else if (layer.type === "background") {
        map.setPaintProperty(layer.id, "background-opacity", clampedOpacity);
      } else if (layer.type === "fill") {
        map.setPaintProperty(layer.id, "fill-opacity", clampedOpacity);
      } else if (layer.type === "line") {
        map.setPaintProperty(layer.id, "line-opacity", clampedOpacity);
      } else if (layer.type === "fill-extrusion") {
        map.setPaintProperty(layer.id, "fill-extrusion-opacity", clampedOpacity);
      } else if (layer.type === "symbol") {
        map.setPaintProperty(layer.id, "text-opacity", clampedOpacity);
        map.setPaintProperty(layer.id, "icon-opacity", clampedOpacity);
      } else if (layer.type === "hillshade") {
        map.setPaintProperty(layer.id, "hillshade-exaggeration", clampedOpacity);
      }
    } catch {
      // Skip layers where property cannot be set
    }
  }
};
