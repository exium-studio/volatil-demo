// src/features/internal/master-geoserver/components/internal.master-geoserver.create-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { P } from "@/design-system/components/typography/ui/p";
import { InternalMasterGeoserverTestResultAlert } from "@/features/internal/master-geoserver/components/internal.master-geoserver.test-result-alert";
import {
  useCreateMasterGeoserver,
  useTestMasterGeoserverConnection,
} from "@/features/internal/master-geoserver/hooks/use-master-geoserver";
import { masterGeoserverFormSchema } from "@/features/internal/master-geoserver/types/master-geoserver.schema";
import type {
  InternalMasterGeoserverCreateModalContentProps,
  InternalMasterGeoserverCreateTriggerProps,
  MasterGeoserverFormValues,
  TestGeoserverConnectionResponse,
} from "@/features/internal/master-geoserver/types/master-geoserver.type";
import { t } from "@/shared/libs/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export const InternalMasterGeoserverCreateTrigger = (
  props: InternalMasterGeoserverCreateTriggerProps,
) => {
  // Props
  const { modalKey: customModalKey = "create-geoserver", children } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const isMounted = useMountTimeout({
    isOpen,
    mountDelay: 0,
    unmountDelay: 250,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"sm"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      {isMounted && <InternalMasterGeoserverCreateModalContent close={close} />}
    </Modal.Root>
  );
};

const InternalMasterGeoserverCreateModalContent = (
  props: InternalMasterGeoserverCreateModalContentProps,
) => {
  // Props
  const { close } = props;

  // States
  const [testResult, setTestResult] =
    useState<TestGeoserverConnectionResponse | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  // Mutations
  const createMutation = useCreateMasterGeoserver();
  const testMutation = useTestMasterGeoserverConnection();

  // Form (RHF + Zod)
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { isValid },
  } = useForm<MasterGeoserverFormValues>({
    resolver: zodResolver(masterGeoserverFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      baseUrl: "",
      username: "",
      password: "",
      description: "",
      isActive: true,
    },
  });

  // Watch required fields for testing connection
  const baseUrl = useWatch({ control, name: "baseUrl" });
  const username = useWatch({ control, name: "username" });
  const isTestDisabled =
    !baseUrl?.trim() || !username?.trim() || testMutation.isPending;

  // Handlers
  const handleTestConnection = () => {
    const values = getValues();
    if (!values.baseUrl?.trim() || !values.username?.trim()) return;

    setTestResult(null);
    setTestError(null);

    testMutation.mutate(
      {
        baseUrl: values.baseUrl.trim(),
        username: values.username?.trim() || undefined,
        password: values.password?.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            setTestResult(data);
          } else {
            setTestError(data.message || "Koneksi ke GeoServer gagal.");
          }
        },
        onError: (err) => {
          setTestError(
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat menguji koneksi GeoServer.",
          );
        },
      },
    );
  };

  const onSubmit = (data: MasterGeoserverFormValues) => {
    createMutation.mutate(
      {
        name: data.name.trim(),
        baseUrl: data.baseUrl.trim(),
        username: data.username.trim(),
        password: data.password?.trim() || undefined,
        description: data.description?.trim() || undefined,
        isActive: data.isActive,
      },
      {
        onSuccess: () => {
          reset();
          setTestResult(null);
          setTestError(null);
          close();
        },
      },
    );
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>{"Tambah Master GeoServer"}</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          <Controller
            control={control}
            name={"name"}
            render={({ field, fieldState }) => (
              <Field
                label={"Nama Server"}
                errorText={fieldState.error?.message}
                invalid={Boolean(fieldState.error)}
              >
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={"GeoServer Produksi ATR/BPN"}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={"baseUrl"}
            render={({ field, fieldState }) => (
              <Field
                label={"Base URL GeoServer"}
                errorText={fieldState.error?.message}
                invalid={Boolean(fieldState.error)}
              >
                <Textarea
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={"https://.../geoserver"}
                  rows={2}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={"username"}
            render={({ field, fieldState }) => (
              <Field
                label={"Username"}
                errorText={fieldState.error?.message}
                invalid={Boolean(fieldState.error)}
              >
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={"admin_spatial"}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={"password"}
            render={({ field }) => (
              <Field label={"Password"} optional>
                <PasswordInput
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder={"Password akun GeoServer..."}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={"description"}
            render={({ field }) => (
              <Field label={"Deskripsi"} optional>
                <Textarea
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder={"Keterangan peruntukan GeoServer (opsional)..."}
                  rows={2}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={"isActive"}
            render={({ field }) => (
              <Field label={"Status Server"}>
                <HStack justify={"space-between"} align={"center"} w={"full"} py={"xs"}>
                  <P fontSize={"sm"} color={"fg.muted"}>
                    {field.value ? "Server Aktif (Dapat digunakan)" : "Server Nonaktif"}
                  </P>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(details) => field.onChange(details.checked)}
                  />
                </HStack>
              </Field>
            )}
          />

          {/* Test Connection Button & Result */}
          <VStack align={"stretch"} gap={"xs"} pt={"xs"}>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={handleTestConnection}
              disabled={isTestDisabled}
              loading={testMutation.isPending}
            >
              <AppIcon icon={ActivityIcon} />
              {"Uji Koneksi Server"}
            </Button>

            <InternalMasterGeoserverTestResultAlert
              testResult={testResult}
              testError={testError}
            />
          </VStack>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || createMutation.isPending}
            loading={createMutation.isPending}
          >
            {"Tambahkan Server"}
          </Button>

          <Button onClick={close}>{t["action.cancel"]()}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
