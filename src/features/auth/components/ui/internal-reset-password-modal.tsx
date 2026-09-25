// src/features/auth/components/ui/internal-reset-password-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";

import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import {
  useChangePasswordMutation,
  useResetPasswordConfirmMutation,
  useResetPasswordRequestMutation,
} from "@/features/auth/hooks/use-reset-password.mutation";
import {
  createChangePasswordSchema,
  createResetPasswordConfirmSchema,
  createResetPasswordRequestSchema,
  zodResolver,
} from "@/features/auth/schemas/reset-password.schema";
import type {
  ChangePasswordFormValues,
  InternalResetPasswordModalContentProps,
  InternalResetPasswordModalProps,
  InternalResetPasswordTriggerProps,
  ResetPasswordConfirmFormValues,
  ResetPasswordRequestFormValues,
  ResetPasswordStep,
} from "@/features/auth/types/reset-password.type";

import { t } from "@/shared/libs/i18n";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  InfoIcon,
  KeyRoundIcon,
  LockIcon,
  MailIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const InternalResetPasswordTrigger = (
  props: InternalResetPasswordTriggerProps,
) => {
  // Props
  const {
    children,
    modalKey: customModalKey = "internal-reset-password-modal",
    defaultEmail = "",
    initialStep,
  } = props;

  // Hooks
  const { user, isAuthenticated } = useAuthSession();
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const effectiveEmail =
    defaultEmail || (isAuthenticated && user ? user.email : "");
  const effectiveInitialStep: ResetPasswordStep =
    initialStep ?? (isAuthenticated ? "change" : "request");

  const handleOpenModal = () => {
    open();
  };

  return (
    <>
      {children && (
        <span
          onClick={handleOpenModal}
          role={"button"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") open();
          }}
          style={{ display: "inline-flex", cursor: "pointer", width: "100%" }}
        >
          {children}
        </span>
      )}

      <InternalResetPasswordModalContent
        modalKey={modalKey}
        isOpen={isOpen}
        open={open}
        close={close}
        defaultEmail={effectiveEmail}
        initialStep={effectiveInitialStep}
      />
    </>
  );
};

export const InternalResetPasswordModal = (
  props: InternalResetPasswordModalProps,
) => {
  // Props
  const {
    modalKey: customModalKey = "internal-reset-password-modal",
    defaultEmail = "",
    initialStep = "request",
    isOpen: controlledIsOpen,
    onClose,
  } = props;

  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const handleClose = () => {
    close();
    onClose?.();
  };

  const isModalOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

  return (
    <InternalResetPasswordModalContent
      modalKey={modalKey}
      isOpen={isModalOpen}
      open={open}
      close={handleClose}
      defaultEmail={defaultEmail}
      initialStep={initialStep}
    />
  );
};

