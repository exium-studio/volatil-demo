import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useCheckoutCartOrder } from "@/features/mitra/cart/hooks/use-mitra-cart";
import type { ActiveCartOrder } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  CreditCardIcon,
  HourglassIcon,
  InfoIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useMemo } from "react";

export type MitraCartOrderSummaryProps = {
  activeOrder: ActiveCartOrder | null;
  isLoading?: boolean;
};

export const MitraCartBatchOrderSummary = (
  props: MitraCartOrderSummaryProps & { activeBatch?: ActiveCartOrder | null },
) => {
  // Props
  const { activeOrder: rawActiveOrder, activeBatch, isLoading = false } = props;
  const activeOrder = rawActiveOrder ?? activeBatch ?? null;

  // Stores
  const { theme } = useThemeStore();

  // Navigation
  const navigate = useNavigate();

  // Mutations
  const checkoutMutation = useCheckoutCartOrder();

  // Derived Values
  const isSelected = Boolean(activeOrder);
  const isPendingPayment = activeOrder?.status === "pending_payment";
  const isPayable = isPendingPayment;
  const isReady = activeOrder?.status === "ready";
  const isProcessing = activeOrder?.status === "processing";
  const isPendingReview = activeOrder?.status === "pending_review";
  const isRejected = activeOrder?.status === "rejected";
  const isPaid = activeOrder?.status === "paid";
  const hasItems = (activeOrder?.items.length ?? 0) > 0;

  const totalBidang = useMemo(() => {
    if (!activeOrder?.items) return 0;
    return activeOrder.items
      .filter((i) => i.spatialBasis === "bidang")
      .reduce((sum, item) => sum + item.featuresCount, 0);
  }, [activeOrder]);

  const totalKawasanHa = useMemo(() => {
    if (!activeOrder?.items) return 0;
    return activeOrder.items
      .filter((i) => i.spatialBasis === "kawasan")
      .reduce((sum, item) => sum + (item.areaHa ?? 0), 0);
  }, [activeOrder]);

  const handleCheckout = () => {
    if (!activeOrder?.orderId || !isPayable) return;

    checkoutMutation.mutate(
      {
        orderId: activeOrder.orderId,
      },
      {
        onSuccess: (data) => {
          if (data?.billingCode) {
            void navigate({
              to: "/mitra/billing/$billingCode",
              params: { billingCode: data.billingCode },
              search: { orderId: data.orderId },
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
      {/* Order Metadata Header */}
      <VStack align={"start"} gap={1}>
        <HStack justify={"space-between"} w={"full"}>
          <P fontSize={"xs"} color={"fg.subtle"}>
            {"ID Pesanan"}
          </P>
          {isSelected ? (
            <Badge
              colorPalette={
                isPendingPayment
                  ? "orange"
                  : isReady
                    ? "green"
                    : isPendingReview
                      ? "orange"
                      : isPaid
                        ? "blue"
                        : isProcessing
                          ? "purple"
                          : isRejected
                            ? "red"
                            : "gray"
              }
              variant={"subtle"}
            >
              {isPendingPayment
                ? "Menunggu Pembayaran"
                : isReady
                  ? "Siap Digunakan"
                  : isPendingReview
                    ? "Menunggu Validasi"
                    : isPaid
                      ? "Terbayar"
                      : isProcessing
                        ? "Sedang Diproses"
                        : isRejected
                          ? "Ditolak"
                          : "Draft"}
            </Badge>
          ) : (
            <Badge colorPalette={"gray"} variant={"subtle"}>
              {"Belum Dipilih"}
            </Badge>
          )}
        </HStack>
        <P fontSize={"sm"} fontWeight={"semibold"}>
          {activeOrder?.orderId ?? "-"}
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
          <P color={"fg.muted"}>{"Metode Pengajuan"}</P>
          {isSelected && activeOrder?.selectionType ? (
            <SelectionTypeBadge size={"xs"}>
              {activeOrder.selectionType}
            </SelectionTypeBadge>
          ) : (
            <P fontWeight={"medium"}>{"-"}</P>
          )}
        </HStack>

        <HStack justify={"space-between"}>
          <P color={"fg.muted"}>{"Total Layer IGT"}</P>
          <P fontWeight={"medium"}>
            {isSelected ? `${activeOrder?.items.length ?? 0} layer` : "-"}
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
          color={isPayable ? "blue.fg" : undefined}
        >
          <P fontSize={"md"} fontWeight={"semibold"}>
            {"Total Tagihan"}
          </P>
          {isSelected ? (
            <P fontSize={"lg"} fontWeight={"semibold"}>
              <FormatNumber
                value={activeOrder?.totalPrice ?? 0}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            </P>
          ) : (
            <P fontSize={"lg"} fontWeight={"semibold"}>
              {"-"}
            </P>
          )}
        </HStack>
      </VStack>

      {/* Notice States */}
      {!isSelected && (
        <Alert.Root status={"neutral"} colorPalette={"gray"} variant={"subtle"}>
          <AppIcon icon={InfoIcon} />
          <Alert.Title>
            {
              "Silakan pilih salah satu pesanan pada daftar keranjang untuk menampilkan rincian dan melakukan pembayaran."
            }
          </Alert.Title>
        </Alert.Root>
      )}

      {isSelected && isPayable && (
        <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
          <AppIcon icon={InfoIcon} />
          <Alert.Title>
            {
              "Totalan tagihan telah dikalkulasi. Klik 'Bayar Sekarang' untuk menerbitkan kode billing dan menyelesaikan pembayaran."
            }
          </Alert.Title>
        </Alert.Root>
      )}

      {isSelected && isProcessing && (
        <Alert.Root status={"info"} colorPalette={"purple"} variant={"subtle"}>
          <AppIcon icon={InfoIcon} />
          <Alert.Title>
            {"Layanan WMS sedang dipersiapkan oleh sistem."}
          </Alert.Title>
        </Alert.Root>
      )}

      {isSelected && isPendingReview && (
        <Alert.Root
          status={"warning"}
          colorPalette={"orange"}
          variant={"subtle"}
        >
          <AppIcon icon={HourglassIcon} />
          <Alert.Title>
            {
              "Permohonan data sedang dalam proses validasi oleh admin internal."
            }
          </Alert.Title>
        </Alert.Root>
      )}

      {isSelected && isRejected && (
        <Alert.Root status={"error"} colorPalette={"red"} variant={"subtle"}>
          <AppIcon icon={AlertCircleIcon} />
          <Alert.Title>
            {`Pesanan ditolak oleh Admin Internal: ${activeOrder?.rejectionReason || "Tidak memenuhi syarat."}`}
          </Alert.Title>
        </Alert.Root>
      )}

      {isSelected && isReady && (
        <Alert.Root
          status={"success"}
          colorPalette={"green"}
          variant={"subtle"}
        >
          <AppIcon icon={InfoIcon} />
          <Alert.Title>
            {
              "Pesanan permohonan telah siap digunakan. Layanan data spasial dapat diakses melalui menu Data Saya."
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
          !isPayable ||
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
          ? "Pilih Pesanan Terlebih Dahulu"
          : isReady
            ? "Pesanan Siap Digunakan"
            : isProcessing
              ? "Menyiapkan Layanan..."
              : isPendingReview
                ? "Menunggu Validasi Admin"
                : isRejected
                  ? "Pesanan Ditolak"
                  : isPaid
                    ? "Pesanan Sudah Dibayar"
                    : "Bayar Sekarang"}
      </Button>

      <HStack align={"center"} justify={"center"} gap={1}>
        <AppIcon icon={ShieldCheckIcon} size={"xs"} color={"fg.subtle"} />

        <P fontSize={"xs"} color={"fg.subtle"}>
          {"Pembayaran Resmi PNBP ATR/BPN"}
        </P>
      </HStack>
    </VStack>
  );
};
