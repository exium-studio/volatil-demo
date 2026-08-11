// src/features/cart/components/mitra.cart.data-list.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { DataListBatchActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { useContainerContext } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import type {
  CartItem,
  MitraCartTableProps,
} from "@/features/cart/types/cart.type";
import {
  useCartItemsQuery,
  useClearCart,
  useRemoveFromCart,
} from "@/features/cart/hooks/use-mitra-cart";
import { t } from "@/shared/libs/i18n";
import { SlidersHorizontalIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { IconShoppingCartOff } from "@tabler/icons-react";

const MAX_VISIBLE_THEMES = 2;
const BASIS_BIDANG_COLOR = "blue" as const;
const BASIS_KAWASAN_COLOR = "orange" as const;

export const MitraCartDataList = (props: MitraCartTableProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { isSmContainer } = useContainerContext();

  // States
  const [dataListState, setDataListState] = useState({
    search: "",
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
  });
  const [selectedItems, setSelectedItems] = useState<
    FormattedListItem<CartItem>[]
  >([]);

  // Hooks (Queries & Mutations)
  const { cartItemsData, isLoading, isFetching } = useCartItemsQuery({
    ...dataListState,
    search: dataListState.search || undefined,
  });
  const clearCartMutation = useClearCart(() => setSelectedItems([]));
  const removeItemsMutation = useRemoveFromCart(() => setSelectedItems([]));

  // Derived Values
  const cartItems = cartItemsData.items;

  // Handlers
  const updateDataListState = (
    nextState: Partial<typeof dataListState>,
    resetPage = false,
  ) => {
    setDataListState((prev) => ({
      ...prev,
      ...nextState,
      page: resetPage ? 1 : (nextState.page ?? prev.page),
    }));
    setSelectedItems([]);
  };

  // Derived Values
  const dataList = useMemo(
    () => ({
      headers: [
        { th: "ID Bidang", sortable: true },
        { th: "Tema IGT-PR" },
        { th: "Basis IGT-PR", sortable: true },
        { th: "Deskripsi", headerCellProps: { minW: "200px" } },
      ],

      items: cartItems.map((item: CartItem) => {
        const visibleThemes = item.themes.slice(0, MAX_VISIBLE_THEMES);
        const remainingCount = item.themes.length - MAX_VISIBLE_THEMES;

        return {
          id: String(item.id),
          data: item,
          columns: [
            {
              value: item.id,
              td: (
                <P fontSize={"sm"} fontWeight={"medium"}>
                  {item.name || item.id}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.themes.map((th) => th.name).join(", "),
              td: (
                <HStack wrap={"wrap"} gap={1}>
                  {visibleThemes.map((themeItem) => (
                    <Badge
                      key={themeItem.name}
                      colorPalette={"neutral"}
                      variant={"subtle"}
                    >
                      {themeItem.name}
                    </Badge>
                  ))}
                  {remainingCount > 0 && (
                    <Badge colorPalette={"neutral"} variant={"outline"}>
                      +{remainingCount} lainnya
                    </Badge>
                  )}
                </HStack>
              ),
              align: "start" as const,
            },
            {
              value: item.basis,
              td: (
                <Badge
                  colorPalette={
                    item.basis === "bidang"
                      ? BASIS_BIDANG_COLOR
                      : BASIS_KAWASAN_COLOR
                  }
                  variant={"subtle"}
                >
                  {item.basis}
                </Badge>
              ),
              align: "center" as const,
            },
            {
              value: item.description ?? "",
              td: (
                <P
                  fontSize={"sm"}
                  color={"fg.subtle"}
                  maxW={"280px"}
                  whiteSpace={"wrap"}
                >
                  {item.description ?? "-"}
                </P>
              ),
              align: "start" as const,
            },
          ],
        };
      }),

      batchActions: [
        ({ selectedItemIds, clearSelectedItems }) => (
          <Button
            key={"remove-selected"}
            colorPalette={"red"}
            onClick={() => {
              removeItemsMutation.mutate(selectedItemIds);
              clearSelectedItems();
            }}
          >
            <AppIcon icon={Trash2Icon} />
            {"Hapus"}
          </Button>
        ),
      ] as DataListBatchActionsGenerator[],
    }),
    [cartItems, removeItemsMutation],
  );

  return (
    <VStack
      flex={1}
      overflowY={"auto"}
      borderRight={isSmContainer ? "none" : "1px solid"}
      borderTop={isSmContainer ? "1px solid" : "none"}
      borderColor={"bg.canvas"}
      {...restProps}
    >
      {/* Header Actions */}
      <VStack
        wrap={"wrap"}
        justify={"space-between"}
        gap={SPACING_MD}
        p={PADDING_MD}
        w={"full"}
      >
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={SPACING_SM}
          w={"full"}
        >
          <HStack gap={SPACING_SM}>
            <SearchInput
              value={dataListState.search}
              onChange={(e) =>
                updateDataListState({ search: e.target.value }, true)
              }
              placeholder={t["action.search"]()}
            />

            <IconButton variant={"outline"}>
              <AppIcon icon={SlidersHorizontalIcon} />
            </IconButton>
          </HStack>

          <HStack gap={SPACING_SM}>
            <Tooltip content={"Kosongkan keranjang"}>
              <Box display={"inline-flex"}>
                <ConfirmationTrigger
                  icon={IconShoppingCartOff}
                  title={"Kosongkan Keranjang"}
                  description={
                    "Apakah Anda yakin ingin mengosongkan seluruh item di keranjang?"
                  }
                  confirmLabel={"Kosongkan"}
                  onConfirm={() => clearCartMutation.mutate()}
                  modalKey={"clearCartConfirmationModal"}
                >
                  <IconButton
                    aria-label={"Kosongkan keranjang"}
                    colorPalette={"red"}
                  >
                    <AppIcon icon={Trash2Icon} />
                  </IconButton>
                </ConfirmationTrigger>
              </Box>
            </Tooltip>
          </HStack>
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      {/* Table Component */}
      <VStack
        flex={1}
        gap={PADDING_SM}
        overflowY={"auto"}
        bg={"bg.canvas"}
        w={"full"}
        position={"relative"}
      >
        {isLoading ? (
          <Skeleton p={PADDING_MD} />
        ) : (
          <Box w={"full"} position={"relative"} overflowY={"auto"}>
            <DataListTable.Root
              headers={dataList.headers}
              items={dataList.items}
              batchActions={dataList.batchActions}
              withNumbering={false}
              canBatchSelect={true}
              selectedItems={selectedItems}
              onSelectedItemChange={({ selectedItems: nextSelectedItems }) =>
                setSelectedItems(
                  nextSelectedItems as FormattedListItem<CartItem>[],
                )
              }
              page={dataListState.page}
              pageSize={dataListState.pageSize}
              rounded={0}
              pb={0}
              shadow={"none"}
            >
              <DataListTable.Header />
              <DataListTable.Body />
            </DataListTable.Root>

            <TopBarLoader isFetching={isFetching} />

            <DataListFooter
              page={dataListState.page}
              pageSize={dataListState.pageSize}
              setPage={(page) => updateDataListState({ page })}
              setPageSize={(pageSize) =>
                updateDataListState({ pageSize }, true)
              }
              currentDataLength={cartItems.length}
              totalData={cartItemsData.meta.total}
              totalPage={cartItemsData.meta.totalPages}
              roundedBottom={0}
              shadow={"none"}
            />
          </Box>
        )}
      </VStack>
    </VStack>
  );
};
