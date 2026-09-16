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
import { UserSessionActions } from "@/features/auth/components/ui/user-session-actions";
import { UserSessionCard } from "@/features/auth/components/ui/user-session-card";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useSigninMutation } from "@/features/auth/hooks/use-signin.mutation";
import { useSsoSigninMutation } from "@/features/auth/hooks/use-sso-signin.mutation";
import {
  createSigninSchema,
  zodResolver,
} from "@/features/auth/schemas/signin.schema";
import type {
  AdminSigninSearch,
  SigninFormValues,
} from "@/features/auth/types/signin.type";
import { Link, useSearch } from "@tanstack/react-router";
import {
  AlertTriangleIcon,
  HandshakeIcon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";

export const MitraSignin = (props: StackProps) => {
  // Hooks
  const { user, isAuthenticated } = useAuthSession();
  const signinMutation = useSigninMutation();

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

  // Handlers
  const handleLogin = (values: SigninFormValues) => {
    signinMutation.mutate({
      email: values.email,
      password: values.password,
      role: "mitra",
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
        <UserSessionCard user={user} portalType={"mitra"} />

        <UserSessionActions user={user} />
      </VStack>
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
      <VStack align={"center"} gap={"lg"}>
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
            {"Pastikan informasi yang dimasukkan sudah benar!"}
          </P>
        </VStack>
      </VStack>

      <Fieldset>
        <Field
          label={"Email"}
          invalid={Boolean(errors.email)}
          errorText={errors.email?.message}
        >
          <Input
            startElement={<AppIcon icon={MailIcon} color={"fg.subtle"} />}
            placeholder={"jolitos@email.com"}
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

        {/* <PLink ml={"auto"}>{"Lupa kata sandi?"}</PLink> */}
      </Fieldset>

      <Button
        primary={true}
        type={"submit"}
        w={"full"}
        mt={4}
        loading={signinMutation.isPending}
      >
        {"Masuk"}
      </Button>

      <VStack gap={2} mt={2} align={"center"} w={"full"}>
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
  const signinMutation = useSigninMutation();
  const ssoSigninMutation = useSsoSigninMutation();
  const search = useSearch({ strict: false }) as AdminSigninSearch;

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
      ? "Sesi Anda telah berakhir setelah 8 jam. Silakan masuk kembali melalui SSO ATR/BPN."
      : search.error;

  // Handlers
  const handleLogin = (values: SigninFormValues) => {
    signinMutation.mutate({
      email: values.email,
      password: values.password,
      role: "internal",
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
        <UserSessionCard user={user} portalType={"internal"} />

        <UserSessionActions user={user} />
      </VStack>
    );
  }

  return (
    <VStack flex={1} justify={"space-between"} gap={"lg"} w={"full"} {...props}>
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
            {"Gunakan akun SSO Keycloak Internal ATR/BPN untuk masuk."}
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
          <AppIcon icon={ShieldCheckIcon} />
          {"Login Pegawai ATR/BPN"}
        </Button>

        <P fontSize={"xs"} color={"fg.subtle"} textAlign={"center"}>
          {"Autentikasi Single Sign-On resmi Kementerian ATR/BPN"}
        </P>
      </VStack>

      <HStack w={"full"} align={"center"} my={2}>
        <Separator flex={1} />
        <P
          fontSize={"2xs"}
          color={"fg.muted"}
          textTransform={"uppercase"}
          px={2}
        >
          {"atau masuk dengan kredensial"}
        </P>
        <Separator flex={1} />
      </HStack>

      {/* Direct Fallback Login Form */}
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
          variant={"outline"}
          type={"submit"}
          w={"full"}
          mt={2}
          loading={signinMutation.isPending}
        >
          {"Masuk dengan Kredensial"}
        </Button>
      </VStack>
    </VStack>
  );
};
