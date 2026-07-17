// src/design-system/components/data-display/types/data-list-table.type.ts

import type {
  DataListBatchActionsGenerator,
  DataListItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-list.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ReactNode } from "react";

export type DataListTableRootProps = Omit<StackProps, "page"> & {
  children: ReactNode;
  headers: FormattedTableHeader[];
  items: FormattedListItem[];
  initialSortColumnIndex?: number;
  initialSortOrder?: "asc" | "desc";
  batchActions?: DataListBatchActionsGenerator[];
  itemActions?: DataListItemActionsGenerator[];
  withNumbering?: boolean;
};

export type DataListTableHeaderProps = StackProps & {};

export type DataListTableBodyProps = StackProps & {}; // Unused type

export type DataListTableSortIconProps = {
  active: boolean;
  direction: "asc" | "desc";
};

// ---------------------------------------------------------------------------

export type DataListTableColumnDataType = "string" | "number" | "date" | "time";

export type DataListTableSortDirection = "asc" | "desc";

export type DataListTableSortConfig = {
  columnIndex?: number;
  direction: DataListTableSortDirection;
};

export type DataListTableSortHandler = (
  aValue: unknown,
  bValue: unknown,
  direction: DataListTableSortDirection,
) => number;

export type FormattedTableHeader = {
  th: ReactNode;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  headerCellProps?: StackProps;
};

export type FormattedTableColumn = {
  td: ReactNode;
  value: unknown;
  align?: "start" | "center" | "end";
  dataType?: DataListTableColumnDataType;
  dim?: boolean;
  bodyCellProps?: StackProps;
};

export type FormattedListItem<T = Record<string, unknown>> = {
  id: string; // must be real item data id from DB
  data: T;
  columns: FormattedTableColumn[];
  dim?: boolean;
};
