// src/features/auth/components/ui/internal-reset-password-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { PinInput } from "@/design-system/components/input/ui/pin-input";
import { RadioCardInput } from "@/design-system/components/input/ui/radio-card-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";

import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import {
  useResetPasswordConfirmMutation,
  useResetPasswordRequestMutation,
  useResetPasswordVerifyOtpMutation,
} from "@/features/auth/hooks/use-reset-password.mutation";
import {
  createResetPasswordMethodSchema,
  createResetPasswordNewPasswordSchema,
  createResetPasswordOtpSchema,
  createResetPasswordRequestSchema,
  zodResolver,
} from "@/features/auth/schemas/reset-password.schema";
import type {
  InternalResetPasswordModalContentProps,
  InternalResetPasswordModalProps,
  InternalResetPasswordTriggerProps,
  ResetMethod,
  ResetPasswordMethodFormValues,
  ResetPasswordNewPasswordFormValues,
  ResetPasswordOtpFormValues,
  ResetPasswordRequestFormValues,
  ResetPasswordStep,
} from "@/features/auth/types/reset-password.type";

import { t } from "@/shared/libs/i18n";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  InfoIcon,
  KeyRoundIcon,
  LockIcon,
  MailIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const InternalResetPasswordTrigger = (
  props: InternalResetPasswordTriggerProps,
) => {
  // Props
  const {
    children,
    modalKey: customModalKey = "internal-reset-password-modal",
    defaultEmail = "",
  } = props;

  // Hooks
  const { user, isAuthenticated } = useAuthSession();
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const effectiveEmail =
    defaultEmail || (isAuthenticated && user ? user.email : "");

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
    />
  );
};

