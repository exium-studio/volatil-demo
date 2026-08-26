// src/features/internal/home/components/internal.home.service-rate-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import type { InternalHomeServiceRateItem } from "@/features/internal/home/types/internal.home.service-rate.type";
import { useUpdateInternalPricing } from "@/features/internal/pricing/hooks/use-internal-pricing";
import { t } from "@/shared/libs/i18n";
import type React from "react";
import { useState } from "react";

export type InternalHomeServiceRateModalTriggerProps = {
  modalKey?: string;
  serviceRates: InternalHomeServiceRateItem[];
  children: React.ReactNode;
};

export const InternalHomeServiceRateModalTrigger = (
  props: InternalHomeServiceRateModalTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey = "internal-home-service-rates",
    serviceRates,
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
      size={"sm"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <InternalHomeServiceRateModalContent
        serviceRates={serviceRates}
        close={close}
      />
    </Modal.Root>
  );
};

type InternalHomeServiceRateModalContentProps = {
  serviceRates: InternalHomeServiceRateItem[];
  close: () => void;
};

const InternalHomeServiceRateModalContent = (
  props: InternalHomeServiceRateModalContentProps,
) => {
  const { serviceRates, close } = props;

  // Find initial rates for bidang & kawasan
  const bidangRate =
    serviceRates.find((r) => r.unit.toLowerCase().includes("bidang")) ??
    serviceRates[0];
  const kawasanRate =
    serviceRates.find((r) => r.unit.toLowerCase().includes("ha")) ??
    serviceRates[1];

  const [bidangPrice, setBidangPrice] = useState<number>(
    () => bidangRate?.price ?? 50000,
  );
  const [kawasanPrice, setKawasanPrice] = useState<number>(
    () => kawasanRate?.price ?? 150000,
  );

  const updateMutation = useUpdateInternalPricing();

  const handleSubmit = async () => {
    try {
      if (bidangRate) {
        await updateMutation.mutateAsync({
          id: bidangRate.id.startsWith("rate-")
            ? "price-bidang-default"
            : bidangRate.id,
          unitPrice: bidangPrice,
        });
      }
      if (kawasanRate) {
        await updateMutation.mutateAsync({
          id: kawasanRate.id.startsWith("rate-")
            ? "price-kawasan-default"
            : kawasanRate.id,
          unitPrice: kawasanPrice,
        });
      }
      close();
    } catch {
      // Handled by toastHandlers in useUpdateInternalPricing
    }
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={SPACING.xs}>
          <Modal.Title>{"Ubah Tarif Jasa Akses IGT-PR"}</Modal.Title>

          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {"Tarif standar PNBP ATR/BPN berbasis objek dan luas"}
          </P>
        </VStack>
      </Modal.Header>

      <Separator borderColor={"bg.canvas"} />

      <Modal.Body p={SPACING.md}>
        <VStack align={"stretch"} gap={SPACING.md}>
          {/* Input Tarif Bidang */}
          <VStack align={"stretch"} gap={1}>
            <HStack justify={"space-between"}>
              <P fontSize={"sm"} fontWeight={"medium"}>
                {"Tarif IGT Berbasis Bidang"}
              </P>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"/ bidang"}
              </P>
            </HStack>
            <NumberInput
              value={String(bidangPrice)}
              onValueChange={(val) => setBidangPrice(Number(val.value))}
              min={0}
              step={5000}
            />
          </VStack>

          {/* Input Tarif Kawasan */}
          <VStack align={"stretch"} gap={1}>
            <HStack justify={"space-between"}>
              <P fontSize={"sm"} fontWeight={"medium"}>
                {"Tarif IGT Berbasis Kawasan"}
              </P>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"/ hektar"}
              </P>
            </HStack>
            <NumberInput
              value={String(kawasanPrice)}
              onValueChange={(val) => setKawasanPrice(Number(val.value))}
              min={0}
              step={10000}
            />
          </VStack>
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
            onClick={() => void handleSubmit()}
          >
            {"Simpan"}
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
