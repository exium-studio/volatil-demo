import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import type { InternalHomeServiceRateItem } from "@/features/internal/home/types/internal.home.service-rate.type";
import { useUpdateInternalPricing } from "@/features/internal/pricing/hooks/use-internal-pricing";
import { t } from "@/shared/libs/i18n";
import type React from "react";
import { useState } from "react";

export type InternalHomeServiceRateModalTriggerProps = {
  modalKey?: string;
  rate: InternalHomeServiceRateItem;
  children: React.ReactNode;
};

export const InternalHomeServiceRateModalTrigger = (
  props: InternalHomeServiceRateModalTriggerProps,
) => {
  // Props
  const { rate, children } = props;
  const customModalKey = props.modalKey ?? `service-rate-edit-${rate.id}`;

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
    <Modal.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <Modal.Trigger>{children}</Modal.Trigger>

      {isMounted && (
        <InternalHomeServiceRateModalContent
          modalKey={modalKey}
          rate={rate}
          close={close}
        />
      )}
    </Modal.Root>
  );
};

type InternalHomeServiceRateModalContentProps = {
  modalKey?: string;
  rate: InternalHomeServiceRateItem;
  close: () => void;
};

const InternalHomeServiceRateModalContent = (
  props: InternalHomeServiceRateModalContentProps,
) => {
  const { rate, close } = props;

  const [price, setPrice] = useState<number>(() => rate.price);
  const [kodePnbp, setKodePnbp] = useState<string>(
    () =>
      rate.kodePnbp ??
      (rate.unit.toLowerCase().includes("bidang")
        ? "PNBP-IGT-01"
        : "PNBP-IGT-02"),
  );

  const updateMutation = useUpdateInternalPricing();

  const handleSubmit = async () => {
    try {
      const targetId = rate.id.startsWith("rate-")
        ? rate.unit.toLowerCase().includes("bidang")
          ? "price-bidang-default"
          : "price-kawasan-default"
        : rate.id;

      await updateMutation.mutateAsync({
        id: targetId,
        unitPrice: price,
        kodePnbp,
      });

      close();
    } catch {
      // Handled by toastHandlers in useUpdateInternalPricing
    }
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />
        <Modal.Title>{`Ubah Tarif ${rate.title}`}</Modal.Title>
      </Modal.Header>

      <Modal.Body p={"md"}>
        <VStack align={"stretch"} gap={"md"}>
          {/* Input Tarif Satuan */}
          <Field label={`Tarif per ${rate.unit}`} w={"full"}>
            <NumberInput
              w={"full"}
              value={String(price)}
              onValueChange={(val) => setPrice(Number(val.value))}
              min={0}
              step={1000}
            />
          </Field>

          {/* Input Kode PNBP */}
          <Field label={"Kode Akun PNBP"} w={"full"}>
            <Input
              w={"full"}
              value={kodePnbp}
              onChange={(e) => setKodePnbp(e.target.value)}
              placeholder={"Contoh: PNBP-IGT-01"}
            />
          </Field>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary
            w={"full"}
            loading={updateMutation.isPending}
            onClick={() => void handleSubmit()}
          >
            {"Simpan"}
          </Button>
          <Button w={"full"} onClick={close}>
            {t["action.cancel"]()}
          </Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
