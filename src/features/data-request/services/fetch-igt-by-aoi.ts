// src/features/data-request/services/fetch-igt-by-aoi.ts

import type { IgtDataItem } from "@/features/data-request/types/igt-by-aoi.type";
import { DUMMY_IGT_ITEMS } from "@/shared/constants/dummy-data/dummy-igt-by-aoi";
import type GeoJSON from "geojson";

/**
 * Sends an AOI polygon geometry to the backend and receives the list of
 * IGT-PR data items that intersect the area.
 *
 * Currently returns DUMMY_IGT_DATA directly while the real API is not yet available.
 */
export const fetchIgtByAoi = async (
  _geometry: GeoJSON.Polygon,
  _signal?: AbortSignal,
): Promise<IgtDataItem[]> => {
  return DUMMY_IGT_ITEMS;
};
