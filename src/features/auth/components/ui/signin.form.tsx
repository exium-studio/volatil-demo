// src/features/auth/components/ui/signin.form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { PLink } from "@/design-system/components/typography/ui/p";
import type { InternalUser, MitraUser } from "@/shared/types/response.type";
import { setStorage } from "@/shared/utils/client/client.storage";
import { useNavigate } from "@tanstack/react-router";

export const MitraSignin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const dummyMitraUser: MitraUser = {
      id: "mitra-123",
      email: "mitra@volatil.com",
      name: "Mitra Volatil",
      role: "mitra",
      companyName: "PT Volatil Sukses Makmur",
      companyRegistrationNumber: "REG-987654321",
      purchasedQuota: 100,
      tier: "premium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStorage("user", JSON.stringify(dummyMitraUser));
    navigate({ to: "/portal/welcome" });
  };

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

      <Button
        primary={true}
        type={"button"}
        w={"full"}
        mt={8}
        onClick={handleLogin}
      >
        Masuk
      </Button>
    </VStack>
  );
};

export const InternalSignin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const dummyInternalUser: InternalUser = {
      id: "internal-123",
      email: "admin@volatil.com",
      name: "Internal Admin",
      role: "internal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStorage("user", JSON.stringify(dummyInternalUser));
    navigate({ to: "/portal/welcome" });
  };

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

      <Button
        primary={true}
        type={"button"}
        w={"full"}
        mt={8}
        onClick={handleLogin}
      >
        Masuk
      </Button>
    </VStack>
  );
};
