// src/features/mitra/data-request/components/mitra.data-request.spatial-summary.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Progress } from "@/design-system/components/feedback/ui/progress";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useMitraDataRequestCalculationStore } from "@/features/mitra/data-request/stores/mitra.data-request-calculation.store";
import type { MitraDataRequestSpatialSummaryProps } from "@/features/mitra/data-request/types/mitra.data-request.spatial-summary.type";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import {
  FocusIcon,
  LoaderIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { memo } from "react";

export const MitraDataRequestSpatialSummary = memo(
  (props: MitraDataRequestSpatialSummaryProps) => {
    // Props
    const {
      totalBidangCount = 0,
      totalKawasanAreaHa = 0,
      subtotalBidangPrice = 0,
      subtotalKawasanPrice = 0,
      estimatedTotalPrice = 0,
      isPurchaseLimitValid = true,
      purchaseLimitMessage,
      isCalculating: propIsCalculating,
      progressMessage: propProgressMessage,
      progressPercentage: propProgressPercentage,
      hasAoiPolygon = false,
      hasCoveragePolygon = false,
      aoiColorPalette = "blue",
      isAoiVisible = true,
      isCoverageVisible = true,
      onToggleAoiVisible,
      onToggleCoverageVisible,
      onFlyToAoi,
      onFlyToCoverage,
    } = props;

    // Stores
    const { theme } = useThemeStore();
    const storeIsCalculating = useMitraDataRequestCalculationStore(
      (state) => state.isCalculating,
    );
    const storeProgressMessage = useMitraDataRequestCalculationStore(
      (state) => state.progressMessage,
    );
    const storeProgressPercentage = useMitraDataRequestCalculationStore(
      (state) => state.progressPercentage,
    );

    // Derived Values
    const effectiveIsCalculating = propIsCalculating ?? storeIsCalculating;
    const effectiveProgressMessage =
      propProgressMessage || storeProgressMessage;
    const effectiveProgressPercentage =
      propProgressPercentage ?? storeProgressPercentage;

    if (effectiveIsCalculating) {
      return (
        <VStack
          gap={"sm"}
          p={"md"}
          rounded={theme.radii.container}
          bg={"bg.body"}
          align={"stretch"}
          border={"1px solid"}
          borderColor={"border.subtle"}
        >
          <HStack align={"center"} justify={"space-between"} color={"blue.fg"}>
            <HStack align={"center"} gap={"xs"}>
              <AppIcon icon={LoaderIcon} />
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
      );
    }

    return (
      <VStack
        gap={"sm"}
        p={"md"}
        rounded={theme.radii.container}
        bg={"bg.body"}
        align={"stretch"}
        border={"1px solid"}
        borderColor={"border.subtle"}
      >
        {/* Layer Controls & Metrics */}
        <VStack gap={"xs"} align={"stretch"} fontSize={"sm"}>
          {/* AOI Layer Control Row */}
          {hasAoiPolygon && (
            <HStack justify={"space-between"} align={"center"}>
              <HStack gap={"xs"} align={"center"}>
                <Box
                  w={"8px"}
                  h={"8px"}
                  rounded={"full"}
                  bg={`${aoiColorPalette}.solid`}
                />
                <P color={"fg.muted"}>{"Area Batas (AOI)"}</P>
              </HStack>

              <HStack gap={"xs"} align={"center"}>
                {onToggleAoiVisible && (
                  <Tooltip
                    content={
                      isAoiVisible
                        ? "Sembunyikan Polygon AOI"
                        : "Tampilkan Polygon AOI"
                    }
                  >
                    <Switch
                      size={"sm"}
                      checked={isAoiVisible}
                      onCheckedChange={onToggleAoiVisible}
                    />
                  </Tooltip>
                )}

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
              </HStack>
            </HStack>
          )}

          {/* Bidang Summary Row */}
          <HStack justify={"space-between"} align={"center"}>
            <P color={"fg.muted"}>{"IGT Berbasis Bidang"}</P>
            <P fontWeight={"medium"}>
              {totalBidangCount > 0 ? (
                <>
                  <TNum>{formatNumber(totalBidangCount)}</TNum> {"bidang"}
                </>
              ) : (
                "-"
              )}
            </P>
          </HStack>

          {/* Kawasan Summary & Map Control Row */}
          <HStack justify={"space-between"} align={"center"}>
            <HStack gap={"xs"} align={"center"}>
              {hasCoveragePolygon && (
                <Box
                  w={"8px"}
                  h={"8px"}
                  rounded={"full"}
                  bg={"green.solid"}
                />
              )}
              <P color={"fg.muted"}>{"IGT Berbasis Kawasan"}</P>
            </HStack>

            <HStack gap={"sm"} align={"center"}>
              <P fontWeight={"medium"}>
                {totalKawasanAreaHa > 0 ? (
                  <>
                    <TNum>
                      {formatNumber(totalKawasanAreaHa, {
                        maximumFractionDigits: 2,
                      })}
                    </TNum>{" "}
                    {"ha"}
                  </>
                ) : (
                  "-"
                )}
              </P>

              {hasCoveragePolygon && (
                <HStack gap={"2xs"} align={"center"}>
                  {onToggleCoverageVisible && (
                    <Tooltip
                      content={
                        isCoverageVisible
                          ? "Sembunyikan Cakupan Kawasan"
                          : "Tampilkan Cakupan Kawasan"
                      }
                    >
                      <Switch
                        size={"sm"}
                        checked={isCoverageVisible}
                        onCheckedChange={onToggleCoverageVisible}
                      />
                    </Tooltip>
                  )}

                  {onFlyToCoverage && (
                    <Tooltip content={"Zoom ke Cakupan Kawasan"}>
                      <IconButton
                        size={"xs"}
                        variant={"ghost"}
                        onClick={onFlyToCoverage}
                      >
                        <AppIcon icon={FocusIcon} />
                      </IconButton>
                    </Tooltip>
                  )}
                </HStack>
              )}
            </HStack>
          </HStack>
        </VStack>

        <Separator
          variant={"dashed"}
          borderTopWidth={"2px"}
          borderColor={"border.subtle"}
          my={1}
        />

        {/* Pricing Subtotal & Total */}
        <VStack gap={1} align={"stretch"} fontSize={"sm"}>
          <P fontSize={"xs"} color={"fg.subtle"}>
            {"Estimasi Tagihan"}
          </P>

          <HStack justify={"space-between"}>
            <P color={"fg.muted"} fontSize={"xs"}>
              {"Subtotal Bidang"}
            </P>
            <P fontWeight={"medium"} fontSize={"xs"}>
              <FormatNumber
                value={subtotalBidangPrice}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            </P>
          </HStack>

          <HStack justify={"space-between"}>
            <P color={"fg.muted"} fontSize={"xs"}>
              {"Subtotal Kawasan"}
            </P>
            <P fontWeight={"medium"} fontSize={"xs"}>
              <FormatNumber
                value={subtotalKawasanPrice}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            </P>
          </HStack>

          <Separator borderColor={"border.subtle"} my={1} />

          <HStack justify={"space-between"} align={"center"}>
            <P fontSize={"sm"} fontWeight={"semibold"}>
              {"Total Estimasi"}
            </P>
            <P fontSize={"md"} fontWeight={"semibold"} color={"blue.fg"}>
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
        {!isPurchaseLimitValid && (
          <Alert.Root status={"error"} colorPalette={"red"} variant={"subtle"} mt={1}>
            <AppIcon icon={ShieldAlertIcon} />
            <Alert.Description fontSize={"xs"}>
              {purchaseLimitMessage ||
                "Total permohonan melebihi batas pembelian (purchase limit) akun Anda."}
            </Alert.Description>
          </Alert.Root>
        )}
      </VStack>
    );
  },
);
