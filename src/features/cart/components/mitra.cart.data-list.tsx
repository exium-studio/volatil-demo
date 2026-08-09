// src/features/cart/components/mitra.cart.data-list.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type { DataListBatchActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { useContainerContext } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
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
import { t } from "@/shared/libs/i18n";
import { MapPinIcon, SlidersHorizontalIcon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";

const MAX_VISIBLE_THEMES = 2;
const BASIS_BIDANG_COLOR = "blue" as const;
const BASIS_KAWASAN_COLOR = "orange" as const;

export const MitraCartDataList = (props: MitraCartTableProps) => {
  // Props
  const {
    cartItems = [],
    selectedItems,
    onSelectedItemChange,
    onClearCart,
    onRemoveItems,
    onOpenBboxModal,
    searchValue = "",
    onSearchChange,
    isLoading = false,
    isFetching = false,
    ...restProps
  } = props;

  // Contexts
  const { isSmContainer } = useContainerContext();

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
              onRemoveItems?.(selectedItemIds);
              clearSelectedItems();
            }}
          >
            <AppIcon icon={Trash2Icon} />
            {"Hapus"}
          </Button>
        ),
      ] as DataListBatchActionsGenerator[],
    }),
    [cartItems, onRemoveItems],
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
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={t["action.search"]()}
            />

            <IconButton variant={"outline"}>
              <AppIcon icon={SlidersHorizontalIcon} />
            </IconButton>
          </HStack>

          <HStack gap={SPACING_SM}>
            <Button onClick={onOpenBboxModal}>
              <AppIcon icon={MapPinIcon} />
              {"Cek Lokasi Area"}
            </Button>

            <IconButton colorPalette={"red"} onClick={onClearCart}>
              <AppIcon icon={Trash2Icon} />
            </IconButton>
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
              onSelectedItemChange={onSelectedItemChange}
              rounded={0}
              shadow={"none"}
            >
              <DataListTable.Header />
              <DataListTable.Body />
            </DataListTable.Root>

            <TopBarLoader isFetching={isFetching} />
          </Box>
        )}
      </VStack>
    </VStack>
  );
};
