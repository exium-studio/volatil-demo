// src/design-system/components/data-display/contexts/data-list-table.context.ts

import type {
  DataListTableSortConfig,
  FormattedListItem,
  FormattedTableHeader,
  FormattedTableColumn,
} from "@/design-system/components/data-display/types/data-list-table.type";
import type {
  DataListBatchActionsGenerator,
  DataListItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-list.type";
import type { RefObject } from "react";
import { createContext, useContext } from "react";

export type DataListTableContextValue = {
  headers: FormattedTableHeader[];
  items: FormattedListItem[];
  page?: number;
  pageSize?: number;
  initialSortColumnIndex?: number;
  initialSortOrder?: "asc" | "desc";
  batchActions?: DataListBatchActionsGenerator[];
  itemActions?: DataListItemActionsGenerator[];
  withNumbering?: boolean;
  virtualized?: boolean;
  fixedItemHeight?: boolean;
  tableContainerRef: RefObject<HTMLDivElement | null>;
  tableContainerEl: HTMLDivElement | null;

  sortConfig: DataListTableSortConfig;
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

export const DataListTableContext =
  createContext<DataListTableContextValue | null>(null);

export const useDataListTableContext = () => {
  const ctx = useContext(DataListTableContext);
  if (!ctx) {
    throw new Error(
      "DataListTable compound components must be used within <DataListTable.Root>",
    );
  }
  return ctx;
};
