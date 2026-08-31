// src/features/auth/components/ui/signin.form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, PLink } from "@/design-system/components/typography/ui/p";
import { useSigninMutation } from "@/features/auth/hooks/use-signin.mutation";
import {
  createSigninSchema,
  type SigninFormValues,
  zodResolver,
} from "@/features/auth/schemas/signin.schema";
import { HandshakeIcon, ShieldCheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "@tanstack/react-router";

export const MitraSignin = (props: StackProps) => {
  // Hooks
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
          <Input placeholder={"jolitos@email.com"} {...register("email")} />
        </Field>

        <Field
          label={"Kata Sandi"}
          invalid={Boolean(errors.password)}
          errorText={errors.password?.message}
        >
          <PasswordInput {...register("password")} />
        </Field>

        <PLink ml={"auto"}>{"Lupa kata sandi?"}</PLink>
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
        <P
          fontSize={"sm"}
          color={"fg.muted"}
          as={"div"}
          display={"flex"}
          gap={"1"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {"Belum bermitra dengan ATR/BPN? "}
          <Link
            to={"/register"}
            style={{
              color: "var(--chakra-colors-blue-600)",
              textDecoration: "underline",
            }}
          >
            {"Daftar Mitra Baru"}
          </Link>
        </P>

        <P
          fontSize={"sm"}
          color={"fg.muted"}
          as={"div"}
          display={"flex"}
          gap={"1"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {"Sudah mendaftar? "}
          <Link
            to={"/registration-status"}
            style={{
              color: "var(--chakra-colors-blue-600)",
              textDecoration: "underline",
            }}
          >
            {"Cek Status Pengajuan"}
          </Link>
        </P>
      </VStack>
    </VStack>
  );
};

export const InternalSignin = (props: StackProps) => {
  // Hooks
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
      role: "internal",
    });
  };

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
        <Badge size={"lg"} colorPalette={"purple"}>
          <AppIcon icon={ShieldCheckIcon} size={"sm"} />

          <P fontSize={"xs"} fontWeight={"semibold"} letterSpacing={"wider"}>
            {"INTERNAL ATR/BPN"}
          </P>
        </Badge>

        <VStack align={"center"} gap={1}>
          <P fontSize={"2xl"} fontWeight={"semibold"} textAlign={"center"}>
            {"Selamat Datang Admin 👋🏻"}
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
          <Input placeholder={"jolitos@email.com"} {...register("email")} />
        </Field>

        <Field
          label={"Kata Sandi"}
          invalid={Boolean(errors.password)}
          errorText={errors.password?.message}
        >
          <PasswordInput {...register("password")} />
        </Field>

        <PLink ml={"auto"}>{"Lupa kata sandi?"}</PLink>
      </Fieldset>

      <Button
        primary={true}
        type={"submit"}
        w={"full"}
        mt={8}
        loading={signinMutation.isPending}
      >
        {"Masuk"}
      </Button>
    </VStack>
  );
};
