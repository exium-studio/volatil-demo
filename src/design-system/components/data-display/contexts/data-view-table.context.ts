// src/design-system/components/data-display/contexts/data-list-table.context.ts

import type {
  DataViewTableSortConfig,
  FormattedListItem,
  FormattedTableHeader,
  FormattedTableColumn,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type {
  DataViewBatchActionsGenerator,
  DataViewItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-view.type";
import type { RefObject } from "react";
import { createContext, useContext } from "react";

export type DataViewTableContextValue = {
  headers: FormattedTableHeader[];
  items: FormattedListItem[];
  page?: number;
  pageSize?: number;
  initialSortColumnIndex?: number;
  initialSortOrder?: "asc" | "desc";
  batchActions?: DataViewBatchActionsGenerator[];
  itemActions?: DataViewItemActionsGenerator[];
  withNumbering?: boolean;
  virtualized?: boolean;
  fixedItemHeight?: boolean;
  tableContainerRef: RefObject<HTMLDivElement | null>;
  tableContainerEl: HTMLDivElement | null;

  sortConfig: DataViewTableSortConfig;
  toggleSort: (columnIndex: number) => void;
  sortedItems: FormattedListItem[];
  selectedItemIds: string[];
  selectedItems: FormattedListItem[];
  isAllItemsSelected: boolean;
  toggleItemSelection: (item: FormattedListItem) => void;
  selectAllItems: (isChecked: boolean) => void;
  clearSelectedItems: () => void;
  canBatchSelect: boolean;
  renderTdCell?: (
    column: FormattedTableColumn,
    item: FormattedListItem,
    columnIndex: number,
  ) => React.ReactNode;
};

export const DataViewTableContext =
  createContext<DataViewTableContextValue | null>(null);

export const useDataViewTableContext = () => {
  const ctx = useContext(DataViewTableContext);
  if (!ctx) {
    throw new Error(
      "DataView.Table compound components must be used within <DataView.Table.Root>",
    );
  }
  return ctx;
};
