// src/features/mitra/cart/components/mitra.cart.order-summary.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Progress } from "@/design-system/components/feedback/ui/progress";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useCheckoutCart } from "@/features/mitra/cart/hooks/use-mitra-cart";
import type { MitraCartOrderSummaryProps } from "@/features/mitra/cart/types/cart.type";
import {
  formatCurrency,
  formatDecimal,
} from "@/shared/utils/formatter/number.formatter";
import { TriangleAlertIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

export const MitraCartOrderSummary = (props: MitraCartOrderSummaryProps) => {
  // Props
  const { summary, config, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const navigate = useNavigate();
  const checkoutMutation = useCheckoutCart();

  // Handlers
  const handleCheckout = () => {
    checkoutMutation.mutate(undefined, {
      onSuccess: ({ billingCode }) => {
        navigate({
          to: "/mitra/billing/$billingCode",
          params: { billingCode },
        });
      },
    });
  };

  // Derived Values
  const totalBidang = summary.totalBidang ?? 0;
  const totalKawasanHa = summary.totalKawasanHa ?? 0;
  const hasCartItems = totalBidang > 0 || totalKawasanHa > 0;

  const isBidangMinimumNotMet = totalBidang < config.minimumBidangCount;
  const isKawasanMinimumNotMet = totalKawasanHa < config.minimumKawasanHa;
  const isMinimumNotMet =
    !hasCartItems || isBidangMinimumNotMet || isKawasanMinimumNotMet;

  const isCheckoutDisabled = isMinimumNotMet || checkoutMutation.isPending;

  // Derived — Warning Message
  const warningMessage = useMemo(() => {
    if (!hasCartItems) {
      return "Keranjang belanja Anda masih kosong";
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
  }, [hasCartItems, isBidangMinimumNotMet, isKawasanMinimumNotMet]);

  return (
    <VStack
      gap={SPACING.md}
      p={PADDING.md}
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
          <AppIcon icon={TriangleAlertIcon} />

          <Alert.Title>{warningMessage}</Alert.Title>
        </Alert.Root>
      )}

      {/* Progress - Bidang */}
      <VStack gap={2} align={"stretch"} mt={2}>
        <Progress.Root
          value={Math.min(100, (totalBidang / config.minimumBidangCount) * 100)}
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
              <TNum>{formatDecimal(totalBidang)}</TNum>
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
            (totalKawasanHa / config.minimumKawasanHa) * 100,
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
              <TNum>{formatDecimal(totalKawasanHa)}</TNum>
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
            <TNum>{formatDecimal(totalBidang)}</TNum> {"bidang"}
          </P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.muted"}>{"Total Kawasan"}</P>
          <P fontWeight={"medium"}>
            <TNum>{formatDecimal(totalKawasanHa)}</TNum> {"ha"}
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
            <TNum>{formatCurrency(summary.grandTotal)}</TNum>
          </P>
        </HStack>

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
            <TNum>{formatCurrency(summary.grandTotal)}</TNum>
          </P>
        </HStack>
      </VStack>

      {/* Beli Sekarang Button */}
      <Button
        primary={true}
        w={"full"}
        disabled={isCheckoutDisabled}
        loading={checkoutMutation.isPending}
        onClick={handleCheckout}
        mt={2}
      >
        {"Bayar sekarang"}
      </Button>
    </VStack>
  );
};
