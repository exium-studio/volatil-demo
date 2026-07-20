// src/features/auth/components/ui/signin.form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { PLink } from "@/design-system/components/typography/ui/p";

export const MitraSignin = () => {
  return (
    <VStack flex={1}>
      <Fieldset mb={"auto"}>
        <Field label={"Email"}>
          <Input placeholder={"jolitos@email.com"} />
        </Field>

        <Field label={"Kata Sandi"}>
          <PasswordInput placeholder={"••••••••"} />
        </Field>

        <PLink ml={"auto"}>Lupa kata sandi?</PLink>
      </Fieldset>

      <Button primary type={"submit"} mt={8}>
        Masuk
      </Button>
    </VStack>
  );
};

export const InternalSignin = () => {
  return (
    <VStack>
      <Fieldset>
        <Field label={"Email"}>
          <Input />
        </Field>

        <Field label={"Kata Sandi"}>
          <PasswordInput />
        </Field>
      </Fieldset>
    </VStack>
  );
};
