// src/features/internal/mitra-registration/components/internal.mitra-registration.approve-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useApproveMitraRegistration } from "@/features/internal/mitra-registration/hooks/use-mitra-registration.query";
import {
  approveMitraRegistrationSchema,
  type ApproveMitraRegistrationFormValues,
  type InternalMitraRegistrationApproveModalContentProps,
  type InternalMitraRegistrationApproveTriggerProps,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";
import { back } from "@/shared/utils/client/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleIcon, InfoIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

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

  // Forms
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ApproveMitraRegistrationFormValues>({
    resolver: zodResolver(approveMitraRegistrationSchema),
    defaultValues: {
      contractFiles: [],
      ssoUsername: registration.ssoUsername ?? "",
      ssoPassword: registration.ssoPassword ?? "",
    },
    mode: "onChange",
  });

  // Mutations
  const approveMutation = useApproveMitraRegistration();

  const onSubmit = (values: ApproveMitraRegistrationFormValues) => {
    const contractDocument = values.contractFiles[0];
    if (!contractDocument) return;

    approveMutation.mutate(
      {
        id: registration.id,
        contractDocument,
        ssoUsername: values.ssoUsername.trim(),
        ssoPassword: values.ssoPassword.trim(),
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

      <VStack
        as={"form"}
        align={"stretch"}
        gap={0}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Modal.Body>
          <VStack align={"stretch"} gap={"md"}>
            <Alert.Root
              status={"info"}
              colorPalette={"blue"}
              variant={"subtle"}
            >
              <AppIcon icon={InfoIcon} />
              <Alert.Description>
                {`Pastikan seluruh dokumen legalitas dan proposal teknis pemohon telah diverifikasi. Unggah dokumen kontrak resmi dan masukkan kredensial akun SSO yang akan dikirimkan ke mitra.`}

                <Box mt={"md"}>
                  <P fontWeight={"semibold"} color={"blue.fg"}>
                    {`Email Mitra: ${registration.email}`}
                  </P>
                </Box>
              </Alert.Description>
            </Alert.Root>

            {/* File input for contract document */}
            <Field
              variant={"default"}
              label={"Unggah Berkas Kontrak Resmi (Wajib)"}
              invalid={Boolean(errors.contractFiles)}
              errorText={errors.contractFiles?.message}
            >
              <Box w={"full"}>
                <Controller
                  name={"contractFiles"}
                  control={control}
                  render={({ field }) => (
                    <FileInput
                      accept={[".pdf", ".doc", ".docx"]}
                      maxFiles={1}
                      value={field.value}
                      onFileAccept={(details) => {
                        field.onChange(details.files);
                      }}
                    />
                  )}
                />
              </Box>
            </Field>

            {/* SSO Username */}
            <Field
              label={"Username Akun SSO"}
              invalid={Boolean(errors.ssoUsername)}
              errorText={errors.ssoUsername?.message}
            >
              <Input
                {...register("ssoUsername")}
                placeholder={"Masukkan username SSO..."}
                w={"full"}
              />
            </Field>

            {/* SSO Password */}
            <Field
              label={"Kata Sandi Akun SSO"}
              invalid={Boolean(errors.ssoPassword)}
              errorText={errors.ssoPassword?.message}
            >
              <PasswordInput
                {...register("ssoPassword")}
                placeholder={"Masukkan kata sandi SSO..."}
                w={"full"}
              />
            </Field>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <VStack gap={"xs"} w={"full"}>
            <Button
              type={"submit"}
              variant={"solid"}
              primary={true}
              colorPalette={"green"}
              disabled={!isValid || approveMutation.isPending || isSubmitting}
              loading={approveMutation.isPending || isSubmitting}
              w={"full"}
            >
              <AppIcon icon={CheckCircleIcon} />
              {"Setujui & Terbitkan Kontrak"}
            </Button>

            <Button type={"button"} onClick={handleClose} w={"full"}>
              {"Batal"}
            </Button>
          </VStack>
        </Modal.Footer>
      </VStack>
    </Modal.Content>
  );
};
