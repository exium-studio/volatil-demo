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
  TreesIcon,
  Layers2Icon,
  ShoppingCartIcon,
} from "lucide-react";
import { useMemo } from "react";

export const MitraDataRequestAddToCartButtons = (
  props: MitraDataRequestAddToCartButtonsProps,
) => {
  // Props
  const {
    spatialBasis,
    onAddAllBidangClick,
    onAddAllKawasanClick,
    onAddAllBothClick,
    onAddSelectedClick,
    selectedItems,
    allItems = [],
    totalBidangCount: totalBidangCountProp,
    totalKawasanCount: totalKawasanCountProp,
    totalCount,
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
  const totalItemCount = totalCount ?? bidangCount + kawasanCount;

  // Derived — calculate total 'luas' attribute in Hektar (Ha) if spatialBasis is kawasan
  const selectedKawasanLuasTotal = useMemo(() => {
    if (spatialBasis !== "kawasan") return 0;
    return (selectedItems ?? []).reduce((acc, item) => {
      const data = item.data as Record<string, unknown> | undefined;
      const props = (data?.properties ?? data ?? {}) as Record<string, unknown>;
      const key = Object.keys(props).find((k) => k.toLowerCase() === "luas");
      const val = key ? Number(props[key]) : NaN;
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [selectedItems, spatialBasis]);

  // Derived — calculate total 'luas' attribute in Hektar (Ha) for all items if spatialBasis is kawasan
  const allKawasanLuasTotal = useMemo<number>(() => {
    if (spatialBasis !== "kawasan") return 0;
    return (allItems ?? []).reduce<number>((acc, item) => {
      const data = item as Record<string, unknown> | undefined;
      const props = (data?.properties ?? data ?? {}) as Record<string, unknown>;
      const key = Object.keys(props).find((k) => k.toLowerCase() === "luas");
      const val = key ? Number(props[key]) : NaN;
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [allItems, spatialBasis]);

  // Derived — selected items basis breakdown
  const selectedBidangCount = useMemo(
    () =>
      (selectedItems ?? []).filter((item) => {
        const data = item.data as Record<string, unknown> | undefined;
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

  // Selected label: if kawasan with luas, show Ha, otherwise count
  const selectedCountLabel = useMemo(() => {
    if (selectedTotalCount === 0) return "";

    if (spatialBasis === "kawasan" && selectedKawasanLuasTotal > 0) {
      return `(${formatNumber(selectedKawasanLuasTotal)} Ha)`;
    }

    if (selectedBidangCount > 0 || selectedKawasanCount > 0) {
      const parts = [
        selectedBidangCount > 0 &&
          `${formatNumber(selectedBidangCount)} bidang`,
        selectedKawasanCount > 0 &&
          `${formatNumber(selectedKawasanCount)} kawasan`,
      ].filter(Boolean);
      return `(${parts.join(", ")})`;
    }

    if (spatialBasis === "kawasan") {
      return `(${formatNumber(selectedTotalCount)} kawasan)`;
    }

    return `(${formatNumber(selectedTotalCount)} bidang)`;
  }, [
    selectedTotalCount,
    spatialBasis,
    selectedKawasanLuasTotal,
    selectedBidangCount,
    selectedKawasanCount,
  ]);

  // All label: if kawasan with luas, show Ha, otherwise count
  const allCountLabel = useMemo(() => {
    if (spatialBasis === "kawasan") {
      if (allKawasanLuasTotal > 0) {
        return `(${formatNumber(allKawasanLuasTotal)} Ha)`;
      }
      return `(${formatNumber(totalItemCount)} kawasan)`;
    }

    if (bidangCount > 0 || kawasanCount > 0) {
      return `(${formatNumber(bidangCount)} bidang, ${formatNumber(kawasanCount)} kawasan)`;
    }

    return `(${formatNumber(totalItemCount)} item)`;
  }, [
    spatialBasis,
    allKawasanLuasTotal,
    totalItemCount,
    bidangCount,
    kawasanCount,
  ]);

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
            disabled={totalItemCount === 0}
            onClick={onAddAllBothClick}
          >
            <AppIcon icon={ShoppingCartIcon} flexShrink={0} />
            {"Tambah semua"} {allCountLabel}
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
                disabled={totalItemCount === 0}
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
                <AppIcon icon={TreesIcon} />
                {"Tambah semua kawasan"}{" "}
                {allKawasanLuasTotal > 0
                  ? `(${formatNumber(allKawasanLuasTotal)} Ha)`
                  : `(${formatNumber(kawasanCount)})`}
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </ButtonGroup>
      </HStack>
    </VStack>
  );
};