const InternalResetPasswordModalContent = (
  props: InternalResetPasswordModalContentProps,
) => {
  // Props
  const { modalKey, isOpen, open, close, defaultEmail } = props;

  // Hooks
  const { user, isAuthenticated } = useAuthSession();
  const isUserLoggedIn = Boolean(isAuthenticated && user);
  const lockedEmail = isUserLoggedIn ? (user?.email ?? defaultEmail) : defaultEmail;

  // States
  const [selectedMethod, setSelectedMethod] = useState<ResetMethod>("email");
  const [step, setStep] = useState<ResetPasswordStep>("method");
  const [customEmail, setCustomEmail] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [verifiedToken, setVerifiedToken] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Derived effective email
  const effectiveEmail = isUserLoggedIn
    ? (user?.email ?? defaultEmail)
    : customEmail || defaultEmail;

  // Mutations
  const requestMutation = useResetPasswordRequestMutation();
  const verifyOtpMutation = useResetPasswordVerifyOtpMutation();
  const confirmMutation = useResetPasswordConfirmMutation();

  // Forms
  const methodForm = useForm<ResetPasswordMethodFormValues>({
    resolver: zodResolver(createResetPasswordMethodSchema()),
    defaultValues: {
      method: "email",
    },
  });

  const requestForm = useForm<ResetPasswordRequestFormValues>({
    resolver: zodResolver(createResetPasswordRequestSchema()),
    defaultValues: {
      email: lockedEmail,
    },
  });

  const otpForm = useForm<ResetPasswordOtpFormValues>({
    resolver: zodResolver(createResetPasswordOtpSchema()),
    defaultValues: {
      resetToken: "",
    },
  });

  const newPasswordForm = useForm<ResetPasswordNewPasswordFormValues>({
    resolver: zodResolver(createResetPasswordNewPasswordSchema()),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleCloseModal = () => {
    close();
    // Reset state after transition
    setTimeout(() => {
      setStep("method");
      setSelectedMethod("email");
      setCustomEmail("");
      setOtpCode("");
      setVerifiedToken("");
      setIsSuccess(false);
      methodForm.reset({ method: "email" });
      requestForm.reset({ email: lockedEmail });
      otpForm.reset({ resetToken: "" });
      newPasswordForm.reset({ newPassword: "", confirmPassword: "" });
    }, 200);
  };

  // Handlers
  const handleMethodSelect = (values: ResetPasswordMethodFormValues) => {
    setSelectedMethod(values.method);
    if (values.method === "email") {
      setStep("request");
    } else {
      // TOTP / Google Authenticator
      // Direct to TOTP verification step
      setStep("otp");
    }
  };

  const handleRequestSubmit = (values: ResetPasswordRequestFormValues) => {
    // If logged in, enforce the session email on FE
    const finalEmail = isUserLoggedIn ? (user?.email ?? values.email) : values.email;
    setCustomEmail(finalEmail);
    requestMutation.mutate(
      { email: finalEmail },
      {
        onSuccess: (data) => {
          if (data.resetToken) {
            setOtpCode(data.resetToken);
            otpForm.setValue("resetToken", data.resetToken);
          }
          setStep("otp");
        },
      },
    );
  };

  const handleResendOtp = () => {
    requestMutation.mutate(
      { email: effectiveEmail },
      {
        onSuccess: (data) => {
          if (data.resetToken) {
            setOtpCode(data.resetToken);
            otpForm.setValue("resetToken", data.resetToken);
          }
        },
      },
    );
  };

  const handleOtpSubmit = (values: ResetPasswordOtpFormValues) => {
    verifyOtpMutation.mutate(
      {
        email: effectiveEmail,
        resetToken: values.resetToken,
      },
      {
        onSuccess: (data) => {
          setVerifiedToken(data.resetToken || values.resetToken);
          setStep("new-password");
        },
      },
    );
  };

  const handleNewPasswordSubmit = (
    values: ResetPasswordNewPasswordFormValues,
  ) => {
    confirmMutation.mutate(
      {
        email: effectiveEmail,
        resetToken: verifiedToken || otpForm.getValues("resetToken"),
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
            {"Reset Kata Sandi"}
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
                  {"Kata Sandi Berhasil Direset!"}
                </P>

                <P fontSize={"sm"} color={"fg.muted"}>
                  {"Kata sandi akun Anda telah berhasil direset. Silakan masuk menggunakan kata sandi baru Anda."}
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
          ) : step === "method" ? (
            /* Step 0: Pilih Metode Reset Kata Sandi */
            <VStack
              as={"form"}
              onSubmit={methodForm.handleSubmit(handleMethodSelect)}
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
                    "Pilih metode verifikasi untuk mereset kata sandi akun internal ATR/BPN Anda."
                  }
                </Alert.Description>
              </Alert.Root>

              <Fieldset>
                <Controller
                  name={"method"}
                  control={methodForm.control}
                  render={({ field }) => (
                    <RadioCardInput.Root
                      value={field.value}
                      onValueChange={(details) =>
                        field.onChange(details.value as ResetMethod)
                      }
                      w={"full"}
                    >
                      <VStack gap={"sm"} align={"stretch"} w={"full"}>
                        {/* Option 1: OTP Email */}
                        <RadioCardInput.Item
                          value={"email"}
                          p={"md"}
                          borderWidth={"1px"}
                          rounded={"lg"}
                          transition={"all 0.15s ease"}
                          _hover={{ borderColor: "purple.fg" }}
                        >
                          <RadioCardInput.ItemControl>
                            <HStack justify={"space-between"} align={"center"} w={"full"}>
                              <HStack gap={"sm"} align={"center"}>
                                <Box
                                  p={"sm"}
                                  rounded={"md"}
                                  bg={"purple.subtle"}
                                  color={"purple.fg"}
                                >
                                  <AppIcon icon={MailIcon} size={"md"} />
                                </Box>
                                <VStack align={"start"} gap={"2xs"}>
                                  <RadioCardInput.ItemText fontWeight={"semibold"}>
                                    {"OTP via Email"}
                                  </RadioCardInput.ItemText>
                                  <RadioCardInput.ItemDescription fontSize={"xs"} color={"fg.muted"}>
                                    {"Kirim 6-digit kode verifikasi ke email kedinasan"}
                                  </RadioCardInput.ItemDescription>
                                </VStack>
                              </HStack>
                              <RadioCardInput.ItemIndicator />
                            </HStack>
                          </RadioCardInput.ItemControl>
                        </RadioCardInput.Item>

                        {/* Option 2: Google Authenticator (TOTP) */}
                        <RadioCardInput.Item
                          value={"totp"}
                          p={"md"}
                          borderWidth={"1px"}
                          rounded={"lg"}
                          transition={"all 0.15s ease"}
                          _hover={{ borderColor: "purple.fg" }}
                        >
                          <RadioCardInput.ItemControl>
                            <HStack justify={"space-between"} align={"center"} w={"full"}>
                              <HStack gap={"sm"} align={"center"}>
                                <Box
                                  p={"sm"}
                                  rounded={"md"}
                                  bg={"blue.subtle"}
                                  color={"blue.fg"}
                                >
                                  <AppIcon icon={SmartphoneIcon} size={"md"} />
                                </Box>
                                <VStack align={"start"} gap={"2xs"}>
                                  <HStack gap={"xs"} align={"center"}>
                                    <RadioCardInput.ItemText fontWeight={"semibold"}>
                                      {"Google Authenticator (TOTP)"}
                                    </RadioCardInput.ItemText>
                                    <Badge size={"xs"} colorPalette={"blue"}>
                                      {"Instan"}
                                    </Badge>
                                  </HStack>
                                  <RadioCardInput.ItemDescription fontSize={"xs"} color={"fg.muted"}>
                                    {"Gunakan kode 6 digit dari aplikasi authenticator"}
                                  </RadioCardInput.ItemDescription>
                                </VStack>
                              </HStack>
                              <RadioCardInput.ItemIndicator />
                            </HStack>
                          </RadioCardInput.ItemControl>
                        </RadioCardInput.Item>
                      </VStack>
                    </RadioCardInput.Root>
                  )}
                />
              </Fieldset>

              <Button
                primary={true}
                type={"submit"}
                w={"full"}
              >
                {"Lanjutkan"}
                <AppIcon icon={ArrowRightIcon} />
              </Button>
            </VStack>
          ) : step === "request" ? (
            /* Step 1: Request OTP via Email */
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
                  {isUserLoggedIn
                    ? "Email Anda terkunci sesuai sesi akun yang sedang aktif. Kode OTP akan dikirimkan ke email ini."
                    : "Masukkan email Anda. Kode verifikasi (OTP) akan dikirimkan untuk mengatur ulang kata sandi."}
                </Alert.Description>
              </Alert.Root>

              <Fieldset>
                <Field
                  label={"Email"}
                  invalid={Boolean(requestForm.formState.errors.email)}
                  errorText={requestForm.formState.errors.email?.message}
                  helperText={
                    isUserLoggedIn ? (
                      <HStack gap={"2xs"} align={"center"} color={"fg.muted"}>
                        <AppIcon icon={LockIcon} size={"xs"} />
                        <P fontSize={"2xs"}>
                          {"Email terkunci sesuai akun login aktif"}
                        </P>
                      </HStack>
                    ) : undefined
                  }
                >
                  <Input
                    startElement={
                      <AppIcon icon={MailIcon} color={"fg.subtle"} />
                    }
                    placeholder={"contoh@email.com"}
                    readOnly={isUserLoggedIn}
                    bg={isUserLoggedIn ? "bg.subtle" : undefined}
                    cursor={isUserLoggedIn ? "not-allowed" : undefined}
                    tabIndex={isUserLoggedIn ? -1 : undefined}
                    {...requestForm.register("email")}
                  />
                </Field>
              </Fieldset>

              <HStack justify={"start"} align={"center"}>
                <Button
                  variant={"ghost"}
                  size={"xs"}
                  type={"button"}
                  onClick={() => setStep("method")}
                >
                  <AppIcon icon={ArrowLeftIcon} />
                  {"Ganti Metode"}
                </Button>
              </HStack>

              <Button
                primary={true}
                type={"submit"}
                w={"full"}
                loading={requestMutation.isPending}
              >
                <AppIcon icon={KeyRoundIcon} />
                {"Kirim Kode OTP"}
              </Button>
            </VStack>
          ) : step === "otp" ? (
            /* Step 2: Input 6-Digit OTP / TOTP */
            <VStack
              as={"form"}
              onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
              gap={"md"}
              align={"stretch"}
            >
              <Alert.Root
                status={"info"}
                colorPalette={selectedMethod === "totp" ? "blue" : "purple"}
                variant={"subtle"}
              >
                <AppIcon
                  icon={selectedMethod === "totp" ? SmartphoneIcon : InfoIcon}
                />
                <Alert.Description fontSize={"xs"}>
                  {selectedMethod === "totp"
                    ? "Buka aplikasi Google Authenticator Anda dan masukkan 6 digit kode yang tertera untuk akun ini."
                    : `Kode OTP 6 digit telah dikirimkan ke ${effectiveEmail}. Silakan masukkan kode di bawah ini.`}
                </Alert.Description>
              </Alert.Root>

              <Fieldset>
                <Field
                  label={
                    selectedMethod === "totp"
                      ? "Kode Google Authenticator (6 Digit)"
                      : "Kode OTP Verifikasi Email"
                  }
                  invalid={Boolean(otpForm.formState.errors.resetToken)}
                  errorText={otpForm.formState.errors.resetToken?.message}
                >
                  <VStack align={"center"} w={"full"} py={"xs"}>
                    <PinInput
                      count={6}
                      value={otpCode ? otpCode.split("") : []}
                      onValueChange={(details) => {
                        setOtpCode(details.valueAsString);
                        otpForm.setValue("resetToken", details.valueAsString, {
                          shouldValidate: true,
                        });
                      }}
                      onValueComplete={(details) => {
                        setOtpCode(details.valueAsString);
                        otpForm.setValue("resetToken", details.valueAsString, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </VStack>
                </Field>
              </Fieldset>

              <HStack justify={"space-between"} align={"center"} mt={"xs"}>
                <Button
                  variant={"ghost"}
                  size={"xs"}
                  type={"button"}
                  onClick={() =>
                    setStep(selectedMethod === "email" ? "request" : "method")
                  }
                >
                  <AppIcon icon={ArrowLeftIcon} />
                  {selectedMethod === "email"
                    ? isUserLoggedIn
                      ? "Ganti Metode"
                      : "Ganti Email"
                    : "Ganti Metode"}
                </Button>

                {selectedMethod === "email" && (
                  <Button
                    variant={"ghost"}
                    size={"xs"}
                    type={"button"}
                    onClick={handleResendOtp}
                    loading={requestMutation.isPending}
                  >
                    <AppIcon icon={RotateCcwIcon} />
                    {"Kirim Ulang OTP"}
                  </Button>
                )}
              </HStack>

              <Button
                primary={true}
                type={"submit"}
                w={"full"}
                loading={verifyOtpMutation.isPending}
              >
                <AppIcon icon={ShieldCheckIcon} />
                {selectedMethod === "totp"
                  ? "Verifikasi Kode Authenticator"
                  : "Verifikasi OTP"}
              </Button>
            </VStack>
          ) : (
            /* Step 3: New Password with Password Strength Meter */
            <VStack
              as={"form"}
              onSubmit={newPasswordForm.handleSubmit(handleNewPasswordSubmit)}
              gap={"md"}
              align={"stretch"}
            >
              <Alert.Root
                status={"info"}
                colorPalette={"green"}
                variant={"subtle"}
              >
                <AppIcon icon={InfoIcon} />
                <Alert.Description fontSize={"xs"}>
                  {"Kode verifikasi berhasil divalidasi. Buat kata sandi baru yang kuat untuk akun Anda."}
                </Alert.Description>
              </Alert.Root>

              <Fieldset>
                <Field
                  label={"Kata Sandi Baru"}
                  invalid={Boolean(
                    newPasswordForm.formState.errors.newPassword,
                  )}
                  errorText={
                    newPasswordForm.formState.errors.newPassword?.message
                  }
                >
                  <PasswordInput
                    startElement={
                      <AppIcon icon={LockIcon} color={"fg.subtle"} />
                    }
                    placeholder={"Minimal 8 karakter"}
                    withPasswordStrength={true}
                    {...newPasswordForm.register("newPassword")}
                  />
                </Field>

                <Field
                  label={"Konfirmasi Kata Sandi Baru"}
                  invalid={Boolean(
                    newPasswordForm.formState.errors.confirmPassword,
                  )}
                  errorText={
                    newPasswordForm.formState.errors.confirmPassword?.message
                  }
                >
                  <PasswordInput
                    startElement={
                      <AppIcon icon={LockIcon} color={"fg.subtle"} />
                    }
                    placeholder={"Ulangi kata sandi baru"}
                    {...newPasswordForm.register("confirmPassword")}
                  />
                </Field>
              </Fieldset>

              <HStack justify={"start"} align={"center"} mt={"xs"}>
                <Button
                  variant={"ghost"}
                  size={"xs"}
                  type={"button"}
                  onClick={() => setStep("otp")}
                >
                  <AppIcon icon={ArrowLeftIcon} />
                  {"Kembali ke Verifikasi"}
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


