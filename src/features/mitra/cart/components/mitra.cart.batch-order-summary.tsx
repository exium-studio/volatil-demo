// src/features/mitra/cart/components/mitra.cart.batch-order-summary.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useCheckoutCartBatch } from "@/features/mitra/cart/hooks/use-mitra-cart";
import type {
  ActiveCartBatch,
  PaymentMethod,
} from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { useNavigate } from "@tanstack/react-router";
import { CreditCardIcon, InfoIcon, ShieldCheckIcon } from "lucide-react";
import { useMemo, useState } from "react";

const PAYMENT_METHOD_OPTIONS = [
  { label: "MPN Gen 2 (Penerimaan Negara Bukan Pajak)", value: "MPN_GEN2" },
  { label: "Virtual Account Mandiri", value: "VA_MANDIRI" },
  { label: "Virtual Account BRI", value: "VA_BRI" },
  { label: "Virtual Account BCA", value: "VA_BCA" },
  { label: "QRIS Dinamis", value: "QRIS" },
];

export type MitraCartBatchOrderSummaryProps = {
  activeBatch: ActiveCartBatch | null;
};

export const MitraCartBatchOrderSummary = (
  props: MitraCartBatchOrderSummaryProps,
) => {
  // Props
  const { activeBatch } = props;

  // Stores
  const { theme } = useThemeStore();

  // Navigation
  const navigate = useNavigate();

  // States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MPN_GEN2");

  // Mutations
  const checkoutMutation = useCheckoutCartBatch();

  // Derived Values
  const isReadyToPay = activeBatch?.status === "ready";
  const isPreparing = activeBatch?.status === "preparing";
  const isExpired = activeBatch?.status === "expired";
  const hasItems = (activeBatch?.items.length ?? 0) > 0;

  const totalBidang = useMemo(() => {
    if (!activeBatch?.items) return 0;
    return activeBatch.items
      .filter((i) => i.spatialBasis === "bidang")
      .reduce((sum, item) => sum + item.featuresCount, 0);
  }, [activeBatch]);

  const totalKawasanHa = useMemo(() => {
    if (!activeBatch?.items) return 0;
    return activeBatch.items
      .filter((i) => i.spatialBasis === "kawasan")
      .reduce((sum, item) => sum + (item.areaHa ?? 0), 0);
  }, [activeBatch]);

  const handleCheckout = () => {
    if (!activeBatch?.batchId || !isReadyToPay) return;

    checkoutMutation.mutate(
      {
        batchId: activeBatch.batchId,
        payload: { paymentMethod },
      },
      {
        onSuccess: () => {
          void navigate({
            to: "/mitra/transaction-history",
          });
        },
      },
    );
  };

  return (
    <VStack
      gap={SPACING.md}
      p={SPACING.md}
      rounded={theme.radii.container}
      bg={"bg.body"}
      align={"stretch"}
    >
      {/* Batch Metadata Header */}
      <VStack align={"start"} gap={1}>
        <HStack justify={"space-between"} w={"full"}>
          <P fontSize={"xs"} color={"fg.subtle"}>
            {"ID Batch Transaksi"}
          </P>
          <Badge
            colorPalette={
              isReadyToPay ? "green" : isPreparing ? "blue" : "gray"
            }
            variant={"subtle"}
          >
            {isReadyToPay
              ? "Siap Dibayar"
              : isPreparing
                ? "Menyiapkan Data"
                : isExpired
                  ? "Kadaluwarsa"
                  : "Draft"}
          </Badge>
        </HStack>
        <P fontSize={"sm"} fontWeight={"semibold"}>
          {activeBatch?.batchId ?? "-"}
        </P>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      {/* Payment Method Selector */}
      <VStack align={"start"} gap={1} w={"full"}>
        <P fontSize={"xs"} fontWeight={"medium"} color={"fg.muted"}>
          {"Metode Pembayaran"}
        </P>
        <FocusSelectInput
          modalKey={"cart-batch-payment-method-select"}
          placeholder={"Pilih Metode Pembayaran"}
          options={PAYMENT_METHOD_OPTIONS}
          value={paymentMethod}
          onValueChange={(val: string | null) => {
            if (val) setPaymentMethod(val as PaymentMethod);
          }}
          disabled={!isReadyToPay || checkoutMutation.isPending}
          w={"full"}
        />
      </VStack>

      <Separator
        variant={"dashed"}
        borderStyle={"dashed"}
        borderTopWidth={"2px"}
        borderColor={"border.emphasized"}
      />

      {/* Summary Breakdown */}
      <VStack gap={2} align={"stretch"} fontSize={"sm"}>
        <HStack justify={"space-between"}>
          <P color={"fg.muted"}>{"Total Layer IGT"}</P>
          <P fontWeight={"medium"}>
            {`${activeBatch?.items.length ?? 0} layer`}
          </P>
        </HStack>

        {totalBidang > 0 && (
          <HStack justify={"space-between"}>
            <P color={"fg.muted"}>{"Total Objek Bidang"}</P>
            <P fontWeight={"medium"}>
              <TNum>{totalBidang}</TNum> {"bidang"}
            </P>
          </HStack>
        )}

        {totalKawasanHa > 0 && (
          <HStack justify={"space-between"}>
            <P color={"fg.muted"}>{"Total Luas Kawasan"}</P>
            <P fontWeight={"medium"}>
              <TNum>{totalKawasanHa}</TNum> {"ha"}
            </P>
          </HStack>
        )}

        <Separator
          variant={"dashed"}
          borderStyle={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.emphasized"}
          my={1}
        />

        <HStack justify={"space-between"} color={"blue.fg"}>
          <P fontSize={"md"} fontWeight={"bold"}>
            {"Total Tagihan"}
          </P>
          <P fontSize={"lg"} fontWeight={"bold"}>
            <FormatNumber
              value={activeBatch?.totalPrice ?? 0}
              style={"currency"}
              currency={"IDR"}
              maximumFractionDigits={0}
            />
          </P>
        </HStack>
      </VStack>

      {/* Info notices */}
      {isPreparing && (
        <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
          <AppIcon icon={InfoIcon} />
          <Alert.Title fontSize={"xs"}>
            {"Tombol pembayaran akan aktif otomatis setelah Interop Engine selesai menyiapkan data."}
          </Alert.Title>
        </Alert.Root>
      )}

      {/* Action Button */}
      <Button
        primary={true}
        w={"full"}
        disabled={!isReadyToPay || !hasItems || checkoutMutation.isPending}
        loading={checkoutMutation.isPending}
        onClick={handleCheckout}
        mt={1}
      >
        <AppIcon icon={CreditCardIcon} />
        {isPreparing
          ? "Menunggu Interop..."
          : isExpired
            ? "Batch Kadaluwarsa"
            : "Checkout & Bayar"}
      </Button>

      <HStack justify={"center"} gap={1} pt={1}>
        <AppIcon icon={ShieldCheckIcon} size={"xs"} color={"fg.subtle"} />
        <P fontSize={"xs"} color={"fg.subtle"}>
          {"Pembayaran Resmi PNBP ATR/BPN"}
        </P>
      </HStack>
    </VStack>
  );
};
