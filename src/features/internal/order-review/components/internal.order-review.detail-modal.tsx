// src\features\internal\order-review\components\internal.order-review.detail-modal.tsx

// src\features\internal\order-review\components\internal.order-review.detail-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { InternalOrderReviewApproveTrigger } from "@/features/internal/order-review/components/internal.order-review.approve-modal";
import { useProvisionOrder } from "@/features/internal/order-review/hooks/use-order-review";
import type {
  InternalOrderReviewDetailModalContentProps,
  InternalOrderReviewDetailTriggerProps,
} from "@/features/internal/order-review/types/order-review.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { buildWmsProxyUrl } from "@/shared/utils/url/wms-proxy.utils";
import { CheckCircleIcon, LoaderIcon, MapPlusIcon } from "lucide-react";
import { useMemo } from "react";

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

      <InternalOrderReviewDetailModalContent order={order} close={close} />
    </Modal.Root>
  );
};

const InternalOrderReviewDetailModalContent = (
  props: InternalOrderReviewDetailModalContentProps,
) => {
  const { order, close } = props;
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);
  const provisionOrderMutation = useProvisionOrder();

  const isPaid = order.status === "paid";
  const isProcessing = order.status === "processing";
  const isPending = order.status === "pending_review";

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>{"Detail Permintaan Pesanan"}</Modal.Title>
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
              <P fontSize={"xs"} color={"fg.muted"}>
                {"Pemohon:"}
              </P>
              <P fontWeight={"semibold"} fontSize={"xs"}>
                {order.mitraName}
              </P>
            </HStack>
            <HStack justify={"space-between"}>
              <P fontSize={"xs"} color={"fg.muted"}>
                {"Metode Seleksi:"}
              </P>
              <SelectionTypeBadge size={"xs"}>
                {order.selectionType}
              </SelectionTypeBadge>
            </HStack>
            <HStack justify={"space-between"}>
              <P fontSize={"xs"} color={"fg.muted"}>
                {"Status Pesanan:"}
              </P>
              <OrderStatusBadge size={"xs"}>{order.status}</OrderStatusBadge>
            </HStack>
            <HStack justify={"space-between"}>
              <P fontSize={"xs"} color={"fg.muted"}>
                {"Waktu Dibuat:"}
              </P>
              <P fontSize={"xs"}>
                {formatUtcDateTime(order.createdAt, preferredTimezone)}
              </P>
            </HStack>
          </VStack>

          {/* Layer List */}
          <VStack align={"stretch"} gap={"xs"}>
            <P fontSize={"xs"} fontWeight={"semibold"}>
              {`Daftar Layer IGT (${order.items.length})`}
            </P>

            {order.items.map((item) => {
              const previewUrl =
                item.previewWmsUrl ||
                item.wmsUrl ||
                (item.sourceLayerId
                  ? buildWmsProxyUrl(`/api/proxy/wms?layerId=${item.sourceLayerId}`)
                  : "");

              return (
                <VStack
                  key={item.id}
                  align={"stretch"}
                  gap={"2xs"}
                  p={"xs"}
                  bg={"bg.subtle"}
                  rounded={"sm"}
                  border={"1px solid"}
                  borderColor={"border.subtle"}
                >
                  <HStack justify={"space-between"} align={"center"}>
                    <HStack gap={"xs"}>
                      <IgtBasisBadge size={"xs"}>
                        {item.spatialBasis}
                      </IgtBasisBadge>
                      <P fontSize={"xs"} fontWeight={"medium"}>
                        {item.sourceLayerTitle}
                      </P>
                    </HStack>
                    <P fontSize={"xs"} fontWeight={"semibold"}>
                      {formatCurrency(item.subtotalPrice ?? 0)}
                    </P>
                  </HStack>

                  <HStack justify={"space-between"} align={"center"}>
                    <P fontSize={"2xs"} color={"fg.subtle"}>
                      {item.sourceLayerId}
                    </P>
                    <P fontSize={"2xs"} color={"fg.muted"}>
                      {item.spatialBasis === "bidang"
                        ? `${item.featuresCount} bidang`
                        : `${item.areaHa ?? 0} ha`}
                    </P>
                  </HStack>

                  {previewUrl && (
                    <HStack
                      justify={"space-between"}
                      align={"center"}
                      bg={"bg.canvas"}
                      p={"2xs"}
                      rounded={"xs"}
                    >
                      <P fontSize={"2xs"} color={"fg.subtle"} truncate>
                        {previewUrl}
                      </P>
                      <ClipboardButton
                        value={previewUrl}
                        variant={"ghost"}
                        size={"2xs"}
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
              loading={provisionOrderMutation.isPending}
              onClick={() => {
                provisionOrderMutation.mutate(
                  { orderId: order.orderId },
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

          {isProcessing && (
            <Button variant={"outline"} disabled={true}>
              <AppIcon icon={LoaderIcon} className={"animate-spin"} />
              {"Menyiapkan Layanan WMS..."}
            </Button>
          )}

          {isPending && (
            <InternalOrderReviewApproveTrigger
              order={order}
              modalKey={`approve-from-detail-${order.orderId}`}
              onSuccessRedirect={close}
            >
              <Button colorPalette={"green"}>
                <AppIcon icon={CheckCircleIcon} />
                {"Setujui Permintaan"}
              </Button>
            </InternalOrderReviewApproveTrigger>
          )}
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
