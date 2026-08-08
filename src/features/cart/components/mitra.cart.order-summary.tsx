import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Progress } from "@/design-system/components/feedback/ui/progress";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { PADDING_MD, SPACING_MD } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type { MitraCartOrderSummaryProps } from "@/features/cart/types/cart.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatCurrency,
  formatDecimal,
} from "@/shared/utils/formatter/number.formatter";
import { TriangleAlertIcon } from "lucide-react";
import { useMemo } from "react";

export const MitraCartOrderSummary = (props: MitraCartOrderSummaryProps) => {
  // Props
  const {
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

  const isBidangMinimumNotMet =
    selectedBidangCount > 0 && selectedBidangCount < config.minimumBidangCount;
  const isKawasanMinimumNotMet =
    selectedKawasanHa > 0 && selectedKawasanHa < config.minimumKawasanHa;
  const isMinimumNotMet =
    !hasSelectedItems || isBidangMinimumNotMet || isKawasanMinimumNotMet;

  const isCheckoutDisabled = isMinimumNotMet || isCheckoutPending;

  const displayTotalBidang = selectedBidangCount;
  const displayTotalKawasanHa = selectedKawasanHa;
  const displaySubtotal = selectedSubtotal;
  const displayServiceFee = selectedServiceFee;
  const displayTax = selectedTax;
  const displayGrandTotal = selectedGrandTotal;

  // Derived — Warning Message
  const warningMessage = useMemo(() => {
    if (!hasSelectedItems) {
      return "Pilih item di keranjang terlebih dahulu untuk konfirmasi pembelian";
    }
    if (isBidangMinimumNotMet && isKawasanMinimumNotMet) {
      return "Jumlah bidang dan kawasan (ha) belum memenuhi batas minimum pembelian";
    }
    if (isBidangMinimumNotMet) {
      return "Jumlah bidang belum memenuhi batas minimum pembelian";
    }
    if (isKawasanMinimumNotMet) {
      return "Jumlah kawasan (ha) belum memenuhi batas minimum pembelian";
    }
    return null;
  }, [hasSelectedItems, isBidangMinimumNotMet, isKawasanMinimumNotMet]);

  return (
    <VStack
      gap={SPACING_MD}
      p={PADDING_MD}
      rounded={theme.radii.container}
      bg={"bg.body"}
      {...restProps}
    >
      {/* Top Warning Alert */}
      {warningMessage && (
        <Alert.Root
          status={"warning"}
          colorPalette={"orange"}
          variant={"subtle"}
        >
          <AppIcon icon={TriangleAlertIcon} mt={1} />

          <Alert.Title>{warningMessage}</Alert.Title>
        </Alert.Root>
      )}

      {/* Progress - Bidang */}
      <VStack gap={2} align={"stretch"} mt={2}>
        <Progress.Root
          value={Math.min(
            100,
            (selectedBidangCount / config.minimumBidangCount) * 100,
          )}
          colorPalette={"blue"}
          size={"sm"}
        >
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>

        <HStack justify={"space-between"} fontSize={"sm"}>
          <P color={"fg.muted"}>{"Bidang"}</P>
          <P fontWeight={"medium"}>
            <strong style={{ fontWeight: 600 }}>
              <TNum>{formatDecimal(selectedBidangCount)}</TNum>
            </strong>
            {" / "}
            <TNum>{formatDecimal(config.minimumBidangCount)}</TNum>
            {" Bidang"}
          </P>
        </HStack>
      </VStack>

      {/* Progress - Kawasan */}
      <VStack gap={2} align={"stretch"}>
        <Progress.Root
          value={Math.min(
            100,
            (selectedKawasanHa / config.minimumKawasanHa) * 100,
          )}
          colorPalette={"orange"}
          size={"sm"}
        >
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>

        <HStack justify={"space-between"} fontSize={"sm"}>
          <P color={"fg.muted"}>{"Kawasan"}</P>

          <P fontWeight={"medium"}>
            <strong style={{ fontWeight: 600 }}>
              <TNum>{formatDecimal(selectedKawasanHa)}</TNum>
            </strong>
            {" / "}
            <TNum>{formatDecimal(config.minimumKawasanHa)}</TNum>
            {" ha"}
          </P>
        </HStack>
      </VStack>

      <Separator
        variant={"dashed"}
        borderStyle={"dashed"}
        borderTopWidth={"2px"}
        borderColor={"border.emphasized"}
        my={3}
      />

      {/* Ringkasan Details Section */}
      <VStack gap={2} align={"stretch"} fontSize={"sm"}>
        <HStack justify={"space-between"}>
          <P color={"fg.muted"}>{"Total Bidang"}</P>
          <P fontWeight={"medium"}>
            <TNum>{formatDecimal(displayTotalBidang)}</TNum> {"bidang"}
          </P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.muted"}>{"Total Kawasan"}</P>
          <P fontWeight={"medium"}>
            <TNum>{formatDecimal(displayTotalKawasanHa)}</TNum> {"ha"}
          </P>
        </HStack>

        <Separator
          variant={"dashed"}
          borderStyle={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.emphasized"}
          my={3}
        />

        <HStack justify={"space-between"}>
          <P color={"fg.muted"}>{"Total Harga"}</P>
          <P fontWeight={"medium"}>
            <TNum>{formatCurrency(displaySubtotal)}</TNum>
          </P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.muted"}>{"Biaya Layanan"}</P>
          <P fontWeight={"medium"}>
            <TNum>{formatCurrency(displayServiceFee)}</TNum>
          </P>
        </HStack>

        {displayTax > 0 && (
          <HStack justify={"space-between"}>
            <P color={"fg.muted"}>{"Pajak"}</P>
            <P fontWeight={"medium"}>
              <TNum>{formatCurrency(displayTax)}</TNum>
            </P>
          </HStack>
        )}

        <Separator
          variant={"dashed"}
          borderStyle={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.emphasized"}
          my={3}
        />

        <HStack justify={"space-between"} color={"blue.fg"}>
          <P fontSize={"lg"} fontWeight={"bold"}>
            {"Sub Total"}
          </P>
          <P fontSize={"lg"} fontWeight={"bold"}>
            <TNum>{formatCurrency(displayGrandTotal)}</TNum>
          </P>
        </HStack>
      </VStack>

      {/* Beli Sekarang Button */}
      <Button
        primary={true}
        w={"full"}
        disabled={isCheckoutDisabled}
        loading={isCheckoutPending}
        onClick={onCheckout}
        mt={2}
      >
        {"Bayar"}
      </Button>
    </VStack>
  );
};
