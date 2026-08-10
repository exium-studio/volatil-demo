// src/features/mitra/data-request/types/mitra.data-request.wfs-data-list.type.ts

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type GeoJSON from "geojson";

export type WfsDataListProps = StackProps & {
  /** Current page of WFS features to display (server-paged by parent via maxFeatures+startIndex). */
  wfsFeatures: GeoJSON.Feature[];
  page?: number;
  pageSize?: number;
  totalFeatures?: number;
  setPage?: (page: number) => void;
  setPageSize?: (pageSize: number) => void;
  onSelectedItemChange?: (params: {
    selectedItems: FormattedListItem[];
  }) => void;
};
