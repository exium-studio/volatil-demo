// src\design-system\components\data-display\types\data-view.type.ts

// src\design-system\components\data-display\types\data-view.type.ts

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import type { SelectProps } from "@/design-system/components/input/types/select.type";
import type { ActionBarRootProps } from "@/design-system/components/overlay/types/action-bar.type";
import type { MenuRootProps, StackProps } from "@chakra-ui/react";
import type { ComponentType, ReactElement, ReactNode } from "react";

export type ActionIconType =
  | ComponentType<{
      size?: string | number;
      className?: string;
      [key: string]: unknown;
    }>
  | ReactNode;

export type DataViewModalActionConfig<T = Record<string, unknown>> = {
  triggerComponent:
    | ReactElement<{ children?: ReactNode }>
    | ((
        item: T,
        formattedItem: FormattedListItem<T>,
      ) => ReactElement<{ children?: ReactNode }> | null | undefined);
};

export type DataViewDeclarativeItemAction<T = Record<string, unknown>> = {
  key?: string;
  label: string | ((item: T) => string); // Label is mandatory
  icon?: ActionIconType | ((item: T) => ActionIconType);
  colorPalette?: string | ((item: T) => string | undefined);
  variant?: "solid" | "subtle" | "outline" | "ghost";
  onClick?: (
    item: T,
    formattedItem: FormattedListItem<T>,
  ) => void | Promise<void>;
  hidden?: (item: T, formattedItem: FormattedListItem<T>) => boolean;
  disabled?: (item: T, formattedItem: FormattedListItem<T>) => boolean;
  showInRow?: boolean; // If true, render in spread action column (default: true)
  showInMenu?: boolean; // If true, render in sticky dropdown menu (default: true)
  sticky?: boolean; // If true, render as sticky action button pinned to the left of the menu trigger

  /**
   * Modal trigger configuration (e.g. `modal: { triggerComponent: <ConfirmationTrigger ... /> }`).
   */
  modal?:
    | DataViewModalActionConfig<T>
    | ((
        item: T,
        formattedItem: FormattedListItem<T>,
      ) => DataViewModalActionConfig<T> | null | undefined);
};

export type DataViewItemActionsGenerator<T = Record<string, unknown>> =
  | DataViewDeclarativeItemAction<T>
  | ((item: FormattedListItem<T>, index: number) => ReactNode);

export type DataViewItemActionsTriggerProps<T = Record<string, unknown>> =
  MenuRootProps & {
    item: FormattedListItem<T>;
    itemActions?: DataViewItemActionsGenerator<T>[];
    contextedTrigger?: boolean;
  };

export type DataViewModalBatchActionConfig<T = Record<string, unknown>> = {
  triggerComponent:
    | ReactElement<{ children?: ReactNode }>
    | ((params: {
        selectedItemIds: string[];
        selectedItems: FormattedListItem<T>[];
        clearSelectedItems: () => void;
      }) => ReactElement<{ children?: ReactNode }> | null | undefined);
};

export type DataViewDeclarativeBatchAction<T = Record<string, unknown>> = {
  key?: string;
  label:
    | string
    | ((params: {
        selectedItemIds: string[];
        selectedItems: FormattedListItem<T>[];
      }) => string);
  icon?:
    | ActionIconType
    | ((params: {
        selectedItemIds: string[];
        selectedItems: FormattedListItem<T>[];
      }) => ActionIconType);
  colorPalette?:
    | string
    | ((params: {
        selectedItemIds: string[];
        selectedItems: FormattedListItem<T>[];
      }) => string | undefined);
  variant?: "solid" | "subtle" | "outline" | "ghost";
  onClick?: (params: {
    selectedItemIds: string[];
    selectedItems: FormattedListItem<T>[];
    clearSelectedItems: () => void;
  }) => void | Promise<void>;
  hidden?: (params: {
    selectedItemIds: string[];
    selectedItems: FormattedListItem<T>[];
  }) => boolean;
  disabled?: (params: {
    selectedItemIds: string[];
    selectedItems: FormattedListItem<T>[];
  }) => boolean;
  loading?: (params: {
    selectedItemIds: string[];
    selectedItems: FormattedListItem<T>[];
  }) => boolean;

  /**
   * Modal trigger configuration (e.g. `modal: { triggerComponent: <ConfirmationTrigger ... /> }`).
   */
  modal?:
    | DataViewModalBatchActionConfig<T>
    | ((params: {
        selectedItemIds: string[];
        selectedItems: FormattedListItem<T>[];
        clearSelectedItems: () => void;
      }) => DataViewModalBatchActionConfig<T> | null | undefined);
};

export type DataViewBatchActionsGenerator<T = Record<string, unknown>> =
  | DataViewDeclarativeBatchAction<T>
  | ((params: {
      selectedItemIds: string[];
      selectedItems: FormattedListItem<T>[];
      clearSelectedItems: () => void;
    }) => ReactNode);

export type DataViewBatchActionsTriggerProps<T = Record<string, unknown>> =
  MenuRootProps & {
    selectedItemIds: string[];
    selectedItems: FormattedListItem<T>[];
    clearSelectedItems: () => void;
    batchActions?: DataViewBatchActionsGenerator<T>[];
    isAllItemsSelected: boolean;
    selectAllItems: (isChecked: boolean) => void;
    menuRootProps?: Omit<MenuRootProps, "children">;
    triggerActionBarMode?: boolean;
  };

export type DataViewBatchActionBarProps<T = Record<string, unknown>> = Omit<
  ActionBarRootProps,
  "children"
> & {
  selectedItemIds: string[];
  selectedItems: FormattedListItem<T>[];
  clearSelectedItems: () => void;
  batchActions?: DataViewBatchActionsGenerator<T>[];
};

export type DataViewFooterProps = Omit<StackProps, "page"> & {
  currentDataLength?: number;
  totalData?: number;
  pageSize: number;
  setPageSize?: (pageSize: number) => void;
  page: number;
  setPage?: (page: number) => void;
  totalPage?: number;
};

export type DataViewPageSizeProps = SelectProps & {
  pageSize: number;
  setPageSize?: (pageSize: number) => void;
  options?: number[];
};

export type DataViewPaginationProps = IconButtonProps & {
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
