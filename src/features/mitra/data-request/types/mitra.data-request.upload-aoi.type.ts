// src/features/mitra/data-request/types/mitra.data-request.upload-aoi.type.ts

import type { ReactNode } from "react";
import type GeoJSON from "geojson";
import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";

/** Single uploaded AOI file with its parsed GeoJSON polygon — source of truth. */
export type MitraDataRequestUploadAoiLayer = {
  id: string;
  fileName: string;
  fileSize: number;
  polygon: GeoJSON.Feature<GeoJSON.Polygon>;
  /** Processing state: parsing is async (worker), done means polygon is ready. */
  status: "parsing" | "done" | "error";
  errorMessage?: string;
};

export type AoiLayer = MitraDataRequestUploadAoiLayer;

export type MitraDataRequestUploadAoiTabsContentProps = TabsContentProps;

export type MitraDataRequestUploadAoiAddFileButtonProps = ButtonProps & {
  isIconButton?: boolean;
  onFilesAdded: (files: File[]) => void;
};

export type MitraDataRequestUploadAoiFileListTriggerProps = {
  children: ReactNode;
  onFilesAdded: (files: File[]) => void;
  onDeleteLayer: (id: string) => void;
  onClearAll: () => void;
};

export type MitraDataRequestUploadAoiDataViewProps = {
  aoiCqlFilter: string;
  aoiLayers: MitraDataRequestUploadAoiLayer[];
  onFilesAdded: (files: File[]) => void;
  onDeleteLayer: (id: string) => void;
  onClearAll: () => void;
};

export type MitraDataRequestUploadAoiPageState = {
  page: number;
  pageSize: number;
  selectedItems: FormattedListItem[];
};

export type MitraDataRequestUploadAoiAttributeViewProps =
  MitraDataRequestUploadAoiDataViewProps;

