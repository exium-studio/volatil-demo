// src/features/internal/master-igt-layer/components/internal.master-igt-layer.config-form.tsx

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
import { toast } from "@/design-system/components/toast";
import { P } from "@/design-system/components/typography/ui/p";
import { GeoserverCascadeSelect } from "@/features/internal/master-igt-layer/components/geoserver-cascade-select";
import { useUpdateMasterIgtLayer } from "@/features/internal/master-igt-layer/hooks/use-master-igt-layer";
import { masterIgtLayerFormSchema } from "@/features/internal/master-igt-layer/types/master-igt-layer.schema";
import type {
  GeoServerWorkspaceLayerOption,
  IgtBasisType,
  InternalMasterIgtLayerConfigFormProps,
  MasterIgtLayerFormValues,
} from "@/features/internal/master-igt-layer/types/master-igt-layer.type";
import { useMasterGeoserverQuery } from "@/features/internal/master-geoserver/hooks/use-master-geoserver";
import { IGT_BASIS_OPTIONS } from "@/features/shared/constants/volatil.ssot-map";
import { t } from "@/shared/libs/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export const InternalMasterIgtLayerConfigForm = (
  props: InternalMasterIgtLayerConfigFormProps,
) => {
  // Props
  const { item, onSuccess } = props;

  // Derived initial values
  const initialWorkspace = useMemo(() => {
    if (item.workspaceName) return item.workspaceName;
    if (item.typeName && item.typeName.includes(":")) {
      return item.typeName.split(":")[0];
    }
    return "";
  }, [item]);

  const initialLayerName = useMemo(() => {
    if (item.layerName !== undefined) return item.layerName;
    if (item.typeName && item.typeName.includes(":")) {
      return item.typeName.split(":")[1];
    }
    return null;
  }, [item]);

  // Hooks (Queries & Mutations)
  const { items: geoserverList } = useMasterGeoserverQuery();
  const updateMutation = useUpdateMasterIgtLayer();

  // Derived Values
  const formValues = useMemo<MasterIgtLayerFormValues>(
    () => ({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      igtBasis: item.igtBasis ?? "kawasan",
      zIndex: item.zIndex ?? 1,
      minZoom: item.minZoom ?? 12,
      geoserverId: item.geoserverId ?? "",
      workspaceName: initialWorkspace,
      layerName: initialLayerName,
      typeName: item.typeName ?? "",
      isActive: item.isActive,
      defaultVisible: item.defaultVisible ?? false,
    }),
    [item, initialWorkspace, initialLayerName],
  );

  // Form (RHF + Zod)
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<MasterIgtLayerFormValues>({
    resolver: zodResolver(masterIgtLayerFormSchema),
    mode: "onChange",
    values: formValues,
  });

  // Watch Form Values
  const geoserverId = useWatch({ control, name: "geoserverId" });
  const workspaceName = useWatch({ control, name: "workspaceName" });
  const layerName = useWatch({ control, name: "layerName" });
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
    selectedLayerName: string | null,
    selectedTypeName: string,
    _layerDetail?: GeoServerWorkspaceLayerOption,
  ) => {
    setValue("layerName", selectedLayerName, { shouldValidate: true });
    setValue("typeName", selectedTypeName, { shouldValidate: true });
  };

  const onInvalid = () => {
    toast.error("Formulir Belum Lengkap", {
      description:
        "Mohon periksa dan lengkapi semua isian wajib (Nama layer, Master GeoServer, dan Workspace).",
    });
  };

  const onSubmit = (data: MasterIgtLayerFormValues) => {
    updateMutation.mutate(
      {
        id: item.id,
        title: data.title.trim(),
        description: data.description?.trim(),
        igtBasis: data.igtBasis,
        zIndex: data.zIndex,
        minZoom: data.minZoom,
        isActive: data.isActive,
        defaultVisible: data.defaultVisible,
        geoserverId: selectedGeoserver.id,
        workspaceName: data.workspaceName.trim(),
        layerName: data.layerName ? data.layerName.trim() : null,
        typeName: data.typeName.trim(),
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <VStack gap={"xl"} align={"stretch"} w={"full"}>
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
                  rows={3}
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
                  gap={"md"}
                  w={"full"}
                  py={1}
                >
                  <VStack align={"start"} gap={0}>
                    <P fontSize={"sm"} fontWeight={"medium"}>
                      {`Status Publikasi (${field.value ? "Publik" : "Draft"})`}
                    </P>
                    <P fontSize={"xs"} color={"fg.subtle"}>
                      {"Layer yang aktif dapat dilihat & dipesan di katalog Mitra"}
                    </P>
                  </VStack>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(e) => field.onChange(Boolean(e.checked))}
                    tooltip={
                      field.value
                        ? "Ubah status ke Draft"
                        : "Publikasikan ke Katalog"
                    }
                  />
                </HStack>
              </Field>
            )}
          />

          {/* Toggle Default Visible di Map */}
          <Controller
            control={control}
            name={"defaultVisible"}
            render={({ field }) => (
              <Field label={"Tampil Otomatis di Peta (Default Visible)"}>
                <HStack
                  justify={"space-between"}
                  align={"center"}
                  w={"full"}
                  py={1}
                >
                  <VStack align={"start"} gap={0}>
                    <P fontSize={"sm"} fontWeight={"medium"}>
                      {`Tampil di Peta Awal (${field.value ? "Aktif" : "Mati"})`}
                    </P>
                    <P fontSize={"xs"} color={"fg.subtle"}>
                      {
                        "Layer akan langsung aktif di peta saat aplikasi pertama kali dimuat"
                      }
                    </P>
                  </VStack>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(e) => field.onChange(Boolean(e.checked))}
                    tooltip={
                      field.value
                        ? "Nonaktifkan Tampil di Peta Awal"
                        : "Aktifkan Tampil di Peta Awal"
                    }
                  />
                </HStack>
              </Field>
            )}
          />
        </VStack>
      </Fieldset>

      {/* Grup 2: Sumber GeoServer & Layer */}
      <Fieldset legend={"Konfigurasi GeoServer & Layer"} containeredContent>
        <GeoserverCascadeSelect
          parentModalKey={`layer-config-${item.id}`}
          selectedGeoserverId={geoserverId}
          onGeoserverChange={(val) => {
            setValue("geoserverId", val, { shouldValidate: true });
            setValue("workspaceName", "", { shouldValidate: true });
            setValue("layerName", null, { shouldValidate: true });
            setValue("typeName", "", { shouldValidate: true });
          }}
          selectedWorkspace={workspaceName}
          onWorkspaceChange={(val) => {
            setValue("workspaceName", val, { shouldValidate: true });
            setValue("layerName", null, { shouldValidate: true });
            setValue("typeName", val, { shouldValidate: true });
          }}
          selectedLayerName={layerName}
          selectedTypeName={typeName}
          onLayerChange={handleLayerChange}
          errors={errors}
        />
      </Fieldset>

      {/* Grup 3: Konfigurasi Spasial */}
      <Fieldset legend={"Konfigurasi Spasial"} containeredContent>
        <VStack align={"stretch"} gap={"md"}>
          {/* Select Basis IGT via RadioCardInput */}
          <Controller
            control={control}
            name={"igtBasis"}
            render={({ field }) => (
              <Field label={"Basis IGT"}>
                <RadioCardInput.Root
                  value={field.value}
                  onValueChange={({ value }) => {
                    if (value) {
                      field.onChange(value as IgtBasisType);
                    }
                  }}
                  w={"full"}
                >
                  <HStack gap={"sm"} w={"full"}>
                    {IGT_BASIS_OPTIONS.map((opt) => (
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

          {/* Input Minimum Zoom Level */}
          <Controller
            control={control}
            name={"minZoom"}
            render={({ field }) => (
              <Field
                label={"Minimum Zoom Level"}
                helperText={
                  "Layer hanya akan tampil di peta jika zoom level >= nilai ini."
                }
              >
                <NumberInput
                  w={"full"}
                  min={0}
                  max={22}
                  value={String(field.value ?? 12)}
                  onValueChange={({ value }) => field.onChange(value ?? 12)}
                  placeholder={"12"}
                />
              </Field>
            )}
          />
        </VStack>
      </Fieldset>

      {/* Action Buttons */}
      <HStack justify={"end"} gap={"sm"} pt={"md"}>
        <Button
          type={"button"}
          disabled={!isDirty || updateMutation.isPending}
          onClick={() => reset()}
        >
          {t["action.cancel"]()}
        </Button>

        <Button
          primary
          loading={updateMutation.isPending}
          disabled={updateMutation.isPending}
          onClick={handleSubmit(onSubmit, onInvalid)}
        >
          {"Simpan Perubahan"}
        </Button>
      </HStack>
    </VStack>
  );
};

export const InternalDataManagementConfigForm = InternalMasterIgtLayerConfigForm;
