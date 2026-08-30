// src/features/internal/batch-review/components/internal.batch-review.reject-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useRejectBatch } from "@/features/internal/batch-review/hooks/use-batch-review";
import type { InternalBatchItem } from "@/features/internal/batch-review/types/batch-review.type";
import { XCircleIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

export type InternalBatchReviewRejectTriggerProps = {
  modalKey?: string;
  batch: InternalBatchItem;
  children?: ReactNode;
};

export const InternalBatchReviewRejectTrigger = (
  props: InternalBatchReviewRejectTriggerProps,
) => {
  const { modalKey: customModalKey, batch, children } = props;
  const key = customModalKey || `reject-batch-${batch.batchId}`;

  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: key,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"sm"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <InternalBatchReviewRejectModalContent batch={batch} close={close} />
    </Modal.Root>
  );
};

type InternalBatchReviewRejectModalContentProps = {
  batch: InternalBatchItem;
  close: () => void;
};

const InternalBatchReviewRejectModalContent = (
  props: InternalBatchReviewRejectModalContentProps,
) => {
  const { batch, close } = props;
  const [reason, setReason] = useState("");
  const rejectMutation = useRejectBatch();

  const handleReject = () => {
    if (!reason.trim()) return;
    rejectMutation.mutate(
      {
        batchId: batch.batchId,
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          close();
        },
      },
    );
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"xs"}>
          <Modal.Title>{"Tolak Permohonan Batch"}</Modal.Title>

          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {`Batch ID: ${batch.batchId} (${batch.mitraName})`}
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          <P fontSize={"sm"} color={"fg.muted"}>
            {
              "Berikan alasan penolakan yang jelas. Catatan ini akan dikirimkan langsung ke kotak masuk notifikasi mitra pemohon."
            }
          </P>

          <Field
            label={"Alasan Penolakan"}
            helperText={
              "Contoh: Area AOI tumpang tindih dengan kawasan lindung nasional / data tidak memenuhi ketentuan"
            }
          >
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={"Tuliskan alasan penolakan secara detail..."}
              rows={4}
            />
          </Field>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"sm"} w={"full"}>
          <Button
            variant={"solid"}
            colorPalette={"red"}
            disabled={!reason.trim() || rejectMutation.isPending}
            loading={rejectMutation.isPending}
            onClick={handleReject}
          >
            <AppIcon icon={XCircleIcon} />
            {"Tolak Batch"}
          </Button>

          <Button variant={"outline"} onClick={close}>
            {"Batal"}
          </Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
