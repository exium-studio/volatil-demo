// src/features/mitra/data-request/types/mitra.data-request.catalog.type.ts

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";

export type MitraDataRequestCatalogTabsContentProps = TabsContentProps & {
  isActive?: boolean;
};

export type CatalogDataViewProps = {
  page: number;
  pageSize: number;
  cqlFilter?: string;
  search?: string;
  selectedItems: FormattedListItem[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSelectedItemChange: (selectedItems: FormattedListItem[]) => void;
};
