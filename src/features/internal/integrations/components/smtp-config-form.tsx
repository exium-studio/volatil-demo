// src/features/internal/integration/components/smtp-config-form.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import SelectInput from "@/design-system/components/input/ui/select";
import { Switch } from "@/design-system/components/input/ui/switch";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { SmtpTestModal } from "@/features/internal/integrations/components/smtp-test-modal";
import {
  useSmtpIntegrationQuery,
  useUpdateSmtpIntegrationMutation,
} from "@/features/internal/integrations/hooks/use-integration.query";
import { smtpFormSchema } from "@/features/internal/integrations/schemas/integration.schema";
import type {
  SmtpFormValues,
  SmtpSecurity,
} from "@/features/internal/integrations/types/integration.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheckIcon, SaveIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const SECURITY_OPTIONS = [
  { label: "STARTTLS (Rekomendasi Port 587)", value: "STARTTLS" },
  { label: "SSL / TLS (Rekomendasi Port 465)", value: "SSL" },
  { label: "None / Plain (Rekomendasi Port 25)", value: "NONE" },
];

const TEST_MODAL_KEY = "smtp-test-email-modal";

export const SmtpConfigForm = () => {
  // Stores
  const { theme } = useThemeStore();

  // Hooks (Queries & Mutations)
  const { data: config, isLoading } = useSmtpIntegrationQuery();
  const updateMutation = useUpdateSmtpIntegrationMutation();
  const { open: openTestModal } = usePopModal({ modalKey: TEST_MODAL_KEY });

  // Form (RHF + Zod)
  const form = useForm<SmtpFormValues>({
    resolver: zodResolver(smtpFormSchema),
    defaultValues: {
      host: "",
      port: 587,
      security: "STARTTLS",
      user: "",
      password: "",
      fromEmail: "",
      fromName: "Volatil ATR/BPN",
      rejectUnauthorized: true,
    },
  });

  // Effects
  useEffect(() => {
    if (config) {
      form.reset({
        host: config.host ?? "",
        port: config.port ?? 587,
        security: config.security ?? "STARTTLS",
        user: config.user ?? "",
        password: config.password ?? "",
        fromEmail: config.fromEmail ?? "",
        fromName: config.fromName ?? "Volatil ATR/BPN",
        rejectUnauthorized: config.rejectUnauthorized ?? true,
      });
    }
  }, [config, form]);

  // Handlers
  const onSubmit = (values: SmtpFormValues) => {
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
        <Skeleton
          h={"40px"}
          w={"200px"}
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
      {/* Banner */}
      {/* <HStack
        p={4}
        rounded={theme.radii.component}
        bg={"bg.subtle"}
        justify={"space-between"}
        align={"center"}
        gap={"md"}
      >
        <HStack gap={3}>
          <AppIcon icon={MailIcon} color={`${theme.colorPalette}.solid`} />

          <VStack gap={"2xs"} align={"start"}>
            <P fontWeight={"semibold"}>{"Pengaturan Email - SMTP"}</P>

            <P fontSize={"xs"} color={"fg.muted"}>
              {
                "Digunakan untuk pengiriman notifikasi, tagihan billing SIMPONI, bukti pendaftaran mitra, dan link verifikasi."
              }
            </P>
          </VStack>
        </HStack>

        <Button
          type={"button"}
          variant={"outline"}
          onClick={() => openTestModal()}
        >
          <AppIcon icon={MailCheckIcon} />
          {"Uji Coba Kirim"}
        </Button>
      </HStack> */}

      {/* Inputs */}
      <VStack gap={6} align={"stretch"}>
        <Fieldset
          legend={"Konfigurasi Server & Port"}
          containeredContent={true}
        >
          <VStack gap={4} align={"stretch"} w={"full"}>
            <Field
              label={"SMTP Host Server"}
              helperText={
                "Contoh: smtp.atrbpn.go.id, smtp.gmail.com, atau mail-relay internal"
              }
              errorText={form.formState.errors.host?.message}
              w={"full"}
            >
              <Input
                placeholder={"smtp.atrbpn.go.id"}
                {...form.register("host")}
                w={"full"}
              />
            </Field>

            <Field
              label={"Port"}
              helperText={
                "Port SMTP (misal: 587 untuk STARTTLS, 465 untuk SSL)"
              }
              errorText={form.formState.errors.port?.message}
              w={"full"}
            >
              <Controller
                control={form.control}
                name={"port"}
                render={({ field }) => (
                  <NumberInput
                    value={
                      field.value !== undefined ? String(field.value) : "587"
                    }
                    onValueChange={(val) => field.onChange(Number(val.value))}
                    placeholder={"587"}
                    w={"full"}
                  />
                )}
              />
            </Field>

            <Field
              label={"Protokol Keamanan (Encryption)"}
              helperText={"Metode enkripsi sambungan"}
              errorText={form.formState.errors.security?.message}
              w={"full"}
            >
              <Controller
                control={form.control}
                name={"security"}
                render={({ field }) => (
                  <SelectInput
                    value={field.value}
                    onValueChange={(val) => field.onChange(val as SmtpSecurity)}
                    options={SECURITY_OPTIONS}
                    clearable={false}
                  />
                )}
              />
            </Field>

            <Field label={"Verifikasi Sertifikat SSL"}>
              <HStack
                justify={"space-between"}
                align={"center"}
                w={"full"}
                py={1}
                gap={"md"}
              >
                <VStack gap={0} align={"start"}>
                  <P fontSize={"sm"} fontWeight={"medium"}>
                    {"Reject Unauthorized Certificate"}
                  </P>

                  <P fontSize={"xs"} color={"fg.muted"}>
                    {
                      "Nonaktifkan jika mail server internal dinas memakai sertifikat self-signed atau private CA."
                    }
                  </P>
                </VStack>

                <Controller
                  control={form.control}
                  name={"rejectUnauthorized"}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={({ checked }) => field.onChange(checked)}
                    />
                  )}
                />
              </HStack>
            </Field>
          </VStack>
        </Fieldset>

        <Fieldset legend={"Autentikasi Kredensial"} containeredContent={true}>
          <VStack gap={4} align={"stretch"} w={"full"}>
            <Field
              label={"Username / API User"}
              helperText={
                "Akun autentikasi pengirim email (bisa berupa alamat email lengkap)"
              }
              errorText={form.formState.errors.user?.message}
              w={"full"}
            >
              <Input
                placeholder={"noreply@atrbpn.go.id"}
                {...form.register("user")}
                w={"full"}
              />
            </Field>

            <Field
              label={"Password / App Password"}
              helperText={"Kata sandi akun email atau App Password/API Token"}
              errorText={form.formState.errors.password?.message}
              w={"full"}
            >
              <PasswordInput
                placeholder={"••••••••••••••••••••••••"}
                {...form.register("password")}
                w={"full"}
              />
            </Field>
          </VStack>
        </Fieldset>

        <Fieldset legend={"Identitas Pengirim"} containeredContent={true}>
          <VStack gap={4} align={"stretch"} w={"full"}>
            <Field
              label={"Email Pengirim (From Email)"}
              helperText={
                "Gunakan email kedinasan atau domain yang terverifikasi SPF/DKIM di provider SMTP. Jika menggunakan relay seperti Brevo dengan domain publik (@gmail.com), provider otomatis me-rewrite sender domain untuk menghindari penolakan DMARC."
              }
              errorText={form.formState.errors.fromEmail?.message}
              w={"full"}
            >
              <Input
                placeholder={"noreply@atrbpn.go.id"}
                {...form.register("fromEmail")}
                w={"full"}
              />
            </Field>

            <Field
              label={"Nama Pengirim (From Name)"}
              helperText={"Label nama tampilan"}
              errorText={form.formState.errors.fromName?.message}
              w={"full"}
            >
              <Input
                placeholder={"Volatil ATR/BPN"}
                {...form.register("fromName")}
                w={"full"}
              />
            </Field>
          </VStack>
        </Fieldset>
      </VStack>

      <Separator borderColor={"border.subtle"} />

      {/* Actions */}
      <HStack justify={"flex-end"} gap={3}>
        <Button
          type={"button"}
          variant={"outline"}
          onClick={() => openTestModal()}
        >
          <AppIcon icon={MailCheckIcon} />
          {"Uji Coba Kirim"}
        </Button>

        <Button
          type={"submit"}
          primary={true}
          loading={updateMutation.isPending || isLoading}
        >
          <AppIcon icon={SaveIcon} />
          {"Simpan Konfigurasi"}
        </Button>
      </HStack>

      {/* Test Email Modal */}
      <SmtpTestModal
        modalKey={TEST_MODAL_KEY}
        currentConfig={form.getValues()}
      />
    </VStack>
  );
};
