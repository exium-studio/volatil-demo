import { AtrLogo } from "@/design-system/components/branding/ui/atr-logo";
import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P, PSerif } from "@/design-system/components/typography/ui/p";
import { PADDING_MD, SPACING_MD } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type { MitraCartOrderSummaryProps } from "@/features/cart/types/cart.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatCurrency,
  formatDecimal,
} from "@/shared/utils/formatter/number.formatter";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useMemo } from "react";

export const MitraCartOrderSummary = (props: MitraCartOrderSummaryProps) => {
  // Props
  const {
    summary,
    config,
    selectedItems = [],
    onCheckout,
    isCheckoutPending = false,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived — Selected totals
  const selectedBidangCount = useMemo(
    () => selectedItems.filter((item) => item.basis === "bidang").length,
    [selectedItems],
  );

  const selectedKawasanHa = useMemo(
    () =>
      selectedItems
        .filter((item) => item.basis === "kawasan")
        .reduce((sum, item) => sum + (item.areaInHa ?? 1), 0),
    [selectedItems],
  );

  const selectedSubtotal = useMemo(
    () =>
      selectedItems.reduce((sum, item) => {
        const price =
          item.basis === "bidang"
            ? config.pricePerBidang
            : (item.areaInHa ?? 1) * config.pricePerKawasanHa;
        return sum + price;
      }, 0),
    [selectedItems, config.pricePerBidang, config.pricePerKawasanHa],
  );

  const selectedServiceFee = useMemo(
    () => Math.round(selectedSubtotal * (config.serviceFeeRate ?? 0.1)),
    [selectedSubtotal, config.serviceFeeRate],
  );

  const selectedTax = useMemo(
    () =>
      Math.round(
        (selectedSubtotal + selectedServiceFee) * (config.taxRate ?? 0.11),
      ),
    [selectedSubtotal, selectedServiceFee, config.taxRate],
  );

  const selectedGrandTotal = useMemo(
    () => selectedSubtotal + selectedServiceFee + selectedTax,
    [selectedSubtotal, selectedServiceFee, selectedTax],
  );

  const hasSelectedItems = !isEmptyArray(selectedItems);

  const isBidangMinimumNotMet = selectedBidangCount < config.minimumBidangCount;
  const isKawasanMinimumNotMet = selectedKawasanHa < config.minimumKawasanHa;
  const isMinimumNotMet = isBidangMinimumNotMet || isKawasanMinimumNotMet;

  const isCheckoutDisabled =
    !hasSelectedItems || isMinimumNotMet || isCheckoutPending;

  const displayTotalBidang = hasSelectedItems
    ? selectedBidangCount
    : summary.totalBidang;
  const displayTotalKawasanHa = hasSelectedItems
    ? selectedKawasanHa
    : summary.totalKawasanHa;
  const displaySubtotal = hasSelectedItems
    ? selectedSubtotal
    : summary.subtotal;
  const displayServiceFee = hasSelectedItems
    ? selectedServiceFee
    : summary.serviceFee;
  const displayTax = hasSelectedItems ? selectedTax : summary.tax;
  const displayGrandTotal = hasSelectedItems
    ? selectedGrandTotal
    : summary.grandTotal;

  return (
    <VStack
      gap={SPACING_MD}
      p={PADDING_MD}
      rounded={theme.radii.container}
      bg={"bg.body"}
      {...restProps}
    >
      {/* Warning Alert & Progress - Bidang */}
      <VStack gap={2} align={"stretch"}>
        {isBidangMinimumNotMet && (
          <HStack
            p={3}
            bg={"orange.subtle"}
            color={"orange.fg"}
            rounded={"md"}
            gap={2}
            align={"start"}
          >
            <AppIcon icon={IconAlertTriangle} boxSize={5} mt={"2px"} />
            <P fontSize={"sm"} fontWeight={"medium"}>
              {"Jumlah bidang belum memenuhi batas minimum pembelian"}
            </P>
          </HStack>
        )}

        <Box
          w={"full"}
          bg={"bg.canvas"}
          rounded={"full"}
          h={"8px"}
          overflow={"hidden"}
        >
          <Box
            h={"full"}
            bg={"blue.fg"}
            w={`${Math.min(100, (selectedBidangCount / config.minimumBidangCount) * 100)}%`}
            transition={"width 0.3s ease"}
          />
        </Box>

        <HStack justify={"space-between"} fontSize={"sm"}>
          <P color={"fg.subtle"}>{"Bidang"}</P>
          <P fontWeight={"medium"}>
            <strong style={{ fontWeight: 600 }}>
              {formatDecimal(selectedBidangCount)}
            </strong>
            {` / ${formatDecimal(config.minimumBidangCount)} Bidang`}
          </P>
        </HStack>
      </VStack>

      {/* Warning Alert & Progress - Kawasan */}
      <VStack gap={2} align={"stretch"}>
        {isKawasanMinimumNotMet && (
          <HStack
            p={3}
            bg={"orange.subtle"}
            color={"orange.fg"}
            rounded={"md"}
            gap={2}
            align={"start"}
          >
            <AppIcon icon={IconAlertTriangle} boxSize={5} mt={"2px"} />
            <P fontSize={"sm"} fontWeight={"medium"}>
              {"Jumlah kawasan (ha) belum memenuhi batas minimum pembelian"}
            </P>
          </HStack>
        )}

        <Box
          w={"full"}
          bg={"bg.canvas"}
          rounded={"full"}
          h={"8px"}
          overflow={"hidden"}
        >
          <Box
            h={"full"}
            bg={isKawasanMinimumNotMet ? "orange.fg" : "orange.fg"}
            w={`${Math.min(100, (selectedKawasanHa / config.minimumKawasanHa) * 100)}%`}
            transition={"width 0.3s ease"}
          />
        </Box>

        <HStack justify={"space-between"} fontSize={"sm"}>
          <P color={"fg.subtle"}>{"Kawasan"}</P>

          <P fontWeight={"medium"}>
            <strong style={{ fontWeight: 600 }}>
              {formatDecimal(selectedKawasanHa)}
            </strong>
            {` / ${formatDecimal(config.minimumKawasanHa)} ha`}
          </P>
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      {/* Ringkasan Details Section */}
      <VStack gap={2} align={"stretch"} fontSize={"sm"}>
        <HStack justify={"space-between"}>
          <P color={"fg.subtle"}>{"Total Bidang"}</P>
          <P fontWeight={"medium"}>
            {formatDecimal(displayTotalBidang)} {"bidang"}
          </P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.subtle"}>{"Total Kawasan"}</P>
          <P fontWeight={"medium"}>
            {formatDecimal(displayTotalKawasanHa)} {"ha"}
          </P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.subtle"}>{"Total Harga"}</P>
          <P fontWeight={"medium"}>{formatCurrency(displaySubtotal)}</P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.subtle"}>{"Biaya Layanan"}</P>
          <P fontWeight={"medium"}>{formatCurrency(displayServiceFee)}</P>
        </HStack>

        {displayTax > 0 && (
          <HStack justify={"space-between"}>
            <P color={"fg.subtle"}>{"Pajak"}</P>
            <P fontWeight={"medium"}>{formatCurrency(displayTax)}</P>
          </HStack>
        )}

        <Separator borderColor={"border.subtle"} my={1} />

        <HStack justify={"space-between"} fontSize={"md"}>
          <P fontWeight={"bold"}>{"Sub Total"}</P>
          <P fontWeight={"bold"} color={"fg.default"}>
            {formatCurrency(displayGrandTotal)}
          </P>
        </HStack>
      </VStack>

      {/* Beli Sekarang Button */}
      <Button
        primary
        w={"full"}
        disabled={isCheckoutDisabled}
        loading={isCheckoutPending}
        onClick={onCheckout}
        mt={4}
      >
        {"Bayar sekarang"}
      </Button>
    </VStack>
  );
};
