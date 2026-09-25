// src\features\auth\components\ui\reset-password-modal.tsx

// src\features\auth\components\ui\reset-password-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { PinInput } from "@/design-system/components/input/ui/pin-input";
import { RadioIndicator } from "@/design-system/components/input/ui/radio-indicator";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";

import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import {
  useResetPasswordConfirmMutation,
  useResetPasswordRequestMutation,
  useResetPasswordVerifyOtpMutation,
  useResetPasswordVerifyTotpMutation,
} from "@/features/auth/hooks/use-reset-password.mutation";
import {
  createResetPasswordMethodSchema,
  createResetPasswordNewPasswordSchema,
  createResetPasswordOtpSchema,
  createResetPasswordRequestSchema,
  zodResolver,
} from "@/features/auth/schemas/reset-password.schema";
import type {
  EmailResetPasswordFlowProps,
  ResetMethod,
  ResetMethodRadioItemProps,
  ResetPasswordMethodFormValues,
  ResetPasswordMethodSelectorProps,
  ResetPasswordModalContentProps,
  ResetPasswordModalProps,
  ResetPasswordNewPasswordFormValues,
  ResetPasswordOtpFormValues,
  ResetPasswordRequestFormValues,
  ResetPasswordTriggerProps,
  TotpResetPasswordFlowProps,
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

export const ResetPasswordTrigger = (props: ResetPasswordTriggerProps) => {
  const {
    children,
    modalKey: customModalKey = "reset-password-modal",
    defaultEmail = "",
  } = props;

  const { user, isAuthenticated } = useAuthSession();
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const effectiveEmail =
    defaultEmail || (isAuthenticated && user ? user.email : "");

  return (
    <>
      {children && (
        <span
          onClick={() => open()}
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

      <ResetPasswordModalContent
        modalKey={modalKey}
        isOpen={isOpen}
        open={open}
        close={close}
        defaultEmail={effectiveEmail}
      />
    </>
  );
};

export const ResetPasswordModal = (props: ResetPasswordModalProps) => {
  const {
    modalKey: customModalKey = "reset-password-modal",
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
    <ResetPasswordModalContent
      modalKey={modalKey}
      isOpen={isModalOpen}
      open={open}
      close={handleClose}
      defaultEmail={defaultEmail}
    />
  );
};

const ResetPasswordModalContent = (props: ResetPasswordModalContentProps) => {
  const { modalKey, isOpen, open, close, defaultEmail } = props;

  // Global State for Modal navigation
  const [selectedMethod, setSelectedMethod] = useState<ResetMethod | null>(
    null,
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleCloseModal = () => {
    close();
    setTimeout(() => {
      setSelectedMethod(null);
      setIsSuccess(false);
    }, 200);
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
          <Modal.Title textAlign={"center"}>{"Reset Kata Sandi"}</Modal.Title>
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
                  {
                    "Kata sandi akun Anda telah berhasil direset. Silakan masuk menggunakan kata sandi baru Anda."
                  }
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
          ) : selectedMethod === null ? (
            <ResetPasswordMethodSelector
              onSelectMethod={(method: ResetMethod) =>
                setSelectedMethod(method)
              }
            />
          ) : selectedMethod === "email" ? (
            <EmailResetPasswordFlow
              defaultEmail={defaultEmail}
              onBackToMethod={() => setSelectedMethod(null)}
              onSuccess={() => setIsSuccess(true)}
            />
          ) : (
            <TotpResetPasswordFlow
              defaultEmail={defaultEmail}
              onBackToMethod={() => setSelectedMethod(null)}
              onSuccess={() => setIsSuccess(true)}
            />
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

const ResetPasswordMethodSelector = ({
  onSelectMethod,
}: ResetPasswordMethodSelectorProps) => {
  const methodForm = useForm<ResetPasswordMethodFormValues>({
    resolver: zodResolver(createResetPasswordMethodSchema()),
    defaultValues: {
      method: "email",
    },
  });

  return (
    <VStack
      as={"form"}
      onSubmit={methodForm.handleSubmit((values) =>
        onSelectMethod(values.method),
      )}
      gap={"md"}
      align={"stretch"}
    >
      <Alert.Root status={"info"} variant={"subtle"}>
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
            <VStack gap={"xs"} align={"stretch"} w={"full"}>
              <ResetMethodRadioItem
                method={"email"}
                isSelected={field.value === "email"}
                onSelect={() => field.onChange("email")}
                title={"OTP via Email"}
                description={"Kirim 6-digit kode verifikasi ke email internal"}
                icon={MailIcon}
                colorPalette={"purple"}
              />

              <ResetMethodRadioItem
                method={"totp"}
                isSelected={field.value === "totp"}
                onSelect={() => field.onChange("totp")}
                title={"Google Authenticator (TOTP)"}
                description={"Gunakan kode 6 digit dari aplikasi authenticator"}
                badge={"Instan"}
                icon={SmartphoneIcon}
                colorPalette={"blue"}
              />
            </VStack>
          )}
        />
      </Fieldset>

      <Button primary={true} type={"submit"} w={"full"}>
        {"Lanjutkan"}
        <AppIcon icon={ArrowRightIcon} />
      </Button>
    </VStack>
  );
};

export const ResetMethodRadioItem = (props: ResetMethodRadioItemProps) => {
  const {
    isSelected,
    onSelect,
    title,
    description,
    badge,
    icon,
    colorPalette = "purple",
  } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <Box
      onClick={onSelect}
      p={"md"}
      borderWidth={"1px"}
      borderColor={isSelected ? `${colorPalette}.solid` : "border.subtle"}
      rounded={theme.radii.component}
      transition={"all 0.15s ease"}
      cursor={"pointer"}
      textAlign={"start"}
      _hover={{ borderColor: `${colorPalette}.fg` }}
    >
      <HStack justify={"space-between"} align={"center"} w={"full"}>
        <HStack gap={"sm"} align={"start"}>
          <AppIcon
            icon={icon}
            size={"sm"}
            color={`${colorPalette}.fg`}
            mt={"2xs"}
          />

          <VStack align={"start"} gap={"2xs"}>
            <HStack gap={"xs"} align={"center"}>
              <P fontWeight={"semibold"}>{title}</P>

              {badge && (
                <Badge size={"sm"} colorPalette={colorPalette}>
                  {badge}
                </Badge>
              )}
            </HStack>

            <P fontSize={"sm"} color={"fg.muted"}>
              {description}
            </P>
          </VStack>
        </HStack>

        <RadioIndicator checked={isSelected} />
      </HStack>
    </Box>
  );
};

const EmailResetPasswordFlow = ({
  defaultEmail,
  onBackToMethod,
  onSuccess,
}: EmailResetPasswordFlowProps) => {
  const { user, isAuthenticated } = useAuthSession();
  const isUserLoggedIn = Boolean(isAuthenticated && user);
  const initialEmail = isUserLoggedIn
    ? (user?.email ?? defaultEmail)
    : defaultEmail;

  // Step state within Email Flow
  const [subStep, setSubStep] = useState<"request" | "otp" | "password">(
    "request",
  );
  const [email, setEmail] = useState<string>(initialEmail);
  const [resetToken, setResetToken] = useState<string>("");

  // Mutations
  const requestMutation = useResetPasswordRequestMutation();
  const verifyOtpMutation = useResetPasswordVerifyOtpMutation();
  const confirmMutation = useResetPasswordConfirmMutation();

  // Forms
  const requestForm = useForm<ResetPasswordRequestFormValues>({
    resolver: zodResolver(createResetPasswordRequestSchema()),
    defaultValues: {
      email: initialEmail,
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

  // Step 1: Request OTP
  const handleRequestSubmit = (values: ResetPasswordRequestFormValues) => {
    const finalEmail = isUserLoggedIn
      ? (user?.email ?? values.email)
      : values.email;
    setEmail(finalEmail);
    requestMutation.mutate(
      { email: finalEmail },
      {
        onSuccess: (data) => {
          if (data.resetToken) {
            otpForm.setValue("resetToken", data.resetToken, {
              shouldValidate: true,
            });
          } else {
            otpForm.setValue("resetToken", "");
          }
          setSubStep("otp");
        },
      },
    );
  };

  const handleResendOtp = () => {
    requestMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          if (data.resetToken) {
            otpForm.setValue("resetToken", data.resetToken, {
              shouldValidate: true,
            });
          }
        },
      },
    );
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = (values: ResetPasswordOtpFormValues) => {
    const code = values.resetToken || otpForm.getValues("resetToken");
    if (!code || code.length !== 6) {
      otpForm.setError("resetToken", { message: "Kode OTP harus 6 digit" });
      return;
    }
    verifyOtpMutation.mutate(
      {
        email,
        resetToken: code,
      },
      {
        onSuccess: (data) => {
          setResetToken(data.resetToken || code);
          setSubStep("password");
        },
      },
    );
  };

  // Step 3: Confirm New Password
  const handlePasswordSubmit = (values: ResetPasswordNewPasswordFormValues) => {
    confirmMutation.mutate(
      {
        email,
        resetToken: resetToken || otpForm.getValues("resetToken"),
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  if (subStep === "request") {
    return (
      <VStack
        as={"form"}
        onSubmit={requestForm.handleSubmit(handleRequestSubmit)}
        gap={"md"}
        align={"stretch"}
      >
        <Alert.Root status={"info"} colorPalette={"purple"} variant={"subtle"}>
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
              startElement={<AppIcon icon={MailIcon} color={"fg.subtle"} />}
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
            onClick={onBackToMethod}
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
    );
  }

  if (subStep === "otp") {
    return (
      <VStack
        as={"form"}
        onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
        gap={"md"}
        align={"stretch"}
      >
        <Alert.Root status={"info"} colorPalette={"purple"} variant={"subtle"}>
          <AppIcon icon={InfoIcon} />
          <Alert.Description fontSize={"xs"}>
            {`Kode OTP 6 digit telah dikirimkan ke ${email}. Silakan masukkan kode di bawah ini.`}
          </Alert.Description>
        </Alert.Root>

        <Fieldset>
          <Field
            label={"Kode OTP Verifikasi Email"}
            invalid={Boolean(otpForm.formState.errors.resetToken)}
            errorText={otpForm.formState.errors.resetToken?.message}
          >
            <VStack align={"center"} w={"full"} py={"xs"}>
              <PinInput
                count={6}
                otp={true}
                autoFocus={true}
                onValueChange={(details) => {
                  otpForm.setValue("resetToken", details.value.join(""));
                }}
                onValueComplete={(details) => {
                  const code = details.value.join("");
                  otpForm.setValue("resetToken", code, {
                    shouldValidate: true,
                  });
                  otpForm.handleSubmit(handleOtpSubmit)();
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
            onClick={() => setSubStep("request")}
          >
            <AppIcon icon={ArrowLeftIcon} />
            {isUserLoggedIn ? "Kembali" : "Ganti Email"}
          </Button>

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
        </HStack>

        <Button
          primary={true}
          type={"submit"}
          w={"full"}
          loading={verifyOtpMutation.isPending}
        >
          <AppIcon icon={ShieldCheckIcon} />
          {"Verifikasi OTP"}
        </Button>
      </VStack>
    );
  }

  return (
    <VStack
      as={"form"}
      onSubmit={newPasswordForm.handleSubmit(handlePasswordSubmit)}
      gap={"md"}
      align={"stretch"}
    >
      <Alert.Root status={"info"} colorPalette={"green"} variant={"subtle"}>
        <AppIcon icon={InfoIcon} />
        <Alert.Description fontSize={"xs"}>
          {
            "Kode verifikasi berhasil divalidasi. Buat kata sandi baru yang kuat untuk akun Anda."
          }
        </Alert.Description>
      </Alert.Root>

      <Fieldset>
        <Field
          label={"Kata Sandi Baru"}
          invalid={Boolean(newPasswordForm.formState.errors.newPassword)}
          errorText={newPasswordForm.formState.errors.newPassword?.message}
        >
          <PasswordInput
            startElement={<AppIcon icon={LockIcon} color={"fg.subtle"} />}
            placeholder={"Minimal 8 karakter"}
            withPasswordStrength={true}
            {...newPasswordForm.register("newPassword")}
          />
        </Field>

        <Field
          label={"Konfirmasi Kata Sandi Baru"}
          invalid={Boolean(newPasswordForm.formState.errors.confirmPassword)}
          errorText={newPasswordForm.formState.errors.confirmPassword?.message}
        >
          <PasswordInput
            startElement={<AppIcon icon={LockIcon} color={"fg.subtle"} />}
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
          onClick={() => setSubStep("otp")}
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
  );
};

const TotpResetPasswordFlow = ({
  defaultEmail,
  onBackToMethod,
  onSuccess,
}: TotpResetPasswordFlowProps) => {
  const { user, isAuthenticated } = useAuthSession();
  const isUserLoggedIn = Boolean(isAuthenticated && user);
  const initialEmail = isUserLoggedIn
    ? (user?.email ?? defaultEmail)
    : defaultEmail;

  // Step state within TOTP Flow: need email & totpCode before new password
  const [subStep, setSubStep] = useState<"totp" | "password">("totp");
  const [email, setEmail] = useState<string>(initialEmail);
  const [verifiedToken, setVerifiedToken] = useState<string>("");

  // Mutations
  const verifyTotpMutation = useResetPasswordVerifyTotpMutation();
  const confirmMutation = useResetPasswordConfirmMutation();

  // Forms
  const totpForm = useForm<{ email: string; totpCode: string }>({
    defaultValues: {
      email: initialEmail,
      totpCode: "",
    },
  });

  const newPasswordForm = useForm<ResetPasswordNewPasswordFormValues>({
    resolver: zodResolver(createResetPasswordNewPasswordSchema()),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Step 1: Submit TOTP Code
  const handleTotpSubmit = (values: { email: string; totpCode: string }) => {
    const finalEmail = isUserLoggedIn
      ? (user?.email ?? values.email)
      : values.email || totpForm.getValues("email");
    if (!finalEmail) {
      totpForm.setError("email", { message: "Email wajib diisi" });
      return;
    }
    const code = values.totpCode || totpForm.getValues("totpCode");
    if (!code || code.length !== 6) {
      totpForm.setError("totpCode", { message: "Kode TOTP harus 6 digit" });
      return;
    }

    setEmail(finalEmail);
    verifyTotpMutation.mutate(
      {
        email: finalEmail,
        totpCode: code,
      },
      {
        onSuccess: (data) => {
          setVerifiedToken(data.resetToken || code);
          setSubStep("password");
        },
      },
    );
  };

  // Step 2: Confirm New Password
  const handlePasswordSubmit = (values: ResetPasswordNewPasswordFormValues) => {
    confirmMutation.mutate(
      {
        email,
        resetToken: verifiedToken || totpForm.getValues("totpCode"),
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  if (subStep === "totp") {
    return (
      <VStack
        as={"form"}
        onSubmit={totpForm.handleSubmit(handleTotpSubmit)}
        gap={"md"}
        align={"stretch"}
      >
        <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
          <AppIcon icon={SmartphoneIcon} />
          <Alert.Description fontSize={"xs"}>
            {
              "Buka aplikasi Google Authenticator Anda dan masukkan 6 digit kode yang tertera untuk akun ini."
            }
          </Alert.Description>
        </Alert.Root>

        <Fieldset>
          <Field
            label={"Email Akun"}
            invalid={Boolean(totpForm.formState.errors.email)}
            errorText={totpForm.formState.errors.email?.message}
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
              startElement={<AppIcon icon={MailIcon} color={"fg.subtle"} />}
              placeholder={"pegawai@atrbpn.go.id"}
              readOnly={isUserLoggedIn}
              bg={isUserLoggedIn ? "bg.subtle" : undefined}
              cursor={isUserLoggedIn ? "not-allowed" : undefined}
              tabIndex={isUserLoggedIn ? -1 : undefined}
              {...totpForm.register("email", {
                required: "Email wajib diisi",
              })}
            />
          </Field>

          <Field
            label={"Kode Google Authenticator (6 Digit)"}
            invalid={Boolean(totpForm.formState.errors.totpCode)}
            errorText={totpForm.formState.errors.totpCode?.message}
          >
            <VStack align={"center"} w={"full"} py={"xs"}>
              <PinInput
                count={6}
                otp={true}
                autoFocus={true}
                onValueChange={(details) => {
                  totpForm.setValue("totpCode", details.value.join(""));
                }}
                onValueComplete={(details) => {
                  const code = details.value.join("");
                  totpForm.setValue("totpCode", code, {
                    shouldValidate: true,
                  });
                  totpForm.handleSubmit(handleTotpSubmit)();
                }}
              />
            </VStack>
          </Field>
        </Fieldset>

        <HStack justify={"start"} align={"center"} mt={"xs"}>
          <Button
            variant={"ghost"}
            size={"xs"}
            type={"button"}
            onClick={onBackToMethod}
          >
            <AppIcon icon={ArrowLeftIcon} />
            {"Ganti Metode"}
          </Button>
        </HStack>

        <Button
          primary={true}
          type={"submit"}
          w={"full"}
          loading={verifyTotpMutation.isPending}
        >
          <AppIcon icon={ShieldCheckIcon} />
          {"Verifikasi Kode Authenticator"}
        </Button>
      </VStack>
    );
  }

  return (
    <VStack
      as={"form"}
      onSubmit={newPasswordForm.handleSubmit(handlePasswordSubmit)}
      gap={"md"}
      align={"stretch"}
    >
      <Alert.Root status={"info"} colorPalette={"green"} variant={"subtle"}>
        <AppIcon icon={InfoIcon} />
        <Alert.Description fontSize={"xs"}>
          {
            "Kode Authenticator berhasil divalidasi. Buat kata sandi baru yang kuat untuk akun Anda."
          }
        </Alert.Description>
      </Alert.Root>

      <Fieldset>
        <Field
          label={"Kata Sandi Baru"}
          invalid={Boolean(newPasswordForm.formState.errors.newPassword)}
          errorText={newPasswordForm.formState.errors.newPassword?.message}
        >
          <PasswordInput
            startElement={<AppIcon icon={LockIcon} color={"fg.subtle"} />}
            placeholder={"Minimal 8 karakter"}
            withPasswordStrength={true}
            {...newPasswordForm.register("newPassword")}
          />
        </Field>

        <Field
          label={"Konfirmasi Kata Sandi Baru"}
          invalid={Boolean(newPasswordForm.formState.errors.confirmPassword)}
          errorText={newPasswordForm.formState.errors.confirmPassword?.message}
        >
          <PasswordInput
            startElement={<AppIcon icon={LockIcon} color={"fg.subtle"} />}
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
          onClick={() => setSubStep("totp")}
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
  );
};
