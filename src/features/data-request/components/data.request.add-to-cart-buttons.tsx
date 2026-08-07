// src/features/data-request/components/data.request.add-to-cart-buttons.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import {
  PADDING_MD,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type { IgtDataItem } from "@/features/data-request/types/igt-by-aoi.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import { IconChevronDown, IconShoppingCartPlus } from "@tabler/icons-react";
import { CheckCheckIcon, FlagIcon, LayersIcon } from "lucide-react";
import { useMemo } from "react";

export type DataRequestAddToCartButtonsProps = StackProps & {
  selectedItems?: FormattedListItem[];
  /** All IGT items in the current result set (for basis breakdown counts). */
  allItems?: IgtDataItem[];
  onAddAllBidangClick?: () => void;
  onAddAllKawasanClick?: () => void;
  onAddAllClick?: () => void;
  onAddSelectedClick?: () => void;
};

export const DataRequestAddToCartButtons = (
  props: DataRequestAddToCartButtonsProps,
) => {
  // Props
  const {
    onAddAllBidangClick,
    onAddAllKawasanClick,
    onAddAllClick,
    onAddSelectedClick,
    selectedItems,
    allItems = [],
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived — basis breakdown from all result items
  const bidangCount = useMemo(
    () => allItems.filter((item) => item.basis === "bidang").length,
    [allItems],
  );
  const kawasanCount = useMemo(
    () => allItems.filter((item) => item.basis === "kawasan").length,
    [allItems],
  );
  const totalCount = allItems.length;

  // Derived — selected items basis breakdown (cast data to IgtDataItem for basis field)
  const selectedBidangCount = useMemo(
    () =>
      (selectedItems ?? []).filter(
        (item) => (item.data as unknown as IgtDataItem).basis === "bidang",
      ).length,
    [selectedItems],
  );
  const selectedKawasanCount = useMemo(
    () =>
      (selectedItems ?? []).filter(
        (item) => (item.data as unknown as IgtDataItem).basis === "kawasan",
      ).length,
    [selectedItems],
  );

  return (
    <VStack
      gap={SPACING_MD}
      p={PADDING_MD}
      rounded={theme.radii.container}
      bg={"bg.body"}
    >
      <HStack
        wrap={"wrap"}
        align={"center"}
        justify={"space-between"}
        gap={SPACING_SM}
        {...restProps}
      >
        {/* Add all — menu with 3 options by basis */}
        <Menu.Root
          positioning={{
            placement: "top",
          }}
        >
          <Menu.Trigger>
            <Button primary variant={"outline"} flex={"1 1 350px"}>
              <AppIcon icon={IconShoppingCartPlus} />
              Tambah semua ({totalCount})
              <AppIcon icon={IconChevronDown} />
            </Button>
          </Menu.Trigger>

          <Menu.Content>
            <Menu.Item value={"add-all-bidang"} onClick={onAddAllBidangClick}>
              <AppIcon icon={LayersIcon} />
              Tambah semua bidang ({bidangCount})
            </Menu.Item>

            <Menu.Item value={"add-all-kawasan"} onClick={onAddAllKawasanClick}>
              <AppIcon icon={FlagIcon} />
              Tambah semua kawasan ({kawasanCount})
            </Menu.Item>

            <Menu.Item value={"add-all"} onClick={onAddAllClick}>
              <AppIcon icon={CheckCheckIcon} />
              Tambah semua bidang dan kawasan ({totalCount})
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>

        {/* Add selected */}
        <Button
          primary
          flex={"1 1 350px"}
          disabled={isEmptyArray(selectedItems)}
          onClick={onAddSelectedClick}
        >
          <AppIcon icon={IconShoppingCartPlus} />
          Tambah yang dipilih{" "}
          {!isEmptyArray(selectedItems) && (
            <>
              ({selectedBidangCount > 0 && `${selectedBidangCount} bidang`}
              {selectedBidangCount > 0 && selectedKawasanCount > 0 && ", "}
              {selectedKawasanCount > 0 && `${selectedKawasanCount} kawasan`})
            </>
          )}
        </Button>
      </HStack>
    </VStack>
  );
};
