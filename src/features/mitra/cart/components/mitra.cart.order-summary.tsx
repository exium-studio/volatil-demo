// src\features\mitra\cart\components\mitra.cart.order-summary.tsx

// src\features\mitra\cart\components\mitra.cart.order-summary.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useCheckoutCartOrder } from "@/features/mitra/cart/hooks/use-mitra-cart";
import type { MitraCartOrderSummaryProps } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  CreditCardIcon,
  HourglassIcon,
  InfoIcon,
  LoaderIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useMemo } from "react";

export const MitraCartOrderSummary = (props: MitraCartOrderSummaryProps) => {
  // Props
  const {
    activeOrder,
    orderIndex,
    isLoading = false,
    isFetching = false,
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Navigation
  const navigate = useNavigate();

  // Mutations
  const checkoutMutation = useCheckoutCartOrder();

  // Derived Values
  const isSelected = Boolean(activeOrder);
  const isRequesting = activeOrder?.status === "requesting";
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
    if (!activeOrder) return 0;
    if (
      activeOrder.coverageHa !== undefined &&
      activeOrder.coverageHa !== null
    ) {
      return activeOrder.coverageHa;
    }
    return activeOrder.items
      .filter((i) => i.spatialBasis === "kawasan")
      .reduce((sum, item) => sum + (item.areaHa ?? 0), 0);
  }, [activeOrder]);

  const subtotalBidang = useMemo(() => {
    if (!activeOrder) return 0;
    if (activeOrder.subtotalBidangPrice != null) {
      return activeOrder.subtotalBidangPrice;
    }
    if (activeOrder.subtotalBidang != null) {
      return activeOrder.subtotalBidang;
    }
    if (!activeOrder.items) return 0;
    return activeOrder.items
      .filter((i) => i.spatialBasis === "bidang")
      .reduce((sum, item) => sum + (item.subtotalPrice ?? 0), 0);
  }, [activeOrder]);

  const subtotalKawasan = useMemo(() => {
    if (!activeOrder) return 0;
    if (activeOrder.subtotalKawasanPrice != null) {
      return activeOrder.subtotalKawasanPrice;
    }
    if (activeOrder.subtotalKawasan != null) {
      return activeOrder.subtotalKawasan;
    }
    if (!activeOrder.items) return 0;
    return activeOrder.items
      .filter((i) => i.spatialBasis === "kawasan")
      .reduce((sum, item) => sum + (item.subtotalPrice ?? 0), 0);
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

  // Render Skeleton feedback when loading / switching order
  if (isLoading) {
    return (
      <VStack
        gap={"md"}
        p={"md"}
        rounded={theme.radii.container}
        bg={"bg.body"}
        align={"stretch"}
      >
        {/* Header Skeleton */}
        <HStack justify={"space-between"} align={"center"}>
          <Skeleton h={"20px"} w={"100px"} />
          <Skeleton h={"20px"} w={"120px"} />
        </HStack>

        <Separator
          variant={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.subtle"}
          my={1}
        />

        {/* Breakdown Rows Skeletons */}
        <VStack gap={2} align={"stretch"}>
          <HStack justify={"space-between"}>
            <Skeleton h={"16px"} w={"120px"} />
            <Skeleton h={"16px"} w={"80px"} />
          </HStack>
          <HStack justify={"space-between"}>
            <Skeleton h={"16px"} w={"100px"} />
            <Skeleton h={"16px"} w={"60px"} />
          </HStack>
          <HStack justify={"space-between"}>
            <Skeleton h={"16px"} w={"130px"} />
            <Skeleton h={"16px"} w={"70px"} />
          </HStack>
          <HStack justify={"space-between"}>
            <Skeleton h={"16px"} w={"140px"} />
            <Skeleton h={"16px"} w={"70px"} />
          </HStack>
        </VStack>

        <Separator
          variant={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.subtle"}
          my={1}
        />

        {/* Layer List Skeleton */}
        <VStack align={"stretch"} gap={"xs"}>
          <Skeleton h={"16px"} w={"110px"} />
          <VStack
            border={"1px solid"}
            borderColor={"border.subtle"}
            rounded={theme.radii.component}
            p={"sm"}
            gap={"xs"}
            align={"stretch"}
          >
            <HStack justify={"space-between"}>
              <Skeleton h={"14px"} w={"160px"} />
              <Skeleton h={"14px"} w={"60px"} />
            </HStack>
            <HStack justify={"space-between"}>
              <Skeleton h={"14px"} w={"120px"} />
              <Skeleton h={"14px"} w={"50px"} />
            </HStack>
          </VStack>
        </VStack>

        <Separator
          variant={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.subtle"}
          my={1}
        />

        {/* Subtotal & Total Skeletons */}
        <VStack gap={1} align={"stretch"}>
          <Skeleton h={"14px"} w={"80px"} mb={"xs"} />
          <HStack justify={"space-between"}>
            <Skeleton h={"14px"} w={"100px"} />
            <Skeleton h={"14px"} w={"90px"} />
          </HStack>
          <HStack justify={"space-between"}>
            <Skeleton h={"14px"} w={"110px"} />
            <Skeleton h={"14px"} w={"90px"} />
          </HStack>
        </VStack>

        <Separator
          variant={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.subtle"}
          my={1}
        />

        {/* Total Tagihan */}
        <HStack justify={"space-between"} align={"center"}>
          <Skeleton h={"20px"} w={"100px"} />
          <Skeleton h={"24px"} w={"120px"} />
        </HStack>

        {/* Action Button Skeleton */}
        <Skeleton
          h={"40px"}
          w={"full"}
          rounded={theme.radii.component}
          mt={1}
        />
      </VStack>
    );
  }

  return (
    <VStack
      gap={"md"}
      p={"md"}
      rounded={theme.radii.container}
      bg={"bg.body"}
      align={"stretch"}
      opacity={isFetching ? 0.8 : 1}
      transition={"opacity 0.2s ease-in-out"}
    >
      {/* Order Metadata Header */}
      <VStack align={"stretch"} gap={"xs"}>
        <HStack
          wrap={"wrap"}
          justify={"space-between"}
          align={"center"}
          gap={"xs"}
          w={"full"}
        >
          <P fontSize={"sm"} fontWeight={"semibold"}>
            {isSelected
              ? orderIndex != null
                ? `Pesanan #${orderIndex}`
                : "Pesanan"
              : "Pesanan"}
          </P>

          {isSelected && activeOrder ? (
            <OrderStatusBadge showIcon={true}>
              {activeOrder.status}
            </OrderStatusBadge>
          ) : (
            <Badge colorPalette={"gray"} variant={"subtle"}>
              {"Belum Dipilih"}
            </Badge>
          )}
        </HStack>
      </VStack>

      <Separator
        variant={"dashed"}
        borderStyle={"dashed"}
        borderTopWidth={"2px"}
        borderColor={"border.subtle"}
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
          <P color={"fg.muted"}>{"IGT Berbasis Bidang"}</P>
          <P fontWeight={"medium"}>
            {isSelected ? (
              totalBidang > 0 ? (
                <>
                  <TNum>{formatNumber(totalBidang)}</TNum> {"bidang"}
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
          <P color={"fg.muted"}>{"IGT Berbasis Kawasan"}</P>
          <P fontWeight={"medium"}>
            {isSelected ? (
              totalKawasanHa > 0 ? (
                <>
                  <TNum>{formatNumber(totalKawasanHa)}</TNum> {"ha"}
                </>
              ) : (
                "-"
              )
            ) : (
              "-"
            )}
          </P>
        </HStack>
      </VStack>

      {/* Daftar Layer IGT */}
      {isSelected && activeOrder?.items && activeOrder.items.length > 0 && (
        <>
          <Separator
            variant={"dashed"}
            borderTopWidth={"2px"}
            borderColor={"border.subtle"}
            my={1}
          />

          <VStack align={"stretch"} gap={"xs"}>
            <P fontSize={"sm"} color={"fg.subtle"}>
              {"Daftar Layer IGT"}
            </P>

            <VStack
              align={"stretch"}
              border={"1px solid"}
              borderColor={"border.subtle"}
              rounded={theme.radii.component}
              overflowY={"auto"}
              maxH={"300px"}
            >
              {activeOrder.items.map((item, index) => {
                const isFirstIndex = index === 0;

                return (
                  <VStack
                    key={item.id || item.sourceLayerId || index}
                    align={"stretch"}
                    gap={"2xs"}
                    p={"sm"}
                    borderTop={isFirstIndex ? "none" : "1px solid"}
                    borderColor={"border.subtle"}
                    fontSize={"xs"}
                  >
                    <HStack
                      align={"center"}
                      justify={"space-between"}
                      gap={"2xs"}
                    >
                      <P fontWeight={"medium"} color={"fg.default"}>
                        {item.sourceLayerTitle || item.sourceLayerId}
                      </P>
                    </HStack>

                    <HStack justify={"space-between"} color={"fg.muted"}>
                      <IgtBasisBadge size={"xs"}>
                        {item.spatialBasis}
                      </IgtBasisBadge>

                      <P>
                        {item.spatialBasis === "bidang"
                          ? `${formatNumber(item.featuresCount)} bidang`
                          : `${formatNumber(item.areaHa ?? 0)} ha`}
                      </P>
                    </HStack>
                  </VStack>
                );
              })}
            </VStack>
          </VStack>
        </>
      )}

      {/* Subtotal & Total Tagihan */}
      <VStack align={"stretch"} gap={"xs"}>
        <Separator
          variant={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.subtle"}
          my={1}
        />

        <VStack gap={1} align={"stretch"} fontSize={"sm"}>
          <P fontSize={"sm"} color={"fg.subtle"} mb={"xs"}>
            Subtotal IGT
          </P>

          <HStack justify={"space-between"}>
            <P color={"fg.muted"}>{"Basis Bidang"}</P>
            <P fontWeight={"medium"}>
              <FormatNumber
                value={isSelected ? subtotalBidang : 0}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            </P>
          </HStack>

          <HStack justify={"space-between"} gap={"md"}>
            <P color={"fg.muted"}>{"Basis Kawasan"}</P>
            <P fontWeight={"medium"}>
              <FormatNumber
                value={isSelected ? subtotalKawasan : 0}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            </P>
          </HStack>
        </VStack>

        <Separator
          variant={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.subtle"}
          my={1}
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
        <Alert.Root status={"neutral"}>
          <AppIcon icon={InfoIcon} />
          <Alert.Description>
            {
              "Silakan pilih salah satu pesanan pada daftar keranjang untuk menampilkan rincian dan melakukan pembayaran."
            }
          </Alert.Description>
        </Alert.Root>
      )}

      {isSelected && isRequesting && (
        <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
          <AppIcon icon={LoaderIcon} />
          <Alert.Description>
            {
              "Pesanan sedang dalam proses kalkulasi oleh server (clipping spasial, luas cakupan kawasan, dan estimasi tarif PNBP). Tagihan akan otomatis siap dibayar setelah proses selesai."
            }
          </Alert.Description>
        </Alert.Root>
      )}

      {isSelected && isPayable && (
        <Alert.Root status={"info"} colorPalette={"blue"}>
          <AppIcon icon={InfoIcon} />
          <Alert.Description>
            {
              "Totalan tagihan telah dikalkulasi. Klik 'Bayar Sekarang' untuk menerbitkan kode billing dan menyelesaikan pembayaran."
            }
          </Alert.Description>
        </Alert.Root>
      )}

      {isSelected && isProcessing && (
        <Alert.Root status={"info"} colorPalette={"purple"}>
          <AppIcon icon={InfoIcon} />
          <Alert.Description>
            {"Layanan WMS sedang dipersiapkan oleh sistem."}
          </Alert.Description>
        </Alert.Root>
      )}

      {isSelected && isPendingReview && (
        <Alert.Root
          status={"warning"}
          colorPalette={"orange"}
          variant={"subtle"}
        >
          <AppIcon icon={HourglassIcon} />
          <Alert.Description>
            {
              "Permintaan data sedang dalam proses validasi oleh admin internal."
            }
          </Alert.Description>
        </Alert.Root>
      )}

      {isSelected && isRejected && (
        <Alert.Root status={"error"} colorPalette={"red"} variant={"subtle"}>
          <AppIcon icon={AlertCircleIcon} />
          <Alert.Description>
            {`Pesanan ditolak oleh Admin Internal: ${activeOrder?.rejectionReason || "Tidak memenuhi syarat."}`}
          </Alert.Description>
        </Alert.Root>
      )}

      {isSelected && isReady && (
        <Alert.Root
          status={"success"}
          colorPalette={"green"}
          variant={"subtle"}
        >
          <AppIcon icon={InfoIcon} />
          <Alert.Description>
            {
              "Pesanan permintaan telah siap digunakan. Layanan data spasial dapat diakses melalui menu Data Saya."
            }
          </Alert.Description>
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
          isLoading ||
          isRequesting
        }
        loading={checkoutMutation.isPending}
        onClick={handleCheckout}
        mt={1}
      >
        <AppIcon icon={CreditCardIcon} />
        {!isSelected
          ? "Pilih Pesanan Terlebih Dahulu"
          : isRequesting
            ? "Menyiapkan Data IGT..."
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
