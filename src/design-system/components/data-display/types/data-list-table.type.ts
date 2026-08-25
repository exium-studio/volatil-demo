// src/design-system/components/data-display/types/data-list-table.type.ts

import type {
  DataListBatchActionsGenerator,
  DataListItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-list.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ReactNode } from "react";

export type DataListTableRowProps<T = Record<string, unknown>> = {
  item: FormattedListItem<T>;
  index: number;
  isItemSelected: boolean;
  canBatchSelect: boolean;
  withNumbering: boolean;
  itemActions?: DataListItemActionsGenerator<T>[];
  toggleItemSelection: (item: FormattedListItem<T>) => void;
  measureRef?: (element: Element | null) => void;
  dataIndex?: number;
  styleProps?: StackProps;
};

export type FixedLengthArray<
  T,
  N extends number,
  R extends readonly T[] = [],
> = number extends N
  ? T[]
  : R["length"] extends N
    ? [...R]
    : FixedLengthArray<T, N, readonly [T, ...R]>;

export type FormattedListItem<
  T = Record<string, unknown>,
  N extends number = number,
> = {
  id: string; // must be real item data id from DB
  data: T;
  columns: FixedLengthArray<FormattedTableColumn, N>;
  dim?: boolean;
};

export type DataListTableOnSelectedItemChange<
  T = Record<string, unknown>,
  N extends number = number,
> = (payload: {
  selectedItems: FormattedListItem<T, N>[];
  selectedCurrentItem?: FormattedListItem<T, N>;
}) => void;

export type DataListTableRootProps<
  T = Record<string, unknown>,
  N extends number = number,
> = Omit<StackProps, "page"> & {
  children: ReactNode;
  headers: FixedLengthArray<FormattedTableHeader, N>;
  items: FormattedListItem<T, N>[];
  page?: number;
  pageSize?: number;
  initialSortColumnIndex?: number;
  initialSortOrder?: "asc" | "desc";
  canBatchSelect?: boolean;
  selectedItems?: FormattedListItem<T, N>[];
  onSelectedItemChange?: DataListTableOnSelectedItemChange<T, N>;
  batchActions?: DataListBatchActionsGenerator[];
  itemActions?: DataListItemActionsGenerator<T>[];
  withNumbering?: boolean;
  virtualized?: boolean;
  fixedItemHeight?: boolean;
  renderTdCell?: (
    column: FormattedTableColumn,
    item: FormattedListItem<T, N>,
    columnIndex: number,
  ) => ReactNode;
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
  key?: string;
  td?: ReactNode;
  value: unknown;
  align?: "start" | "center" | "end";
  dataType?: DataListTableColumnDataType;
  dim?: boolean;
  bodyCellProps?: StackProps;
};
