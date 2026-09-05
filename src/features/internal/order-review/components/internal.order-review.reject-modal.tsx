// src/features/internal/order-review/components/internal.order-review.reject-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Field } from "@/design-system/components/input/ui/field";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useRejectOrder } from "@/features/internal/order-review/hooks/use-order-review";
import type {
  InternalOrderItem,
  InternalOrderReviewRejectModalContentProps,
} from "@/features/internal/order-review/types/order-review.type";
import { XCircleIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { P } from "@/design-system/components/typography/ui/p";
import { back } from "@/shared/utils/client/navigation";

type InternalOrderReviewRejectTriggerProps = {
  modalKey?: string;
  order: InternalOrderItem;
  children?: ReactNode;
  onSuccessRedirect?: () => void;
};

export const InternalOrderReviewRejectTrigger = (
  props: InternalOrderReviewRejectTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey,
    order,
    children,
    onSuccessRedirect,
  } = props;
  const key = customModalKey || `reject-order-${order.orderId}`;

  // Hooks
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

      <InternalOrderReviewRejectModalContent
        order={order}
        isOpen={isOpen}
        onSuccessRedirect={onSuccessRedirect}
      />
    </Modal.Root>
  );
};

const InternalOrderReviewRejectModalContent = (
  props: InternalOrderReviewRejectModalContentProps,
) => {
  // Props
  const { order, isOpen, onSuccessRedirect } = props;

  // States
  const [reason, setReason] = useState("");

  // Mutations
  const rejectMutation = useRejectOrder();

  // Handlers
  const handleReject = () => {
    if (!reason.trim()) return;
    rejectMutation.mutate(
      {
        orderId: order.orderId,
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          if (isOpen) back();
          onSuccessRedirect?.();
        },
      },
    );
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"xs"}>
          <Modal.Title>{"Tolak Permohonan Pesanan"}</Modal.Title>

          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {`ID Pesanan: ${order.orderId} (${order.mitraName})`}
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          <Alert.Root status={"warning"} size={"sm"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                {
                  "Alasan penolakan ini akan langsung masuk ke inbox notifikasi mitra pemohon. Pastikan alasan ditulis secara jelas dan akurat."
                }
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>

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
        <VStack gap={"xs"} w={"full"}>
          <Button
            variant={"solid"}
            colorPalette={"red"}
            disabled={!reason.trim() || rejectMutation.isPending}
            loading={rejectMutation.isPending}
            onClick={handleReject}
          >
            <AppIcon icon={XCircleIcon} />
            {"Tolak Pesanan"}
          </Button>

          <Button onClick={back}>{"Batal"}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
