// src/features/internal/mitra-registration/components/internal.mitra-registration.resend-sso-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import {
  useInternalMitraRegistrationDetailQuery,
  useResendMitraSsoCredentials,
} from "@/features/internal/mitra-registration/hooks/use-mitra-registration.query";
import type {
  InternalMitraRegistrationItem,
  InternalMitraRegistrationResendSsoModalContentProps,
  InternalMitraRegistrationResendSsoTriggerProps,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";
import { back } from "@/shared/utils/client/navigation";
import { InfoIcon, KeyRoundIcon, MailIcon } from "lucide-react";
import { useState } from "react";

export const InternalMitraRegistrationResendSsoTrigger = (
  props: InternalMitraRegistrationResendSsoTriggerProps,
) => {
  // Props
  const { modalKey: customModalKey, registration, children, onSuccess } = props;
  const key = customModalKey || `resend-sso-${registration.id}`;

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

      <InternalMitraRegistrationResendSsoModalContent
        registration={registration}
        isOpen={isOpen}
        onSuccess={onSuccess}
        close={close}
      />
    </Modal.Root>
  );
};

export const InternalMitraRegistrationResendSsoModalContent = (
  props: InternalMitraRegistrationResendSsoModalContentProps & {
    close?: () => void;
  },
) => {
  // Props
  const { registration, isOpen, onSuccess, close } = props;

  // Queries
  const { data: detailData, isLoading: isDetailLoading } =
    useInternalMitraRegistrationDetailQuery(isOpen ? registration.id : "");

  const activeRegistration = detailData ?? registration;

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>{"Kirim Kredensial Akun SSO Mitra"}</Modal.Title>

          <P fontSize={"xs"} textAlign={"center"} color={"fg.muted"}>
            {`${activeRegistration.organizationName ?? activeRegistration.namaInstansi} (${activeRegistration.registrationNumber})`}
          </P>
        </VStack>
      </Modal.Header>

      {/* Render form using key-based mount to initialize state cleanly when detail data is ready */}
      <InternalMitraRegistrationResendSsoForm
        key={`${activeRegistration.id}-${activeRegistration.ssoPassword ?? ""}-${isDetailLoading}`}
        registration={activeRegistration}
        close={close}
        onSuccess={onSuccess}
      />
    </Modal.Content>
  );
};

const InternalMitraRegistrationResendSsoForm = (props: {
  registration: InternalMitraRegistrationItem;
  close?: () => void;
  onSuccess?: () => void;
}) => {
  // Props
  const { registration, close, onSuccess } = props;

  // States
  const [ssoUsername, setSsoUsername] = useState<string>(
    registration.ssoUsername ?? "",
  );
  const [ssoPassword, setSsoPassword] = useState<string>(
    registration.ssoPassword ?? "",
  );

  // Mutations
  const resendMutation = useResendMitraSsoCredentials();

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

  const handleSubmit = () => {
    if (!ssoUsername.trim()) return;

    resendMutation.mutate(
      {
        id: registration.id,
        ssoUsername: ssoUsername.trim(),
        ssoPassword: ssoPassword.trim() || undefined,
      },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          if (close) {
            close();
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
  const isSubmitDisabled = !ssoUsername.trim() || resendMutation.isPending;

  return (
    <>
      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
            <AppIcon icon={InfoIcon} />
            <Alert.Description>
              {
                "Kredensial SSO berikut akan dikirimkan langsung ke email resmi mitra. Anda dapat memasukkan kata sandi baru untuk mereset/me-roll akun SSO mitra, atau biarkan kosong untuk mengirim ulang kata sandi saat ini."
              }
            </Alert.Description>
          </Alert.Root>

          {/* SSO Username Input */}
          <Field label={"Username Akun SSO"}>
            <Input
              value={ssoUsername}
              onChange={(e) => setSsoUsername(e.target.value)}
              placeholder={"Masukkan username SSO..."}
            />
          </Field>

          {/* SSO Password Input */}
          <Field
            label={"Kata Sandi Akun SSO (Opsional)"}
            helperText={
              "Kosongkan jika ingin mengirim ulang kata sandi saat ini. Masukkan atau klik 'Acak' jika ingin mereset/me-roll kata sandi baru."
            }
          >
            <HStack gap={"xs"} w={"full"}>
              <Box flex={1}>
                <PasswordInput
                  value={ssoPassword}
                  onChange={(e) => setSsoPassword(e.target.value)}
                  placeholder={"Kosongkan untuk pakai sandi saat ini, atau buat yang baru..."}
                />
              </Box>

              <Button
                variant={"outline"}
                h={"60px"}
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
            colorPalette={"blue"}
            disabled={isSubmitDisabled}
            loading={resendMutation.isPending}
            onClick={handleSubmit}
            w={"full"}
          >
            <AppIcon icon={MailIcon} />
            {"Kirim Kredensial ke Email"}
          </Button>

          <Button onClick={handleClose} w={"full"}>
            {"Batal"}
          </Button>
        </VStack>
      </Modal.Footer>
    </>
  );
};
