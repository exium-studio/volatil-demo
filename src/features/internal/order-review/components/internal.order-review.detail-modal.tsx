// src/features/internal/order-review/components/internal.order-review.detail-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { BasisIgtBadge } from "@/features/shared/components/basis-igt.badge";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { InternalOrderReviewApproveTrigger } from "@/features/internal/order-review/components/internal.order-review.approve-modal";
import { useProvisionOrder } from "@/features/internal/order-review/hooks/use-order-review";
import type { InternalOrderItem } from "@/features/internal/order-review/types/order-review.type";
import { formatUtcDateTime, getPreferredUserTimezone } from "@/shared/utils/formatter/date.formatter";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { CheckCircle2Icon, MapPlusIcon } from "lucide-react";
import { useMemo, type ReactNode } from "react";

export type InternalOrderReviewDetailTriggerProps = {
  modalKey?: string;
  order: InternalOrderItem;
  children?: ReactNode;
};

export const InternalOrderReviewDetailTrigger = (
  props: InternalOrderReviewDetailTriggerProps,
) => {
  const { modalKey: customModalKey, order, children } = props;
  const key = customModalKey || `detail-order-${order.orderId}`;

  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: key,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"lg"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <InternalOrderReviewDetailModalContent
        order={order}
        close={close}
      />
    </Modal.Root>
  );
};

type InternalOrderReviewDetailModalContentProps = {
  order: InternalOrderItem;
  close: () => void;
};

const InternalOrderReviewDetailModalContent = (
  props: InternalOrderReviewDetailModalContentProps,
) => {
  const { order, close } = props;
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Mutations
  const provisionMutation = useProvisionOrder();

  const isPaid = order.status === "paid";
  const isPending = order.status === "pending_review";

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>{"Detail Permohonan Pesanan"}</Modal.Title>
          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {`ID Pesanan: ${order.orderId}`}
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          {/* Metadata */}
          <VStack
            align={"stretch"}
            gap={"xs"}
            p={"sm"}
            bg={"bg.subtle"}
            rounded={"md"}
            border={"1px solid"}
            borderColor={"border.subtle"}
          >
            <HStack justify={"space-between"}>
              <P fontSize={"xs"} color={"fg.muted"}>{"Pemohon:"}</P>
              <P fontWeight={"semibold"} fontSize={"xs"}>{order.mitraName}</P>
            </HStack>
            <HStack justify={"space-between"}>
              <P fontSize={"xs"} color={"fg.muted"}>{"Metode Seleksi:"}</P>
              <SelectionTypeBadge size={"xs"}>{order.selectionType}</SelectionTypeBadge>
            </HStack>
            <HStack justify={"space-between"}>
              <P fontSize={"xs"} color={"fg.muted"}>{"Status:"}</P>
              <OrderStatusBadge size={"xs"}>{order.status}</OrderStatusBadge>
            </HStack>
            <HStack justify={"space-between"}>
              <P fontSize={"xs"} color={"fg.muted"}>{"Diajukan Pada:"}</P>
              <P fontSize={"xs"}>
                {formatUtcDateTime(order.createdAt, preferredTimezone)}
              </P>
            </HStack>
          </VStack>

          {/* Layer List */}
          <VStack align={"stretch"} gap={"xs"}>
            <P fontWeight={"semibold"} fontSize={"sm"}>
              {`Daftar Layer Spasial (${order.items.length})`}
            </P>

            {(order.items ?? []).map((item, idx) => {
              const previewUrl =
                item.previewWmsUrl ||
                item.wmsUrl ||
                (item.sourceLayerId ? `/api/proxy/wms?layerId=${item.sourceLayerId}` : "");

              return (
                <VStack
                  key={item.id || idx}
                  align={"stretch"}
                  p={"sm"}
                  border={"1px solid"}
                  borderColor={"border.subtle"}
                  rounded={"md"}
                  gap={"xs"}
                >
                  <HStack justify={"space-between"}>
                    <VStack align={"start"} gap={0}>
                      <P fontWeight={"medium"} fontSize={"sm"}>{item.sourceLayerTitle}</P>
                      <HStack gap={"xs"} mt={"2xs"}>
                        <BasisIgtBadge>{item.spatialBasis}</BasisIgtBadge>
                      </HStack>
                    </VStack>

                    <VStack align={"end"} gap={0}>
                      <P fontSize={"xs"} color={"fg.muted"}>
                        {item.spatialBasis === "kawasan"
                          ? `${item.areaHa ?? 0} Ha (${item.featuresCount} fitur)`
                          : `${item.featuresCount} Bidang`}
                      </P>
                      <P fontWeight={"semibold"} fontSize={"sm"} color={"brand.fg"}>
                        {formatCurrency(item.subtotalPrice ?? 0)}
                      </P>
                    </VStack>
                  </HStack>

                  {previewUrl && (
                    <HStack
                      gap={"xs"}
                      bg={"bg.subtle"}
                      p={1.5}
                      rounded={"sm"}
                      border={"1px solid"}
                      borderColor={"border.subtle"}
                    >
                      <P fontSize={"xs"} color={"fg.muted"}>{"WMS Volatil:"}</P>
                      <P fontSize={"xs"} fontFamily={"mono"} flex={1} truncate color={"fg.default"}>
                        {previewUrl}
                      </P>
                      <ClipboardButton
                        value={previewUrl}
                        variant={"ghost"}
                        size={"xs"}
                        aria-label={"Salin URL WMS"}
                      />
                    </HStack>
                  )}
                </VStack>
              );
            })}
          </VStack>

          <Separator />

          <HStack justify={"space-between"} px={"xs"}>
            <P fontWeight={"semibold"}>{"Total Estimasi PNBP"}</P>
            <P fontWeight={"bold"} fontSize={"md"} color={"green.500"}>
              {formatCurrency(order.totalPrice ?? 0)}
            </P>
          </HStack>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <HStack justify={"end"} gap={"sm"} w={"full"}>
          <Button variant={"outline"} onClick={close}>
            {"Tutup"}
          </Button>

          {isPaid && (
            <Button
              primary={true}
              colorPalette={"blue"}
              loading={provisionMutation.isPending}
              onClick={() => {
                provisionMutation.mutate(
                  {
                    orderId: order.orderId,
                  },
                  {
                    onSuccess: () => {
                      close();
                    },
                  },
                );
              }}
            >
              <AppIcon icon={MapPlusIcon} />
              {"Create Service WMS"}
            </Button>
          )}

          {isPending && (
            <InternalOrderReviewApproveTrigger
              order={order}
              modalKey={`approve-from-detail-${order.orderId}`}
              onSuccessRedirect={close}
            >
              <Button colorPalette={"green"}>
                <AppIcon icon={CheckCircle2Icon} />
                {"Setujui Permohonan"}
              </Button>
            </InternalOrderReviewApproveTrigger>
          )}
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
