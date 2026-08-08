// src/features/mitra/data-request/services/fetch-mitra-igt-by-aoi.ts

import { getIgtByAoi } from "@/features/mitra/data-request/services/mitra.data-request.api";
import type { IgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type GeoJSON from "geojson";

export async function fetchMitraIgtByAoi(
  geometry: GeoJSON.Polygon,
): Promise<IgtDataItem[]> {
  console.log("fetchMitraIgtByAoi polygon:", geometry);
  return getIgtByAoi(geometry);
}
