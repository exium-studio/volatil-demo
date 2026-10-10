// src/features/internal/pricing/components/internal.pricing-edit-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useUpdateInternalPricing } from "@/features/internal/pricing/hooks/use-internal-pricing";
import type {
  InternalPricingEditModalContentProps,
  InternalPricingEditModalProps,
} from "@/features/internal/pricing/types/internal.pricing.type";
import { t } from "@/shared/libs/i18n";
import { useState } from "react";

export const InternalPricingEditModal = (
  props: InternalPricingEditModalProps,
) => {
  // Props
  const { modalKey: customModalKey = "pricing-edit", item, onClose } = props;

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
    <InternalPricingEditModalContent
      key={item.id}
      modalKey={modalKey}
      item={item}
      isOpen={isOpen}
      open={open}
      close={handleClose}
    />
  );
};

const InternalPricingEditModalContent = (
  props: InternalPricingEditModalContentProps,
) => {
  // Props
  const { modalKey, item, isOpen, open, close } = props;

  // States initialized from item props (no setState in useEffect)
  const [price, setPrice] = useState<number>(() => item.price ?? item.unitPrice ?? 0);
  const [pnbpCode, setPnbpCode] = useState<string>(
    () => item.pnbpCode ?? item.kodePnbp ?? "",
  );
  const [minimumPurchase, setMinimumPurchase] = useState<number>(
    () => item.minimumPurchase ?? item.minPurchase ?? 0,
  );

  // Mutations
  const updateMutation = useUpdateInternalPricing();

  const handleSubmit = () => {
    updateMutation.mutate(
      {
        id: item.id,
        price,
        pnbpCode,
        minimumPurchase,
      },
      {
        onSuccess: () => {
          close();
        },
      },
    );
  };

  const basis = item.igtBasis ?? item.spatialBasis ?? "bidang";
  const unitLabel = item.unit ?? (basis === "bidang" ? "bidang" : "ha");

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"sm"}
    >
      <Modal.Content>
        <Modal.Header>
          <Modal.CloseButton />

          <VStack gap={"xs"}>
            <Modal.Title>{"Ubah Tarif PNBP"}</Modal.Title>
            <P fontSize={"xs"} textAlign={"center"} color={"fg.muted"}>
              {item.layerTitle ?? item.id}
            </P>
          </VStack>
        </Modal.Header>

        <Separator borderColor={"bg.canvas"} />

        <Modal.Body p={"md"}>
          <VStack align={"stretch"} gap={"md"}>
            {/* Metadata Badges */}
            <HStack justify={"space-between"} align={"center"}>
              <P fontSize={"sm"} color={"fg.subtle"}>
                {"Basis IGT"}
              </P>
              <Badge
                colorPalette={basis === "bidang" ? "blue" : "orange"}
                variant={"subtle"}
              >
                {basis === "bidang"
                  ? "IGT Berbasis Bidang"
                  : "IGT Berbasis Kawasan"}
              </Badge>
            </HStack>

            {/* Input Kode PNBP */}
            <VStack align={"stretch"} gap={1}>
              <Field label={"Kode PNBP"}>
                <Input
                  value={pnbpCode}
                  onChange={(e) => setPnbpCode(e.target.value)}
                  placeholder={"PNBP_BIDANG_01"}
                />
              </Field>
            </VStack>

            {/* Input Unit Price */}
            <VStack align={"stretch"} gap={1}>
              <P fontSize={"sm"} fontWeight={"medium"}>
                {`Tarif Satuan (Rp / ${unitLabel})`}
              </P>
              <NumberInput
                value={String(price)}
                onValueChange={(val) => setPrice(Number(val.value))}
                min={0}
                step={1000}
              />
            </VStack>

            {/* Input Minimum Purchase */}
            <VStack align={"stretch"} gap={1}>
              <P fontSize={"sm"} fontWeight={"medium"}>
                {`Minimum Pembelian (${unitLabel})`}
              </P>
              <NumberInput
                value={String(minimumPurchase)}
                onValueChange={(val) => setMinimumPurchase(Number(val.value))}
                min={0}
                step={1}
              />
            </VStack>
          </VStack>
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
    </Modal.Root>
  );
};
