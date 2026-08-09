// src/design-system/components/map/utils/fetch-wfs.ts

import type GeoJSON from "geojson";
import {
  WFS_BASE_URL,
  WFS_OUTPUT_FORMAT,
  WFS_SRS_NAME,
  WFS_VERSION,
} from "@/design-system/components/map/constants/map.config";

export type WfsBbox = [number, number, number, number];

interface FetchWfsParams {
  typeName: string;
  bbox?: WfsBbox;
  /** GeoServer CQL filter expression, e.g. `INTERSECTS(geom, POLYGON(...))`. */
  cqlFilter?: string;
  signal?: AbortSignal;
}

/** Fetches features from a WFS endpoint as GeoJSON, optionally scoped to a bbox. */
export const fetchWfs = async ({
  typeName,
  bbox,
  cqlFilter,
  signal,
}: FetchWfsParams): Promise<GeoJSON.FeatureCollection> => {
  const url = new URL(WFS_BASE_URL);
  url.searchParams.set("service", "WFS");
  url.searchParams.set("version", WFS_VERSION);
  url.searchParams.set("request", "GetFeature");
  url.searchParams.set("typeName", typeName);
  url.searchParams.set("outputFormat", WFS_OUTPUT_FORMAT);
  // srsName=EPSG:4326 forces lon/lat axis order in responses, consistent with GeoJSON/Turf/MapLibre.
  url.searchParams.set("srsName", WFS_SRS_NAME);

  if (bbox) {
    url.searchParams.set("bbox", `${bbox.join(",")},${WFS_SRS_NAME}`);
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
