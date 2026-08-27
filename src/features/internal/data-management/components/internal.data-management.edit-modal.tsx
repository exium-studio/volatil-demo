// src/features/internal/data-management/components/internal.data-management.edit-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useUpdateMasterIgtLayer } from "@/features/internal/data-management/hooks/use-data-management";
import type {
  MasterIgtLayerItem,
  SpatialBasisType,
} from "@/features/internal/data-management/types/data-management.type";
import { SpatialBasisSelect } from "@/shared/components/select/ui/spatial-basis-select";
import { t } from "@/shared/libs/i18n";
import { useState, type ReactNode } from "react";

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

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"md"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <InternalDataManagementEditModalContent
        modalKey={modalKey}
        item={item}
        close={close}
      />
    </Modal.Root>
  );
};

type InternalDataManagementEditModalContentProps = {
  modalKey: string;
  item: MasterIgtLayerItem;
  close: () => void;
};

const SPATIAL_BASIS_EDIT_OPTIONS = [
  { value: "bidang", label: "Objek Bidang" },
  { value: "kawasan", label: "Luas Kawasan" },
];

const InternalDataManagementEditModalContent = (
  props: InternalDataManagementEditModalContentProps,
) => {
  const { modalKey, item, close } = props;

  // States initialized from item props (no setState in useEffect)
  const [title, setTitle] = useState<string>(() => item.title);
  const [description, setDescription] = useState<string>(
    () => item.description ?? "",
  );
  const [spatialBasis, setSpatialBasis] = useState<SpatialBasisType>(
    () => item.spatialBasis,
  );
  const [zIndex, setZIndex] = useState<number>(() => item.zIndex ?? 1);
  const [wfsUrl, setWfsUrl] = useState<string>(() => item.wfs.wfsUrl);
  const [wmsUrl, setWmsUrl] = useState<string>(() => item.wms.wmsUrl);
  const [isActive, setIsActive] = useState<boolean>(() => item.isActive);

  // Mutations
  const updateMutation = useUpdateMasterIgtLayer();

  const handleSubmit = () => {
    updateMutation.mutate(
      {
        id: item.id,
        title,
        description,
        spatialBasis,
        zIndex,
        isActive,
        wfs: {
          wfsUrl,
          wfsTypeName: item.wfs.wfsTypeName,
        },
        wms: {
          wmsUrl,
          layers: item.wms.layers,
        },
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

        <VStack gap={"2xs"}>
          <Modal.Title>{"Ubah Konfigurasi Layer IGT"}</Modal.Title>
          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {item.id}
          </P>
        </VStack>
      </Modal.Header>

      <Separator borderColor={"bg.canvas"} />

      <Modal.Body p={"md"}>
        <Fieldset>
          <VStack align={"stretch"} gap={"md"}>
            {/* Input Judul Layer */}
            <Field label={"Nama / Judul Layer"}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={"Contoh: RTRW Kabupaten Badung"}
              />
            </Field>

            {/* Select Basis Spasial */}
            <Field label={"Basis Spasial"}>
              <SpatialBasisSelect
                modalKey={`${modalKey}.spatial-basis`}
                options={SPATIAL_BASIS_EDIT_OPTIONS}
                value={spatialBasis}
                onValueChange={(val) =>
                  setSpatialBasis(val as SpatialBasisType)
                }
                placeholder={"Pilih Basis Spasial"}
                w={"full"}
              />
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
                placeholder={"Contoh: 1"}
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

            {/* Input WFS Endpoint */}
            <Field label={"WFS Endpoint URL"}>
              <Textarea
                rows={2}
                value={wfsUrl}
                onChange={(e) => setWfsUrl(e.target.value)}
                placeholder={"https://.../geoserver/.../ows"}
              />
            </Field>

            {/* Input WMS Endpoint */}
            <Field label={"WMS Endpoint URL"}>
              <Textarea
                rows={2}
                value={wmsUrl}
                onChange={(e) => setWmsUrl(e.target.value)}
                placeholder={"https://.../geoserver/.../wms"}
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
      </Modal.Body>

      <Modal.Footer>
        <HStack gap={"sm"} w={"full"}>
          <Button variant={"outline"} flex={1} onClick={close}>
            {t["action.cancel"]()}
          </Button>
          <Button
            primary
            flex={1}
            loading={updateMutation.isPending}
            onClick={handleSubmit}
          >
            {"Simpan"}
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
