// src/design-system/components/data-display/types/data-list.type.ts
import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { SelectProps } from "@/design-system/components/input/types/select.type";
import type { ActionBarRootProps } from "@/design-system/components/overlay/types/action-bar.type";
import type { MenuRootProps, StackProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type DataListItemActionsGenerator<T = Record<string, unknown>> = (
  item: FormattedListItem<T>,
  index: number,
) => ReactNode;

export type DataListItemActionsTriggerProps<T = Record<string, unknown>> = {
  item: FormattedListItem<T>;
  itemActions?: DataListItemActionsGenerator[];
  contextedTrigger?: boolean;
} & MenuRootProps;

export type DataListBatchActionsGenerator = (params: {
  selectedItemIds: string[];
  selectedItems: FormattedListItem[];
  clearSelectedItems: () => void;
}) => ReactNode;

export type DataListBatchActionsTriggerProps = {
  selectedItemIds: string[];
  selectedItems: FormattedListItem[];
  clearSelectedItems: () => void;
  batchActions?: DataListBatchActionsGenerator[];
  isAllItemsSelected: boolean;
  selectAllItems: (isChecked: boolean) => void;
  menuRootProps?: Omit<MenuRootProps, "children">;
  triggerActionBarMode?: boolean;
} & MenuRootProps;

export type DataListBatchActionBarProps = {
  selectedItemIds: string[];
  selectedItems: FormattedListItem[];
  clearSelectedItems: () => void;
  batchActions?: DataListBatchActionsGenerator[];
} & Omit<ActionBarRootProps, "children">;

export type DataListFooterProps = {
  currentDataLength?: number;
  totalData?: number;
  perPage: number;
  setPerPage?: (perPage: number) => void;
  page: number;
  setPage?: (page: number) => void;
  totalPage?: number;
} & Omit<StackProps, "page">;

export type DataListPerPageProps = {
  perPage: number;
  setPerPage?: (perPage: number) => void;
  options?: number[];
} & SelectProps;

export type DataListPaginationProps = {
  page: number;
  setPage?: (page: number) => void;
  totalPage?: number;
} & IconButtonProps;
