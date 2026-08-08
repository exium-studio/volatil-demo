// src/features/auth/components/ui/signin.form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { toast } from "@/design-system/components/toast";
import { PLink } from "@/design-system/components/typography/ui/p";
import {
  createSigninSchema,
  type SigninFormValues,
  zodResolver,
} from "@/features/auth/schemas/signin.schema";
import { authService } from "@/features/auth/services/auth.service";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export const MitraSignin = () => {
  // Hooks
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(createSigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handlers
  const handleLogin = async (values: SigninFormValues) => {
    try {
      await authService.login({
        email: values.email,
        password: values.password,
        role: "mitra",
      });
      toast.create({
        variant: "success",
        title: "Berhasil masuk sebagai Mitra!",
      });
      navigate({ to: "/mitra/welcome" });
    } catch (err) {
      toast.create({
        variant: "error",
        title: "Gagal masuk",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat masuk",
      });
    }
  };

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(handleLogin)}
      flex={1}
      w={"full"}
    >
      <Fieldset mb={"auto"}>
        <Field
          label={"Email"}
          invalid={Boolean(errors.email)}
          errorText={errors.email?.message}
        >
          <Input
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
            placeholder={"••••••••"}
            {...register("password")}
          />
        </Field>

        <PLink ml={"auto"}>{"Lupa kata sandi?"}</PLink>
      </Fieldset>

      <Button
        primary={true}
        type={"submit"}
        w={"full"}
        mt={8}
        loading={isSubmitting}
      >
        {"Masuk"}
      </Button>
    </VStack>
  );
};

export const InternalSignin = () => {
  // Hooks
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(createSigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handlers
  const handleLogin = async (values: SigninFormValues) => {
    try {
      await authService.login({
        email: values.email,
        password: values.password,
        role: "internal",
      });
      toast.create({
        variant: "success",
        title: "Berhasil masuk sebagai Internal Admin!",
      });
      navigate({ to: "/internal/welcome" });
    } catch (err) {
      toast.create({
        variant: "error",
        title: "Gagal masuk",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat masuk",
      });
    }
  };

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(handleLogin)}
      flex={1}
      w={"full"}
    >
      <Fieldset mb={"auto"}>
        <Field
          label={"Email"}
          invalid={Boolean(errors.email)}
          errorText={errors.email?.message}
        >
          <Input
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
            placeholder={"••••••••"}
            {...register("password")}
          />
        </Field>

        <PLink ml={"auto"}>{"Lupa kata sandi?"}</PLink>
      </Fieldset>

      <Button
        primary={true}
        type={"submit"}
        w={"full"}
        mt={8}
        loading={isSubmitting}
      >
        {"Masuk"}
      </Button>
    </VStack>
  );
};
