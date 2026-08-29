// src/design-system/components/data-display/ui/data-list-table.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { DataViewTableContextValue } from "@/design-system/components/data-display/contexts/data-view-table.context";
import {
  DataViewTableContext,
  useDataViewTableContext,
} from "@/design-system/components/data-display/contexts/data-view-table.context";
import { useDataViewSelection } from "@/design-system/components/data-display/hooks/use-data-view-selection";
import { useDataViewSort } from "@/design-system/components/data-display/hooks/use-data-view-sort";
import type {
  DataViewTableHeaderProps,
  DataViewTableOnSelectedItemChange,
  DataViewTableRootProps,
  DataViewTableRowProps,
  DataViewTableSortIconProps,
  FormattedListItem,
  FormattedTableColumn,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import {
  DataViewBatchActionBar,
  DataViewBatchActionsTrigger,
} from "@/design-system/components/data-display/ui/data-view-batch-actions";
import {
  DataListItemActionsTrigger,
  DataViewSpreadActions,
} from "@/design-system/components/data-display/ui/data-view-item-actions";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Checkbox } from "@/design-system/components/input/ui/checkbox";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Grid } from "@/design-system/components/layout/ui/grid";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import { tintAlpha } from "@/shared/utils/style/color";
import { Box, Center } from "@chakra-ui/react";
import { IconListCheck } from "@tabler/icons-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDownIcon, ChevronUpIcon, EllipsisIcon } from "lucide-react";
import {
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

// ---------------------------------------------------------------------------

const DataListTableRootInternal = <
  T extends Record<string, unknown> = Record<string, unknown>,
  N extends number = number,
>(
  props: DataViewTableRootProps<T, N> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => {
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
    ref,
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

  const headersList = headers as unknown as FormattedTableHeader[];
  const itemsList = items as unknown as FormattedListItem[];
  const selectedItemsList = controlledSelectedItems as unknown as
    | FormattedListItem[]
    | undefined;
  const onSelectedItemChangeHandler = onSelectedItemChange as unknown as
    | DataViewTableOnSelectedItemChange
    | undefined;
  const itemActionsList = itemActions as unknown as
    | DataViewItemActionsGenerator[]
    | undefined;
  const renderTdCellHandler = renderTdCell as unknown as
    | ((
        column: FormattedTableColumn,
        item: FormattedListItem,
        columnIndex: number,
      ) => React.ReactNode)
    | undefined;

  // Hooks
  const { sortConfig, toggleSort, sortedItems } = useDataViewSort({
    formattedItems: itemsList,
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
  } = useDataViewSelection(
    itemsList,
    selectedItemsList,
    onSelectedItemChangeHandler,
  );

  // Resolved Values
  const contextValue = useMemo<DataViewTableContextValue>(
    () => ({
      headers: headersList,
      items: itemsList,
      page,
      pageSize,
      initialSortColumnIndex,
      initialSortOrder,
      batchActions,
      itemActions: itemActionsList,
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
      renderTdCell: renderTdCellHandler,
    }),
    [
      headersList,
      itemsList,
      page,
      pageSize,
      initialSortColumnIndex,
      initialSortOrder,
      batchActions,
      itemActionsList,
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
      renderTdCellHandler,
    ],
  );

  const gridCols = useMemo(() => {
    const cols: string[] = [];

    if (canBatchSelect || !isEmptyArray(batchActions)) {
      cols.push("56px");
    }

    if (withNumbering) {
      cols.push("56px");
    }

    headersList.forEach(() => cols.push("auto"));

    if (!isEmptyArray(itemActionsList)) {
      // 1 normal column for spread action buttons
      cols.push("auto");
      // 1 sticky column for sticky menu trigger
      cols.push("56px");
    }

    return cols.join(" ");
  }, [
    canBatchSelect,
    batchActions,
    headersList,
    itemActionsList,
    withNumbering,
  ]);

  return (
    <DataViewTableContext.Provider value={contextValue}>
      <VStack
        className={"table-container"}
        ref={setTableContainerRef}
        overflow={"auto"}
        // flex={1}
        w={"full"}
        maxH={"full"}
        roundedTop={theme.radii.container}
        bg={"bg.body"}
        {...restProps}
      >
        <Grid
          role={"table"}
          gridTemplateColumns={gridCols}
          w={headersList.length > 1 ? "full" : "fit"}
        >
          {children}
        </Grid>
      </VStack>

      {!isEmptyArray(batchActions) && (
        <DataViewBatchActionBar
          selectedItemIds={selectedItemIds}
          selectedItems={selectedItems}
          clearSelectedItems={clearSelectedItems}
          batchActions={batchActions}
        />
      )}
    </DataViewTableContext.Provider>
  );
};

const DataListTableRoot = DataListTableRootInternal as <
  T = Record<string, unknown>,
  N extends number = number,
>(
  props: DataViewTableRootProps<T, N> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.ReactElement;

const DataListTableHeader = (props: DataViewTableHeaderProps) => {
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
  } = useDataViewTableContext();

  return (
    <Box
      role={"row"}
      display={"grid"}
      gridTemplateColumns={"subgrid"}
      gridColumn={"1 / -1"}
      overflow={"clip"}
      h={"56px"}
      pos={"sticky"}
      top={0}
      left={0}
      zIndex={10}
      bg={"bg.body"}
      borderBottom={"1px solid"}
      borderColor={"border.subtle"}
      {...props}
    >
      {canBatchSelect && (
        <DataListTableCell pos={"sticky"} left={0} zIndex={11}>
          <DataViewBatchActionsTrigger
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
          </DataViewBatchActionsTrigger>
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
          <P fontSize={"sm"} fontWeight={"medium"} color={"fg.subtle"}>
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
        <>
          {/* Normal column header for spread action buttons */}
          <DataListTableCell justify={"center"}>
            <P fontWeight={"semibold"} color={"fg.subtle"}>
              {t["action.actions"]()}
            </P>
          </DataListTableCell>
          {/* Sticky column header for sticky menu */}
          <DataListTableCell pos={"sticky"} top={0} right={0} zIndex={11} />
        </>
      )}
    </Box>
  );
};

const DataListTableRow = memo(
  ({
    item,
    index,
    isItemSelected,
    canBatchSelect,
    withNumbering,
    itemActions = [],
    toggleItemSelection,
    measureRef,
    dataIndex,
    styleProps,
  }: DataViewTableRowProps) => {
    // Contexts & Stores
    const { page, pageSize, renderTdCell } = useDataViewTableContext();
    const { theme } = useThemeStore();

    const cellBg = isItemSelected
      ? tintAlpha(`${theme.colorPalette}.subtle`, 40)
      : "bg.body";

    return (
      <Box
        ref={measureRef}
        data-index={dataIndex}
        role={"row"}
        display={"grid"}
        gridTemplateColumns={"subgrid"}
        gridColumn={"1 / -1"}
        overflow={"clip"}
        minH={"56px"}
        bg={"bg.body"}
        borderBottom={"1px solid"}
        borderColor={"bg.canvas"}
        transition={"background-color 0.1s ease"}
        _hover={{
          bg: isItemSelected
            ? tintAlpha(`${theme.colorPalette}.subtle`, 50)
            : "bg.subtle",
        }}
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
            <Center w={"full"} h={"full"} px={"10px"} bg={cellBg}>
              <Checkbox
                size={"sm"}
                checked={isItemSelected}
                variant={"subtle"}
              />
            </Center>
          </Center>
        )}

        {withNumbering && (
          <DataListTableCell bg={cellBg}>
            <P>
              {page && pageSize ? index + 1 + (page - 1) * pageSize : index + 1}
            </P>
          </DataListTableCell>
        )}

        {/* Main columns */}
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
            bg={cellBg}
            {...col?.bodyCellProps}
          >
            {renderTdCell
              ? renderTdCell(col, item, colIndex)
              : (col.td ?? <P>{String(col.value ?? "-")}</P>)}
          </HStack>
        ))}

        {!isEmptyArray(itemActions) && (
          <>
            {/* Normal column cell for spread action buttons */}
            <HStack
              justify={"center"}
              align={"center"}
              px={4}
              py={2}
              bg={cellBg}
              gap={1}
            >
              <DataViewSpreadActions item={item} itemActions={itemActions} />
            </HStack>

            {/* Sticky column cell for sticky menu trigger */}
            <Center pos={"sticky"} right={0} zIndex={2} bg={"bg.body"}>
              <Center
                w={"full"}
                h={"full"}
                px={"10px"}
                bg={cellBg}
                onClick={(e) => e.stopPropagation()}
              >
                <DataListItemActionsTrigger
                  itemActions={itemActions}
                  item={item}
                >
                  <IconButton variant={"ghost"}>
                    <AppIcon icon={EllipsisIcon} />
                  </IconButton>
                </DataListItemActionsTrigger>
              </Center>
            </Center>
          </>
        )}
      </Box>
    );
  },
);

const DataListTableBody = () => {
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
  } = useDataViewTableContext();

  const rowHeight = useMemo(() => parseInt("56px", 10), []);
  const rowGap = useMemo(() => 0, []);

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

// -------------------------------------------------------------------------------------

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
}: DataViewTableSortIconProps) => {
  // Stores
  const { theme } = useThemeStore();

  // Derived Values
  const primaryFg = `${theme.colorPalette}.fg`;
  const isAscActive = active && direction === "asc";
  const isDescActive = active && direction === "desc";

  return (
    <VStack align={"center"} gap={0}>
      <AppIcon
        icon={ChevronUpIcon}
        boxSize={"12px"}
        strokeWidth={2.5}
        color={isAscActive ? primaryFg : "an3"}
        mb={"-6px"}
      />
      <AppIcon
        icon={ChevronDownIcon}
        boxSize={"12px"}
        strokeWidth={2.5}
        color={isDescActive ? primaryFg : "an3"}
      />
    </VStack>
  );
};

// -------------------------------------------------------------------------------------

const DataViewTableInternal = {
  Root: DataListTableRoot,
  Header: DataListTableHeader,
  Body: DataListTableBody,
};

export const DataView = {
  Table: DataViewTableInternal,
};
