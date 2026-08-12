// src/design-system/components/data-display/ui/data-list-table.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { DataListTableContextValue } from "@/design-system/components/data-display/contexts/data-list-table.context";
import { useDataListSelection } from "@/design-system/components/data-display/hooks/use-data-list-selection";
import { useDataListSort } from "@/design-system/components/data-display/hooks/use-data-list-sort";
import type {
  DataListTableHeaderProps,
  DataListTableRootProps,
  DataListTableSortIconProps,
  FormattedListItem,
} from "@/design-system/components/data-display/types/data-list-table.type";
import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import {
  DataListBatchActionBar,
  DataListBatchActionsTrigger,
} from "@/design-system/components/data-display/ui/data-list-batch-actions";
import { DataListItemActionsTrigger } from "@/design-system/components/data-display/ui/data-list-item-actions";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Checkbox } from "@/design-system/components/input/ui/checkbox";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Grid } from "@/design-system/components/layout/ui/grid";
import { P } from "@/design-system/components/typography/ui/p";
import { TABLE } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { isEmptyArray } from "@/shared/utils/data/array";
import { tintAlpha } from "@/shared/utils/style/color";
import { Box, Center } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconListCheck,
} from "@tabler/icons-react";
import { EllipsisIcon } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DataListTableContext,
  useDataListTableContext,
} from "@/design-system/components/data-display/contexts/data-list-table.context";

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
      canBatchSelect = false,
      selectedItems: controlledSelectedItems,
      onSelectedItemChange,
      virtualized = true,
      fixedItemHeight = true,
      renderTdCell,
      page,
      pageSize,
      ...restProps
    } = props;

    // Refs & Container State
    const [tableContainerEl, setTableContainerEl] =
      useState<HTMLDivElement | null>(null);
    const tableContainerRef = useRef<HTMLDivElement | null>(null);

    const setTableContainerRef = useCallback(
      (node: HTMLDivElement | null) => {
        tableContainerRef.current = node;
        setTableContainerEl(node);

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    useImperativeHandle(ref, () => tableContainerRef.current as HTMLDivElement);

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
    } = useDataListSelection(
      items,
      controlledSelectedItems,
      onSelectedItemChange,
    );

    // Resolved Values
    const contextValue = useMemo<DataListTableContextValue>(
      () => ({
        headers,
        items,
        page,
        pageSize,
        initialSortColumnIndex,
        initialSortOrder,
        batchActions,
        itemActions,
        withNumbering,
        virtualized,
        fixedItemHeight,
        tableContainerRef,
        tableContainerEl,

        sortConfig,
        toggleSort,
        sortedItems,
        selectedItemIds,
        selectedItems,
        isAllItemsSelected,
        toggleItemSelection,
        selectAllItems,
        clearSelectedItems,
        canBatchSelect: !isEmptyArray(batchActions) || canBatchSelect,
        renderTdCell,
      }),
      [
        headers,
        items,
        page,
        pageSize,
        initialSortColumnIndex,
        initialSortOrder,
        batchActions,
        itemActions,
        withNumbering,
        virtualized,
        fixedItemHeight,
        tableContainerRef,
        tableContainerEl,

        sortConfig,
        toggleSort,
        sortedItems,
        selectedItemIds,
        selectedItems,
        isAllItemsSelected,
        toggleItemSelection,
        selectAllItems,
        clearSelectedItems,
        canBatchSelect,
        renderTdCell,
      ],
    );

    const gridCols = useMemo(() => {
      const cols: string[] = [];

      if (canBatchSelect || !isEmptyArray(batchActions)) {
        cols.push(TABLE.actionsCellW);
      }

      if (withNumbering) {
        cols.push(TABLE.actionsCellW);
      }

      headers.forEach(() => cols.push("auto"));

      if (!isEmptyArray(itemActions)) {
        cols.push(TABLE.actionsCellW);
      }

      return cols.join(" ");
    }, [canBatchSelect, batchActions, headers, itemActions, withNumbering]);

    return (
      <DataListTableContext.Provider value={contextValue}>
        <VStack
          className={"table-container"}
          ref={setTableContainerRef}
          overflow={"auto"}
          pb={TABLE.rowGap}
          roundedTop={theme.radii.container}
          shadow={"sm"}
          {...restProps}
        >
          <Grid
            role={"table"}
            gridTemplateColumns={gridCols}
            w={headers.length > 1 ? "full" : "fit"}
            rowGap={TABLE.rowGap}
          >
            {children}
          </Grid>
        </VStack>

        {!isEmptyArray(batchActions) && (
          <DataListBatchActionBar
            selectedItemIds={selectedItemIds}
            selectedItems={selectedItems}
            clearSelectedItems={clearSelectedItems}
            batchActions={batchActions}
          />
        )}
      </DataListTableContext.Provider>
    );
  },
);

