// src/features/cart/components/mitra.cart.table.tsx

import { Button, IconButton } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { DataListBatchActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING_MD, PADDING_SM, SPACING_MD, SPACING_SM } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type { CartItem } from "@/features/cart/types/cart.type";
import { formatDecimal } from "@/shared/utils/formatter/number.formatter";
import { t } from "@/shared/libs/i18n";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { SlidersHorizontalIcon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";

const MAX_VISIBLE_THEMES = 2;
const BASIS_BIDANG_COLOR = "blue" as const;
const BASIS_KAWASAN_COLOR = "orange" as const;

export type MitraCartTableProps = StackProps & {
  cartItems: CartItem[];
  selectedItems?: FormattedListItem<CartItem>[];
  onSelectedItemChange?: (payload: { selectedItems: FormattedListItem[] }) => void;
  onClearCart?: () => void;
  onRemoveItems?: (itemIds: string[]) => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
};

export const MitraCartTable = (props: MitraCartTableProps) => {
  // Props
  const {
    cartItems = [],
    selectedItems,
    onSelectedItemChange,
    onClearCart,
    onRemoveItems,
    searchValue = "",
    onSearchChange,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Values — Table Configuration
  const { headers, items } = useMemo(() => {
    return {
      headers: [
        { th: "Nama Data IGT-PR", sortable: true },
        { th: "Jenis Tema IGT-PR" },
        { th: "Basis Kuota", sortable: true },
        { th: "Kategori Tema IGT-PR", headerCellProps: { minW: "200px" } },
      ],
      items: cartItems.map((item: CartItem) => {
        const visibleThemes = item.themes.slice(0, MAX_VISIBLE_THEMES);
        const remainingCount = item.themes.length - MAX_VISIBLE_THEMES;

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.name,
              td: <P fontSize={"sm"} fontWeight={"medium"}>{item.name}</P>,
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
                  {`IGT Berbasis ${item.basis === "bidang" ? "Bidang" : "Kawasan"}`}
                </Badge>
              ),
              align: "start" as const,
            },
            {
              value: item.quota,
              td: (
                <HStack gap={1} align={"baseline"}>
                  <P fontSize={"sm"} fontWeight={"semibold"}>
                    {formatDecimal(item.quota)}
                  </P>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {item.basis === "bidang" ? "bidang" : "ha"}
                  </P>
                </HStack>
              ),
              align: "start" as const,
            },
            {
              value: item.themes.map((t) => t.name).join(", "),
              td: (
                <VStack align={"start"} gap={1}>
                  {visibleThemes.map((themeItem) => (
                    <P key={themeItem.name} fontSize={"xs"} color={"fg.subtle"}>
                      {themeItem.name}
                    </P>
                  ))}
                  {remainingCount > 0 && (
                    <P fontSize={"xs"} color={"fg.muted"}>
                      +{remainingCount} lainnya
                    </P>
                  )}
                </VStack>
              ),
              align: "start" as const,
            },
          ],
        };
      }),
    };
  }, [cartItems]);

  // Derived Values — Batch Actions
  const batchActions: DataListBatchActionsGenerator[] = useMemo(
    () => [
      ({ selectedItemIds, clearSelectedItems }) => (
        <Button
          key={"remove-selected"}
          variant={"outline"}
          colorPalette={"red"}
          size={"xs"}
          onClick={() => {
            onRemoveItems?.(selectedItemIds);
            clearSelectedItems();
          }}
        >
          <AppIcon icon={Trash2Icon} />
          {"Hapus Terpilih"} ({selectedItemIds.length})
        </Button>
      ),
    ],
    [onRemoveItems],
  );

  return (
    <VStack flex={1} overflowY={"auto"} bg={"bg.body"} rounded={theme.radii.container} shadow={"sm"} {...restProps}>
      {/* Header Actions */}
      <VStack wrap={"wrap"} justify={"space-between"} gap={SPACING_MD} p={PADDING_MD} w={"full"}>
        <HStack wrap={"wrap"} align={"center"} justify={"space-between"} gap={SPACING_SM} w={"full"}>
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

          <HStack gap={SPACING_SM} align={"center"}>
            <Button
              variant={"outline"}
              colorPalette={"red"}
              onClick={onClearCart}
            >
              <AppIcon icon={IconTrash} />
              {"Hapus Semua Data"}
            </Button>
          </HStack>
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      {/* Table Component */}
      <VStack flex={1} gap={PADDING_SM} overflowY={"auto"} bg={"bg.canvas"} w={"full"}>
        <DataListTable.Root
          headers={headers}
          items={items}
          withNumbering={false}
          canBatchSelect={true}
          batchActions={batchActions}
          selectedItems={selectedItems}
          onSelectedItemChange={onSelectedItemChange}
          rounded={0}
          shadow={"none"}
        >
          <DataListTable.Header />
          <DataListTable.Body />
        </DataListTable.Root>
      </VStack>
    </VStack>
  );
};
