// src/features/internal/data-management/components/internal.data-management.edit-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Input } from "@/design-system/components/input/ui/input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { useUpdateMasterIgtLayer } from "@/features/internal/data-management/hooks/use-data-management";
import type { MasterIgtLayerItem } from "@/features/internal/data-management/types/data-management.type";
import { t } from "@/shared/libs/i18n";
import { useState } from "react";

export type InternalDataManagementEditModalProps = {
  modalKey?: string;
  item: MasterIgtLayerItem | null;
  onClose: () => void;
};

export const InternalDataManagementEditModal = (
  props: InternalDataManagementEditModalProps,
) => {
  const { modalKey: customModalKey = "layer-edit", item, onClose } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const handleClose = () => {
    close();
    onClose();
  };

  if (!item) return null;

  return (
    <InternalDataManagementEditModalContent
      key={item.id}
      modalKey={modalKey}
      item={item}
      isOpen={isOpen}
      open={open}
      close={handleClose}
    />
  );
};

type InternalDataManagementEditModalContentProps = {
  modalKey: string;
  item: MasterIgtLayerItem;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const InternalDataManagementEditModalContent = (
  props: InternalDataManagementEditModalContentProps,
) => {
  const { modalKey, item, isOpen, open, close } = props;

  // States initialized from item props (no setState in useEffect)
  const [title, setTitle] = useState<string>(() => item.title);
  const [description, setDescription] = useState<string>(
    () => item.description ?? "",
  );
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
    <Modal.Root modalKey={modalKey} opened={isOpen} open={open} close={close} size={"md"}>
      <Modal.Content>
        <Modal.Header>
          <Modal.CloseButton />

          <VStack gap={SPACING.xs}>
            <Modal.Title>{"Ubah Konfigurasi Layer IGT"}</Modal.Title>
            <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
              {item.id}
            </P>
          </VStack>
        </Modal.Header>

        <Separator borderColor={"bg.canvas"} />

        <Modal.Body p={SPACING.md}>
          <VStack align={"stretch"} gap={SPACING.md}>
            {/* Basis Spasial Badge */}
            <HStack justify={"space-between"} align={"center"}>
              <P fontSize={"sm"} color={"fg.subtle"}>
                {"Basis Spasial"}
              </P>
              <Badge
                colorPalette={item.spatialBasis === "bidang" ? "blue" : "orange"}
                variant={"subtle"}
              >
                {item.spatialBasis === "bidang" ? "Objek Bidang" : "Luas Kawasan"}
              </Badge>
            </HStack>

            {/* Input Judul Layer */}
            <VStack align={"stretch"} gap={1}>
              <P fontSize={"sm"} fontWeight={"medium"}>
                {"Nama / Judul Layer"}
              </P>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={"Contoh: RTRW Kabupaten Badung"}
              />
            </VStack>

            {/* Input Deskripsi */}
            <VStack align={"stretch"} gap={1}>
              <P fontSize={"sm"} fontWeight={"medium"}>
                {"Deskripsi"}
              </P>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={"Deskripsi data layer..."}
              />
            </VStack>

            {/* Input WFS Endpoint */}
            <VStack align={"stretch"} gap={1}>
              <P fontSize={"sm"} fontWeight={"medium"}>
                {"WFS Endpoint URL"}
              </P>
              <Input
                value={wfsUrl}
                onChange={(e) => setWfsUrl(e.target.value)}
                placeholder={"https://.../geoserver/.../ows"}
              />
            </VStack>

            {/* Input WMS Endpoint */}
            <VStack align={"stretch"} gap={1}>
              <P fontSize={"sm"} fontWeight={"medium"}>
                {"WMS Endpoint URL"}
              </P>
              <Input
                value={wmsUrl}
                onChange={(e) => setWmsUrl(e.target.value)}
                placeholder={"https://.../geoserver/.../wms"}
              />
            </VStack>

            {/* Toggle Status Aktif (Publish) */}
            <HStack justify={"space-between"} align={"center"} py={1}>
              <VStack align={"start"} gap={0}>
                <P fontSize={"sm"} fontWeight={"medium"}>
                  {"Status Publikasi (Aktif)"}
                </P>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Layer yang aktif dapat dilihat & dipesan di katalog Mitra"}
                </P>
              </VStack>
              <Switch
                checked={isActive}
                onCheckedChange={(e) => setIsActive(Boolean(e.checked))}
              />
            </HStack>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <HStack gap={SPACING.sm} w={"full"}>
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
    </Modal.Root>
  );
};
