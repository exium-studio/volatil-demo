// src/features/internal/batch-review/components/internal.batch-review.detail-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { BasisIgtBadge } from "@/features/shared/components/basis-igt.badge";
import { BatchStatusBadge } from "@/features/shared/components/batch-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { InternalBatchReviewApproveTrigger } from "@/features/internal/batch-review/components/internal.batch-review.approve-modal";
import { useProvisionOrder } from "@/features/internal/batch-review/hooks/use-batch-review";
import type { InternalBatchItem } from "@/features/internal/batch-review/types/batch-review.type";
import { formatUtcDateTime, getPreferredUserTimezone } from "@/shared/utils/formatter/date.formatter";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { CheckCircle2Icon, SparklesIcon } from "lucide-react";
import { useMemo, type ReactNode } from "react";

export type InternalBatchReviewDetailTriggerProps = {
  modalKey?: string;
  batch: InternalBatchItem;
  children?: ReactNode;
};

export const InternalBatchReviewDetailTrigger = (
  props: InternalBatchReviewDetailTriggerProps,
) => {
  const { modalKey: customModalKey, batch, children } = props;
  const key = customModalKey || `detail-batch-${batch.batchId}`;

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

      <InternalBatchReviewDetailModalContent
        batch={batch}
        close={close}
      />
    </Modal.Root>
  );
};

type InternalBatchReviewDetailModalContentProps = {
  batch: InternalBatchItem;
  close: () => void;
};

const InternalBatchReviewDetailModalContent = (
  props: InternalBatchReviewDetailModalContentProps,
) => {
  const { batch, close } = props;
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Mutations
  const provisionMutation = useProvisionOrder();

  const isPaid = batch.status === "paid";
  const isPending = batch.status === "pending_review";

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>{"Detail Permohonan Batch Interop"}</Modal.Title>
          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {`ID Batch: ${batch.batchId}`}
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
              <P fontWeight={"semibold"} fontSize={"xs"}>{batch.mitraName}</P>
            </HStack>
            <HStack justify={"space-between"}>
              <P fontSize={"xs"} color={"fg.muted"}>{"Metode Seleksi:"}</P>
              <SelectionTypeBadge size={"xs"}>{batch.selectionType}</SelectionTypeBadge>
            </HStack>
            <HStack justify={"space-between"}>
              <P fontSize={"xs"} color={"fg.muted"}>{"Status:"}</P>
              <BatchStatusBadge size={"xs"}>{batch.status}</BatchStatusBadge>
            </HStack>
            <HStack justify={"space-between"}>
              <P fontSize={"xs"} color={"fg.muted"}>{"Diajukan Pada:"}</P>
              <P fontSize={"xs"}>
                {formatUtcDateTime(batch.createdAt, preferredTimezone)}
              </P>
            </HStack>
          </VStack>

          {/* Layer List */}
          <VStack align={"stretch"} gap={"xs"}>
            <P fontWeight={"semibold"} fontSize={"sm"}>
              {`Daftar Layer Spasial (${batch.items.length})`}
            </P>

            {(batch.items ?? []).map((item, idx) => {
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
              {formatCurrency(batch.totalPrice ?? 0)}
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
                    orderId: batch.orderId ?? batch.batchId,
                    batchId: batch.batchId,
                  },
                  {
                    onSuccess: () => {
                      close();
                    },
                  },
                );
              }}
            >
              <AppIcon icon={SparklesIcon} />
              {"Create Service WMS"}
            </Button>
          )}

          {isPending && (
            <InternalBatchReviewApproveTrigger
              batch={batch}
              modalKey={`approve-from-detail-${batch.batchId}`}
              onSuccessRedirect={close}
            >
              <Button colorPalette={"green"}>
                <AppIcon icon={CheckCircle2Icon} />
                {"Setujui Permohonan"}
              </Button>
            </InternalBatchReviewApproveTrigger>
          )}
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
