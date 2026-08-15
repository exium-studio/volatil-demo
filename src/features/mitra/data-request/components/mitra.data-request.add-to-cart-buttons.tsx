// src/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { MitraDataRequestAddToCartButtonsProps } from "@/features/mitra/data-request/types/mitra.data-request.cart.type";
import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import {
  ChevronDownIcon,
  LandPlotIcon,
  Layers2Icon,
  ShoppingCartIcon,
} from "lucide-react";
import { useMemo } from "react";

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
    () =>
      (allItems as MitraDataRequestIgtDataItem[]).filter(
        (item) => item?.basis === "bidang",
      ).length,
    [allItems],
  );
  const calculatedKawasan = useMemo(
    () =>
      (allItems as MitraDataRequestIgtDataItem[]).filter(
        (item) => item?.basis === "kawasan",
      ).length,
    [allItems],
  );

  const bidangCount = totalBidangCountProp ?? calculatedBidang;
  const kawasanCount = totalKawasanCountProp ?? calculatedKawasan;

  // Derived — selected items basis breakdown
  const selectedBidangCount = useMemo(
    () =>
      (selectedItems ?? []).filter((item) => {
        const data = item.data as Record<string, unknown> | undefined;
        // Check IgtDataItem basis or GeoJSON feature properties
        const basis =
          data?.basis ??
          (data?.properties as Record<string, unknown> | undefined)?.basis;
        return basis === "bidang";
      }).length,
    [selectedItems],
  );

  const selectedKawasanCount = useMemo(
    () =>
      (selectedItems ?? []).filter((item) => {
        const data = item.data as Record<string, unknown> | undefined;
        const basis =
          data?.basis ??
          (data?.properties as Record<string, unknown> | undefined)?.basis;
        return basis === "kawasan";
      }).length,
    [selectedItems],
  );

  const selectedTotalCount = selectedItems?.length ?? 0;

  // Selected label: if basis counts exist show "X bidang, Y kawasan", otherwise show "X item" or "X bidang"
  const selectedCountLabel = useMemo(() => {
    if (selectedTotalCount === 0) return "";

    if (selectedBidangCount > 0 || selectedKawasanCount > 0) {
      const parts = [
        selectedBidangCount > 0 &&
          `${formatNumber(selectedBidangCount)} bidang`,
        selectedKawasanCount > 0 &&
          `${formatNumber(selectedKawasanCount)} kawasan`,
      ].filter(Boolean);
      return `(${parts.join(", ")})`;
    }

    // Default: for WFS features without explicit basis property, treat as bidang or count
    return `(${formatNumber(selectedTotalCount)} bidang)`;
  }, [selectedTotalCount, selectedBidangCount, selectedKawasanCount]);

  return (
    <VStack
      gap={SPACING.md}
      p={PADDING.md}
      rounded={theme.radii.container}
      bg={"bg.body"}
      {...restProps}
    >
      <HStack
        wrap={"wrap"}
        align={"center"}
        justify={"space-between"}
        gap={SPACING.sm}
        w={"full"}
      >
        {/* Add selected */}
        <Button
          primary
          variant={"outline"}
          flex={"1 1 300px"}
          w={"full"}
          maxW={"full"}
          minW={0}
          disabled={isEmptyArray(selectedItems)}
          onClick={onAddSelectedClick}
        >
          <AppIcon icon={ShoppingCartIcon} flexShrink={0} />
          {"Tambah yang dipilih"}{" "}
          {!isEmptyArray(selectedItems) && selectedCountLabel}
        </Button>

        {/* Add all — ButtonGroup with main button on left and menu trigger on right */}
        <ButtonGroup
          variant={"outline"}
          attached
          flex={"1 1 300px"}
          w={"full"}
          maxW={"full"}
          minW={0}
        >
          <Button
            primary
            flex={1}
            minW={0}
            disabled={bidangCount + kawasanCount === 0}
            onClick={onAddAllBothClick}
          >
            <AppIcon icon={ShoppingCartIcon} flexShrink={0} />
            {"Tambah semua"} ({formatNumber(bidangCount)} bidang,{" "}
            {formatNumber(kawasanCount)} kawasan)
          </Button>

          <Menu.Root
            positioning={{
              placement: "top-end",
            }}
          >
            <Menu.Trigger>
              <IconButton
                primary
                aria-label={"Pilih opsi tambah semua"}
                roundedLeft={0}
                flexShrink={0}
                disabled={bidangCount + kawasanCount === 0}
              >
                <AppIcon icon={ChevronDownIcon} />
              </IconButton>
            </Menu.Trigger>

            <Menu.Content>
              <Menu.Item
                value={"add-all-bidang"}
                disabled={bidangCount === 0}
                onClick={onAddAllBidangClick}
              >
                <AppIcon icon={Layers2Icon} />
                {"Tambah semua bidang"} ({formatNumber(bidangCount)})
              </Menu.Item>

              <Menu.Item
                value={"add-all-kawasan"}
                disabled={kawasanCount === 0}
                onClick={onAddAllKawasanClick}
              >
                <AppIcon icon={LandPlotIcon} />
                {"Tambah semua kawasan"} ({formatNumber(kawasanCount)})
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </ButtonGroup>
      </HStack>
    </VStack>
  );
};
