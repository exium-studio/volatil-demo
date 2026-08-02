// src/design-system/components/data-display/contexts/data-list-table.context.ts

import type {
  DataListTableSortConfig,
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import type {
  DataListBatchActionsGenerator,
  DataListItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-list.type";
import { createContext, useContext } from "react";

export type DataListTableContextValue = {
  headers: FormattedTableHeader[];
  items: FormattedListItem[];
  initialSortColumnIndex?: number;
  initialSortOrder?: "asc" | "desc";
  batchActions?: DataListBatchActionsGenerator[];
  itemActions?: DataListItemActionsGenerator[];
  withNumbering?: boolean;

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
