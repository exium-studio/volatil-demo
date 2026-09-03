// src/features/internal/mitra-registration/components/internal.mitra-registration.approve-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useApproveMitraRegistration } from "@/features/internal/mitra-registration/hooks/use-mitra-registration.query";
import type { InternalMitraRegistrationItem } from "@/features/internal/mitra-registration/types/mitra-registration.type";
import { back } from "@/shared/utils/client/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { useState, type ReactNode } from "react";

export type InternalMitraRegistrationApproveTriggerProps = {
  modalKey?: string;
  registration: InternalMitraRegistrationItem;
  children?: ReactNode;
  onSuccessRedirect?: () => void;
};

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
      />
    </Modal.Root>
  );
};

type InternalMitraRegistrationApproveModalContentProps = {
  registration: InternalMitraRegistrationItem;
  isOpen: boolean;
  onSuccessRedirect?: () => void;
};

const InternalMitraRegistrationApproveModalContent = (
  props: InternalMitraRegistrationApproveModalContentProps,
) => {
  // Props
  const { registration, isOpen, onSuccessRedirect } = props;

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

        <VStack gap={"2xs"}>
          <Modal.Title>{"Setujui Permohonan Mitra"}</Modal.Title>

          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {`${registration.organizationName ?? registration.namaInstansi} (${registration.registrationNumber})`}
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          <Alert.Root status={"info"} size={"sm"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>
                {
                  "Menyetujui permohonan ini akan otomatis mengaktifkan akun kemitraan di Volatil dan mengirimkan email pemberitahuan beserta Berkas Kontrak resmi ke mitra."
                }
              </Alert.Title>
            </Alert.Content>
          </Alert.Root>

          <Field
            label={"Unggah Berkas Kontrak Resmi (Wajib)"}
            helperText={"Format berkas: PDF atau Dokumen resmi (Maks. 10MB)"}
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
            colorPalette={"green"}
            disabled={!contractFiles[0] || approveMutation.isPending}
            loading={approveMutation.isPending}
            onClick={handleApprove}
          >
            <AppIcon icon={CheckCircle2Icon} />
            {"Setujui & Terbitkan Kontrak"}
          </Button>

          <Button onClick={back}>{"Batal"}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
