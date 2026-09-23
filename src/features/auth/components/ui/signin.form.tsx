// src/features/auth/components/ui/signin.form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { TotpSetupStep } from "@/features/auth/components/ui/totp-setup-step";
import { TotpVerifyStep } from "@/features/auth/components/ui/totp-verify-step";
import { UserSessionActions } from "@/features/auth/components/ui/user-session-actions";
import { UserSessionCard } from "@/features/auth/components/ui/user-session-card";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import {
  useInternalSigninStep1Mutation,
  useInternalTotpSetupMutation,
} from "@/features/auth/hooks/use-internal-auth.mutation";
import { useSigninMutation } from "@/features/auth/hooks/use-signin.mutation";
import { useSsoSigninMutation } from "@/features/auth/hooks/use-sso-signin.mutation";
import {
  createSigninSchema,
  zodResolver,
} from "@/features/auth/schemas/signin.schema";
import type {
  AdminSigninSearch,
  InternalAuthState,
  SigninFormValues,
} from "@/features/auth/types/signin.type";
import { isDevModeEnabled } from "@/shared/utils/env/env.utils";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertTriangleIcon,
  Code2Icon,
  HandshakeIcon,
  KeyRoundIcon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const MitraSignin = (props: StackProps) => {
  // Hooks
  const { user, isAuthenticated } = useAuthSession();
  const signinMutation = useSigninMutation();
  const ssoSigninMutation = useSsoSigninMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(createSigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Derived Values
  const isDevMode = isDevModeEnabled();

  // Handlers
  const handleLogin = (values: SigninFormValues) => {
    signinMutation.mutate({
      email: values.email,
      password: values.password,
      role: "mitra",
    });
  };

  const handleSsoClick = () => {
    ssoSigninMutation.mutate();
  };

  if (isAuthenticated && user) {
    return (
      <VStack
        flex={1}
        justify={"space-between"}
        gap={"lg"}
        w={"full"}
        {...props}
      >
        <UserSessionCard user={user} portalType={"mitra"} />

        <UserSessionActions user={user} />
      </VStack>
    );
  }

  return (
    <VStack flex={1} justify={"space-between"} gap={"lg"} w={"full"} {...props}>
      <VStack align={"center"} gap={"lg"} w={"full"}>
        <Badge size={"lg"} colorPalette={"blue"}>
          <AppIcon icon={HandshakeIcon} size={"sm"} />

          <P fontSize={"xs"} fontWeight={"semibold"} letterSpacing={"wider"}>
            {"PORTAL MITRA"}
          </P>
        </Badge>

        <VStack align={"center"} gap={1}>
          <P fontSize={"2xl"} fontWeight={"semibold"} textAlign={"center"}>
            {"Selamat Datang Mitra 👋🏻"}
          </P>

          <P color={"fg.muted"} textAlign={"center"}>
            {"Masuk menggunakan akun Single Sign-On (SSO) Mitra Anda."}
          </P>
        </VStack>
      </VStack>

      {/* SSO Login Action */}
      <VStack w={"full"} gap={3}>
        <Button
          primary={true}
          type={"button"}
          w={"full"}
          size={"lg"}
          loading={ssoSigninMutation.isPending}
          onClick={handleSsoClick}
        >
          <AppIcon icon={KeyRoundIcon} />
          {"Masuk dengan SSO Mitra"}
        </Button>
      </VStack>

      {/* Divider Dev / Fallback & Development / Fallback Login Form */}
      {isDevMode && (
        <>
          <HStack w={"full"} align={"center"} my={1}>
            <Separator flex={1} />
            <Badge
              size={"sm"}
              variant={"surface"}
              colorPalette={"amber"}
              px={2}
            >
              <AppIcon icon={Code2Icon} size={"xs"} />
              <P fontSize={"2xs"} fontWeight={"medium"}>
                {"DEVELOPMENT PURPOSE ONLY"}
              </P>
            </Badge>
            <Separator flex={1} />
          </HStack>

          <VStack
            as={"form"}
            onSubmit={handleSubmit(handleLogin)}
            w={"full"}
            gap={"md"}
          >
            <Fieldset>
              <Field
                label={"Email"}
                invalid={Boolean(errors.email)}
                errorText={errors.email?.message}
              >
                <Input
                  startElement={<AppIcon icon={MailIcon} color={"fg.subtle"} />}
                  placeholder={"mitra@instansi.go.id"}
                  {...register("email")}
                />
              </Field>

              <Field
                label={"Kata Sandi"}
                invalid={Boolean(errors.password)}
                errorText={errors.password?.message}
              >
                <PasswordInput
                  startElement={<AppIcon icon={LockIcon} color={"fg.subtle"} />}
                  {...register("password")}
                />
              </Field>
            </Fieldset>

            <Button
              variant={"outline"}
              type={"submit"}
              w={"full"}
              loading={signinMutation.isPending}
            >
              {"Masuk dengan Kredensial (Dev Mode)"}
            </Button>
          </VStack>
        </>
      )}

      <VStack gap={2} align={"center"} w={"full"}>
        <HStack wrap={"wrap"} justify={"center"} gapX={"xs"}>
          <P fontSize={"sm"} color={"fg.muted"}>
            {"Belum bermitra dengan ATR/BPN? "}
          </P>

          <Link
            to={"/register"}
            style={{
              color: "var(--chakra-colors-blue-600)",
              textDecoration: "underline",
            }}
          >
            {"Daftar Mitra Baru"}
          </Link>
        </HStack>

        <HStack wrap={"wrap"} justify={"center"} gapX={"xs"}>
          <P fontSize={"sm"} color={"fg.muted"}>
            {"Sudah mendaftar? "}
          </P>

          <Link
            to={"/registration-status"}
            style={{
              color: "var(--chakra-colors-blue-600)",
              textDecoration: "underline",
            }}
          >
            {"Cek Status Pengajuan"}
          </Link>
        </HStack>
      </VStack>
    </VStack>
  );
};

export const InternalSignin = (props: StackProps) => {
  // Hooks
  const { user, isAuthenticated } = useAuthSession();
  const navigate = useNavigate();
  const step1Mutation = useInternalSigninStep1Mutation();
  const setupMutation = useInternalTotpSetupMutation();
  const search = useSearch({ strict: false }) as AdminSigninSearch;

  // States
  const [authState, setAuthState] = useState<InternalAuthState>({
    screen: "login",
    mfaToken: null,
    mfaTokenExpiresIn: 300,
    setupData: null,
    email: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(createSigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Derived Values
  const errorMessage =
    search.reason === "session_expired"
      ? "Sesi Anda telah berakhir. Silakan masuk kembali."
      : search.error;

  // Handlers
  const handleLogin = (values: SigninFormValues) => {
    step1Mutation.mutate(
      {
        email: values.email,
        password: values.password,
        role: "internal",
      },
      {
        onSuccess: (data) => {
          if ("mfaRequired" in data && data.mfaRequired) {
            setAuthState({
              screen: "totp-verify",
              mfaToken: data.mfaToken,
              mfaTokenExpiresIn: data.mfaTokenExpiresIn || 300,
              setupData: null,
              email: values.email,
            });
            return;
          }

          if ("requiresTotpSetup" in data && data.requiresTotpSetup) {
            setupMutation.mutate(data.mfaToken, {
              onSuccess: (setupData) => {
                setAuthState({
                  screen: "totp-setup-qr",
                  mfaToken: data.mfaToken,
                  mfaTokenExpiresIn: data.mfaTokenExpiresIn || 300,
                  setupData,
                  email: values.email,
                });
              },
            });
            return;
          }

          if ("accessToken" in data && data.accessToken) {
            void navigate({ to: "/internal/welcome" });
          }
        },
      },
    );
  };

  const handleBackToLogin = () => {
    setAuthState({
      screen: "login",
      mfaToken: null,
      mfaTokenExpiresIn: 300,
      setupData: null,
      email: "",
    });
  };

  if (isAuthenticated && user) {
    return (
      <VStack
        flex={1}
        justify={"space-between"}
        gap={"lg"}
        w={"full"}
        {...props}
      >
        <UserSessionCard user={user} portalType={"internal"} />

        <UserSessionActions user={user} />
      </VStack>
    );
  }

  if (authState.screen === "totp-verify" && authState.mfaToken) {
    return (
      <TotpVerifyStep
        email={authState.email}
        mfaToken={authState.mfaToken}
        onSuccess={() => void navigate({ to: "/internal/welcome" })}
        onBackToLogin={handleBackToLogin}
        {...props}
      />
    );
  }

  if (authState.screen === "totp-setup-qr" && authState.mfaToken) {
    return (
      <TotpSetupStep
        email={authState.email}
        mfaToken={authState.mfaToken}
        setupData={authState.setupData}
        onSuccess={() => void navigate({ to: "/internal/welcome" })}
        onBackToLogin={handleBackToLogin}
        {...props}
      />
    );
  }

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(handleLogin)}
      flex={1}
      justify={"space-between"}
      gap={"lg"}
      w={"full"}
      {...props}
    >
      <VStack align={"center"} gap={"lg"} w={"full"}>
        <Badge size={"lg"} colorPalette={"purple"}>
          <AppIcon icon={ShieldCheckIcon} size={"sm"} />

          <P fontSize={"xs"} fontWeight={"semibold"} letterSpacing={"wider"}>
            {"INTERNAL ATR/BPN"}
          </P>
        </Badge>

        <VStack align={"center"} gap={1}>
          <P fontSize={"2xl"} fontWeight={"semibold"} textAlign={"center"}>
            {"Selamat Datang Pegawai ATR/BPN 👋🏻"}
          </P>

          <P color={"fg.muted"} textAlign={"center"}>
            {"Masukkan email dan kata sandi kedinasan Anda untuk masuk."}
          </P>
        </VStack>
      </VStack>

      {errorMessage && (
        <HStack
          p={3}
          bg={"bg.error"}
          borderColor={"border.error"}
          borderWidth={"1px"}
          rounded={"md"}
          w={"full"}
          gap={3}
          align={"start"}
        >
          <AppIcon icon={AlertTriangleIcon} color={"fg.error"} size={"md"} />

          <P fontSize={"sm"} color={"fg.error"}>
            {errorMessage}
          </P>
        </HStack>
      )}

      {/* Standard Internal Email/Password Form */}
      <Fieldset>
        <Field
          label={"Email Pegawai"}
          invalid={Boolean(errors.email)}
          errorText={errors.email?.message}
        >
          <Input
            startElement={<AppIcon icon={MailIcon} color={"fg.subtle"} />}
            placeholder={"pegawai@atrbpn.go.id"}
            {...register("email")}
          />
        </Field>

        <Field
          label={"Kata Sandi"}
          invalid={Boolean(errors.password)}
          errorText={errors.password?.message}
        >
          <PasswordInput
            startElement={<AppIcon icon={LockIcon} color={"fg.subtle"} />}
            {...register("password")}
          />
        </Field>
      </Fieldset>

      <Button
        primary={true}
        type={"submit"}
        w={"full"}
        mt={4}
        loading={step1Mutation.isPending || setupMutation.isPending}
      >
        {"Masuk ke Portal Internal"}
      </Button>

      <P fontSize={"xs"} color={"fg.subtle"} textAlign={"center"}>
        {"Akses terbatas hanya untuk pegawai dan administrator resmi ATR/BPN."}
      </P>
    </VStack>
  );
};
