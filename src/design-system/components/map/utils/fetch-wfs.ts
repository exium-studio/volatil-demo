// src/design-system/components/map/utils/fetch-wfs.ts

import type { FeatureCollection } from "geojson";
import {
  WFS_BASE_URL,
  WFS_OUTPUT_FORMAT,
  WFS_SRS_NAME,
  WFS_VERSION,
} from "@/design-system/components/map/constants/map.constant";

export type WfsBbox = [number, number, number, number];

interface FetchWfsParams {
  typeName: string;
  bbox?: WfsBbox;
  signal?: AbortSignal;
}

/** Fetches features from a WFS endpoint as GeoJSON, optionally scoped to a bbox. */
export const fetchWfs = async ({
  typeName,
  bbox,
  signal,
}: FetchWfsParams): Promise<FeatureCollection> => {
  const url = new URL(WFS_BASE_URL);
  url.searchParams.set("service", "WFS");
  url.searchParams.set("version", WFS_VERSION);
  url.searchParams.set("request", "GetFeature");
  url.searchParams.set("typeName", typeName);
  url.searchParams.set("outputFormat", WFS_OUTPUT_FORMAT);
  url.searchParams.set("srsName", WFS_SRS_NAME);

  if (bbox) {
    url.searchParams.set("bbox", `${bbox.join(",")},${WFS_SRS_NAME}`);
  }

  const res = await fetch(url.toString(), { signal });

  if (!res.ok) {
    throw new Error(`WFS request failed for "${typeName}": ${res.status}`);
  }

  return res.json() as Promise<FeatureCollection>;
};
