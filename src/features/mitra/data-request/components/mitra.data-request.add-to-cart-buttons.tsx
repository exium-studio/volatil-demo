// src/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { MitraDataRequestAddToCartButtonsProps } from "@/features/mitra/data-request/types/mitra.data-request.cart.type";
import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import {
  calculateIntersectAreaInHectares,
  extractAoiPolygonsFromCql,
} from "@/features/mitra/data-request/utils/calculate-feature-area";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import {
  ChevronDownIcon,
  Layers2Icon,
  ShoppingCartIcon,
  Grid2X2Icon,
} from "lucide-react";
import { useMemo } from "react";

export const MitraDataRequestAddToCartButtons = (
  props: MitraDataRequestAddToCartButtonsProps,
) => {
  // Props
  const {
    spatialBasis,
    cqlFilter,
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

  const aoiPolygon = useMemo(
    () => extractAoiPolygonsFromCql(cqlFilter),
    [cqlFilter],
  );

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

  // Derived — calculate total 'luas' in hectares (ha) using geometry or fallback to attribute
  const selectedKawasanLuasTotal = useMemo(() => {
    if (spatialBasis !== "kawasan") return 0;
    return (selectedItems ?? []).reduce((acc, item) => {
      const data = item.data as
        | GeoJSON.Feature
        | Record<string, unknown>
        | undefined;
      // Try calculating directly from geometry with intersection clipping
      if (data && "geometry" in data && data.geometry) {
        const geomAreaHa = calculateIntersectAreaInHectares(
          data as GeoJSON.Feature,
          aoiPolygon,
        );
        if (geomAreaHa > 0) return acc + geomAreaHa;
      }
      const props = (
        data && "properties" in data ? data.properties : (data ?? {})
      ) as Record<string, unknown>;
      const key = Object.keys(props).find(
        (k) => k.toLowerCase() === "luas" || k.toLowerCase() === "luastertul",
      );
      const val = key ? Number(props[key]) : NaN;
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [selectedItems, spatialBasis, aoiPolygon]);

  // Derived — calculate total 'luas' in hectares (ha) for all items
  const allKawasanLuasTotal = useMemo<number>(() => {
    if (spatialBasis !== "kawasan") return 0;
    return (allItems ?? []).reduce<number>((acc, item) => {
      const data = item as
        | GeoJSON.Feature
        | Record<string, unknown>
        | undefined;
      // Try calculating directly from geometry with intersection clipping
      if (data && "geometry" in data && data.geometry) {
        const geomAreaHa = calculateIntersectAreaInHectares(
          data as GeoJSON.Feature,
          aoiPolygon,
        );
        if (geomAreaHa > 0) return acc + geomAreaHa;
      }
      const props = (
        data && "properties" in data ? data.properties : (data ?? {})
      ) as Record<string, unknown>;
      const key = Object.keys(props).find(
        (k) => k.toLowerCase() === "luas" || k.toLowerCase() === "luastertul",
      );
      const val = key ? Number(props[key]) : NaN;
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [allItems, spatialBasis, aoiPolygon]);

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

  // Selected label: if kawasan with luas, show ha, otherwise count or ? ha kawasan
  const selectedCountLabel = useMemo(() => {
    if (selectedTotalCount === 0) return "";

    if (spatialBasis === "kawasan") {
      if (selectedKawasanLuasTotal > 0) {
        return `(${formatNumber(selectedKawasanLuasTotal, { maximumFractionDigits: 2 })} ha)`;
      }
      return `(? ha kawasan)`;
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

    return `(${formatNumber(selectedTotalCount)} bidang)`;
  }, [
    selectedTotalCount,
    spatialBasis,
    selectedKawasanLuasTotal,
    selectedBidangCount,
    selectedKawasanCount,
  ]);

  // All label: if kawasan with luas, show ha, otherwise ? ha kawasan
  const allCountLabel = useMemo(() => {
    if (spatialBasis === "kawasan") {
      if (allKawasanLuasTotal > 0) {
        return `(${formatNumber(allKawasanLuasTotal, { maximumFractionDigits: 2 })} ha)`;
      }
      return `(? ha kawasan)`;
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
      gap={"md"}
      p={"md"}
      rounded={theme.radii.container}
      bg={"bg.body"}
      {...restProps}
    >
      <HStack
        wrap={"wrap"}
        align={"center"}
        justify={"space-between"}
        gap={"sm"}
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
                <AppIcon icon={Grid2X2Icon} />
                {"Tambah semua kawasan"}{" "}
                {allKawasanLuasTotal > 0
                  ? `(${formatNumber(allKawasanLuasTotal, { maximumFractionDigits: 2 })} ha)`
                  : `(? ha kawasan)`}
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </ButtonGroup>
      </HStack>
    </VStack>
  );
};
