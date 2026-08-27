// src/design-system/components/data-display/types/data-list-table.type.ts

import type {
  DataViewBatchActionsGenerator,
  DataViewItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-view.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ReactNode } from "react";

export type DataViewTableRowProps<T = Record<string, unknown>> = {
  item: FormattedListItem<T>;
  index: number;
  isItemSelected: boolean;
  canBatchSelect: boolean;
  withNumbering: boolean;
  itemActions?: DataViewItemActionsGenerator<T>[];
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

export type DataViewTableOnSelectedItemChange<
  T = Record<string, unknown>,
  N extends number = number,
> = (payload: {
  selectedItems: FormattedListItem<T, N>[];
  selectedCurrentItem?: FormattedListItem<T, N>;
}) => void;

export type DataViewTableRootProps<
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
  onSelectedItemChange?: DataViewTableOnSelectedItemChange<T, N>;
  batchActions?: DataViewBatchActionsGenerator[];
  itemActions?: DataViewItemActionsGenerator<T>[];
  withNumbering?: boolean;
  virtualized?: boolean;
  fixedItemHeight?: boolean;
  renderTdCell?: (
    column: FormattedTableColumn,
    item: FormattedListItem<T, N>,
    columnIndex: number,
  ) => ReactNode;
};

export type DataViewTableHeaderProps = StackProps & {};

export type DataViewTableBodyProps = StackProps & {}; // Unused type

export type DataViewTableSortIconProps = {
  active: boolean;
  direction: "asc" | "desc";
};

// ---------------------------------------------------------------------------

export type DataViewTableColumnDataType = "string" | "number" | "date" | "time";

export type DataViewTableSortDirection = "asc" | "desc";

export type DataViewTableSortConfig = {
  columnIndex?: number;
  direction: DataViewTableSortDirection;
};

export type DataViewTableSortHandler = (
  aValue: unknown,
  bValue: unknown,
  direction: DataViewTableSortDirection,
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
  dataType?: DataViewTableColumnDataType;
  dim?: boolean;
  bodyCellProps?: StackProps;
};
