// src/design-system/components/data-display/ui/data-list-table.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { useDataListSelection } from "@/design-system/components/data-display/hooks/use-data-list-selection";
import { useDataListSort } from "@/design-system/components/data-display/hooks/use-data-list-sort";
import type {
  DataListTableHeaderProps,
  DataListTableRootProps,
  DataListTableSortConfig,
  DataListTableSortIconProps,
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import type {
  DataListBatchActionsGenerator,
  DataListItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-list.type";
import {
  DataListBatchActionsTrigger,
  DataListBatchActionBar,
} from "@/design-system/components/data-display/ui/data-list-batch-actions";
import { DataListItemActionsTrigger } from "@/design-system/components/data-display/ui/data-list-item-actions";
import { AppTablerIcon } from "@/design-system/components/icon/ui/app-icon";
import { Checkbox } from "@/design-system/components/input/ui/checkbox";
import type { StackProps } from "@/design-system/components/layout/types/stack.type";
import { Grid } from "@/design-system/components/layout/ui/grid";
import { HStack, VStack } from "@/design-system/components/layout/ui/stack";
import { P } from "@/design-system/components/typography/ui/p";
import {
  TABLE_ACTIONS_CELL_W,
  TABLE_ROW_GAP,
  TABLE_ROW_H,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { isEmptyArray } from "@/shared/utils/data/array";
import { Box, Center } from "@chakra-ui/react";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconDots,
  IconListCheck,
} from "@tabler/icons-react";
import { createContext, useContext, useMemo, forwardRef } from "react";

type DataListTableContextValue = {
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
};

const DataListTableContext = createContext<DataListTableContextValue | null>(
  null,
);

const useDataListTableContext = () => {
  const ctx = useContext(DataListTableContext);
  if (!ctx) {
    throw new Error(
      "DataListTable compound components must be used within <DataListTable.Root>",
    );
  }
  return ctx;
};

// ---------------------------------------------------------------------------

const DataListTableRoot = forwardRef<HTMLDivElement, DataListTableRootProps>(
  (props, ref) => {
    // Props
    const {
      children,
      items,
      headers,
      batchActions = [],
      itemActions = [],
      initialSortColumnIndex,
      initialSortOrder = "asc",
      withNumbering = true,
      ...restProps
    } = props;

    // Stores
    const { theme } = useThemeStore();

    // Hooks
    const { sortConfig, toggleSort, sortedItems } = useDataListSort({
      formattedItems: items,
      initialColumnIndex: initialSortColumnIndex,
      initialDirection: initialSortOrder,
    });
    const {
      isAllItemsSelected,
      selectedItemIds,
      selectedItems,
      selectAllItems,
      clearSelectedItems,
      toggleItemSelection,
    } = useDataListSelection(items);

    // Resolved Values
    const contextValue = useMemo<DataListTableContextValue>(
      () => ({
        headers,
        items,
        initialSortColumnIndex,
        initialSortOrder,
        batchActions,
        itemActions,
        withNumbering,

        sortConfig,
        toggleSort,
        sortedItems,
        selectedItemIds,
        selectedItems,
        isAllItemsSelected,
        toggleItemSelection,
        selectAllItems,
        clearSelectedItems,
      }),
      [
        headers,
        items,
        initialSortColumnIndex,
        initialSortOrder,
        batchActions,
        itemActions,
        withNumbering,

        sortConfig,
        toggleSort,
        sortedItems,
        selectedItemIds,
        selectedItems,
        isAllItemsSelected,
        toggleItemSelection,
        selectAllItems,
        clearSelectedItems,
      ],
    );

    const gridCols = useMemo(() => {
      const cols = [];

      if (!isEmptyArray(batchActions)) {
        cols.push(TABLE_ACTIONS_CELL_W);
      }

      if (withNumbering) {
        cols.push(TABLE_ACTIONS_CELL_W);
      }

      headers.forEach(() => cols.push("auto"));

      if (!isEmptyArray(itemActions)) {
        cols.push(TABLE_ACTIONS_CELL_W);
      }

      return cols.join(" ");
    }, [batchActions, headers, itemActions, withNumbering]);

    return (
      <DataListTableContext.Provider value={contextValue}>
        <VStack
          className={"table-container"}
          ref={ref}
          overflow={"auto"}
          pb={TABLE_ROW_GAP}
          roundedTop={theme.radii.container}
          shadow={"sm"}
          {...restProps}
        >
          <Grid
            role={"table"}
            gridTemplateColumns={gridCols}
            w={headers.length > 1 ? "full" : "fit"}
            rowGap={TABLE_ROW_GAP}
          >
            {children}
          </Grid>
        </VStack>

        <DataListBatchActionBar
          selectedItemIds={selectedItemIds}
          selectedItems={selectedItems}
          clearSelectedItems={clearSelectedItems}
          batchActions={batchActions}
        />
      </DataListTableContext.Provider>
    );
  },
);

const DataListTableCell = forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    return (
      <HStack
        className="table-cell"
        ref={ref}
        align={"center"}
        justify={"center"}
        gap={2}
        px={4}
        py={2}
        bg={"bg.body"}
        whiteSpace={"nowrap"}
        userSelect={"none"}
        {...props}
      />
    );
  },
);

const DataListTableHeader = forwardRef<
  HTMLDivElement,
  DataListTableHeaderProps
