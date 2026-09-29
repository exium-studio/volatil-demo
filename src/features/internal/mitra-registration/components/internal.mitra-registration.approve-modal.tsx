// src/features/internal/mitra-registration/components/internal.mitra-registration.approve-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useApproveMitraRegistration } from "@/features/internal/mitra-registration/hooks/use-mitra-registration.query";
import type {
  InternalMitraRegistrationApproveModalContentProps,
  InternalMitraRegistrationApproveTriggerProps,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";
import { back } from "@/shared/utils/client/navigation";
import { CheckCircleIcon, InfoIcon } from "lucide-react";
import { useState } from "react";

export const InternalMitraRegistrationApproveTrigger = (
  props: InternalMitraRegistrationApproveTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey,
    registration,
    children,
    onSuccessRedirect,
  } = props;
  const key = customModalKey || `approve-mitra-reg-${registration.id}`;

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
      size={"md"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <InternalMitraRegistrationApproveModalContent
        registration={registration}
        isOpen={isOpen}
        onSuccessRedirect={onSuccessRedirect}
        close={close}
      />
    </Modal.Root>
  );
};

export const InternalMitraRegistrationApproveModalContent = (
  props: InternalMitraRegistrationApproveModalContentProps & {
    close?: () => void;
  },
) => {
  // Props
  const { registration, isOpen, onSuccessRedirect, close } = props;

  // States
  const [contractFiles, setContractFiles] = useState<File[]>([]);

  // Mutations
  const approveMutation = useApproveMitraRegistration();

  // Handlers
  const handleApprove = () => {
    if (!contractFiles[0]) return;

    approveMutation.mutate(
      {
        id: registration.id,
        contractDocument: contractFiles[0],
      },
      {
        onSuccess: () => {
          if (close) {
            close();
          } else if (isOpen) {
            back();
          }
          onSuccessRedirect?.();
        },
      },
    );
  };

  const handleClose = () => {
    if (close) {
      close();
    } else {
      back();
    }
  };

  const isSubmitDisabled = !contractFiles[0] || approveMutation.isPending;

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>{"Verifikasi & Setujui Pendaftaran Mitra"}</Modal.Title>

          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {`${registration.organizationName ?? registration.namaInstansi} (${registration.registrationNumber})`}
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
            <AppIcon icon={InfoIcon} />
            <Alert.Description>
              {
                "Pastikan seluruh dokumen legalitas dan proposal teknis pemohon telah diverifikasi. Unggah dokumen kontrak kemitraan resmi untuk menyelesaikan proses aktivasi mitra."
              }
            </Alert.Description>
          </Alert.Root>

          {/* File input for contract document */}
          <Field
            variant={"default"}
            label={"Unggah Berkas Kontrak Resmi (Wajib)"}
          >
            <Box w={"full"}>
              <FileInput
                accept={[".pdf", ".doc", ".docx"]}
                maxFiles={1}
                onFileAccept={(details) => setContractFiles(details.files)}
              />
            </Box>
          </Field>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            variant={"solid"}
            primary
            colorPalette={"green"}
            disabled={isSubmitDisabled}
            loading={approveMutation.isPending}
            onClick={handleApprove}
            w={"full"}
          >
            <AppIcon icon={CheckCircleIcon} />
            {"Setujui & Terbitkan Kontrak"}
          </Button>

          <Button onClick={handleClose} w={"full"}>
            {"Batal"}
          </Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};

