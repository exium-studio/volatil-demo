// src/features/mitra/data-request/components/mitra.data-request.spatial-summary.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { Progress } from "@/design-system/components/feedback/ui/progress";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { List } from "@/design-system/components/typography/ui/list";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
import { useMitraDataRequestCalculationStore } from "@/features/mitra/data-request/stores/mitra.data-request-calculation.store";
import type { MitraDataRequestSpatialSummaryProps } from "@/features/mitra/data-request/types/mitra.data-request.spatial-summary.type";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { FocusIcon, ShieldAlertIcon } from "lucide-react";
import { memo } from "react";

export const MitraDataRequestSpatialSummary = memo(
  (props: MitraDataRequestSpatialSummaryProps) => {
    // Props
    const {
      totalBidangCount = 0,
      totalKawasanAreaHa = 0,
      subtotalBidangPrice = 0,
      subtotalKawasanPrice = 0,
      pricePerBidang: propPricePerBidang,
      pricePerKawasanHa: propPricePerKawasanHa,
      minBidangCount: propMinBidangCount,
      minKawasanHa: propMinKawasanHa,
      calculatedPolicy,
      estimatedTotalPrice = 0,
      isCalculating: propIsCalculating,
      progressMessage: propProgressMessage,
      progressPercentage: propProgressPercentage,
      hasCoveragePolygon = false,
      isCoverageVisible = true,
      isBidangVisible = true,
      isFetchingBidang = false,
      onToggleCoverageVisible,
      onToggleBidangVisible,
      onFlyToCoverage,
      onFlyToBidang,
    } = props;

    // Stores
    const storeIsCalculating = useMitraDataRequestCalculationStore(
      (state) => state.isCalculating,
    );
    const storeProgressMessage = useMitraDataRequestCalculationStore(
      (state) => state.progressMessage,
    );
    const storeProgressPercentage = useMitraDataRequestCalculationStore(
      (state) => state.progressPercentage,
    );

    // Hooks
    const pricingPolicy = usePricingPolicy();

    // Derived Values
    const effectiveIsCalculating = propIsCalculating ?? storeIsCalculating;
    const effectiveProgressMessage =
      propProgressMessage || storeProgressMessage;
    const effectiveProgressPercentage =
      propProgressPercentage ?? storeProgressPercentage;

    const effectivePricePerBidang =
      propPricePerBidang ??
      calculatedPolicy?.pricePerBidang ??
      pricingPolicy.pricePerBidang;
    const effectivePricePerKawasanHa =
      propPricePerKawasanHa ??
      calculatedPolicy?.pricePerKawasanHa ??
      pricingPolicy.pricePerKawasanHa;

    const effectiveMinBidangCount =
      propMinBidangCount ??
      calculatedPolicy?.minimumBidangCount ??
      pricingPolicy.minBidangCount;
    const effectiveMinKawasanHa =
      propMinKawasanHa ??
      calculatedPolicy?.minimumKawasanHa ??
      pricingPolicy.minKawasanHa;

    // Show inline RetryState if policy query failed and no policy is available from SSE calculation
    const isPolicyError =
      pricingPolicy.isError &&
      !calculatedPolicy &&
      !propMinBidangCount &&
      !propPricePerBidang;

    if (effectiveIsCalculating) {
      return (
        <VStack gap={"md"}>
          {/* Progress / Loading message */}
          <VStack gap={"sm"} align={"stretch"}>
            <HStack
              align={"center"}
              justify={"space-between"}
              color={"blue.fg"}
            >
              <HStack align={"center"} gap={"xs"}>
                {/* <AppIcon icon={LoaderIcon} /> */}
                <Loader size={"xs"} />

                <P fontSize={"sm"} fontWeight={"semibold"}>
                  {effectiveProgressMessage ||
                    "Sedang mengkalkulasi spasial di server (PostGIS)..."}
                </P>
              </HStack>

              {effectiveProgressPercentage > 0 && (
                <P fontSize={"xs"} fontWeight={"bold"} color={"blue.fg"}>
                  {`${effectiveProgressPercentage}%`}
                </P>
              )}
            </HStack>

            <Progress.Root
              value={effectiveProgressPercentage}
              size={"xs"}
              colorPalette={"blue"}
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </VStack>

          <Separator borderColor={"border.subtle"} />

          {/* Pricing Skeleton Placeholders */}
          <VStack gap={"sm"} align={"stretch"} fontSize={"sm"}>
            {/* Subtotal Bidang */}
            <HStack justify={"space-between"} align={"center"}>
              <VStack align={"start"} gap={1}>
                <P fontSize={"sm"} fontWeight={"medium"} color={"fg.body"}>
                  {"Subtotal Bidang"}
                </P>
                <Skeleton h={"14px"} w={"100px"} />
              </VStack>
              <Skeleton h={"18px"} w={"80px"} />
            </HStack>

            {/* Subtotal Kawasan */}
            <HStack justify={"space-between"} align={"center"}>
              <VStack align={"start"} gap={1}>
                <P fontSize={"sm"} fontWeight={"medium"} color={"fg.body"}>
                  {"Subtotal Kawasan"}
                </P>
                <Skeleton h={"14px"} w={"120px"} />
              </VStack>
              <Skeleton h={"18px"} w={"80px"} />
            </HStack>

            <Separator borderColor={"border.subtle"} />

            {/* Total Estimasi */}
            <HStack justify={"space-between"} align={"center"}>
              <P fontWeight={"semibold"}>{"Total Estimasi"}</P>
              <Skeleton h={"22px"} w={"110px"} />
            </HStack>
          </VStack>
        </VStack>
      );
    }

    if (isPolicyError) {
      return (
        <RetryState
          title={"Gagal memuat kebijakan tarif"}
          description={
            pricingPolicy.error?.message ||
            "Terjadi kesalahan saat memuat batas minimum dan tarif layanan."
          }
          onRetry={pricingPolicy.refetch}
        />
      );
    }

    // Validation: valid jika count/area >= minimum policy limit
    const isBidangValid = totalBidangCount >= effectiveMinBidangCount;
    const isKawasanValid = totalKawasanAreaHa >= effectiveMinKawasanHa;

    const isOrValidForCheckout = isBidangValid || isKawasanValid;

    const calculatedSubtotalBidang =
      subtotalBidangPrice > 0
        ? subtotalBidangPrice
        : totalBidangCount * effectivePricePerBidang;
    const calculatedSubtotalKawasan =
      subtotalKawasanPrice > 0
        ? subtotalKawasanPrice
        : Math.ceil(totalKawasanAreaHa) * effectivePricePerKawasanHa;

    const calculatedTotalPrice =
      isBidangValid && isKawasanValid && estimatedTotalPrice > 0
        ? estimatedTotalPrice
        : (isBidangValid ? calculatedSubtotalBidang : 0) +
          (isKawasanValid ? calculatedSubtotalKawasan : 0);

    return (
      <VStack gap={"md"}>
        {/* Toggle Selected Layer Bidang */}
        {totalBidangCount > 0 && onToggleBidangVisible && (
          <HStack justify={"space-between"} align={"center"}>
            <HStack align={"center"} gap={"xs"}>
              <P>{"Tampilkan Cakupan Bidang"}</P>

              {isFetchingBidang && <Loader size={"xs"} />}
            </HStack>

            <HStack align={"center"} gap={"xs"}>
              <Switch
                checked={isBidangVisible}
                disabled={isFetchingBidang}
                onCheckedChange={onToggleBidangVisible}
                tooltip={
                  isBidangVisible
                    ? "Sembunyikan Cakupan Bidang"
                    : "Tampilkan Cakupan Bidang"
                }
              />

              {onFlyToBidang && (
                <Tooltip content={"Zoom ke Cakupan Bidang"}>
                  <IconButton
                    variant={"outline"}
                    onClick={onFlyToBidang}
                    aria-label={"Zoom ke Cakupan Bidang"}
                  >
                    <AppIcon icon={FocusIcon} />
                  </IconButton>
                </Tooltip>
              )}
            </HStack>
          </HStack>
        )}

        {/* Toggle Selected Layer Cakupan Kawasan  */}
        {hasCoveragePolygon && onToggleCoverageVisible && (
          <HStack justify={"space-between"} align={"center"}>
            <HStack gap={"xs"} align={"center"}>
              <P>{"Tampilkan Cakupan Kawasan"}</P>
            </HStack>

            <HStack gap={"xs"} align={"center"}>
              <Switch
                checked={isCoverageVisible}
                onCheckedChange={onToggleCoverageVisible}
                tooltip={
                  isCoverageVisible
                    ? "Sembunyikan Cakupan Kawasan"
                    : "Tampilkan Cakupan Kawasan"
                }
              />

              {onFlyToCoverage && (
                <Tooltip content={"Zoom ke Cakupan Kawasan"}>
                  <IconButton
                    variant={"outline"}
                    onClick={onFlyToCoverage}
                    aria-label={"Zoom ke Cakupan Kawasan"}
                  >
                    <AppIcon icon={FocusIcon} />
                  </IconButton>
                </Tooltip>
              )}
            </HStack>
          </HStack>
        )}

        <Separator variant={"dashed"} />

        {/* Pricing Subtotal & Details */}
        <VStack gap={"sm"} align={"stretch"} fontSize={"sm"}>
          {/* Subtotal Bidang */}
          <HStack justify={"space-between"} align={"end"}>
            <VStack align={"start"} gap={"2xs"}>
              <P fontSize={"sm"} color={"fg.subtle"}>
                {"Subtotal Bidang"}
              </P>

              <P>
                <TNum>{formatNumber(totalBidangCount)}</TNum>
                {" bidang × "}
                <FormatNumber
                  value={effectivePricePerBidang}
                  style={"currency"}
                  currency={"IDR"}
                  maximumFractionDigits={0}
                />
              </P>
            </VStack>

            {isBidangValid ? (
              <P fontWeight={"semibold"}>
                <FormatNumber
                  value={calculatedSubtotalBidang}
                  style={"currency"}
                  currency={"IDR"}
                  maximumFractionDigits={0}
                />
              </P>
            ) : (
              <P fontSize={"sm"} color={"fg.error"} fontWeight={"medium"}>
                {"Tidak valid"}
              </P>
            )}
          </HStack>

          {/* Subtotal Kawasan */}
          <HStack justify={"space-between"} align={"end"}>
            <VStack align={"start"} gap={"2xs"}>
              <P fontSize={"sm"} color={"fg.subtle"}>
                {"Subtotal Kawasan"}
              </P>

              <P>
                <TNum>
                  {formatNumber(totalKawasanAreaHa, {
                    maximumFractionDigits: 2,
                  })}
                </TNum>
                {" ha × "}
                <FormatNumber
                  value={effectivePricePerKawasanHa}
                  style={"currency"}
                  currency={"IDR"}
                  maximumFractionDigits={0}
                />
              </P>
            </VStack>

            {isKawasanValid ? (
              <P fontWeight={"semibold"}>
                <FormatNumber
                  value={calculatedSubtotalKawasan}
                  style={"currency"}
                  currency={"IDR"}
                  maximumFractionDigits={0}
                />
              </P>
            ) : (
              <P fontSize={"sm"} color={"fg.error"} fontWeight={"medium"}>
                {"Tidak valid"}
              </P>
            )}
          </HStack>

          <Separator variant={"dashed"} />

          {/* Total Estimasi */}
          <HStack justify={"space-between"} align={"center"}>
            <P fontWeight={"medium"}>{"Total Estimasi"}</P>

            {isOrValidForCheckout && calculatedTotalPrice > 0 ? (
              <P fontSize={"lg"} fontWeight={"bold"} color={"blue.fg"}>
                <FormatNumber
                  value={calculatedTotalPrice}
                  style={"currency"}
                  currency={"IDR"}
                  maximumFractionDigits={0}
                />
              </P>
            ) : (
              <P fontSize={"md"} fontWeight={"semibold"} color={"fg.error"}>
                {"Tidak valid"}
              </P>
            )}
          </HStack>
        </VStack>

        {/* Limit Warning Notice */}
        {(!isBidangValid || !isKawasanValid) && (
          <Alert.Root
            status={"error"}
            colorPalette={"red"}
            variant={"subtle"}
            mt={1}
          >
            <AppIcon icon={ShieldAlertIcon} mt={"1px"} />

            <Alert.Description>
              <List.Root
                variant={"plain"}
                fontSize={"xs"}
                color={"fg.error"}
                align={"start"}
                gap={"2xs"}
              >
                {!isBidangValid && (
                  <List.Item>
                    <List.Indicator color={"fg.error"}>{"•"}</List.Indicator>
                    {`Minimum pembelian bidang: ${formatNumber(effectiveMinBidangCount)} bidang (saat ini: ${formatNumber(totalBidangCount)} bidang)`}
                  </List.Item>
                )}

                {!isKawasanValid && (
                  <List.Item>
                    <List.Indicator color={"fg.error"}>{"•"}</List.Indicator>
                    {`Minimum pembelian kawasan: ${formatNumber(effectiveMinKawasanHa)} ha (saat ini: ${formatNumber(totalKawasanAreaHa, { maximumFractionDigits: 2 })} ha)`}
                  </List.Item>
                )}
              </List.Root>
            </Alert.Description>
          </Alert.Root>
        )}
      </VStack>
    );
  },
);
