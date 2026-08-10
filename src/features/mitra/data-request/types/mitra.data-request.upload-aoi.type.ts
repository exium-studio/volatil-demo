// src/features/mitra/data-request/types/mitra.data-request.upload-aoi.type.ts

import type { ReactNode } from "react";
import type GeoJSON from "geojson";

/** Single uploaded AOI file with its parsed GeoJSON polygon — source of truth. */
export type AoiLayer = {
  id: string;
  fileName: string;
  fileSize: number;
  polygon: GeoJSON.Feature<GeoJSON.Polygon>;
  /** Processing state: parsing is async (worker), done means polygon is ready. */
  status: "parsing" | "done" | "error";
  errorMessage?: string;
};

export type UploadAoiFileListTriggerProps = {
  children: ReactNode;
};

export type UploadAoiWfsIgtDataListProps = {
  wfsFeatures: GeoJSON.Feature[];
};

export type MitraDataRequestUploadAoiFileListTriggerProps =
  UploadAoiFileListTriggerProps;
export type MitraDataRequestUploadAoiWfsIgtDataListProps =
  UploadAoiWfsIgtDataListProps;
