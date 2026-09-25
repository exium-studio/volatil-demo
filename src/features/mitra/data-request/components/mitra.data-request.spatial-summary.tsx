// src\features\mitra\data-request\components\mitra.data-request.spatial-summary.tsx

// src\features\mitra\data-request\components\mitra.data-request.spatial-summary.tsx

import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { Progress } from "@/design-system/components/feedback/ui/progress";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
import { useMitraDataRequestCalculationStore } from "@/features/mitra/data-request/stores/mitra.data-request-calculation.store";
import type { MitraDataRequestSpatialSummaryProps } from "@/features/mitra/data-request/types/mitra.data-request.spatial-summary.type";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { ShieldAlertIcon } from "lucide-react";
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
      estimatedTotalPrice = 0,
      isPurchaseLimitValid = true,
      purchaseLimitMessage,
      isCalculating: propIsCalculating,
      progressMessage: propProgressMessage,
      progressPercentage: propProgressPercentage,
      hasCoveragePolygon = false,
      isCoverageVisible = true,
      onToggleCoverageVisible,
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
      propPricePerBidang ?? pricingPolicy.pricePerBidang;
    const effectivePricePerKawasanHa =
      propPricePerKawasanHa ?? pricingPolicy.pricePerKawasanHa;

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

    // Validation logic against purchase policies with OR logic
    const isBidangBelowMin =
      totalBidangCount > 0 &&
      pricingPolicy.minBidangCount > 0 &&
      totalBidangCount < pricingPolicy.minBidangCount;

    const isKawasanBelowMin =
      totalKawasanAreaHa > 0 &&
      pricingPolicy.minKawasanHa > 0 &&
      totalKawasanAreaHa < pricingPolicy.minKawasanHa;

    const hasValidBidang =
      totalBidangCount >= pricingPolicy.minBidangCount && totalBidangCount > 0;
    const hasValidKawasan =
      totalKawasanAreaHa >= pricingPolicy.minKawasanHa && totalKawasanAreaHa > 0;

    const hasAnyLimitViolation =
      isBidangBelowMin || isKawasanBelowMin || isPurchaseLimitValid === false;

    // Logika OR: Jika salah satu valid (misal kawasan valid tapi bidang tidak), maka tetap valid untuk checkout
    const isOrValidForCheckout = hasValidBidang || hasValidKawasan;

    // Jika OR valid (bisa checkout untuk yang valid), gunakan warna orange (warning)
    // Jika KEDUA-DUANYA tidak valid (tidak bisa checkout sama sekali), gunakan warna red (error)
    const isOrangeWarning =
      isOrValidForCheckout && (isBidangBelowMin || isKawasanBelowMin);

    const displayAlertMessage = (() => {
      if (purchaseLimitMessage) return purchaseLimitMessage;
      if (isBidangBelowMin && isKawasanBelowMin) {
        return `Minimum pembelian belum terpenuhi (Bidang: min ${formatNumber(pricingPolicy.minBidangCount)} bidang, Kawasan: min ${formatNumber(pricingPolicy.minKawasanHa)} ha).`;
      }
      if (isBidangBelowMin) {
        return `Minimum pembelian untuk bidang tanah adalah ${formatNumber(pricingPolicy.minBidangCount)} bidang (saat ini: ${formatNumber(totalBidangCount)} bidang).`;
      }
      if (isKawasanBelowMin) {
        return `Minimum pembelian untuk kawasan adalah ${formatNumber(pricingPolicy.minKawasanHa)} ha (saat ini: ${formatNumber(totalKawasanAreaHa, { maximumFractionDigits: 2 })} ha).`;
      }
      return "Total permohonan melebihi batas pembelian (purchase limit) akun Anda.";
    })();

    return (
      <VStack gap={"md"}>
        {/* Coverage Layer Switch (Only rendered if coverage polygon exists) */}
        {hasCoveragePolygon && onToggleCoverageVisible && (
          <HStack justify={"space-between"} align={"center"}>
            <HStack gap={"xs"} align={"center"}>
              <P fontSize={"sm"}>{"Tampilkan Cakupan Kawasan"}</P>
            </HStack>

            <Switch
              size={"sm"}
              checked={isCoverageVisible}
              onCheckedChange={onToggleCoverageVisible}
            />
          </HStack>
        )}

        {/* Pricing Subtotal & Details */}
        <VStack gap={"sm"} align={"stretch"} fontSize={"sm"}>
          {/* Subtotal Bidang */}
          <HStack justify={"space-between"} align={"start"}>
            <VStack align={"start"} gap={"2xs"}>
              <P fontSize={"sm"} color={"fg.subtle"}>
                {"Subtotal Bidang"}
              </P>

              <P fontSize={"sm"}>
                {totalBidangCount > 0 ? (
                  <>
                    <TNum>{formatNumber(totalBidangCount)}</TNum>
                    {" bidang × "}
                    <FormatNumber
                      value={effectivePricePerBidang}
                      style={"currency"}
                      currency={"IDR"}
                      maximumFractionDigits={0}
                    />
                  </>
                ) : (
                  "0 bidang"
                )}
              </P>
            </VStack>

            <P fontWeight={"semibold"} fontSize={"sm"}>
              <FormatNumber
                value={subtotalBidangPrice}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            </P>
          </HStack>

          {/* Subtotal Kawasan */}
          <HStack justify={"space-between"} align={"start"}>
            <VStack align={"start"} gap={"2xs"}>
              <P fontSize={"sm"} color={"fg.subtle"}>
                {"Subtotal Kawasan"}
              </P>

              <P fontSize={"sm"}>
                {totalKawasanAreaHa > 0 ? (
                  <>
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
                  </>
                ) : (
                  "0 ha"
                )}
              </P>
            </VStack>

            <P fontWeight={"semibold"} fontSize={"sm"}>
              <FormatNumber
                value={subtotalKawasanPrice}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            </P>
          </HStack>

          <Separator borderColor={"border.subtle"} />

          {/* Total Estimasi */}
          <HStack justify={"space-between"} align={"center"}>
            <P fontWeight={"semibold"}>{"Total Estimasi"}</P>

            <P fontWeight={"bold"} color={"blue.fg"}>
              <FormatNumber
                value={estimatedTotalPrice}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            </P>
          </HStack>
        </VStack>

        {/* Limit Warning Notice */}
        {hasAnyLimitViolation && (
          <Alert.Root
            status={isOrangeWarning ? "warning" : "error"}
            colorPalette={isOrangeWarning ? "orange" : "red"}
            variant={"subtle"}
            mt={1}
          >
            <AppIcon icon={ShieldAlertIcon} />
            <Alert.Description fontSize={"xs"}>
              {displayAlertMessage}
            </Alert.Description>
          </Alert.Root>
        )}
      </VStack>
    );

  },
);
