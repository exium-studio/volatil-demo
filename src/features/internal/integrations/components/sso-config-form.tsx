// src/features/internal/integration/components/sso-config-form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import {
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle,
} from "@/design-system/components/feedback/ui/alert";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Circle } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  useSsoIntegrationQuery,
  useUpdateSsoIntegrationMutation,
} from "@/features/internal/integrations/hooks/use-integration.query";
import { ssoFormSchema } from "@/features/internal/integrations/schemas/integration.schema";
import type { SsoFormValues } from "@/features/internal/integrations/types/integration.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { HandshakeIcon, InfoIcon, SaveIcon, UsersIcon } from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export const SsoConfigForm = () => {
  // Stores
  const { theme } = useThemeStore();

  // Hooks (Queries & Mutations)
  const { data: config, isLoading } = useSsoIntegrationQuery();
  const updateMutation = useUpdateSsoIntegrationMutation();

  const canonicalRedirectUri =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback/keycloak`
      : "/auth/callback/keycloak";

  // Derived Values
  const formValues = useMemo<SsoFormValues>(() => {
    return {
      mitra: {
        issuerUrl: config?.mitra?.issuerUrl ?? "",
        clientId: config?.mitra?.clientId ?? "",
        clientSecret: config?.mitra?.clientSecret ?? "",
        redirectUri: canonicalRedirectUri,
      },
      internal: {
        isEnabled: config?.internal?.isEnabled ?? false,
        issuerUrl: config?.internal?.issuerUrl ?? "",
        clientId: config?.internal?.clientId ?? "",
        clientSecret: config?.internal?.clientSecret ?? "",
        redirectUri: canonicalRedirectUri,
      },
    };
  }, [config, canonicalRedirectUri]);

  // Form (RHF + Zod)
  const form = useForm<SsoFormValues>({
    resolver: zodResolver(ssoFormSchema),
    values: formValues,
  });

  const isInternalEnabled = useWatch({
    control: form.control,
    name: "internal.isEnabled",
    defaultValue: false,
  });

  // Handlers
  const onSubmit = (values: SsoFormValues) => {
    updateMutation.mutate({
      ...values,
      mitra: {
        ...values.mitra,
        redirectUri: canonicalRedirectUri,
      },
      internal: {
        ...values.internal,
        redirectUri: canonicalRedirectUri,
      },
    });
  };

  if (isLoading || !config) {
    return (
      <VStack gap={4} w={"full"} align={"stretch"}>
        <Skeleton h={"80px"} w={"full"} rounded={theme.radii.component} />
        <Skeleton h={"80px"} w={"full"} rounded={theme.radii.component} />
        <Skeleton h={"64px"} w={"full"} rounded={theme.radii.component} />
        <Skeleton h={"64px"} w={"full"} rounded={theme.radii.component} />
        <Skeleton
          h={"40px"}
          w={"140px"}
          rounded={theme.radii.component}
          alignSelf={"flex-end"}
        />
      </VStack>
    );
  }

  return (
    <VStack
      as={"form"}
      onSubmit={form.handleSubmit(onSubmit)}
      gap={6}
      w={"full"}
      align={"stretch"}
    >
      {/* CARD 1: Konfigurasi SSO Mitra (Eksternal) */}
      <Fieldset
        legend={"1. Konfigurasi SSO Mitra (Eksternal)"}
        containeredContent={true}
      >
        <VStack gap={4} align={"stretch"} w={"full"}>
          <HStack
            align={"center"}
            justify={"space-between"}
            gap={"md"}
            p={3}
            rounded={theme.radii.component}
            bg={"bg.subtle"}
          >
            <HStack align={"start"} gap={"xs"}>
              <Circle p={"2xs"}>
                <AppIcon
                  icon={HandshakeIcon}
                  color={`${theme.colorPalette}.solid`}
                />
              </Circle>

              <VStack gap={"2xs"} align={"start"}>
                <P fontWeight={"semibold"}>{"SSO Mitra"}</P>

                <P fontSize={"xs"} color={"fg.muted"}>
                  {
                    "Kredensial dan endpoint Keycloak realm Mitra untuk proses login dan registrasi pemohon data spasial."
                  }
                </P>
              </VStack>
            </HStack>
          </HStack>

          <VStack gap={4} align={"stretch"} w={"full"} pt={2}>
            <Field
              label={"Issuer / Realm URL"}
              helperText={"URL realm autentikasi Keycloak Mitra ATR/BPN"}
              errorText={form.formState.errors.mitra?.issuerUrl?.message}
              w={"full"}
            >
              <Input
                placeholder={
                  "https://loginmitradev.atrbpn.go.id/auth/realms/mitra"
                }
                defaultValue={formValues.mitra.issuerUrl}
                {...form.register("mitra.issuerUrl")}
                w={"full"}
              />
            </Field>

            <Field
              label={"Client ID"}
              helperText={
                "Identifier klien OIDC Mitra yang terdaftar di Keycloak"
              }
              errorText={form.formState.errors.mitra?.clientId?.message}
              w={"full"}
            >
              <Input
                placeholder={"volatil-mitra-client"}
                defaultValue={formValues.mitra.clientId}
                {...form.register("mitra.clientId")}
                w={"full"}
              />
            </Field>

            <Field
              label={"Client Secret"}
              helperText={
                "Kunci rahasia klien Mitra dari Keycloak. Biarkan kosong jika tidak ingin mengubah kunci tersimpan"
              }
              errorText={form.formState.errors.mitra?.clientSecret?.message}
              w={"full"}
            >
              <PasswordInput
                placeholder={"••••••••"}
                defaultValue={formValues.mitra.clientSecret}
                {...form.register("mitra.clientSecret")}
                w={"full"}
              />
            </Field>

            <Field
              label={"Callback Redirect URI (Resmi)"}
              helperText={
                "URL callback resmi aplikasi (read-only). Salin URL ini dan daftarkan ke 'Valid Redirect URIs' pada client Keycloak ATR/BPN."
              }
              w={"full"}
            >
              <Input
                value={canonicalRedirectUri}
                readOnly={true}
                w={"full"}
                pr={"44px"}
                endElement={
                  <ClipboardButton
                    value={canonicalRedirectUri}
                    aria-label={"Salin Callback Redirect URI"}
                    variant={"plain"}
                    size={"xs"}
                    mr={"-8px"}
                  />
                }
              />
            </Field>
          </VStack>
        </VStack>
      </Fieldset>

      {/* CARD 2: SSO Pegawai Internal ASN ATR/BPN (Configurable) */}
      <Fieldset
        legend={"2. SSO Pegawai Internal ASN ATR/BPN"}
        containeredContent={true}
      >
        <VStack gap={4} align={"stretch"} w={"full"}>
          <HStack
            align={"center"}
            justify={"space-between"}
            gap={"md"}
            p={3}
            rounded={theme.radii.component}
            bg={"bg.subtle"}
          >
            <HStack align={"start"} gap={"xs"}>
              <Circle p={"2xs"}>
                <AppIcon
                  icon={UsersIcon}
                  color={`${theme.colorPalette}.solid`}
                />
              </Circle>

              <VStack gap={0} align={"start"}>
                <P fontWeight={"semibold"}>{"SSO Internal"}</P>

                <P fontSize={"xs"} color={"fg.muted"}>
                  {
                    "Izinkan pegawai internal login menggunakan kredensial Single Sign-On Keycloak Pusdatin."
                  }
                </P>
              </VStack>
            </HStack>

            <Controller
              control={form.control}
              name={"internal.isEnabled"}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={({ checked }) => field.onChange(checked)}
                />
              )}
            />
          </HStack>

          {/* Alert when SSO Internal is disabled */}
          {!isInternalEnabled && (
            <AlertRoot status={"info"} variant={"subtle"}>
              <AlertIndicator>
                <AppIcon icon={InfoIcon} />
              </AlertIndicator>
              <AlertContent>
                <AlertTitle>{"SSO Internal Nonaktif"}</AlertTitle>
                <AlertDescription>
                  {
                    "Login SSO pegawai internal saat ini dinonaktifkan. Seluruh pegawai hanya dapat login via kredensial akun lokal."
                  }
                </AlertDescription>
              </AlertContent>
            </AlertRoot>
          )}

          {/* Form fields active only when internal SSO is enabled */}
          {isInternalEnabled && (
            <VStack gap={4} align={"stretch"} w={"full"} pt={2}>
              <Field
                label={"Issuer / Realm URL"}
                helperText={"URL realm autentikasi Keycloak Pusdatin ATR/BPN"}
                errorText={form.formState.errors.internal?.issuerUrl?.message}
                w={"full"}
              >
                <Input
                  placeholder={
                    "https://logininternaldev.atrbpn.go.id/auth/realms/internal"
                  }
                  defaultValue={formValues.internal.issuerUrl}
                  {...form.register("internal.issuerUrl")}
                  w={"full"}
                />
              </Field>

              <Field
                label={"Client ID"}
                helperText={
                  "Identifier klien OIDC yang terdaftar di Keycloak Pusdatin"
                }
                errorText={form.formState.errors.internal?.clientId?.message}
                w={"full"}
              >
                <Input
                  placeholder={"dotnet-web-multiotp"}
                  defaultValue={formValues.internal.clientId}
                  {...form.register("internal.clientId")}
                  w={"full"}
                />
              </Field>

              <Field
                label={"Client Secret"}
                helperText={
                  "Kunci rahasia dari Pusdatin. Biarkan kosong jika tidak ingin mengubah kunci tersimpan"
                }
                errorText={
                  form.formState.errors.internal?.clientSecret?.message
                }
                w={"full"}
              >
                <PasswordInput
                  placeholder={"••••••••••••••••••••••••"}
                  defaultValue={formValues.internal.clientSecret}
                  {...form.register("internal.clientSecret")}
                  w={"full"}
                />
              </Field>

              <Field
                label={"Callback Redirect URI (Resmi)"}
                helperText={
                  "URL callback resmi aplikasi (read-only). Salin URL ini dan daftarkan ke 'Valid Redirect URIs' pada client Keycloak ATR/BPN."
                }
                w={"full"}
              >
                <Input
                  value={canonicalRedirectUri}
                  readOnly={true}
                  w={"full"}
                  pr={"44px"}
                  endElement={
                    <ClipboardButton
                      value={canonicalRedirectUri}
                      aria-label={"Salin Callback Redirect URI"}
                      variant={"plain"}
                      size={"xs"}
                      mr={"-8px"}
                    />
                  }
                />
              </Field>
            </VStack>
          )}
        </VStack>
      </Fieldset>

      {/* Actions */}
      <HStack justify={"flex-end"} gap={3}>
        <Button
          type={"submit"}
          primary={true}
          loading={updateMutation.isPending || isLoading}
        >
          <AppIcon icon={SaveIcon} />
          {"Simpan Konfigurasi"}
        </Button>
      </HStack>
    </VStack>
  );
};
