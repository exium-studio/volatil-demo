// src/features/internal/mitra-registration/components/internal.mitra-registration.approve-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
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
      size={"lg"}
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

  // Stores
  const { theme } = useThemeStore();

  // States
  const [contractFiles, setContractFiles] = useState<File[]>([]);
  const [workspaceInteropUrl, setWorkspaceInteropUrl] = useState<string>("");

  // Mutations
  const approveMutation = useApproveMitraRegistration();

  // Derived Values — Internal GeoServer workspace URL to be registered in INTEROP Pusdatin
  const workspaceSlug = (
    registration.organizationName ||
    registration.namaInstansi ||
    `mitra_${registration.id}`
  )
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");

  const internalWorkspaceUrl = `https://geoserver.internal.volatil.atrbpn.go.id/geoserver/${workspaceSlug}/ows`;

  // Handlers
  const handleApprove = () => {
    if (!contractFiles[0] || !workspaceInteropUrl.trim()) return;

    approveMutation.mutate(
      {
        id: registration.id,
        contractDocument: contractFiles[0],
        workspaceInteropUrl: workspaceInteropUrl.trim(),
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

  const isSubmitDisabled =
    !contractFiles[0] ||
    !workspaceInteropUrl.trim() ||
    approveMutation.isPending;

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
                "Salin URL Workspace GeoServer internal di bawah, buka aplikasi INTEROP Pusdatin ATR/BPN untuk mendaftarkan workspace kemitraan dan mendapatkan link proxy wrapper resmi, lalu masukkan link proxy tersebut ke formulir di bawah ini."
              }
            </Alert.Description>
          </Alert.Root>

          {/* Internal GeoServer Workspace URL */}
          <VStack align={"stretch"} gap={1}>
            <P fontSize={"xs"} color={"fg.muted"}>
              {"URL Workspace GeoServer Volatil (Internal):"}
            </P>

            <HStack
              gap={"md"}
              bg={"bg.panel"}
              p={"md"}
              rounded={theme.radii.component}
              border={"1px solid"}
              borderColor={"border.subtle"}
            >
              <P
                fontFamily={"mono"}
                fontSize={"xs"}
                flex={1}
                color={"fg.default"}
              >
                {internalWorkspaceUrl}
              </P>

              <ClipboardButton
                value={internalWorkspaceUrl}
                variant={"ghost"}
                size={"xs"}
                aria-label={"Salin URL Workspace Internal"}
              />
            </HStack>
          </VStack>

          {/* Input INTEROP Workspace Proxy URL */}
          <Field
            variant={"default"}
            label={"URL Workspace Resmi (INTEROP Pusdatin - Wajib)"}
          >
            <Textarea
              placeholder={
                "https://geoportal.atrbpn.go.id/interop/wms?workspace=..."
              }
              value={workspaceInteropUrl}
              onChange={(e) => setWorkspaceInteropUrl(e.target.value)}
              minH={"90px"}
            />
          </Field>

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
