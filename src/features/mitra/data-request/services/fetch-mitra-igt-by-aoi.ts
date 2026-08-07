// src/features/mitra/data-request/services/fetch-mitra-igt-by-aoi.ts

import type { IgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import { DUMMY_IGT_ITEMS } from "@/shared/constants/dummy-data/dummy-igt-by-aoi";
import type GeoJSON from "geojson";

export async function fetchMitraIgtByAoi(
  geometry: GeoJSON.Polygon,
): Promise<IgtDataItem[]> {
  console.log("fetchMitraIgtByAoi polygon:", geometry);
  return Promise.resolve(DUMMY_IGT_ITEMS);
}
