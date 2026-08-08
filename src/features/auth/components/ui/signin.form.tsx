// src/features/auth/components/ui/signin.form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { PLink } from "@/design-system/components/typography/ui/p";
import { useSigninMutation } from "@/features/auth/hooks/use-signin.mutation";
import {
  createSigninSchema,
  type SigninFormValues,
  zodResolver,
} from "@/features/auth/schemas/signin.schema";
import { useForm } from "react-hook-form";

export const MitraSignin = () => {
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
      w={"full"}
    >
      <Fieldset mb={"auto"}>
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
          <PasswordInput placeholder={"••••••••"} {...register("password")} />
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

export const InternalSignin = () => {
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
      w={"full"}
    >
      <Fieldset mb={"auto"}>
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
          <PasswordInput placeholder={"••••••••"} {...register("password")} />
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
