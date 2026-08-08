// src/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
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
import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import { IconChevronDown, IconShoppingCartPlus } from "@tabler/icons-react";
import { FlagIcon, LayersIcon } from "lucide-react";
import { useMemo } from "react";

export type MitraDataRequestAddToCartButtonsProps = StackProps & {
  selectedItems?: FormattedListItem[];
  allItems?: MitraDataRequestIgtDataItem[];
  totalBidangCount?: number;
  totalKawasanCount?: number;
  totalCount?: number;
  onAddAllBidangClick?: () => void;
  onAddAllKawasanClick?: () => void;
  onAddAllBothClick?: () => void;
  onAddSelectedClick?: () => void;
};

export const MitraDataRequestAddToCartButtons = (
  props: MitraDataRequestAddToCartButtonsProps,
) => {
  // Props
  const {
    onAddAllBidangClick,
    onAddAllKawasanClick,
    onAddAllBothClick,
    onAddSelectedClick,
    selectedItems,
    allItems = [],
    totalBidangCount: totalBidangCountProp,
    totalKawasanCount: totalKawasanCountProp,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived — basis breakdown fallback from all result items
  const calculatedBidang = useMemo(
    () => allItems.filter((item) => item.basis === "bidang").length,
    [allItems],
  );
  const calculatedKawasan = useMemo(
    () => allItems.filter((item) => item.basis === "kawasan").length,
    [allItems],
  );

  const bidangCount = totalBidangCountProp ?? calculatedBidang;
  const kawasanCount = totalKawasanCountProp ?? calculatedKawasan;

  // Derived — selected items basis breakdown
  const selectedBidangCount = useMemo(
    () =>
      (selectedItems ?? []).filter(
        (item) =>
          (item.data as unknown as MitraDataRequestIgtDataItem).basis ===
          "bidang",
      ).length,
    [selectedItems],
  );
  const selectedKawasanCount = useMemo(
    () =>
      (selectedItems ?? []).filter(
        (item) =>
          (item.data as unknown as MitraDataRequestIgtDataItem).basis ===
          "kawasan",
      ).length,
    [selectedItems],
  );

  return (
    <VStack
      gap={SPACING_MD}
      p={PADDING_MD}
      rounded={theme.radii.container}
      bg={"bg.body"}
      {...restProps}
    >
      <HStack
        wrap={"wrap"}
        align={"center"}
        justify={"space-between"}
        gap={SPACING_SM}
      >
        {/* Add all — ButtonGroup with main button on left and menu trigger on right */}
        <ButtonGroup variant={"outline"} attached flex={"1 1 350px"}>
          <Button
            primary
            variant={"outline"}
            flex={1}
            onClick={onAddAllBothClick}
          >
            <AppIcon icon={IconShoppingCartPlus} />
            {"Tambah semua"} ({bidangCount} bidang, {kawasanCount} kawasan)
          </Button>

          <Menu.Root
            positioning={{
              placement: "top-end",
            }}
          >
            <Menu.Trigger>
              <IconButton
                primary
                variant={"outline"}
                aria-label={"Pilih opsi tambah semua"}
                roundedLeft={0}
              >
                <AppIcon icon={IconChevronDown} />
              </IconButton>
            </Menu.Trigger>

            <Menu.Content>
              <Menu.Item value={"add-all-bidang"} onClick={onAddAllBidangClick}>
                <AppIcon icon={LayersIcon} />
                {"Tambah semua bidang"} ({bidangCount})
              </Menu.Item>

              <Menu.Item
                value={"add-all-kawasan"}
                onClick={onAddAllKawasanClick}
              >
                <AppIcon icon={FlagIcon} />
                {"Tambah semua kawasan"} ({kawasanCount})
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </ButtonGroup>

        {/* Add selected */}
        <Button
          primary
          flex={"1 1 350px"}
          disabled={isEmptyArray(selectedItems)}
          onClick={onAddSelectedClick}
        >
          <AppIcon icon={IconShoppingCartPlus} />
          {"Tambah yang dipilih"}{" "}
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

export const DataRequestAddToCartButtons = MitraDataRequestAddToCartButtons;
