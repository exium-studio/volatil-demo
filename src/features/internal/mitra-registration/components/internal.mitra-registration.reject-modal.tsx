// src/features/internal/mitra-registration/components/internal.mitra-registration.reject-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Field } from "@/design-system/components/input/ui/field";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useRejectMitraRegistration } from "@/features/internal/mitra-registration/hooks/use-mitra-registration.query";
import type { InternalMitraRegistrationItem } from "@/features/internal/mitra-registration/types/mitra-registration.type";
import { back } from "@/shared/utils/client/navigation";
import { XCircleIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

export type InternalMitraRegistrationRejectTriggerProps = {
  modalKey?: string;
  registration: InternalMitraRegistrationItem;
  children?: ReactNode;
  onSuccessRedirect?: () => void;
};

export const InternalMitraRegistrationRejectTrigger = (
  props: InternalMitraRegistrationRejectTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey,
    registration,
    children,
    onSuccessRedirect,
  } = props;
  const key = customModalKey || `reject-mitra-reg-${registration.id}`;

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

      <InternalMitraRegistrationRejectModalContent
        registration={registration}
        isOpen={isOpen}
        onSuccessRedirect={onSuccessRedirect}
      />
    </Modal.Root>
  );
};

type InternalMitraRegistrationRejectModalContentProps = {
  registration: InternalMitraRegistrationItem;
  isOpen: boolean;
  onSuccessRedirect?: () => void;
};

const InternalMitraRegistrationRejectModalContent = (
  props: InternalMitraRegistrationRejectModalContentProps,
) => {
  // Props
  const { registration, isOpen, onSuccessRedirect } = props;

  // States
  const [reason, setReason] = useState("");

  // Mutations
  const rejectMutation = useRejectMitraRegistration();

  // Handlers
  const handleReject = () => {
    if (!reason.trim()) return;

    rejectMutation.mutate(
      {
        id: registration.id,
        rejectionReason: reason.trim(),
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
          <Modal.Title>{"Tolak Permohonan Mitra"}</Modal.Title>

          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {`${registration.namaInstansi} (${registration.registrationNumber})`}
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
                  "Alasan penolakan ini akan dikirimkan langsung melalui email resmi kepada pemohon. Mohon jelaskan kekurangan berkas atau alasan penolakan secara jelas."
                }
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>

          <Field
            label={"Alasan Penolakan"}
            helperText={
              "Contoh: Dokumen DIK belum ditandatangani basah / NIB tidak sesuai bidang usaha"
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
            {"Tolak Permohonan"}
          </Button>

          <Button onClick={back}>{"Batal"}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
