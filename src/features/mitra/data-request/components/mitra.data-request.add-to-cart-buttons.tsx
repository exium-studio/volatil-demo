// src/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import {
  PADDING_MD,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type { MitraDataRequestAddToCartButtonsProps } from "@/features/mitra/data-request/types/mitra.data-request.cart.type";
import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import { isEmptyArray } from "@/shared/utils/data/array";
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
        w={"full"}
      >
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
            variant={"outline"}
            flex={1}
            minW={0}
            disabled={bidangCount + kawasanCount === 0}
            onClick={onAddAllBothClick}
          >
            <AppIcon icon={ShoppingCartIcon} flexShrink={0} />
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
                {"Tambah semua bidang"} ({bidangCount})
              </Menu.Item>

              <Menu.Item
                value={"add-all-kawasan"}
                disabled={kawasanCount === 0}
                onClick={onAddAllKawasanClick}
              >
                <AppIcon icon={LandPlotIcon} />
                {"Tambah semua kawasan"} ({kawasanCount})
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </ButtonGroup>

        {/* Add selected */}
        <Button
          primary
          flex={"1 1 300px"}
          w={"full"}
          maxW={"full"}
          minW={0}
          disabled={isEmptyArray(selectedItems)}
          onClick={onAddSelectedClick}
        >
          <AppIcon icon={ShoppingCartIcon} flexShrink={0} />
          {"Tambah yang dipilih"}{" "}
          {!isEmptyArray(selectedItems) &&
            `(${[
              selectedBidangCount > 0 && `${selectedBidangCount} bidang`,
              selectedKawasanCount > 0 && `${selectedKawasanCount} kawasan`,
            ]
              .filter(Boolean)
              .join(", ")})`}
        </Button>
      </HStack>
    </VStack>
  );
};
