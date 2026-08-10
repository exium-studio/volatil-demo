// src/features/mitra/data-request/types/mitra.data-request.upload-aoi.type.ts

import type { ReactNode } from "react";
import type GeoJSON from "geojson";

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
