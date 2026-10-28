// src/features/internal/integrasi/components/simponi-config-form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  useSimponiIntegrationQuery,
  useUpdateSimponiIntegrationMutation,
} from "@/features/internal/integrations/hooks/use-integration.query";
import { simponiFormSchema } from "@/features/internal/integrations/schemas/integration.schema";
import type { SimponiFormValues } from "@/features/internal/integrations/types/integration.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { LandmarkIcon, SaveIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const SimponiConfigForm = () => {
  // Stores
  const { theme } = useThemeStore();

  // Hooks (Queries & Mutations)
  const { data: config, isLoading } = useSimponiIntegrationQuery();
  const updateMutation = useUpdateSimponiIntegrationMutation();

  // Form (RHF + Zod)
  const form = useForm<SimponiFormValues>({
    resolver: zodResolver(simponiFormSchema),
    defaultValues: {
      baseUrl: "",
      kodeKl: "056",
      kodeSatker: "",
      kodeAkun: "425311",
      apiKey: "",
      billingExpiryHours: 24,
      isSimulator: false,
      isEnabled: true,
    },
  });

  // Effects
  useEffect(() => {
    if (config) {
      form.reset({
        baseUrl: config.baseUrl ?? "",
        kodeKl: config.kodeKl ?? "056",
        kodeSatker: config.kodeSatker ?? "",
        kodeAkun: config.kodeAkun ?? "425311",
        apiKey: config.apiKey ?? "",
        billingExpiryHours: config.billingExpiryHours ?? 24,
        isSimulator: config.isSimulator ?? false,
        isEnabled: config.isEnabled ?? true,
      });
    }
  }, [config, form]);

  // Handlers
  const onSubmit = (values: SimponiFormValues) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <VStack gap={4} w={"full"} align={"stretch"}>
        <Skeleton h={"72px"} w={"full"} rounded={theme.radii.component} />
        <Skeleton h={"64px"} w={"full"} rounded={theme.radii.component} />
        <Skeleton h={"64px"} w={"full"} rounded={theme.radii.component} />
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
      {/* Banner */}
      <HStack
        p={4}
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
            <AppIcon icon={LandmarkIcon} color={`${theme.colorPalette}.solid`} />
          </Box>

          <VStack gap={0} align={"start"}>
            <P fontWeight={"semibold"}>{"Gateway SIMPONI (PNBP)"}</P>

            <P fontSize={"xs"} color={"fg.muted"}>
              {"Integrasi penerbitan kode billing pembayaran PNBP langsung ke sistem SIMPONI Kemenkeu."}
            </P>
          </VStack>
        </HStack>

        <Controller
          control={form.control}
          name={"isEnabled"}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={({ checked }) => field.onChange(checked)}
            />
          )}
        />
      </HStack>

      {/* Inputs */}
      <VStack gap={6} align={"stretch"}>
        <Fieldset legend={"Mode & Endpoint Gateway"} containeredContent={true}>
          <VStack gap={4} align={"stretch"} w={"full"}>
            <Field label={"Simulasi Billing Internal"}>
              <HStack
                justify={"space-between"}
                align={"center"}
                w={"full"}
                py={1}
                gap={"md"}
              >
                <VStack gap={0} align={"start"}>
                  <P fontSize={"sm"} fontWeight={"medium"}>
                    {"Gunakan Simulator / Mock Billing"}
                  </P>

                  <P fontSize={"xs"} color={"fg.muted"}>
                    {"Hasilkan kode billing dummy internal tanpa memanggil Web Service Kemenkeu."}
                  </P>
                </VStack>

                <Controller
                  control={form.control}
                  name={"isSimulator"}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={({ checked }) => field.onChange(checked)}
                    />
                  )}
                />
              </HStack>
            </Field>

            <Field
              label={"Base URL Web Service SIMPONI"}
              helperText={"Endpoint gateway API Kemenkeu (Sandbox atau Production)"}
              errorText={form.formState.errors.baseUrl?.message}
              w={"full"}
            >
              <Input
                placeholder={"https://simponi.kemenkeu.go.id/api/ws"}
                {...form.register("baseUrl")}
                w={"full"}
              />
            </Field>

            <Field
              label={"Token API / Authorization Key"}
              helperText={"Token kredensial yang diterbitkan oleh Ditjen Anggaran Kemenkeu"}
              errorText={form.formState.errors.apiKey?.message}
              w={"full"}
            >
              <PasswordInput
                placeholder={"••••••••••••••••••••••••"}
                {...form.register("apiKey")}
                w={"full"}
              />
            </Field>
          </VStack>
        </Fieldset>

        <Fieldset legend={"Kode Akun Anggaran (Bagan Akun Standar)"} containeredContent={true}>
          <VStack gap={4} align={"stretch"} w={"full"}>
            <Field
              label={"Kode K/L (3 digit)"}
              helperText={"Kode Kementerian/Lembaga ATR/BPN: 056"}
              errorText={form.formState.errors.kodeKl?.message}
              w={"full"}
            >
              <Input
                maxLength={3}
                placeholder={"056"}
                {...form.register("kodeKl")}
                w={"full"}
              />
            </Field>

            <Field
              label={"Kode Satker (6 digit)"}
              helperText={"Kode Satuan Kerja penerima PNBP"}
              errorText={form.formState.errors.kodeSatker?.message}
              w={"full"}
            >
              <Input
                maxLength={6}
                placeholder={"430123"}
                {...form.register("kodeSatker")}
                w={"full"}
              />
            </Field>

            <Field
              label={"Mata Anggaran / Akun (6 digit)"}
              helperText={"Kode Akun PNBP Informasi Geospasial / Spasial"}
              errorText={form.formState.errors.kodeAkun?.message}
              w={"full"}
            >
              <Input
                maxLength={6}
                placeholder={"425311"}
                {...form.register("kodeAkun")}
                w={"full"}
              />
            </Field>

            <Field
              label={"Masa Berlaku Kode Billing (Jam)"}
              helperText={"Batas waktu pembayaran mitra sebelum kode billing kedaluwarsa (default: 24 jam)"}
              errorText={form.formState.errors.billingExpiryHours?.message}
              w={"full"}
            >
              <Controller
                control={form.control}
                name={"billingExpiryHours"}
                render={({ field }) => (
                  <NumberInput
                    value={field.value !== undefined ? String(field.value) : "24"}
                    onValueChange={(val) => field.onChange(Number(val.value))}
                    placeholder={"24"}
                    w={"full"}
                  />
                )}
              />
            </Field>
          </VStack>
        </Fieldset>
      </VStack>

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
