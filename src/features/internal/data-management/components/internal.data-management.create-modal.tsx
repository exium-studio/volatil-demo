// src/features/internal/data-management/components/internal.data-management.create-modal.tsx

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
import { GeoserverCascadeSelect } from "@/features/internal/data-management/components/geoserver-cascade-select";
import { useCreateMasterIgtLayer } from "@/features/internal/data-management/hooks/use-data-management";
import type {
  GeoServerWorkspaceLayerOption,
  SpatialBasisType,
} from "@/features/internal/data-management/types/data-management.type";
import { useMasterGeoserverQuery } from "@/features/internal/master-geoserver/hooks/use-master-geoserver";
import { t } from "@/shared/libs/i18n";
import { Layers2Icon, TreesIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

export type InternalDataManagementCreateTriggerProps = {
  modalKey?: string;
  children?: ReactNode;
};

export const InternalDataManagementCreateTrigger = (
  props: InternalDataManagementCreateTriggerProps,
) => {
  const { modalKey: customModalKey = "create-igt-layer", children } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
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

      <InternalDataManagementCreateModalContent
        modalKey={modalKey}
        close={close}
      />
    </Modal.Root>
  );
};

type InternalDataManagementCreateModalContentProps = {
  modalKey: string;
  close: () => void;
};

const InternalDataManagementCreateModalContent = (
  props: InternalDataManagementCreateModalContentProps,
) => {
  // Props
  const { modalKey, close } = props;

  // States
  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [spatialBasis, setSpatialBasis] = useState<SpatialBasisType>("kawasan");
  const [zIndex, setZIndex] = useState<number>(1);
  const [selectedGeoserverId, setSelectedGeoserverId] = useState<string>("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [selectedTypeName, setSelectedTypeName] = useState<string>("");
  const [bbox, setBbox] = useState<[number, number, number, number]>([
    115.083839, -8.850039, 115.251389, -8.239441,
  ]);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Hooks
  const { items: geoserverList } = useMasterGeoserverQuery();
  const createMutation = useCreateMasterIgtLayer();

  // Derived Values
  const selectedGeoserver = useMemo(
    () => geoserverList.find((g) => g.id === selectedGeoserverId),
    [geoserverList, selectedGeoserverId],
  );

  const handleLayerChange = (
    typeName: string,
    layerDetail?: GeoServerWorkspaceLayerOption,
  ) => {
    setSelectedTypeName(typeName);
    if (layerDetail) {
      if (!title) {
        setTitle(layerDetail.title || layerDetail.name);
      }
      if (!description && layerDetail.abstract) {
        setDescription(layerDetail.abstract);
      }
      if (layerDetail.spatialBasis) {
        setSpatialBasis(layerDetail.spatialBasis);
      }
      if (layerDetail.bbox) {
        setBbox(layerDetail.bbox);
      }
      if (!id) {
        setId(layerDetail.typeName);
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !selectedGeoserver || !selectedTypeName.trim()) return;

    const layerId =
      id.trim() || selectedTypeName.trim() || `layer_${Date.now()}`;
    const baseUrl = selectedGeoserver.baseUrl;
    const wfsUrl = `${baseUrl}/ows`;
    const wmsUrl = `${baseUrl}/wms`;

    createMutation.mutate(
      {
        id: layerId,
        title: title.trim(),
        description: description.trim(),
        spatialBasis,
        zIndex,
        isActive,
        bbox,
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

  const isFormValid = Boolean(
    title.trim() && selectedGeoserverId && selectedTypeName.trim(),
  );

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>{"Tambah Layer IGT Baru"}</Modal.Title>
          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {
              "Daftarkan layer geospasial tematik baru ke katalog internal ATR/BPN"
            }
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"xl"}>
          {/* Grup 1: Informasi Dasar Layer */}
          <Fieldset legend={"Informasi Dasar"} containeredContent>
            <VStack align={"stretch"} gap={"md"}>
              {/* Input ID / Identifier Layer */}
              <Field
                label={"ID / Identifier Layer"}
                helperText={
                  "testing_workspace:TEST_RTRW_BADUNG (opsional, otomatis dari layer)"
                }
                optional
              >
                <Input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder={"workspace:nama_layer"}
                />
              </Field>

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
            </VStack>
          </Fieldset>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary
            loading={createMutation.isPending}
            disabled={!isFormValid || createMutation.isPending}
            onClick={handleSubmit}
          >
            {"Tambah Layer"}
          </Button>

          <Button onClick={close}>{t["action.cancel"]()}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
