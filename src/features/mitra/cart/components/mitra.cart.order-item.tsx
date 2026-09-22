// src/features/mitra/cart/components/mitra.cart.order-item.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { RadioIndicator } from "@/design-system/components/input/ui/radio-indicator";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type {
  MitraCartBatchItemProps,
  MitraCartOrderItemProps,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { ORDER_STATUS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { formatDateTime } from "@/shared/utils/formatter/date.formatter";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { EyeIcon, EyeOffIcon, FocusIcon, Trash2Icon } from "lucide-react";
import { memo } from "react";

export const MitraCartOrderItem = memo((props: MitraCartOrderItemProps) => {
  // Props
  const {
    order,
    index,
    isSelected,
    onSelect,
    onDelete,
    isDeleting = false,
    isAoiVisible = true,
    isCoverageVisible = true,
    onToggleAoiVisible,
    onToggleCoverageVisible,
    onFlyToAoi,
    onFlyToCoverage,
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Values
  const statusConfig = ORDER_STATUS_MAP[order.status];

  const totalBidang = order.items
    .filter((i) => i.spatialBasis === "bidang")
    .reduce((sum, item) => sum + item.featuresCount, 0);

  const totalKawasanHa = order.coverageHa;

  const hasAoiPolygon = Boolean(order.aoiPolygon);
  const hasCoveragePolygon = Boolean(order.coveragePolygon);

  return (
    <Box
      w={"full"}
      p={"md"}
      bg={"bg.body"}
      rounded={theme.radii.container}
      border={"1.5px solid"}
      borderColor={isSelected ? `${theme.colorPalette}.solid` : "border.subtle"}
      cursor={"pointer"}
      transition={"all 0.15s ease-in-out"}
      _hover={{
        borderColor: isSelected
          ? `${theme.colorPalette}.solid`
          : "border.muted",
        bg: isSelected ? `` : "bg.subtle",
      }}
      onClick={() => onSelect(order.orderId)}
    >
      <VStack align={"stretch"} gap={"sm"}>
        {/* Header: Order Number, Selection Type, Status & Radio Indicator */}
        <HStack justify={"space-between"} gapX={"md"} gapY={"xs"} w={"full"}>
          <HStack wrap={"wrap"} justify={"space-between"} gap={"sm"} w={"full"}>
            <HStack gap={"sm"} align={"center"}>
              <AppIcon
                icon={statusConfig.icon}
                color={statusConfig.iconColor}
              />

              <VStack>
                <P fontWeight={"semibold"} fontSize={"sm"}>
                  {`Pesanan #${index + 1}`}
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
            </HStack>
          </HStack>

          <RadioIndicator checked={isSelected} mt={"2px"} />
        </HStack>

        <Separator />

        {/* Content Details */}
        <VStack align={"stretch"} gap={"xs"} fontSize={"xs"}>
          <HStack justify={"space-between"} align={"center"}>
            <P color={"fg.muted"}>{"Tanggal Pesan:"}</P>
            <P fontWeight={"medium"}>
              {order.createdAt ? formatDateTime(order.createdAt) : "-"}
            </P>
          </HStack>

          <HStack justify={"space-between"} align={"center"}>
            <P color={"fg.muted"}>{"Metode Pengajuan:"}</P>
            <SelectionTypeBadge size={"xs"}>
              {order.selectionType}
            </SelectionTypeBadge>
          </HStack>

          <HStack justify={"space-between"} align={"center"}>
            <P color={"fg.muted"}>{"IGT Berbasis Bidang:"}</P>
            <P fontWeight={"medium"}>
              {totalBidang > 0 ? (
                <>
                  <TNum>{formatNumber(totalBidang)}</TNum> {"bidang"}
                </>
              ) : (
                "-"
              )}
            </P>
          </HStack>

          <HStack justify={"space-between"} align={"center"}>
            <P color={"fg.muted"}>{"IGT Berbasis Kawasan:"}</P>
            <P fontWeight={"medium"}>
              {totalKawasanHa && totalKawasanHa > 0 ? (
                <>
                  <TNum>{formatNumber(totalKawasanHa)}</TNum> {"ha"}
                </>
              ) : (
                "-"
              )}
            </P>
          </HStack>

          <HStack justify={"space-between"} align={"center"}>
            <P color={"fg.muted"}>{"Total Tagihan:"}</P>
            <P fontWeight={"semibold"} color={"blue.fg"}>
              <FormatNumber
                value={order.totalPrice}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            </P>
          </HStack>
        </VStack>

        {/* Dynamic Status Notices */}
        {order.status === "pending_payment" && order.expiredAt ? (
          <HStack
            justify={"space-between"}
            align={"center"}
            gap={"md"}
            bg={"bg.subtle"}
            p={2}
            rounded={"md"}
            fontSize={"xs"}
          >
            <P color={"fg.muted"}>{"Sisa Waktu Pembayaran (TTL):"}</P>

            <Countdown
              finishedAt={order.expiredAt}
              fontWeight={"semibold"}
              color={"orange.fg"}
            />
          </HStack>
        ) : order.status === "rejected" ? (
          <HStack
            align={"center"}
            gap={"xs"}
            bg={`${statusConfig.colorPalette}.subtle`}
            p={2}
            rounded={"md"}
            fontSize={"xs"}
            color={`${statusConfig.colorPalette}.fg`}
          >
            {statusConfig.icon && <AppIcon icon={statusConfig.icon} />}
            <P>
              {order.rejectionReason
                ? `Alasan penolakan: ${order.rejectionReason}`
                : statusConfig.noticeDescription || statusConfig.label}
            </P>
          </HStack>
        ) : statusConfig.noticeDescription ? (
          <HStack
            align={"center"}
            gap={"xs"}
            bg={`${statusConfig.colorPalette}.subtle`}
            p={2}
            rounded={"md"}
            fontSize={"xs"}
            color={`${statusConfig.colorPalette}.fg`}
          >
            {statusConfig.icon && <AppIcon icon={statusConfig.icon} />}
            <P>{statusConfig.noticeDescription}</P>
          </HStack>
        ) : null}


        {/* Selected Order Actions: Spatial Actions (Left) & Delete (Right) */}
        {isSelected && (
          <>
            <Separator />

            <HStack
              justify={"space-between"}
              align={"end"}
              w={"full"}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {/* Pojok Kiri: Spatial Actions (AOI & Coverage) */}
              <VStack>
                {hasAoiPolygon && (
                  <HStack gap={"2xs"} align={"center"}>
                    <P w={"100px"}>AOI</P>

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
                        <IconButton size={"xs"} onClick={onToggleAoiVisible}>
                          <AppIcon icon={isAoiVisible ? EyeIcon : EyeOffIcon} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </HStack>
                )}

                <Separator
                  direction={"vertical"}
                  w={"1px"}
                  borderColor={"red"}
                  // className={"debug"}
                  alignSelf={"stretch"}
                />

                {hasCoveragePolygon && (
                  <HStack gap={"2xs"} align={"center"}>
                    <P w={"100px"}>Kawasan</P>

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
                          onClick={onToggleCoverageVisible}
                        >
                          <AppIcon
                            icon={isCoverageVisible ? EyeIcon : EyeOffIcon}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </HStack>
                )}
              </VStack>

              {/* Pojok Kanan: Hapus Pesanan */}
              {onDelete && (
                <ConfirmationTrigger
                  modalKey={`delete-order-${order.orderId}`}
                  title={"Hapus Pesanan?"}
                  description={`Pesanan #${index + 1} akan dihapus dari keranjang transaksi.`}
                  confirmLabel={"Hapus pesanan"}
                  colorPalette={"red"}
                  onConfirm={() => {
                    onDelete(order.orderId);
                  }}
                >
                  <Button
                    colorPalette={"red"}
                    variant={"ghost"}
                    size={"xs"}
                    loading={isDeleting}
                  >
                    <AppIcon icon={Trash2Icon} />
                    {"Hapus Pesanan"}
                  </Button>
                </ConfirmationTrigger>
              )}
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  );
});

export const MitraCartBatchItem = (props: MitraCartBatchItemProps) => {
  const targetOrder = props.order ?? props.batch;
  if (!targetOrder) return null;
  return (
    <MitraCartOrderItem
      order={targetOrder}
      index={props.index}
      isSelected={props.isSelected}
      onSelect={props.onSelect}
      onDelete={props.onDelete}
      isDeleting={props.isDeleting}
    />
  );
};
