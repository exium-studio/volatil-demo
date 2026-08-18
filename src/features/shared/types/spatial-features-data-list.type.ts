// src/features/mitra/shared/types/wfs-data-list.type.ts

import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type GeoJSON from "geojson";
import type { ReactNode } from "react";

export type SpatialFeaturesDataListContentProps = {
  wfsFeatures: GeoJSON.Feature[];
  attributeKeys: string[];
  canBatchSelect?: boolean;
  batchActions?: SpatialFeaturesDataListProps["batchActions"];
  extraItemActions?: SpatialFeaturesDataListProps["extraItemActions"];
  page?: number;
  pageSize?: number;
  selectedItems?: FormattedListItem[];
  onSelectedItemChange?: SpatialFeaturesDataListProps["onSelectedItemChange"];
};

export type SpatialFeaturesDataListProps = StackProps & {
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
  extraItemActions?: DataListItemActionsGenerator[];
  isLoading?: boolean;
  isFetching?: boolean;
};
