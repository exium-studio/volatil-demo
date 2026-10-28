// src/features/internal/integrasi/components/sso-config-form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AlertContent, AlertDescription, AlertIndicator, AlertRoot, AlertTitle } from "@/design-system/components/feedback/ui/alert";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { StringArrayInput } from "@/design-system/components/input/ui/string-array-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  useSsoIntegrationQuery,
  useUpdateSsoIntegrationMutation,
} from "@/features/internal/integrations/hooks/use-integration.query";
import { ssoFormSchema } from "@/features/internal/integrations/schemas/integration.schema";
import type { SsoFormValues } from "@/features/internal/integrations/types/integration.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2Icon, InfoIcon, KeyRoundIcon, LockIcon, SaveIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export const SsoConfigForm = () => {
  // Stores
  const { theme } = useThemeStore();

  // Hooks (Queries & Mutations)
  const { data: config, isLoading } = useSsoIntegrationQuery();
  const updateMutation = useUpdateSsoIntegrationMutation();

  // Form (RHF + Zod)
  const form = useForm<SsoFormValues>({
    resolver: zodResolver(ssoFormSchema),
    defaultValues: {
      internal: {
        isEnabled: true,
        issuerUrl: "",
        clientId: "",
        clientSecret: "",
        redirectUri: "",
        allowedDomains: [],
      },
    },
  });

  const isInternalEnabled = useWatch({
    control: form.control,
    name: "internal.isEnabled",
    defaultValue: true,
  });

  // Effects
  useEffect(() => {
    if (config?.internal) {
      form.reset({
        internal: {
          isEnabled: config.internal.isEnabled ?? true,
          issuerUrl: config.internal.issuerUrl ?? "",
          clientId: config.internal.clientId ?? "",
          clientSecret: config.internal.clientSecret ?? "",
          redirectUri: config.internal.redirectUri ?? "",
          allowedDomains: config.internal.allowedDomains ?? [],
        },
      });
    }
  }, [config, form]);

  // Handlers
  const onSubmit = (values: SsoFormValues) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <VStack gap={4} w={"full"} align={"stretch"}>
        <Skeleton h={"80px"} w={"full"} rounded={theme.radii.component} />
        <Skeleton h={"80px"} w={"full"} rounded={theme.radii.component} />
        <Skeleton h={"64px"} w={"full"} rounded={theme.radii.component} />
        <Skeleton h={"64px"} w={"full"} rounded={theme.radii.component} />
        <Skeleton h={"40px"} w={"140px"} rounded={theme.radii.component} alignSelf={"flex-end"} />
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
      {/* CARD 1: SSO Mitra Eksternal (Hardcoded & Wajib) */}
      <Fieldset legend={"1. SSO Mitra Eksternal (Kemitraan Spasial)"} containeredContent={true}>
        <VStack gap={4} align={"stretch"} w={"full"}>
          <HStack
            p={3}
            rounded={theme.radii.component}
            borderWidth={"1px"}
            borderColor={"border.subtle"}
            bg={"bg.subtle"}
            justify={"space-between"}
            align={"center"}
            gap={"md"}
          >
            <HStack gap={3} align={"start"}>
              <Box p={2} rounded={"full"} bg={"bg.surface"} shadow={"xs"}>
                <AppIcon icon={Building2Icon} color={`${theme.colorPalette}.solid`} />
              </Box>

              <VStack gap={1} align={"start"}>
                <HStack gap={2} align={"center"}>
                  <P fontWeight={"semibold"}>{"SSO Mitra (Eksternal)"}</P>
                  <Badge colorPalette={"teal"} variant={"subtle"}>
                    <AppIcon icon={LockIcon} size={"xs"} />
                    {"Wajib (Hardcoded)"}
                  </Badge>
                </HStack>

                <P fontSize={"xs"} color={"fg.muted"}>
                  {"Autentikasi SSO adalah satu-satunya metode login wajib untuk akun mitra di lingkungan produksi. Konfigurasi telah ditentukan secara permanen oleh sistem."}
                </P>
              </VStack>
            </HStack>

            <Switch
              checked={true}
              disabled={true}
            />
          </HStack>
        </VStack>
      </Fieldset>

      {/* CARD 2: SSO Pegawai Internal ASN ATR/BPN (Configurable) */}
      <Fieldset legend={"2. SSO Pegawai Internal ASN ATR/BPN"} containeredContent={true}>
        <VStack gap={4} align={"stretch"} w={"full"}>
          <HStack
            p={3}
            rounded={theme.radii.component}
            borderWidth={"1px"}
            borderColor={"border.subtle"}
            bg={"bg.subtle"}
            justify={"space-between"}
            align={"center"}
            gap={"md"}
          >
            <HStack gap={3}>
              <Box p={2} rounded={"full"} bg={"bg.surface"} shadow={"xs"}>
                <AppIcon icon={KeyRoundIcon} color={`${theme.colorPalette}.solid`} />
              </Box>

              <VStack gap={0} align={"start"}>
                <P fontWeight={"semibold"}>{"Aktifkan SSO Internal"}</P>

                <P fontSize={"xs"} color={"fg.muted"}>
                  {"Izinkan pegawai internal login menggunakan kredensial Single Sign-On Keycloak Pusdatin."}
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
                  {"Login SSO pegawai internal saat ini dinonaktifkan. Seluruh pegawai hanya dapat login via kredensial akun lokal."}
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
                  placeholder={"https://logininternaldev.atrbpn.go.id/auth/realms/internal"}
                  {...form.register("internal.issuerUrl")}
                  w={"full"}
                />
              </Field>

              <Field
                label={"Client ID"}
                helperText={"Identifier klien OIDC yang terdaftar di Keycloak Pusdatin"}
                errorText={form.formState.errors.internal?.clientId?.message}
                w={"full"}
              >
                <Input
                  placeholder={"dotnet-web-multiotp"}
                  {...form.register("internal.clientId")}
                  w={"full"}
                />
              </Field>

              <Field
                label={"Client Secret"}
                helperText={"Kunci rahasia dari Pusdatin. Biarkan kosong jika tidak ingin mengubah kunci tersimpan"}
                errorText={form.formState.errors.internal?.clientSecret?.message}
                w={"full"}
              >
                <PasswordInput
                  placeholder={"••••••••••••••••••••••••"}
                  {...form.register("internal.clientSecret")}
                  w={"full"}
                />
              </Field>

              <Field
                label={"Callback Redirect URI"}
                helperText={"Alamat redirect kembalian setelah login SSO berhasil diverifikasi"}
                errorText={form.formState.errors.internal?.redirectUri?.message}
                w={"full"}
              >
                <Input
                  placeholder={"https://volatil-demo.vercel.app/auth/callback/keycloak"}
                  {...form.register("internal.redirectUri")}
                  w={"full"}
                />
              </Field>

              <Field
                variant={"default"}
                label={"Whitelist Domain Email"}
                helperText={"Daftar domain email resmi yang diizinkan login SSO (contoh: atrbpn.go.id). Kosongkan jika seluruh domain diizinkan."}
                errorText={form.formState.errors.internal?.allowedDomains?.message}
                w={"full"}
              >
                <Controller
                  control={form.control}
                  name={"internal.allowedDomains"}
                  render={({ field }) => (
                    <StringArrayInput
                      value={field.value}
                      onChange={(nextVal) => field.onChange(nextVal)}
                      placeholder={"atrbpn.go.id"}
                      addButtonText={"Tambah Domain Email"}
                      emptyText={"Semua domain diizinkan (tidak ada batasan)."}
                    />
                  )}
                />
              </Field>
            </VStack>
          )}
        </VStack>
      </Fieldset>

      <Separator borderColor={"border.subtle"} />

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
