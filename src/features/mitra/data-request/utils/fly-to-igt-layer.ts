// src/features/mitra/data-request/utils/fly-to-igt-layer.ts

import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { getGisAuthHeader } from "@/design-system/components/map/utils/gis-auth-header";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import type GeoJSON from "geojson";

export const computeGeoJsonBbox = (
  geojson: GeoJSON.FeatureCollection,
): [number, number, number, number] | null => {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  const processCoords = (coords: unknown) => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      let lng = coords[0];
      let lat = coords[1];
      if (Math.abs(lng) <= 90 && Math.abs(lat) > 90) {
        const temp = lng;
        lng = lat;
        lat = temp;
      }
      if (!isNaN(lng) && !isNaN(lat) && Math.abs(lat) <= 90) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    } else {
      coords.forEach(processCoords);
    }
  };

  geojson.features.forEach((feature) => {
    if (feature.geometry) {
      processCoords(
        (feature.geometry as GeoJSON.Geometry & { coordinates?: unknown })
          .coordinates,
      );
    }
  });

  if (
    minLng !== Infinity &&
    minLat !== Infinity &&
    maxLng !== -Infinity &&
    maxLat !== -Infinity
  ) {
    return [minLng, minLat, maxLng, maxLat];
  }

  return null;
};

/**
 * Fetches dynamic spatial bounding box [minLng, minLat, maxLng, maxLat] from GeoServer.
 * If cqlFilter is provided, queries filtered features; otherwise parses OGC GetCapabilities WGS84BoundingBox.
 */
export const fetchLayerDynamicBbox = async (
  typeName: string,
  wfsUrl: string,
  cqlFilter?: string,
): Promise<[number, number, number, number] | null> => {
  if (cqlFilter) {
    try {
      const geojson = await fetchWfs({
        typeName,
        wfsUrl,
        cqlFilter,
        maxFeatures: 100,
      });
      return computeGeoJsonBbox(geojson);
    } catch (error) {
      console.warn("Filtered WFS bbox fetch failed:", error);
    }
  }

  try {
    const url = new URL(wfsUrl);
    url.searchParams.set("service", "WFS");
    url.searchParams.set("version", "1.1.0");
    url.searchParams.set("request", "GetCapabilities");

    const authHeader = getGisAuthHeader();
    const res = await fetch(url.toString(), {
      headers: { Authorization: authHeader },
    });

    if (res.ok) {
      const xml = await res.text();
      const typeIdx = xml.indexOf(`<Name>${typeName}</Name>`);
      if (typeIdx !== -1) {
        const snippet = xml.slice(typeIdx, typeIdx + 800);
        const lowerMatch =
          /<ows:LowerCorner>(.*?)<\/ows:LowerCorner>/.exec(snippet);
        const upperMatch =
          /<ows:UpperCorner>(.*?)<\/ows:UpperCorner>/.exec(snippet);
        if (lowerMatch && upperMatch) {
          const [minLng, minLat] = lowerMatch[1].split(/\s+/).map(Number);
          const [maxLng, maxLat] = upperMatch[1].split(/\s+/).map(Number);
          if (
            !isNaN(minLng) &&
            !isNaN(minLat) &&
            !isNaN(maxLng) &&
            !isNaN(maxLat)
          ) {
            return [minLng, minLat, maxLng, maxLat];
          }
        }
      }
    }
  } catch (error) {
    console.warn("GeoServer GetCapabilities fetch failed:", error);
  }

  return null;
};

type FlyToIgtLayerOptions = {
  cqlFilter?: string;
  fetchBoundary?: boolean;
};

/**
 * Dynamically queries GeoServer for the IGT layer's bounding box or WFS feature geometries,
 * highlights the spatial bounds on the map in cyan blue, and animates camera position.
 */
export const flyToIgtLayer = async (
  layer: IgtLayerItem,
  options?: FlyToIgtLayerOptions,
): Promise<void> => {
  const map = useMapInstanceStore.getState().map;
  if (!map) return;

  const { cqlFilter, fetchBoundary = false } = options ?? {};

  // If fetchBoundary is requested, try fetching WFS features
  if (fetchBoundary && layer.wfs?.wfsTypeName && layer.wfs?.wfsUrl) {
    try {
      const featureCollection = await fetchWfs({
        typeName: layer.wfs.wfsTypeName,
        wfsUrl: layer.wfs.wfsUrl,
        cqlFilter,
        maxFeatures: 100,
      });

      if (
        featureCollection.features &&
        featureCollection.features.length > 0
      ) {
        highlightFeatureOnMap(map, featureCollection, {
          zoom: 15,
          timeoutMs: 5000,
        });
        return;
      }
    } catch (error) {
      console.warn("WFS boundary fetch failed, falling back to dynamic bbox:", error);
    }
  }

  // Fetch dynamic bbox directly from GeoServer OGC GetCapabilities / WFS filter
  let bbox: [number, number, number, number] | null = null;
  if (layer.wfs?.wfsTypeName && layer.wfs?.wfsUrl) {
    bbox = await fetchLayerDynamicBbox(
      layer.wfs.wfsTypeName,
      layer.wfs.wfsUrl,
      cqlFilter,
    );
  }

  // Fallback to static layer.bbox if GeoServer capabilities request fails
  if (!bbox) {
    bbox = layer.bbox ?? [115.083839, -8.850038, 115.251388, -8.23944];
  }

  const [minLng, minLat, maxLng, maxLat] = bbox;

  const bboxPolygonFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: "Feature",
    properties: { id: layer.id, title: layer.title || layer.id },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [minLng, minLat],
          [maxLng, minLat],
          [maxLng, maxLat],
          [minLng, maxLat],
          [minLng, minLat],
        ],
      ],
    },
  };

  highlightFeatureOnMap(map, bboxPolygonFeature, {
    zoom: 15,
    timeoutMs: 5000,
  });
};
