// src/features/mitra/shared/types/wfs-data-list.type.ts

import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type GeoJSON from "geojson";
import type { ReactNode } from "react";

export type WfsDataListProps = StackProps & {
  /** Current page of WFS features to display (server-paged by parent via maxFeatures+startIndex). */
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

// Aliases for compatibility
export type WfsIgtDataListProps = WfsDataListProps;
export type MitraWfsDataListProps = WfsDataListProps;