>((props, ref) => {
  // Stores
  const { theme } = useThemeStore();

  const {
    batchActions,
    selectedItemIds,
    selectedItems,
    clearSelectedItems,
    isAllItemsSelected,
    selectAllItems,
    headers,
    itemActions,
    sortConfig,
    toggleSort,
    withNumbering,
  } = useDataListTableContext();

  return (
    <Box
      role={"row"}
      ref={ref}
      display={"grid"}
      gridTemplateColumns={"subgrid"}
      gridColumn={"1 / -1"}
      overflow={"clip"}
      h={TABLE_ROW_H}
      pos={"sticky"}
      top={0}
      left={0}
      zIndex={3}
      roundedTop={theme.radii.component}
      shadow={"sm"}
      {...props}
    >
      {!isEmptyArray(batchActions) && (
        <DataListTableCell pos={"sticky"} left={0}>
          <DataListBatchActionsTrigger
            batchActions={batchActions}
            selectedItemIds={selectedItemIds}
            selectedItems={selectedItems}
            clearSelectedItems={clearSelectedItems}
            isAllItemsSelected={isAllItemsSelected}
            selectAllItems={selectAllItems}
          >
            <IconButton variant={"ghost"} size={"xs"}>
              <AppTablerIcon icon={IconListCheck} />
            </IconButton>
          </DataListBatchActionsTrigger>
        </DataListTableCell>
      )}

      {withNumbering && (
        <DataListTableCell>
          <P color={"fg.subtle"}>#</P>
        </DataListTableCell>
      )}

      {headers.map((header, index) => (
        <DataListTableCell
          key={index}
          justify={header.align}
          cursor={header.sortable ? "pointer" : "auto"}
          onClick={header.sortable ? () => toggleSort(index) : undefined}
          {...header?.headerCellProps}
        >
          <P fontSize={"sm"} fontWeight={"semibold"} color={"fg.subtle"}>
            {header.th}
          </P>

          {header.sortable && (
            <DataListTableSortIcon
              active={sortConfig.columnIndex === index}
              direction={sortConfig.direction}
            />
          )}
        </DataListTableCell>
      ))}

      {!isEmptyArray(itemActions) && (
        <DataListTableCell pos={"sticky"} top={0} right={0} />
      )}
    </Box>
  );
});

const DataListTableBody = () => {
  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const {
    batchActions,
    sortedItems,
    itemActions,
    selectedItemIds,
    toggleItemSelection,
    withNumbering,
  } = useDataListTableContext();

  return (
    <>
      {sortedItems.map((item, index) => {
        const isItemSelected = selectedItemIds.includes(item.id);

        const bodyCellStyles = {
          bg: isItemSelected ? `${theme.colorPalette}.subtle` : "bg.body",
        };

        return (
          <Box
            key={item.id}
            role={"row"}
            display={"grid"}
            gridTemplateColumns={"subgrid"}
            gridColumn={"1 / -1"}
            overflow={"clip"}
            h={TABLE_ROW_H}
            shadow={isItemSelected ? "md" : "none"}
          >
            {!isEmptyArray(batchActions) && (
              <Center
                h={"full"}
                px={"10px"}
                pos={"sticky"}
                left={0}
                cursor={"pointer"}
                {...bodyCellStyles}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItemSelection(item);
                }}
              >
                <Checkbox
                  size={"sm"}
                  checked={isItemSelected}
                  variant={"subtle"}
                />
              </Center>
            )}

            {withNumbering && (
              <DataListTableCell {...bodyCellStyles}>
                <P>{index + 1}</P>
              </DataListTableCell>
            )}

            {item.columns.map((col, colIndex) => (
              <HStack
                key={colIndex}
                align={"center"}
                justify={col.align}
                w={"full"}
                h={"full"}
                px={3}
                py={2}
                opacity={item.dim || col.dim ? 0.5 : 1}
                whiteSpace={"nowrap"}
                {...bodyCellStyles}
                {...col?.bodyCellProps}
              >
                {col.td}
              </HStack>
            ))}

            {!isEmptyArray(itemActions) && (
              <Center
                h={"full"}
                px={"10px"}
                pos={"sticky"}
                right={0}
                zIndex={2}
                {...bodyCellStyles}
                onClick={(e) => e.stopPropagation()}
              >
                <DataListItemActionsTrigger
                  itemActions={itemActions}
                  item={item}
                >
                  <IconButton variant={"ghost"} size={"xs"}>
                    <AppTablerIcon icon={IconDots} />
                  </IconButton>
                </DataListItemActionsTrigger>
              </Center>
            )}
          </Box>
        );
      })}
    </>
  );
};

const DataListTableSortIcon = ({
  active,
  direction,
}: DataListTableSortIconProps) => {
  // Stores
  const { theme } = useThemeStore();

  // Derived Values
  const primaryFg = `${theme.colorPalette}.fg`;
  const isAscActive = active && direction === "asc";
  const isDescActive = active && direction === "desc";

  return (
    <VStack align={"center"}>
      <AppTablerIcon
        icon={IconCaretUpFilled}
        boxSize={"11px"}
        color={isAscActive ? primaryFg : "fg.subtle"}
        mb={"-6px"}
      />
      <AppTablerIcon
        icon={IconCaretDownFilled}
        boxSize={"11px"}
        color={isDescActive ? primaryFg : "fg.subtle"}
      />
    </VStack>
  );
};

export const DataListTable = {
  Root: DataListTableRoot,
  Header: DataListTableHeader,
  Body: DataListTableBody,
};
