// src/features/internal/data-management/components/internal.data-management.edit-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { RadioCardInput } from "@/design-system/components/input/ui/radio-card-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { GeoserverCascadeSelect } from "@/features/internal/data-management/components/geoserver-cascade-select";
import { useUpdateMasterIgtLayer } from "@/features/internal/data-management/hooks/use-data-management";
import { masterIgtLayerFormSchema } from "@/features/internal/data-management/types/data-management.schema";
import type {
  GeoServerWorkspaceLayerOption,
  MasterIgtLayerFormValues,
  MasterIgtLayerItem,
  SpatialBasisType,
} from "@/features/internal/data-management/types/data-management.type";
import { useMasterGeoserverQuery } from "@/features/internal/master-geoserver/hooks/use-master-geoserver";
import { SPATIAL_BASIS_OPTIONS } from "@/shared/constants/status.config";
import { t } from "@/shared/libs/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, type ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

type InternalDataManagementEditTriggerProps = {
  modalKey?: string;
  item: MasterIgtLayerItem;
  children?: ReactNode;
};

export const InternalDataManagementEditTrigger = (
  props: InternalDataManagementEditTriggerProps,
) => {
  const {
    modalKey: customModalKey = `layer-edit-${props.item.id}`,
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
      size={"md"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      {isMounted && (
        <InternalDataManagementEditModalContent
          modalKey={modalKey}
          item={item}
          close={close}
        />
      )}
    </Modal.Root>
  );
};

type InternalDataManagementEditModalContentProps = {
  modalKey: string;
  item: MasterIgtLayerItem;
  close: () => void;
};

const InternalDataManagementEditModalContent = (
  props: InternalDataManagementEditModalContentProps,
) => {
  const { modalKey, item, close } = props;

  // Extract initial workspace from typeName if exists
  const initialWorkspace = useMemo(() => {
    if (item.workspaceName) return item.workspaceName;
    if (item.typeName && item.typeName.includes(":")) {
      return item.typeName.split(":")[0];
    }
    return "";
  }, [item]);

  // Hooks (Queries & Mutations)
  const { items: geoserverList } = useMasterGeoserverQuery();
  const updateMutation = useUpdateMasterIgtLayer();

  // Form (RHF + Zod)
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<MasterIgtLayerFormValues>({
    resolver: zodResolver(masterIgtLayerFormSchema),
    mode: "onChange",
    defaultValues: {
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      spatialBasis: item.spatialBasis,
      zIndex: item.zIndex ?? 1,
      geoserverId: item.geoserverId ?? "gs_prod_01",
      workspace: initialWorkspace,
      typeName: item.typeName ?? item.id ?? "",
      isActive: item.isActive,
    },
  });

  // Watch Form Values
  const geoserverId = useWatch({ control, name: "geoserverId" });
  const workspace = useWatch({ control, name: "workspace" });
  const typeName = useWatch({ control, name: "typeName" });

  // Derived Values
  const selectedGeoserver = useMemo(
    () =>
      geoserverList.find((g) => g.id === geoserverId) ?? {
        id: item.geoserverId ?? geoserverId,
        name: item.geoserver?.name ?? "",
        baseUrl: item.geoserver?.baseUrl ?? "",
      },
    [geoserverList, geoserverId, item.geoserverId, item.geoserver],
  );

  const handleLayerChange = (
    selectedTypeName: string,
    layerDetail?: GeoServerWorkspaceLayerOption,
  ) => {
    setValue("typeName", selectedTypeName, { shouldValidate: true });
    if (layerDetail?.spatialBasis) {
      setValue("spatialBasis", layerDetail.spatialBasis, {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = (data: MasterIgtLayerFormValues) => {
    updateMutation.mutate(
      {
        id: item.id,
        title: data.title.trim(),
        description: data.description?.trim(),
        spatialBasis: data.spatialBasis,
        zIndex: data.zIndex,
        isActive: data.isActive,
        geoserverId: selectedGeoserver.id,
        typeName: data.typeName.trim(),
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
        <Modal.CloseButton />

        <Modal.Title>{"Ubah Konfigurasi Layer IGT"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"xl"}>
          {/* Grup 1: Informasi Dasar */}
          <Fieldset legend={"Informasi Dasar"} containeredContent>
            <VStack align={"stretch"} gap={"md"}>
              {/* Input Judul Layer */}
              <Controller
                control={control}
                name={"title"}
                render={({ field, fieldState }) => (
                  <Field
                    label={"Nama / Judul Layer"}
                    errorText={fieldState.error?.message}
                    invalid={Boolean(fieldState.error)}
                  >
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={"RTRW Kabupaten Badung"}
                    />
                  </Field>
                )}
              />

              {/* Input Deskripsi */}
              <Controller
                control={control}
                name={"description"}
                render={({ field }) => (
                  <Field label={"Deskripsi"} optional>
                    <Textarea
                      rows={2}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder={"Deskripsi data layer..."}
                    />
                  </Field>
                )}
              />

              {/* Toggle Status Aktif (Publish) */}
              <Controller
                control={control}
                name={"isActive"}
                render={({ field }) => (
                  <Field label={"Status Publikasi"}>
                    <HStack
                      justify={"space-between"}
                      align={"center"}
                      w={"full"}
                      py={1}
                    >
                      <VStack align={"start"} gap={0}>
                        <P fontSize={"sm"} fontWeight={"medium"}>
                          {field.value ? "Publik (Aktif)" : "Draft (Nonaktif)"}
                        </P>
                        <P fontSize={"xs"} color={"fg.subtle"}>
                          {
                            "Layer yang aktif dapat dilihat & dipesan di katalog Mitra"
                          }
                        </P>
                      </VStack>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) =>
                          field.onChange(Boolean(e.checked))
                        }
                      />
                    </HStack>
                  </Field>
                )}
              />
            </VStack>
          </Fieldset>

          {/* Grup 2: Sumber GeoServer & Layer (Dedicated Component dengan URL Live Preview) */}
          <Fieldset legend={"Konfigurasi GeoServer & Layer"} containeredContent>
            <GeoserverCascadeSelect
              parentModalKey={modalKey}
              selectedGeoserverId={geoserverId}
              onGeoserverChange={(val) => {
                setValue("geoserverId", val, { shouldValidate: true });
                setValue("workspace", "", { shouldValidate: true });
                setValue("typeName", "", { shouldValidate: true });
              }}
              selectedWorkspace={workspace}
              onWorkspaceChange={(val) => {
                setValue("workspace", val, { shouldValidate: true });
                setValue("typeName", "", { shouldValidate: true });
              }}
              selectedTypeName={typeName}
              onLayerChange={handleLayerChange}
            />
          </Fieldset>

          {/* Grup 3: Konfigurasi Spasial */}
          <Fieldset legend={"Konfigurasi Spasial"} containeredContent>
            <VStack align={"stretch"} gap={"md"}>
              {/* Select Basis IGT via RadioCardInput */}
              <Controller
                control={control}
                name={"spatialBasis"}
                render={({ field }) => (
                  <Field label={"Basis IGT"}>
                    <RadioCardInput.Root
                      value={field.value}
                      onValueChange={({ value }) => {
                        if (value) {
                          field.onChange(value as SpatialBasisType);
                        }
                      }}
                      w={"full"}
                    >
                      <HStack gap={"sm"} w={"full"}>
                        {SPATIAL_BASIS_OPTIONS.map((opt) => (
                          <RadioCardInput.Item
                            key={opt.value}
                            value={opt.value}
                            flex={1}
                            p={3}
                          >
                            <HStack
                              justify={"space-between"}
                              align={"center"}
                              w={"full"}
                            >
                              <HStack gap={"xs"} align={"center"}>
                                <AppIcon
                                  icon={opt.icon}
                                  color={`${opt.colorPalette}.fg`}
                                />
                                <RadioCardInput.ItemText fontSize={"sm"}>
                                  {opt.label}
                                </RadioCardInput.ItemText>
                              </HStack>
                              <RadioCardInput.ItemIndicator />
                            </HStack>
                          </RadioCardInput.Item>
                        ))}
                      </HStack>
                    </RadioCardInput.Root>
                  </Field>
                )}
              />

              {/* Input Urutan Z-Index */}
              <Controller
                control={control}
                name={"zIndex"}
                render={({ field }) => (
                  <Field
                    label={"Urutan Tumpukan Layer (Z-Index)"}
                    helperText={
                      "Angka lebih kecil = di bawah, angka lebih besar = di atas"
                    }
                  >
                    <NumberInput
                      w={"full"}
                      min={1}
                      max={100}
                      value={String(field.value ?? 1)}
                      onValueChange={({ value }) => field.onChange(value || 1)}
                      placeholder={"1"}
                    />
                  </Field>
                )}
              />
            </VStack>
          </Fieldset>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary
            loading={updateMutation.isPending}
            disabled={!isValid || updateMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {"Simpan"}
          </Button>

          <Button onClick={close}>{t["action.cancel"]()}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
