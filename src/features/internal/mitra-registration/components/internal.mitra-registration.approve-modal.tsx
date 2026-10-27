// src/features/internal/mitra-registration/components/internal.mitra-registration.approve-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useApproveMitraRegistration } from "@/features/internal/mitra-registration/hooks/use-mitra-registration.query";
import type {
  InternalMitraRegistrationApproveModalContentProps,
  InternalMitraRegistrationApproveTriggerProps,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";
import { back } from "@/shared/utils/client/navigation";
import { CheckCircleIcon, InfoIcon, KeyRoundIcon } from "lucide-react";
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
  const [ssoUsername, setSsoUsername] = useState<string>(
    registration.ssoUsername ?? registration.email ?? "",
  );
  const [ssoPassword, setSsoPassword] = useState<string>(
    registration.ssoPassword ?? "",
  );

  // Mutations
  const approveMutation = useApproveMitraRegistration();

  // Handlers
  const handleGeneratePassword = () => {
    const chars =
      "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%&*";
    let generated = "";
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSsoPassword(generated);
  };

  const handleApprove = () => {
    if (!contractFiles[0] || !ssoUsername.trim() || !ssoPassword.trim()) return;

    approveMutation.mutate(
      {
        id: registration.id,
        contractDocument: contractFiles[0],
        ssoUsername: ssoUsername.trim(),
        ssoPassword: ssoPassword.trim(),
      },
      {
        onSuccess: () => {
          if (onSuccessRedirect) {
            onSuccessRedirect();
          } else if (close) {
            close();
          } else if (isOpen) {
            back();
          }
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

  // Derived Values
  const isSubmitDisabled =
    !contractFiles[0] ||
    !ssoUsername.trim() ||
    !ssoPassword.trim() ||
    approveMutation.isPending;

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>{"Verifikasi & Setujui Pendaftaran Mitra"}</Modal.Title>

          <P fontSize={"xs"} textAlign={"center"} color={"fg.muted"}>
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
                "Pastikan seluruh dokumen legalitas dan proposal teknis pemohon telah diverifikasi. Unggah dokumen kontrak resmi dan masukkan kredensial akun SSO yang akan dikirimkan ke mitra."
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

          {/* SSO Username / Email */}
          <Field
            variant={"default"}
            label={"Email / Username Akun SSO (Wajib)"}
            helperText={
              "Kredensial SSO ini akan dikirimkan langsung ke email resmi mitra."
            }
          >
            <Input
              value={ssoUsername}
              onChange={(e) => setSsoUsername(e.target.value)}
              placeholder={"Masukkan email atau username SSO..."}
            />
          </Field>

          {/* SSO Password */}
          <Field
            variant={"default"}
            label={"Kata Sandi Akun SSO (Wajib)"}
            helperText={"Kata sandi untuk akses awal sistem SSO oleh mitra."}
          >
            <HStack gap={"xs"} w={"full"}>
              <Box flex={1}>
                <PasswordInput
                  value={ssoPassword}
                  onChange={(e) => setSsoPassword(e.target.value)}
                  placeholder={"Masukkan kata sandi SSO..."}
                />
              </Box>
              <Button
                type={"button"}
                variant={"outline"}
                size={"sm"}
                onClick={handleGeneratePassword}
              >
                <AppIcon icon={KeyRoundIcon} />
                {"Acak"}
              </Button>
            </HStack>
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
