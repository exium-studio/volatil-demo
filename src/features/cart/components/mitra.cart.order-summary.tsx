// src/features/cart/components/mitra.cart.order-summary.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AtrLogo } from "@/design-system/components/branding/ui/atr-logo";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Box } from "@/design-system/components/layout/ui/box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING_MD, SPACING_MD, SPACING_SM } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import {
  MINIMUM_BIDANG_COUNT,
  MINIMUM_KAWASAN_HA,
  PRICE_PER_BIDANG,
  PRICE_PER_KAWASAN_HA,
} from "@/features/cart/constants/cart.config";
import type { CartItem, CartSummary } from "@/features/cart/types/cart.type";
import { formatCurrency, formatDecimal } from "@/shared/utils/formatter/number.formatter";
import { isEmptyArray } from "@/shared/utils/data/array";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useMemo } from "react";

export type MitraCartOrderSummaryProps = StackProps & {
  summary: CartSummary;
  selectedItems: CartItem[];
  onCheckout?: () => void;
  isCheckoutPending?: boolean;
};

export const MitraCartOrderSummary = (props: MitraCartOrderSummaryProps) => {
  // Props
  const {
    summary,
    selectedItems = [],
    onCheckout,
    isCheckoutPending = false,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived — Selected totals
  const selectedBidangCount = useMemo(
    () =>
      selectedItems
        .filter((item) => item.basis === "bidang")
        .reduce((sum, item) => sum + item.quota, 0),
    [selectedItems],
  );

  const selectedKawasanHa = useMemo(
    () =>
      selectedItems
        .filter((item) => item.basis === "kawasan")
        .reduce((sum, item) => sum + item.quota, 0),
    [selectedItems],
  );

  const isBidangMinimumNotMet =
    selectedBidangCount > 0 && selectedBidangCount < MINIMUM_BIDANG_COUNT;
  const isKawasanMinimumNotMet =
    selectedKawasanHa > 0 && selectedKawasanHa < MINIMUM_KAWASAN_HA;
  const isMinimumNotMet = isBidangMinimumNotMet || isKawasanMinimumNotMet;

  const isCheckoutDisabled =
    isEmptyArray(selectedItems) || isMinimumNotMet || isCheckoutPending;

  return (
    <VStack
      w={"full"}
      maxW={{ base: "full", md: "380px" }}
      bg={"bg.body"}
      p={PADDING_MD}
      rounded={theme.radii.container}
      shadow={"sm"}
      gap={SPACING_MD}
      align={"stretch"}
      {...restProps}
    >
      {/* Branding Header */}
      <HStack gap={3} align={"center"}>
        <AtrLogo boxSize={10} />
        <VStack gap={0} align={"start"}>
          <P fontWeight={"semibold"} fontSize={"md"}>
            {"Kementerian ATR/BPN"}
          </P>
          <P fontSize={"xs"} color={"blue.fg"}>
            {"Melayani, Profesional, Terpercaya"}
          </P>
        </VStack>
      </HStack>

      <Separator borderColor={"bg.canvas"} />

      {/* Ringkasan Title */}
      <P fontWeight={"semibold"} fontSize={"md"}>
        {"Ringkasan"}
      </P>

      {/* Warning Alert & Progress - Bidang */}
      {selectedBidangCount > 0 && (
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
              <P fontSize={"xs"} fontWeight={"medium"}>
                {"Jumlah bidang belum memenuhi batas minimum pembelian"}
              </P>
            </HStack>
          )}

          <Box w={"full"} bg={"bg.canvas"} rounded={"full"} h={"8px"} overflow={"hidden"}>
            <Box
              h={"full"}
              bg={isBidangMinimumNotMet ? "orange.fg" : "blue.fg"}
              w={`${Math.min(100, (selectedBidangCount / MINIMUM_BIDANG_COUNT) * 100)}%`}
              transition={"width 0.3s ease"}
            />
          </Box>

          <HStack justify={"space-between"} fontSize={"xs"}>
            <P color={"fg.subtle"}>{"Bidang Terpilih:"}</P>
            <P fontWeight={"medium"}>
              <strong style={{ fontWeight: 600 }}>
                {formatDecimal(selectedBidangCount)} Bidang
              </strong>{" "}
              {"dari "}
              {formatDecimal(MINIMUM_BIDANG_COUNT)} Bidang Minimal Pembelian
            </P>
          </HStack>
        </VStack>
      )}

      {/* Warning Alert & Progress - Kawasan */}
      {selectedKawasanHa > 0 && (
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
              <P fontSize={"xs"} fontWeight={"medium"}>
                {"Jumlah kawasan (ha) belum memenuhi batas minimum pembelian"}
              </P>
            </HStack>
          )}

          <Box w={"full"} bg={"bg.canvas"} rounded={"full"} h={"8px"} overflow={"hidden"}>
            <Box
              h={"full"}
              bg={isKawasanMinimumNotMet ? "orange.fg" : "orange.fg"}
              w={`${Math.min(100, (selectedKawasanHa / MINIMUM_KAWASAN_HA) * 100)}%`}
              transition={"width 0.3s ease"}
            />
          </Box>

          <HStack justify={"space-between"} fontSize={"xs"}>
            <P color={"fg.subtle"}>{"Kawasan Terpilih:"}</P>
            <P fontWeight={"medium"}>
              <strong style={{ fontWeight: 600 }}>
                {formatDecimal(selectedKawasanHa)} ha
              </strong>{" "}
              {"dari "}
              {formatDecimal(MINIMUM_KAWASAN_HA)} ha Minimal Pembelian
            </P>
          </HStack>
        </VStack>
      )}

      {/* Total Pesanan Section */}
      {!isEmptyArray(selectedItems) && (
        <VStack gap={2} p={3} bg={"bg.canvas"} rounded={"md"} align={"stretch"}>
          <HStack justify={"space-between"}>
            <P fontSize={"sm"} fontWeight={"semibold"}>
              {"Total Pesanan"}
            </P>
            <Badge colorPalette={"neutral"} variant={"subtle"}>
              {selectedItems.length} {"Data"}
            </Badge>
          </HStack>

          <Separator borderColor={"border.subtle"} my={1} />

          <VStack gap={2} align={"stretch"} maxH={"160px"} overflowY={"auto"}>
            {selectedItems.map((item) => {
              const itemPrice =
                item.basis === "bidang"
                  ? item.quota * PRICE_PER_BIDANG
                  : item.quota * PRICE_PER_KAWASAN_HA;

              return (
                <HStack key={item.id} justify={"space-between"} fontSize={"xs"}>
                  <HStack gap={2}>
                    <P fontWeight={"medium"}>{item.name}</P>
                    <P color={"fg.subtle"}>
                      • {formatDecimal(item.quota)} {item.basis}
                    </P>
                  </HStack>
                  <P fontWeight={"semibold"}>{formatCurrency(itemPrice)}</P>
                </HStack>
              );
            })}
          </VStack>
        </VStack>
      )}

      <Separator borderColor={"bg.canvas"} />

      {/* Ringkasan Details Section */}
      <VStack gap={2} align={"stretch"} fontSize={"sm"}>
        <P fontWeight={"semibold"}>{"Ringkasan"}</P>

        <HStack justify={"space-between"}>
          <P color={"fg.subtle"}>{"Total Bidang"}</P>
          <P fontWeight={"medium"}>
            {formatDecimal(summary.totalBidang)} {"bidang"}
          </P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.subtle"}>{"Total Kawasan"}</P>
          <P fontWeight={"medium"}>
            {formatDecimal(summary.totalKawasanHa)} {"ha"}
          </P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.subtle"}>{"Total Harga"}</P>
          <P fontWeight={"medium"}>{formatCurrency(summary.subtotal)}</P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.subtle"}>{"Biaya Layanan"}</P>
          <P fontWeight={"medium"}>{formatCurrency(summary.serviceFee)}</P>
        </HStack>

        {summary.tax > 0 && (
          <HStack justify={"space-between"}>
            <P color={"fg.subtle"}>{"Pajak"}</P>
            <P fontWeight={"medium"}>{formatCurrency(summary.tax)}</P>
          </HStack>
        )}

        <Separator borderColor={"border.subtle"} my={1} />

        <HStack justify={"space-between"} fontSize={"md"}>
          <P fontWeight={"bold"}>{"Sub Total"}</P>
          <P fontWeight={"bold"} color={"fg.default"}>
            {formatCurrency(summary.grandTotal)}
          </P>
        </HStack>
      </VStack>

      {/* Beli Sekarang Button */}
      <Button
        primary
        w={"full"}
        size={"lg"}
        disabled={isCheckoutDisabled}
        loading={isCheckoutPending}
        onClick={onCheckout}
      >
        {"Beli Sekarang"}
      </Button>
    </VStack>
  );
};
