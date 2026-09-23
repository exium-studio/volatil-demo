// src/features/mitra/data-request/types/mitra.data-request.upload-aoi.type.ts

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import type { TabsContentProps } from "@/design-system/components/disclosure/types/tabs.type";
import type GeoJSON from "geojson";
import type { Dispatch, SetStateAction } from "react";

/** Individual polygon feature extracted from uploaded file. */
export type AoiFeatureItem = {
  id: string;
  index: number;
  name: string;
  areaHa: number;
  polygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  isVisibleOnMap: boolean;
};

/** Metadata for the uploaded file. */
export type UploadedAoiFile = {
  id: string;
  fileName: string;
  fileSize: number;
  features: AoiFeatureItem[];
  status: "parsing" | "done" | "error";
  errorMessage?: string;
};

/** Compatibility alias */
export type MitraDataRequestUploadAoiLayer = UploadedAoiFile;
export type AoiLayer = UploadedAoiFile;

export type MitraDataRequestUploadAoiTabsContentProps = TabsContentProps & {
  isActive?: boolean;
};

export type MitraDataRequestUploadAoiDataViewProps = {
  aoiCqlFilter: string;
  confirmedPolygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  isActive?: boolean;
  onResetAoi: () => void;
};

export type MitraDataRequestUploadAoiPageState = {
  page: number;
  pageSize: number;
  selectedItems: FormattedListItem[];
};

export type MitraDataRequestUploadAoiAttributeViewProps =
  MitraDataRequestUploadAoiDataViewProps;

export type UploadAoiFeatureListProps = {
  file: UploadedAoiFile;
  selectedFeatureId: string | null;
  onSelectFeature: (id: string) => void;
  onToggleFeatureVisibility: (id: string) => void;
  onConfirmSelection: () => void;
  onResetFile: () => void;
};

export type MitraDataRequestUploadAoiContextValue = {
  uploadedFile: UploadedAoiFile | null;
  setUploadedFile: Dispatch<SetStateAction<UploadedAoiFile | null>>;
  confirmedFeature: AoiFeatureItem | null;
  setConfirmedFeature: Dispatch<SetStateAction<AoiFeatureItem | null>>;
};

