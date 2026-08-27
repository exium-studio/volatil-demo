// src/features/mitra/shared/types/wfs-data-list.type.ts

import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type GeoJSON from "geojson";
import type { ReactNode } from "react";

export type SpatialFeaturesDataViewContentProps = {
  wfsFeatures: GeoJSON.Feature[];
  attributeKeys: string[];
  canBatchSelect?: boolean;
  batchActions?: SpatialFeaturesDataViewProps["batchActions"];
  extraItemActions?: SpatialFeaturesDataViewProps["extraItemActions"];
  page?: number;
  pageSize?: number;
  selectedItems?: FormattedListItem[];
  onSelectedItemChange?: SpatialFeaturesDataViewProps["onSelectedItemChange"];
};

export type SpatialFeaturesDataViewProps = StackProps & {
  wfsFeatures: GeoJSON.Feature[];
  page?: number;
  pageSize?: number;
  totalFeatures?: number;
  setPage?: (page: number) => void;
  setPageSize?: (pageSize: number) => void;
  selectedItems?: FormattedListItem[];
  onSelectedItemChange?: (params: {
    selectedItems: FormattedListItem[];
  }) => void;
  canBatchSelect?: boolean;
  batchActions?: Array<
    (params: {
      selectedItemIds: string[];
      clearSelectedItems: () => void;
    }) => ReactNode
  >;
  extraItemActions?: DataViewItemActionsGenerator[];
  isLoading?: boolean;
  isFetching?: boolean;
};
