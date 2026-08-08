// src/features/cart/components/mitra.cart.location-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING_MD, SPACING_SM } from "@/design-system/constants/styles";
import { useCartBboxQuery } from "@/features/cart/hooks/use-mitra-cart";
import type { MitraCartLocationModalProps } from "@/features/cart/types/cart.type";
import { GlobeIcon, MapPinIcon } from "lucide-react";

export const MitraCartLocationModal = (
  props: MitraCartLocationModalProps,
) => {
  // Props
  const { modalKey, isOpen, open, close } = props;

  // Hooks (Queries)
  const { data: bboxData } = useCartBboxQuery();

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"md"}
    >
      <Modal.Content>
        <Modal.Header>
          <HStack gap={SPACING_SM} justify={"center"} w={"full"}>
            <AppIcon icon={MapPinIcon} color={"blue.fg"} />
            <P fontSize={"lg"} fontWeight={"semibold"}>
              {"Cek Lokasi Area Pembelian"}
            </P>
          </HStack>
        </Modal.Header>

        <Modal.Body>
          <VStack gap={SPACING_MD} align={"stretch"}>
            <Box p={SPACING_MD} bg={"bg.canvas"} rounded={"md"}>
              <VStack gap={SPACING_SM} align={"start"}>
                <HStack gap={SPACING_SM}>
                  <AppIcon icon={GlobeIcon} color={"blue.fg"} />
                  <P fontWeight={"semibold"}>
                    {bboxData?.areaName ?? "Kawasan Kota Semarang dan Sekitarnya"}
                  </P>
                </HStack>

                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Cakupan Bounding Box (EPSG:4326):"}
                </P>

                <Badge colorPalette={"neutral"} variant={"subtle"}>
                  {bboxData?.bbox
                    ? `[${bboxData.bbox.join(", ")}]`
                    : "[110.36, -7.05, 110.45, -6.95]"}
                </Badge>
              </VStack>
            </Box>

            <VStack gap={1} align={"start"} p={SPACING_SM}>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Informasi Coverage Area:"}
              </P>
              <P fontSize={"sm"}>
                {"Seluruh data polygon di keranjang berada dalam cakupan area bbox di atas."}
              </P>
            </VStack>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <Button w={"full"} variant={"outline"} onClick={close}>
            {"Tutup"}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
