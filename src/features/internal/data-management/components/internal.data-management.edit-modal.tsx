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
import type {
  GeoServerWorkspaceLayerOption,
  MasterIgtLayerItem,
  SpatialBasisType,
} from "@/features/internal/data-management/types/data-management.type";
import { useMasterGeoserverQuery } from "@/features/internal/master-geoserver/hooks/use-master-geoserver";
import { t } from "@/shared/libs/i18n";
import { Layers2Icon, TreesIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

export type InternalDataManagementEditTriggerProps = {
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

  // States initialized from item props (no setState in useEffect)
  const [title, setTitle] = useState<string>(() => item.title);
  const [description, setDescription] = useState<string>(
    () => item.description ?? "",
  );
  const [spatialBasis, setSpatialBasis] = useState<SpatialBasisType>(
    () => item.spatialBasis,
  );
  const [zIndex, setZIndex] = useState<number>(() => item.zIndex ?? 1);
  const [selectedGeoserverId, setSelectedGeoserverId] = useState<string>(
    () => item.geoserverId ?? "gs_prod_01",
  );
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(
    () => initialWorkspace,
  );
  const [selectedTypeName, setSelectedTypeName] = useState<string>(
    () => item.typeName ?? item.id ?? "",
  );
  const [isActive, setIsActive] = useState<boolean>(() => item.isActive);

  // Hooks (Queries & Mutations)
  const { items: geoserverList } = useMasterGeoserverQuery();
  const updateMutation = useUpdateMasterIgtLayer();

  // Derived Values
  const selectedGeoserver = useMemo(
    () =>
      geoserverList.find((g) => g.id === selectedGeoserverId) ?? {
        id: selectedGeoserverId,
        baseUrl: item.geoserverBaseUrl,
      },
    [geoserverList, selectedGeoserverId, item.geoserverBaseUrl],
  );

  const handleLayerChange = (
    typeName: string,
    layerDetail?: GeoServerWorkspaceLayerOption,
  ) => {
    setSelectedTypeName(typeName);
    if (layerDetail?.spatialBasis) {
      setSpatialBasis(layerDetail.spatialBasis);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !selectedTypeName.trim()) return;

    const baseUrl = selectedGeoserver.baseUrl || item.geoserverBaseUrl;
    const wfsUrl = `${baseUrl}/ows`;
    const wmsUrl = `${baseUrl}/wms`;

    updateMutation.mutate(
      {
        id: item.id,
        title: title.trim(),
        description: description.trim(),
        spatialBasis,
        zIndex,
        isActive,
        geoserverId: selectedGeoserver.id,
        geoserverBaseUrl: baseUrl,
        typeName: selectedTypeName.trim(),
        wfsUrl,
        wmsUrl,
      },
      {
        onSuccess: () => {
          close();
        },
      },
    );
  };

  const isFormValid = Boolean(title.trim() && selectedTypeName.trim());

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
              <Field label={"Nama / Judul Layer"}>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={"RTRW Kabupaten Badung"}
                />
              </Field>

              {/* Input Deskripsi */}
              <Field label={"Deskripsi"} optional>
                <Textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={"Deskripsi data layer..."}
                />
              </Field>

              {/* Toggle Status Aktif (Publish) */}
              <Field label={"Status Publikasi"}>
                <HStack
                  justify={"space-between"}
                  align={"center"}
                  w={"full"}
                  py={1}
                >
                  <VStack align={"start"} gap={0}>
                    <P fontSize={"sm"} fontWeight={"medium"}>
                      {isActive ? "Publik (Aktif)" : "Draft (Nonaktif)"}
                    </P>
                    <P fontSize={"xs"} color={"fg.subtle"}>
                      {
                        "Layer yang aktif dapat dilihat & dipesan di katalog Mitra"
                      }
                    </P>
                  </VStack>
                  <Switch
                    checked={isActive}
                    onCheckedChange={(e) => setIsActive(Boolean(e.checked))}
                  />
                </HStack>
              </Field>
            </VStack>
          </Fieldset>

          {/* Grup 2: Sumber GeoServer & Layer (Dedicated Component) */}
          <Fieldset legend={"Konfigurasi GeoServer & Layer"} containeredContent>
            <GeoserverCascadeSelect
              parentModalKey={modalKey}
              selectedGeoserverId={selectedGeoserverId}
              onGeoserverChange={setSelectedGeoserverId}
              selectedWorkspace={selectedWorkspace}
              onWorkspaceChange={setSelectedWorkspace}
              selectedTypeName={selectedTypeName}
              onLayerChange={handleLayerChange}
            />
          </Fieldset>

          {/* Grup 3: Konfigurasi Spasial */}
          <Fieldset legend={"Konfigurasi Spasial"} containeredContent>
            <VStack align={"stretch"} gap={"md"}>
              {/* Select Basis IGT via RadioCardInput */}
              <Field label={"Basis IGT"}>
                <RadioCardInput.Root
                  value={spatialBasis}
                  onValueChange={({ value }) => {
                    if (value) {
                      setSpatialBasis(value as SpatialBasisType);
                    }
                  }}
                  w={"full"}
                >
                  <HStack gap={"sm"} w={"full"}>
                    <RadioCardInput.Item value={"bidang"} flex={1} p={3}>
                      <HStack
                        justify={"space-between"}
                        align={"center"}
                        w={"full"}
                      >
                        <HStack gap={"xs"} align={"center"}>
                          <AppIcon icon={Layers2Icon} color={"blue.fg"} />
                          <RadioCardInput.ItemText fontSize={"sm"}>
                            {"Bidang"}
                          </RadioCardInput.ItemText>
                        </HStack>
                        <RadioCardInput.ItemIndicator />
                      </HStack>
                    </RadioCardInput.Item>

                    <RadioCardInput.Item value={"kawasan"} flex={1} p={3}>
                      <HStack
                        justify={"space-between"}
                        align={"center"}
                        w={"full"}
                      >
                        <HStack gap={"xs"} align={"center"}>
                          <AppIcon icon={TreesIcon} color={"orange.fg"} />
                          <RadioCardInput.ItemText fontSize={"sm"}>
                            {"Kawasan"}
                          </RadioCardInput.ItemText>
                        </HStack>
                        <RadioCardInput.ItemIndicator />
                      </HStack>
                    </RadioCardInput.Item>
                  </HStack>
                </RadioCardInput.Root>
              </Field>

              {/* Input Urutan Z-Index */}
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
                  value={String(zIndex)}
                  onValueChange={({ value }) => setZIndex(value || 1)}
                  placeholder={"1"}
                />
              </Field>

              {/* Generated URLs — readonly, for reference */}
              <VStack align={"stretch"} gap={"xs"}>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"WFS URL"}
                </P>
                <P fontSize={"xs"} fontFamily={"mono"} color={"fg.muted"}>
                  {item.wfsUrl || "-"}
                </P>
              </VStack>

              <VStack align={"stretch"} gap={"xs"}>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"WMS URL"}
                </P>
                <P fontSize={"xs"} fontFamily={"mono"} color={"fg.muted"}>
                  {item.wmsUrl || "-"}
                </P>
              </VStack>
            </VStack>
          </Fieldset>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary
            loading={updateMutation.isPending}
            disabled={!isFormValid || updateMutation.isPending}
            onClick={handleSubmit}
          >
            {"Simpan"}
          </Button>

          <Button onClick={close}>{t["action.cancel"]()}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
