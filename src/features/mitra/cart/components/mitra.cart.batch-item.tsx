import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { RadioIndicator } from "@/design-system/components/input/ui/radio-indicator";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { CART_BATCH_STATUS_CONFIG_MAP } from "@/features/mitra/cart/constants/cart.config";
import type { MitraCartBatchItemProps } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { memo } from "react";

export const MitraCartBatchItem = memo((props: MitraCartBatchItemProps) => {
  // Props
  const { batch, index, isSelected, onSelect } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Values
  const statusConfig = CART_BATCH_STATUS_CONFIG_MAP[batch.status];

  const totalBidang = batch.items
    .filter((i) => i.spatialBasis === "bidang")
    .reduce((sum, item) => sum + item.featuresCount, 0);

  const totalKawasanHa = batch.items
    .filter((i) => i.spatialBasis === "kawasan")
    .reduce((sum, item) => sum + (item.areaHa ?? 0), 0);

  const layerTitles = batch.items.map((i) => i.sourceLayerTitle).join(", ");

  return (
    <Box
      w={"full"}
      p={"md"}
      bg={isSelected ? "bg.subtle" : "bg.body"}
      rounded={theme.radii.container}
      border={"1.5px solid"}
      borderColor={isSelected ? `${theme.colorPalette}.solid` : "border.subtle"}
      cursor={"pointer"}
      transition={"all 0.15s ease-in-out"}
      _hover={{
        borderColor: isSelected
          ? `${theme.colorPalette}.solid`
          : "border.muted",
        bg: "bg.subtle",
      }}
      onClick={() => onSelect(batch.batchId)}
    >
      <VStack align={"stretch"} gap={"sm"}>
        {/* Header: Batch Number, Status & Radio Indicator */}
        <HStack
          wrap={"wrap"}
          justify={"space-between"}
          align={"center"}
          gapX={"md"}
          gapY={"xs"}
          w={"full"}
        >
          <HStack gap={"md"} align={"center"}>
            <AppIcon
              icon={statusConfig.icon}
              color={statusConfig.iconColor}
              size={"lg"}
            />

            <VStack>
              <P fontWeight={"semibold"} fontSize={"sm"}>
                {`Batch #${index + 1}`}
              </P>

              <P fontSize={"xs"} color={"fg.subtle"}>
                {`(${batch.batchId})`}
              </P>
            </VStack>
          </HStack>

          <HStack gap={"sm"} align={"center"}>
            <Badge
              size={"sm"}
              variant={"subtle"}
              colorPalette={statusConfig.colorPalette}
            >
              {statusConfig.label}
            </Badge>

            <RadioIndicator checked={isSelected} />
          </HStack>
        </HStack>

        <Separator />

        {/* Content Details */}
        <VStack align={"stretch"} gap={"xs"} fontSize={"xs"}>
          <HStack justify={"space-between"} align={"center"}>
            <P color={"fg.muted"}>{"Daftar Layer IGT:"}</P>
            <ClampedP maxW={"65%"} textAlign={"end"} color={"fg.default"}>
              {layerTitles || "-"}
            </ClampedP>
          </HStack>

          <HStack justify={"space-between"} align={"center"}>
            <P color={"fg.muted"}>{"Volume Spasial:"}</P>
            <P fontWeight={"medium"}>
              {totalBidang > 0 && (
                <>
                  <TNum>{totalBidang}</TNum> {"bidang"}
                </>
              )}
              {totalBidang > 0 && totalKawasanHa > 0 && " • "}
              {totalKawasanHa > 0 && (
                <>
                  <TNum>{totalKawasanHa}</TNum> {"ha"}
                </>
              )}
            </P>
          </HStack>

          <HStack justify={"space-between"} align={"center"}>
            <P color={"fg.muted"}>{"Total Estimasi:"}</P>
            <P fontWeight={"semibold"} color={"blue.fg"}>
              <FormatNumber
                value={batch.totalPrice}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            </P>
          </HStack>
        </VStack>

        {/* Dynamic Status Notices */}
        {batch.status === "ready" && batch.expiredAt && (
          <HStack
            justify={"space-between"}
            align={"center"}
            gap={"md"}
            bg={"an0"}
            p={2}
            rounded={"md"}
            fontSize={"xs"}
          >
            <P color={"fg.muted"}>{"Sisa Waktu Pembayaran (TTL):"}</P>

            <Countdown
              finishedAt={batch.expiredAt}
              fontWeight={"semibold"}
              color={"orange.fg"}
            />
          </HStack>
        )}

        {batch.status === "preparing" && (
          <HStack
            align={"center"}
            gap={"xs"}
            bg={"blue.subtle"}
            p={2}
            rounded={"md"}
            fontSize={"xs"}
            color={"blue.fg"}
          >
            <P>{"Interop Engine sedang memproses & memotong data layer..."}</P>
          </HStack>
        )}
      </VStack>
    </Box>
  );
});
