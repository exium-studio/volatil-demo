import { Button } from "@/design-system/components/button/ui/button";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { RadioIndicator } from "@/design-system/components/input/ui/radio-indicator";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { CartOrder, MitraCartOrderItemProps } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { ORDER_STATUS_MAP } from "@/shared/constants/status.config";
import { Trash2Icon } from "lucide-react";
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
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Values
  const statusConfig = ORDER_STATUS_MAP[order.status];

  const totalBidang = order.items
    .filter((i) => i.spatialBasis === "bidang")
    .reduce((sum, item) => sum + item.featuresCount, 0);

  const totalKawasanHa = order.items
    .filter((i) => i.spatialBasis === "kawasan")
    .reduce((sum, item) => sum + (item.areaHa ?? 0), 0);

  const layerTitles = order.items.map((i) => i.sourceLayerTitle).join(", ");

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
        bg: "bg.subtle",
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
          <P fontSize={"xs"} color={"fg.subtle"} mb={"xs"}>
            {`${order.orderId}`}
          </P>

          <HStack justify={"space-between"} align={"center"}>
            <P color={"fg.muted"}>{"Metode Pengajuan:"}</P>
            <SelectionTypeBadge size={"xs"}>
              {order.selectionType}
            </SelectionTypeBadge>
          </HStack>

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
        {order.status === "pending_payment" && order.expiredAt && (
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
        )}

        {order.status === "pending_review" && (
          <HStack
            align={"center"}
            gap={"xs"}
            bg={"orange.subtle"}
            p={2}
            rounded={"md"}
            fontSize={"xs"}
            color={"orange.fg"}
          >
            <P>{"Menunggu validasi Admin Internal..."}</P>
          </HStack>
        )}

        {order.status === "processing" && (
          <HStack
            align={"center"}
            gap={"xs"}
            bg={"purple.subtle"}
            p={2}
            rounded={"md"}
            fontSize={"xs"}
            color={"purple.fg"}
          >
            <P>{"Layanan WMS sedang dipersiapkan..."}</P>
          </HStack>
        )}

        {order.status === "ready" && (
          <HStack
            align={"center"}
            gap={"xs"}
            bg={"green.subtle"}
            p={2}
            rounded={"md"}
            fontSize={"xs"}
            color={"green.fg"}
          >
            <P>{"Layanan data spasial siap digunakan."}</P>
          </HStack>
        )}

        {order.status === "rejected" && order.rejectionReason && (
          <HStack
            align={"center"}
            gap={"xs"}
            bg={"red.subtle"}
            p={2}
            rounded={"md"}
            fontSize={"xs"}
            color={"red.fg"}
          >
            <P>{`Alasan penolakan: ${order.rejectionReason}`}</P>
          </HStack>
        )}

        {/* Selected Order Actions: Individual Delete */}
        {isSelected && onDelete && (
          <>
            <Separator />

            <HStack
              w={"full"}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ConfirmationTrigger
                modalKey={`delete-order-${order.orderId}`}
                title={"Hapus Pesanan?"}
                description={`Pesanan #${index + 1} (${order.orderId}) akan dihapus dari keranjang transaksi.`}
                confirmLabel={"Hapus pesanan"}
                colorPalette={"red"}
                onConfirm={() => {
                  onDelete(order.orderId);
                }}
              >
                <Button colorPalette={"red"} w={"full"} loading={isDeleting}>
                  <AppIcon icon={Trash2Icon} />
                  {"Hapus pesanan ini"}
                </Button>
              </ConfirmationTrigger>
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  );
});

export type MitraCartBatchItemProps = {
  batch?: CartOrder;
  order?: CartOrder;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
};

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
