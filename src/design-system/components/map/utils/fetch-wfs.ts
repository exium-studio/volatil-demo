// src/design-system/components/map/utils/fetch-wfs.ts

import type GeoJSON from "geojson";

export type WfsBbox = [number, number, number, number];

export type FetchWfsParams = {
  typeName: string;
  wfsUrl?: string;
  bbox?: WfsBbox;
  /** GeoServer CQL filter expression, e.g. `INTERSECTS(geom, POLYGON(...))`. */
  cqlFilter?: string;
  version?: string;
  outputFormat?: string;
  srsName?: string;
  signal?: AbortSignal;
};

/** Fetches features from a WFS endpoint as GeoJSON, optionally scoped to a bbox. */
export const fetchWfs = async ({
  typeName,
  wfsUrl,
  bbox,
  cqlFilter,
  version = "1.0.0",
  outputFormat = "application/json",
  srsName = "EPSG:4326",
  signal,
}: FetchWfsParams): Promise<GeoJSON.FeatureCollection> => {
  const baseUrl = wfsUrl ?? "https://igtpr.atrbpn.go.id/geoserver/igt/ows";
  const url = new URL(baseUrl);
  url.searchParams.set("service", "WFS");
  url.searchParams.set("version", version);
  url.searchParams.set("request", "GetFeature");
  url.searchParams.set("typeName", typeName);
  url.searchParams.set("outputFormat", outputFormat);
  // srsName=EPSG:4326 forces lon/lat axis order in responses, consistent with GeoJSON/Turf/MapLibre.
  url.searchParams.set("srsName", srsName);

  if (bbox) {
    url.searchParams.set("bbox", `${bbox.join(",")},${srsName}`);
  }

  if (cqlFilter) {
    url.searchParams.set("CQL_FILTER", cqlFilter);
  }

  const res = await fetch(url.toString(), { signal });

  if (!res.ok) {
    throw new Error(`WFS request failed for "${typeName}": ${res.status}`);
  }

  return res.json() as Promise<GeoJSON.FeatureCollection>;
};
