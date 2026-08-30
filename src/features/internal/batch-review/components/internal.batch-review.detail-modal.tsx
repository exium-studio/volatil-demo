// src/features/internal/batch-review/components/internal.batch-review.detail-modal.tsx

import { Badge } from "@/design-system/components/typography/ui/badge";
import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { BasisIgtBadge } from "@/features/shared/components/basis-igt.badge";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { InternalBatchReviewRejectTrigger } from "@/features/internal/batch-review/components/internal.batch-review.reject-modal";
import { useApproveBatch } from "@/features/internal/batch-review/hooks/use-batch-review";
import type { InternalBatchItem } from "@/features/internal/batch-review/types/batch-review.type";
import { formatUtcDateTime, getPreferredUserTimezone } from "@/shared/utils/formatter/date.formatter";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
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
  const approveMutation = useApproveBatch();

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
          {/* Metadata Mitra */}
          <HStack justify={"space-between"} p={"sm"} bg={"bg.subtle"} rounded={"md"}>
            <VStack align={"start"} gap={0}>
              <P fontSize={"xs"} color={"fg.subtle"}>{"Pemohon / Mitra"}</P>
              <P fontWeight={"semibold"}>{batch.mitraName}</P>
              <P fontSize={"xs"} color={"fg.muted"}>{batch.mitraId}</P>
            </VStack>

            <VStack align={"end"} gap={0}>
              <P fontSize={"xs"} color={"fg.subtle"}>{"Waktu Pengajuan"}</P>
              <P fontSize={"xs"}>{formatUtcDateTime(batch.createdAt, preferredTimezone)}</P>
              <Badge
                colorPalette={
                  batch.status === "approved"
                    ? "green"
                    : batch.status === "rejected"
                      ? "red"
                      : "blue"
                }
                mt={"xs"}
              >
                {batch.status === "pending_review"
                  ? "Menunggu Persetujuan"
                  : batch.status === "approved"
                    ? "Disetujui"
                    : "Ditolak"}
              </Badge>
            </VStack>
          </HStack>

          {/* List Layer Item */}
          <P fontSize={"sm"} fontWeight={"semibold"}>{"Daftar Layer & Potongan Data"}</P>

          <VStack align={"stretch"} gap={"xs"}>
            {batch.items.map((item, idx) => (
              <HStack
                key={item.id || idx}
                justify={"space-between"}
                p={"sm"}
                border={"1px solid"}
                borderColor={"border.subtle"}
                rounded={"md"}
              >
                <VStack align={"start"} gap={0}>
                  <P fontWeight={"medium"} fontSize={"sm"}>{item.sourceLayerTitle}</P>
                  <HStack gap={"xs"} mt={"2xs"}>
                    <BasisIgtBadge>{item.spatialBasis}</BasisIgtBadge>
                    <Badge variant={"outline"} size={"xs"}>{item.selectionType}</Badge>
                  </HStack>
                </VStack>

                <VStack align={"end"} gap={0}>
                  <P fontSize={"xs"} color={"fg.muted"}>
                    {item.spatialBasis === "kawasan"
                      ? `${item.areaHa ?? 0} Ha (${item.featuresCount} fitur)`
                      : `${item.featuresCount} Bidang`}
                  </P>
                  <P fontWeight={"semibold"} fontSize={"sm"} color={"brand.fg"}>
                    {formatCurrency(item.subtotalPrice)}
                  </P>
                </VStack>
              </HStack>
            ))}
          </VStack>

          <Separator />

          <HStack justify={"space-between"} px={"xs"}>
            <P fontWeight={"semibold"}>{"Total Estimasi PNBP"}</P>
            <P fontWeight={"bold"} fontSize={"md"} color={"green.500"}>
              {formatCurrency(batch.totalPrice)}
            </P>
          </HStack>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <HStack justify={"end"} gap={"sm"} w={"full"}>
          <Button variant={"outline"} onClick={close}>
            {"Tutup"}
          </Button>

          {isPending && (
            <>
              <InternalBatchReviewRejectTrigger batch={batch}>
                <Button colorPalette={"red"} variant={"outline"}>
                  <AppIcon icon={XCircleIcon} />
                  {"Tolak"}
                </Button>
              </InternalBatchReviewRejectTrigger>

              <ConfirmationTrigger
                modalKey={`approve-batch-${batch.batchId}`}
                title={"Setujui Permohonan Batch?"}
                description={`Apakah Anda yakin ingin menyetujui batch "${batch.batchId}" milik ${batch.mitraName}? Setelah disetujui, mitra dapat melanjutkan ke proses pembayaran dan layer hasil potong akan diaktifkan.`}
                confirmLabel={"Setujui Batch"}
                colorPalette={"green"}
                onConfirm={() => {
                  approveMutation.mutate(
                    { batchId: batch.batchId },
                    {
                      onSuccess: () => {
                        close();
                      },
                    },
                  );
                }}
              >
                <Button colorPalette={"green"}>
                  <AppIcon icon={CheckCircle2Icon} />
                  {"Setujui Batch"}
                </Button>
              </ConfirmationTrigger>
            </>
          )}
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
