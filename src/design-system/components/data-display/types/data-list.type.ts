// src/design-system/components/data-display/types/data-list.type.ts

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { SelectProps } from "@/design-system/components/input/types/select.type";
import type { ActionBarRootProps } from "@/design-system/components/overlay/types/action-bar.type";
import type { MenuRootProps, StackProps } from "@chakra-ui/react";
import type { ComponentType, ReactNode } from "react";

export type ActionIconType =
  | ComponentType<{ size?: string | number; className?: string; [key: string]: unknown }>
  | ReactNode;

export type DataListDeclarativeItemAction<T = Record<string, unknown>> = {
  key?: string;
  label: string | ((item: T) => string); // Label is mandatory
  icon?: ActionIconType | ((item: T) => ActionIconType);
  colorPalette?: string | ((item: T) => string | undefined);
  variant?: "solid" | "subtle" | "outline" | "ghost";
  onClick?: (item: T, formattedItem: FormattedListItem<T>) => void | Promise<void>;
  hidden?: (item: T, formattedItem: FormattedListItem<T>) => boolean;
  disabled?: (item: T, formattedItem: FormattedListItem<T>) => boolean;
  showInRow?: boolean; // If true, render in spread action column (default: true)
  showInMenu?: boolean; // If true, render in sticky dropdown menu (default: true)

  /**
   * Declarative Modal Trigger wrapper (e.g. ConfirmationTrigger, TransactionDetailTrigger, etc.).
   * Receives `children` (the standard button / menu item) and must return the trigger component wrapping that children.
   */
  modalTrigger?: (
    children: ReactNode,
    item: T,
    formattedItem: FormattedListItem<T>,
  ) => ReactNode;
};

export type DataListItemActionsGenerator<T = Record<string, unknown>> =
  | DataListDeclarativeItemAction<T>
  | ((item: FormattedListItem<T>, index: number) => ReactNode);

export type DataListItemActionsTriggerProps<T = Record<string, unknown>> =
  MenuRootProps & {
    item: FormattedListItem<T>;
    itemActions?: DataListItemActionsGenerator<T>[];
    contextedTrigger?: boolean;
  };

export type DataListBatchActionsGenerator = (params: {
  selectedItemIds: string[];
  selectedItems: FormattedListItem[];
  clearSelectedItems: () => void;
}) => ReactNode;

export type DataListBatchActionsTriggerProps = MenuRootProps & {
  selectedItemIds: string[];
  selectedItems: FormattedListItem[];
  clearSelectedItems: () => void;
  batchActions?: DataListBatchActionsGenerator[];
  isAllItemsSelected: boolean;
  selectAllItems: (isChecked: boolean) => void;
  menuRootProps?: Omit<MenuRootProps, "children">;
  triggerActionBarMode?: boolean;
};

export type DataListBatchActionBarProps = Omit<
  ActionBarRootProps,
  "children"
> & {
  selectedItemIds: string[];
  selectedItems: FormattedListItem[];
  clearSelectedItems: () => void;
  batchActions?: DataListBatchActionsGenerator[];
};

export type DataListFooterProps = Omit<StackProps, "page"> & {
  currentDataLength?: number;
  totalData?: number;
  pageSize: number;
  setPageSize?: (pageSize: number) => void;
  page: number;
  setPage?: (page: number) => void;
  totalPage?: number;
};

export type DataListPageSizeProps = SelectProps & {
  pageSize: number;
  setPageSize?: (pageSize: number) => void;
  options?: number[];
};

export type DataListPaginationProps = IconButtonProps & {
  page: number;
  setPage?: (page: number) => void;
  totalPage?: number;
};

export type DataListFilterProps<T = Record<string, unknown>> = SelectProps & {
  filterKey: string;
  label?: string;
  onFilterChange?: (key: string, value: unknown) => void;
  filterOption?: (item: T) => boolean;
};
