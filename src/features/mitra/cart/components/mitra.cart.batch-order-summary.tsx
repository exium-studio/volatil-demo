import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useCheckoutCartBatch } from "@/features/mitra/cart/hooks/use-mitra-cart";
import type { ActiveCartBatch } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { useNavigate } from "@tanstack/react-router";
import { CreditCardIcon, InfoIcon, ShieldCheckIcon } from "lucide-react";
import { useMemo } from "react";

export type MitraCartBatchOrderSummaryProps = {
  activeBatch: ActiveCartBatch | null;
  isLoading?: boolean;
};

export const MitraCartBatchOrderSummary = (
  props: MitraCartBatchOrderSummaryProps,
) => {
  // Props
  const { activeBatch, isLoading = false } = props;

  // Stores
  const { theme } = useThemeStore();

  // Navigation
  const navigate = useNavigate();

  // Mutations
  const checkoutMutation = useCheckoutCartBatch();

  // Derived Values
  const isSelected = Boolean(activeBatch);
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
      },
      {
        onSuccess: (data) => {
          if (data?.billingCode) {
            void navigate({
              to: "/mitra/billing/$billingCode",
              params: { billingCode: data.billingCode },
            });
          } else {
            void navigate({
              to: "/mitra/transaction-history",
            });
          }
        },
      },
    );
  };

  return (
    <VStack
      gap={"md"}
      p={"md"}
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
          {isSelected ? (
            <Badge
              colorPalette={
                isReadyToPay
                  ? "green"
                  : isPreparing
                    ? "blue"
                    : isExpired
                      ? "red"
                      : "gray"
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
          ) : (
            <Badge colorPalette={"gray"} variant={"subtle"}>
              {"Belum Dipilih"}
            </Badge>
          )}
        </HStack>
        <P fontSize={"sm"} fontWeight={"semibold"}>
          {activeBatch?.batchId ?? "-"}
        </P>
      </VStack>

      <Separator
        variant={"dashed"}
        borderStyle={"dashed"}
        borderTopWidth={"2px"}
        borderColor={"border.emphasized"}
        my={1}
      />

      {/* Summary Breakdown */}
      <VStack gap={2} align={"stretch"} fontSize={"sm"}>
        <HStack justify={"space-between"}>
          <P color={"fg.muted"}>{"Total Layer IGT"}</P>
          <P fontWeight={"medium"}>
            {isSelected ? `${activeBatch?.items.length ?? 0} layer` : "-"}
          </P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.muted"}>{"Total Objek Bidang"}</P>
          <P fontWeight={"medium"}>
            {isSelected ? (
              totalBidang > 0 ? (
                <>
                  <TNum>{totalBidang}</TNum> {"bidang"}
                </>
              ) : (
                "-"
              )
            ) : (
              "-"
            )}
          </P>
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.muted"}>{"Total Luas Kawasan"}</P>
          <P fontWeight={"medium"}>
            {isSelected ? (
              totalKawasanHa > 0 ? (
                <>
                  <TNum>{totalKawasanHa}</TNum> {"ha"}
                </>
              ) : (
                "-"
              )
            ) : (
              "-"
            )}
          </P>
        </HStack>

        <Separator
          variant={"dashed"}
          borderStyle={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.emphasized"}
          my={3}
        />

        <HStack
          justify={"space-between"}
          color={isReadyToPay ? "blue.fg" : undefined}
        >
          <P fontSize={"md"} fontWeight={"bold"}>
            {"Total Tagihan"}
          </P>
          <P fontSize={"lg"} fontWeight={"bold"}>
            {isSelected ? (
              isPreparing ? (
                <P color={"fg.subtle"} fontSize={"sm"} fontStyle={"italic"}>
                  {"Menunggu penyiapan data..."}
                </P>
              ) : (
                <FormatNumber
                  value={activeBatch?.totalPrice ?? 0}
                  style={"currency"}
                  currency={"IDR"}
                  maximumFractionDigits={0}
                />
              )
            ) : (
              "-"
            )}
          </P>
        </HStack>
      </VStack>

      {/* Notice States */}
      {!isSelected && (
        <Alert.Root status={"neutral"} colorPalette={"gray"} variant={"subtle"}>
          <AppIcon icon={InfoIcon} />
          <Alert.Title>
            {
              "Silakan pilih salah satu batch pesanan pada daftar keranjang untuk menampilkan rincian dan melakukan pembayaran."
            }
          </Alert.Title>
        </Alert.Root>
      )}

      {isSelected && isPreparing && (
        <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
          <AppIcon icon={InfoIcon} />
          <Alert.Title>
            {
              "Tombol pembayaran akan aktif otomatis setelah Interop Engine selesai menyiapkan data."
            }
          </Alert.Title>
        </Alert.Root>
      )}

      {/* Action Button */}
      <Button
        primary={true}
        w={"full"}
        disabled={
          !isSelected ||
          !isReadyToPay ||
          !hasItems ||
          checkoutMutation.isPending ||
          isLoading
        }
        loading={checkoutMutation.isPending}
        onClick={handleCheckout}
        mt={1}
      >
        <AppIcon icon={CreditCardIcon} />
        {!isSelected
          ? "Pilih Batch Terlebih Dahulu"
          : isPreparing
            ? "Menunggu Interop..."
            : isExpired
              ? "Batch Kadaluwarsa"
              : "Bayar Sekarang"}
      </Button>

      <HStack justify={"center"} gap={1}>
        <AppIcon icon={ShieldCheckIcon} size={"xs"} color={"fg.subtle"} />

        <P fontSize={"xs"} color={"fg.subtle"}>
          {"Pembayaran Resmi PNBP ATR/BPN"}
        </P>
      </HStack>
    </VStack>
  );
};