const InternalResetPasswordModalContent = (
  props: InternalResetPasswordModalContentProps,
) => {
  // Props
  const { modalKey, isOpen, open, close, defaultEmail, initialStep } = props;

  // States
  const [step, setStep] = useState<ResetPasswordStep>(initialStep);
  const [targetEmail, setTargetEmail] = useState<string>(defaultEmail);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Mutations
  const requestMutation = useResetPasswordRequestMutation();
  const confirmMutation = useResetPasswordConfirmMutation();
  const changeMutation = useChangePasswordMutation();

  // Forms
  const requestForm = useForm<ResetPasswordRequestFormValues>({
    resolver: zodResolver(createResetPasswordRequestSchema()),
    defaultValues: {
      email: defaultEmail,
    },
  });

  const confirmForm = useForm<ResetPasswordConfirmFormValues>({
    resolver: zodResolver(createResetPasswordConfirmSchema()),
    defaultValues: {
      email: defaultEmail,
      resetToken: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changeForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(createChangePasswordSchema()),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleCloseModal = () => {
    close();
    // Reset state after transition
    setTimeout(() => {
      setStep(initialStep);
      setIsSuccess(false);
      requestForm.reset();
      confirmForm.reset();
      changeForm.reset();
    }, 200);
  };

  // Handlers
  const handleRequestSubmit = (values: ResetPasswordRequestFormValues) => {
    setTargetEmail(values.email);
    requestMutation.mutate(
      { email: values.email },
      {
        onSuccess: (data) => {
          confirmForm.setValue("email", values.email);
          if (data.resetToken) {
            confirmForm.setValue("resetToken", data.resetToken);
          }
          setStep("confirm");
        },
      },
    );
  };

  const handleConfirmSubmit = (values: ResetPasswordConfirmFormValues) => {
    confirmMutation.mutate(
      {
        email: values.email || targetEmail,
        resetToken: values.resetToken,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      },
    );
  };

  const handleChangeSubmit = (values: ChangePasswordFormValues) => {
    changeMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      },
    );
  };

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={handleCloseModal}
      size={"sm"}
    >
      <Modal.Content>
        <Modal.Header>
          <Modal.CloseButton />

          <Modal.Title textAlign={"center"}>
            {step === "change" ? "Ubah Kata Sandi" : "Reset Kata Sandi"}
          </Modal.Title>
        </Modal.Header>

        <Separator borderColor={"bg.canvas"} />

        <Modal.Body p={"md"}>
          {isSuccess ? (
            <VStack gap={"md"} align={"center"} py={"md"} textAlign={"center"}>
              <AppIcon
                icon={CheckCircle2Icon}
                size={"2xl"}
                color={"green.fg"}
              />

              <VStack gap={"2xs"}>
                <P fontSize={"md"} fontWeight={"semibold"}>
                  {step === "change"
                    ? "Kata Sandi Berhasil Diubah!"
                    : "Kata Sandi Berhasil Direset!"}
                </P>

                <P fontSize={"sm"} color={"fg.muted"}>
                  {step === "change"
                    ? "Kata sandi Anda telah berhasil diperbarui."
                    : "Kata sandi Anda telah berhasil direset. Silakan masuk menggunakan kata sandi baru Anda."}
                </P>
              </VStack>

              <Button
                primary={true}
                w={"full"}
                mt={"sm"}
                onClick={handleCloseModal}
              >
                {"Selesai"}
              </Button>
            </VStack>
          ) : step === "request" ? (
            /* Step 1: Request Reset Token via Email */
            <VStack
              as={"form"}
              onSubmit={requestForm.handleSubmit(handleRequestSubmit)}
              gap={"md"}
              align={"stretch"}
            >
              <Alert.Root
                status={"info"}
                colorPalette={"purple"}
                variant={"subtle"}
              >
                <AppIcon icon={InfoIcon} />
                <Alert.Description fontSize={"xs"}>
                  {
                    "Masukkan email Anda. Kode verifikasi akan dikirimkan untuk mengatur ulang kata sandi."
                  }
                </Alert.Description>
              </Alert.Root>

              <Fieldset>
                <Field
                  label={"Email"}
                  invalid={Boolean(requestForm.formState.errors.email)}
                  errorText={requestForm.formState.errors.email?.message}
                >
                  <Input
                    startElement={
                      <AppIcon icon={MailIcon} color={"fg.subtle"} />
                    }
                    placeholder={"contoh@email.com"}
                    {...requestForm.register("email")}
                  />
                </Field>
              </Fieldset>

              <Button
                primary={true}
                type={"submit"}
                w={"full"}
                loading={requestMutation.isPending}
              >
                <AppIcon icon={KeyRoundIcon} />
                {"Kirim Kode Verifikasi"}
              </Button>
            </VStack>
          ) : step === "confirm" ? (
            /* Step 2: Confirm Reset Token + Set New Password */
            <VStack
              as={"form"}
              onSubmit={confirmForm.handleSubmit(handleConfirmSubmit)}
              gap={"md"}
              align={"stretch"}
            >
              <Alert.Root
                status={"info"}
                colorPalette={"blue"}
                variant={"subtle"}
              >
                <AppIcon icon={InfoIcon} />
                <Alert.Description fontSize={"xs"}>
                  {`Kode verifikasi telah dikirimkan ke ${targetEmail}. Silakan masukkan kode dan kata sandi baru Anda.`}
                </Alert.Description>
              </Alert.Root>

              <Fieldset>
                <Field
                  label={"Kode / Token Verifikasi"}
                  invalid={Boolean(confirmForm.formState.errors.resetToken)}
                  errorText={confirmForm.formState.errors.resetToken?.message}
                >
                  <Input
                    startElement={
                      <AppIcon icon={KeyRoundIcon} color={"fg.subtle"} />
                    }
                    placeholder={"123456"}
                    {...confirmForm.register("resetToken")}
                  />
                </Field>

                <Field
                  label={"Kata Sandi Baru"}
                  invalid={Boolean(confirmForm.formState.errors.newPassword)}
                  errorText={confirmForm.formState.errors.newPassword?.message}
                >
                  <PasswordInput
                    startElement={
                      <AppIcon icon={LockIcon} color={"fg.subtle"} />
                    }
                    placeholder={"Minimal 8 karakter"}
                    {...confirmForm.register("newPassword")}
                  />
                </Field>

                <Field
                  label={"Konfirmasi Kata Sandi Baru"}
                  invalid={Boolean(
                    confirmForm.formState.errors.confirmPassword,
                  )}
                  errorText={
                    confirmForm.formState.errors.confirmPassword?.message
                  }
                >
                  <PasswordInput
                    startElement={
                      <AppIcon icon={LockIcon} color={"fg.subtle"} />
                    }
                    placeholder={"Ulangi kata sandi baru"}
                    {...confirmForm.register("confirmPassword")}
                  />
                </Field>
              </Fieldset>

              <HStack justify={"space-between"} align={"center"} mt={"xs"}>
                <Button
                  variant={"ghost"}
                  size={"xs"}
                  type={"button"}
                  onClick={() => setStep("request")}
                >
                  <AppIcon icon={ArrowLeftIcon} />
                  {"Ganti Email / Kirim Ulang"}
                </Button>
              </HStack>

              <Button
                primary={true}
                type={"submit"}
                w={"full"}
                loading={confirmMutation.isPending}
              >
                {"Simpan Kata Sandi Baru"}
              </Button>
            </VStack>
          ) : (
            /* Change Password Mode (for logged-in internal users) */
            <VStack
              as={"form"}
              onSubmit={changeForm.handleSubmit(handleChangeSubmit)}
              gap={"md"}
              align={"stretch"}
            >
              <Fieldset>
                <Field
                  label={"Kata Sandi Saat Ini"}
                  invalid={Boolean(changeForm.formState.errors.currentPassword)}
                  errorText={
                    changeForm.formState.errors.currentPassword?.message
                  }
                >
                  <PasswordInput
                    startElement={
                      <AppIcon icon={LockIcon} color={"fg.subtle"} />
                    }
                    placeholder={"Masukkan kata sandi saat ini"}
                    {...changeForm.register("currentPassword")}
                  />
                </Field>

                <Field
                  label={"Kata Sandi Baru"}
                  invalid={Boolean(changeForm.formState.errors.newPassword)}
                  errorText={changeForm.formState.errors.newPassword?.message}
                >
                  <PasswordInput
                    startElement={
                      <AppIcon icon={LockIcon} color={"fg.subtle"} />
                    }
                    placeholder={"Minimal 8 karakter"}
                    {...changeForm.register("newPassword")}
                  />
                </Field>

                <Field
                  label={"Konfirmasi Kata Sandi Baru"}
                  invalid={Boolean(changeForm.formState.errors.confirmPassword)}
                  errorText={
                    changeForm.formState.errors.confirmPassword?.message
                  }
                >
                  <PasswordInput
                    startElement={
                      <AppIcon icon={LockIcon} color={"fg.subtle"} />
                    }
                    placeholder={"Ulangi kata sandi baru"}
                    {...changeForm.register("confirmPassword")}
                  />
                </Field>
              </Fieldset>

              <HStack justify={"end"} align={"center"}>
                <Button
                  variant={"ghost"}
                  size={"xs"}
                  type={"button"}
                  onClick={() => setStep("request")}
                >
                  <AppIcon icon={KeyRoundIcon} />
                  {"Lupa kata sandi saat ini?"}
                </Button>
              </HStack>

              <Button
                primary={true}
                type={"submit"}
                w={"full"}
                loading={changeMutation.isPending}
              >
                {"Perbarui Kata Sandi"}
              </Button>
            </VStack>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant={"outline"} w={"full"} onClick={handleCloseModal}>
            {t["action.close"]()}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