const DataListTableHeader = (props: DataListTableHeaderProps) => {
  const {
    canBatchSelect,
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
      display={"grid"}
      gridTemplateColumns={"subgrid"}
      gridColumn={"1 / -1"}
      overflow={"clip"}
      h={TABLE.rowH}
      pos={"sticky"}
      top={0}
      left={0}
      zIndex={3}
      shadow={"sm"}
      {...props}
    >
      {canBatchSelect && (
        <DataListTableCell pos={"sticky"} left={0}>
          <DataListBatchActionsTrigger
            batchActions={batchActions}
            selectedItemIds={selectedItemIds}
            selectedItems={selectedItems}
            clearSelectedItems={clearSelectedItems}
            isAllItemsSelected={isAllItemsSelected}
            selectAllItems={selectAllItems}
            triggerActionBarMode={true}
          >
            <IconButton variant={"ghost"} size={"xs"}>
              <AppIcon icon={IconListCheck} />
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
};

interface DataListTableRowProps {
  item: FormattedListItem;
  index: number;
  isItemSelected: boolean;
  canBatchSelect: boolean;
  withNumbering: boolean;
  itemActions?: DataListItemActionsGenerator[];
  toggleItemSelection: (item: FormattedListItem) => void;
  bodyCellStyles: { bg: string };
  measureRef?: (element: Element | null) => void;
  dataIndex?: number;
  styleProps?: StackProps;
}

const DataListTableRow = ({
  item,
  index,
  isItemSelected,
  canBatchSelect,
  withNumbering,
  itemActions = [],
  toggleItemSelection,
  bodyCellStyles,
  measureRef,
  dataIndex,
  styleProps,
}: DataListTableRowProps) => {
  // Contexts
  const { page, pageSize, renderTdCell } = useDataListTableContext();

  return (
    <Box
      ref={measureRef}
      data-index={dataIndex}
      role={"row"}
      display={"grid"}
      gridTemplateColumns={"subgrid"}
      gridColumn={"1 / -1"}
      overflow={"clip"}
      minH={TABLE.rowH}
      bg={"bg.body"}
      shadow={isItemSelected ? "md" : "none"}
      {...styleProps}
    >
      {canBatchSelect && (
        <Center
          pos={"sticky"}
          left={0}
          bg={"bg.body"}
          cursor={"pointer"}
          onClick={(e) => {
            e.stopPropagation();
            toggleItemSelection(item);
          }}
        >
          <Center w={"full"} h={"full"} px={"10px"} {...bodyCellStyles}>
            <Checkbox size={"sm"} checked={isItemSelected} variant={"subtle"} />
          </Center>
        </Center>
      )}

      {withNumbering && page && pageSize && (
        <DataListTableCell {...bodyCellStyles}>
          <P>{index + 1 + (page - 1) * pageSize}</P>
        </DataListTableCell>
      )}

      {item.columns.map((col, colIndex) => (
        <HStack
          key={colIndex}
          align={"center"}
          justify={col.align}
          w={"full"}
          h={"full"}
          px={4}
          py={2}
          opacity={item.dim || col.dim ? 0.5 : 1}
          whiteSpace={"nowrap"}
          {...bodyCellStyles}
          {...col?.bodyCellProps}
        >
          {renderTdCell
            ? renderTdCell(col, item, colIndex)
            : (col.td ?? <P fontSize={"sm"}>{String(col.value ?? "-")}</P>)}
        </HStack>
      ))}

      {!isEmptyArray(itemActions) && (
        <Center pos={"sticky"} right={0} zIndex={2} bg={"bg.body"}>
          <Center
            w={"full"}
            h={"full"}
            px={"10px"}
            {...bodyCellStyles}
            onClick={(e) => e.stopPropagation()}
          >
            <DataListItemActionsTrigger itemActions={itemActions} item={item}>
              <IconButton variant={"ghost"} size={"xs"}>
                <AppIcon icon={EllipsisIcon} />
              </IconButton>
            </DataListItemActionsTrigger>
          </Center>
        </Center>
      )}
    </Box>
  );
};

const DataListTableBody = () => {
  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const {
    canBatchSelect,
    sortedItems,
    itemActions,
    selectedItemIds,
    toggleItemSelection,
    withNumbering,
    virtualized = true,
    fixedItemHeight = true,
    tableContainerRef,
    tableContainerEl,
  } = useDataListTableContext();

  const rowHeight = useMemo(() => parseInt(TABLE.rowH, 10), []);
  const rowGap = useMemo(() => parseInt(TABLE.rowGap, 10), []);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: sortedItems.length,
    getScrollElement: () => tableContainerEl ?? tableContainerRef.current,
    estimateSize: () => rowHeight,
    gap: rowGap,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Fallback to direct rendering if virtualized is false or if virtualizer returned no items despite items existing
  if (!virtualized || (virtualItems.length === 0 && sortedItems.length > 0)) {
    return (
      <>
        {sortedItems.map((item, index) => {
          const isItemSelected = selectedItemIds.includes(item.id);
          const bodyCellStyles = {
            bg: isItemSelected
              ? tintAlpha(`${theme.colorPalette}.subtle`, 40)
              : "bg.body",
          };

          return (
            <DataListTableRow
              key={item.id}
              item={item}
              index={index}
              isItemSelected={isItemSelected}
              canBatchSelect={canBatchSelect}
              withNumbering={Boolean(withNumbering)}
              itemActions={itemActions}
              toggleItemSelection={toggleItemSelection}
              bodyCellStyles={bodyCellStyles}
            />
          );
        })}
      </>
    );
  }

  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const totalSize = virtualizer.getTotalSize();
  const paddingBottom =
    virtualItems.length > 0
      ? totalSize - virtualItems[virtualItems.length - 1].end
      : 0;

  return (
    <>
      {paddingTop > 0 && (
        <Box gridColumn={"1 / -1"} h={`${paddingTop}px`} aria-hidden={"true"} />
      )}

      {virtualItems.map((virtualRow) => {
        const item = sortedItems[virtualRow.index];
        const index = virtualRow.index;
        const isItemSelected = selectedItemIds.includes(item.id);
        const bodyCellStyles = {
          bg: isItemSelected
            ? tintAlpha(`${theme.colorPalette}.subtle`, 40)
            : "bg.body",
        };

        return (
          <DataListTableRow
            key={item.id}
            item={item}
            index={index}
            isItemSelected={isItemSelected}
            canBatchSelect={canBatchSelect}
            withNumbering={Boolean(withNumbering)}
            itemActions={itemActions}
            toggleItemSelection={toggleItemSelection}
            bodyCellStyles={bodyCellStyles}
            measureRef={
              fixedItemHeight ? undefined : virtualizer.measureElement
            }
            dataIndex={fixedItemHeight ? undefined : virtualRow.index}
          />
        );
      })}

      {paddingBottom > 0 && (
        <Box
          gridColumn={"1 / -1"}
          h={`${paddingBottom}px`}
          aria-hidden={"true"}
        />
      )}
    </>
  );
};

const DataListTableCell = (props: StackProps) => {
  return (
    <HStack
      className="table-cell"
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
      <AppIcon
        icon={IconCaretUpFilled}
        boxSize={"11px"}
        color={isAscActive ? primaryFg : "fg.subtle"}
        mb={"-6px"}
      />
      <AppIcon
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
