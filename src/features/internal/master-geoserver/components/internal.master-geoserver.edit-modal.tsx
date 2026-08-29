// src/features/internal/master-geoserver/components/internal.master-geoserver.edit-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useUpdateMasterGeoserver } from "@/features/internal/master-geoserver/hooks/use-master-geoserver";
import {
  masterGeoserverFormSchema,
  type MasterGeoserverFormValues,
} from "@/features/internal/master-geoserver/types/master-geoserver.schema";
import type { MasterGeoserverItem } from "@/features/internal/master-geoserver/types/master-geoserver.type";
import { t } from "@/shared/libs/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

export type InternalMasterGeoserverEditTriggerProps = {
  modalKey?: string;
  item: MasterGeoserverItem;
  children?: ReactNode;
};

export const InternalMasterGeoserverEditTrigger = (
  props: InternalMasterGeoserverEditTriggerProps,
) => {
  const {
    modalKey: customModalKey = `geoserver-edit-${props.item.id}`,
    item,
    children,
  } = props;

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

      {isMounted && (
        <InternalMasterGeoserverEditModalContent item={item} close={close} />
      )}
    </Modal.Root>
  );
};

type InternalMasterGeoserverEditModalContentProps = {
  item: MasterGeoserverItem;
  close: () => void;
};

const InternalMasterGeoserverEditModalContent = (
  props: InternalMasterGeoserverEditModalContentProps,
) => {
  // Props
  const { item, close } = props;

  // Mutations
  const updateMutation = useUpdateMasterGeoserver();

  // Form (RHF + Zod)
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<MasterGeoserverFormValues>({
    resolver: zodResolver(masterGeoserverFormSchema),
    mode: "onChange",
    defaultValues: {
      name: item.name,
      baseUrl: item.baseUrl,
      username: item.username,
      password: "",
      description: item.description ?? "",
    },
  });

  const onSubmit = (data: MasterGeoserverFormValues) => {
    updateMutation.mutate(
      {
        id: item.id,
        name: data.name.trim(),
        baseUrl: data.baseUrl.trim(),
        username: data.username.trim(),
        password: data.password?.trim() ? data.password.trim() : undefined,
        description: data.description?.trim() || undefined,
      },
      {
        onSuccess: () => {
          close();
        },
      },
    );
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>{"Ubah Master GeoServer"}</Modal.Title>
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
              <Field
                label={"Password Baru"}
                optional
                helperText={"Kosongkan jika tidak ubah"}
              >
                <PasswordInput
                  value={field.value ?? ""}
                  onChange={field.onChange}
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
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || updateMutation.isPending}
            loading={updateMutation.isPending}
          >
            {"Simpan Perubahan"}
          </Button>

          <Button onClick={close}>{t["action.cancel"]()}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
