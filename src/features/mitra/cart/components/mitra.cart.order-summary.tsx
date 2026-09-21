import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useCheckoutCartOrder } from "@/features/mitra/cart/hooks/use-mitra-cart";
import type { MitraCartOrderSummaryProps } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { formatDateTime } from "@/shared/utils/formatter/date.formatter";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  CreditCardIcon,
  EyeIcon,
  EyeOffIcon,
  FocusIcon,
  HourglassIcon,
  InfoIcon,
  LoaderIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useMemo } from "react";

export const MitraCartOrderSummary = (props: MitraCartOrderSummaryProps) => {
  // Props
  const {
    activeOrder,
    orderIndex,
    isLoading = false,
    isAoiVisible = true,
    isCoverageVisible = true,
    onToggleAoiVisible,
    onToggleCoverageVisible,
    onFlyToAoi,
    onFlyToCoverage,
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
  const hasAoiPolygon = Boolean(activeOrder?.aoiPolygon);
  const hasCoveragePolygon = Boolean(activeOrder?.coveragePolygon);

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

        <HStack
          justify={"space-between"}
          align={"center"}
          fontSize={"xs"}
          w={"full"}
        >
          <P fontSize={"xs"} color={"fg.subtle"}>
            {isSelected && activeOrder ? activeOrder.orderId : "-"}
          </P>

          {isSelected && activeOrder?.createdAt && (
            <P fontSize={"xs"} color={"fg.subtle"} textAlign={"right"}>
              {formatDateTime(activeOrder.createdAt)}
            </P>
          )}
        </HStack>
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

      {/* Spatial Visualizations & Map Toggles */}
      {isSelected && (hasAoiPolygon || hasCoveragePolygon) && (
        <>
          <Separator borderColor={"bg.canvas"} my={1} />

          <VStack align={"stretch"} gap={"xs"}>
            <HStack justify={"space-between"} align={"center"}>
              <HStack gap={1} align={"center"}>
                <AppIcon icon={MapPinIcon} size={"xs"} color={"fg.muted"} />
                <P fontSize={"xs"} fontWeight={"medium"} color={"fg.muted"}>
                  {"Visualisasi Spasial Peta"}
                </P>
              </HStack>
            </HStack>

            <VStack gap={"xs"} align={"stretch"}>
              {hasAoiPolygon && (
                <HStack
                  justify={"space-between"}
                  align={"center"}
                  p={2}
                  rounded={"md"}
                  bg={"bg.subtle"}
                >
                  <HStack gap={"xs"} align={"center"}>
                    <Badge colorPalette={"orange"} size={"sm"}>
                      {"AOI Polygon"}
                    </Badge>
                  </HStack>

                  <HStack gap={"xs"}>
                    {onFlyToAoi && (
                      <Tooltip content={"Zoom ke Polygon AOI"}>
                        <IconButton
                          size={"xs"}
                          variant={"ghost"}
                          onClick={onFlyToAoi}
                        >
                          <AppIcon icon={FocusIcon} />
                        </IconButton>
                      </Tooltip>
                    )}

                    {onToggleAoiVisible && (
                      <Tooltip
                        content={
                          isAoiVisible
                            ? "Sembunyikan Polygon AOI"
                            : "Tampilkan Polygon AOI"
                        }
                      >
                        <IconButton
                          size={"xs"}
                          variant={isAoiVisible ? "subtle" : "ghost"}
                          colorPalette={isAoiVisible ? "orange" : "gray"}
                          onClick={onToggleAoiVisible}
                        >
                          <AppIcon icon={isAoiVisible ? EyeIcon : EyeOffIcon} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </HStack>
                </HStack>
              )}

              {hasCoveragePolygon && (
                <HStack
                  justify={"space-between"}
                  align={"center"}
                  p={2}
                  rounded={"md"}
                  bg={"bg.subtle"}
                >
                  <HStack gap={"xs"} align={"center"}>
                    <Badge colorPalette={"green"} size={"sm"}>
                      {"Coverage Area"}
                    </Badge>
                  </HStack>

                  <HStack gap={"xs"}>
                    {onFlyToCoverage && (
                      <Tooltip content={"Zoom ke Coverage Area"}>
                        <IconButton
                          size={"xs"}
                          variant={"ghost"}
                          onClick={onFlyToCoverage}
                        >
                          <AppIcon icon={FocusIcon} />
                        </IconButton>
                      </Tooltip>
                    )}

                    {onToggleCoverageVisible && (
                      <Tooltip
                        content={
                          isCoverageVisible
                            ? "Sembunyikan Coverage Area"
                            : "Tampilkan Coverage Area"
                        }
                      >
                        <IconButton
                          size={"xs"}
                          variant={isCoverageVisible ? "subtle" : "ghost"}
                          colorPalette={isCoverageVisible ? "green" : "gray"}
                          onClick={onToggleCoverageVisible}
                        >
                          <AppIcon
                            icon={isCoverageVisible ? EyeIcon : EyeOffIcon}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </HStack>
                </HStack>
              )}
            </VStack>
          </VStack>
        </>
      )}

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
            ? "Sedang Dikalkulasi (BE)..."
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
