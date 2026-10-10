// src/features/internal/home/components/internal.home.pricing-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import {
  internalHomePricingFormSchema,
  zodResolver,
} from "@/features/internal/home/schemas/internal.home.pricing.schema";
import type {
  InternalHomePricingModalContentProps,
  InternalHomePricingModalTriggerProps,
  PricingFormValues,
} from "@/features/internal/home/types/internal.home.pricing.type";
import { useUpdateInternalPricing } from "@/features/internal/pricing/hooks/use-internal-pricing";
import { t } from "@/shared/libs/i18n";
import { useForm } from "react-hook-form";

export const InternalHomePricingModalTrigger = (
  props: InternalHomePricingModalTriggerProps,
) => {
  // Props
  const { pricing, children } = props;
  const customModalKey = props.modalKey ?? `home-pricing-edit-${pricing.id}`;

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
        <InternalHomePricingModalContent
          modalKey={modalKey}
          pricing={pricing}
          close={close}
        />
      )}
    </Modal.Root>
  );
};

const InternalHomePricingModalContent = (
  props: InternalHomePricingModalContentProps,
) => {
  const { pricing, close } = props;

  // Forms
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PricingFormValues>({
    resolver: zodResolver(internalHomePricingFormSchema),
    defaultValues: {
      price: pricing.price,
      minimumPurchase: pricing.minimumPurchase,
      pnbpCode: pricing.pnbpCode ?? "",
    },
  });

  // Mutations
  const updateMutation = useUpdateInternalPricing();

  const handleFormSubmit = async (values: PricingFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: pricing.id,
        price: values.price,
        minimumPurchase: values.minimumPurchase,
        pnbpCode: values.pnbpCode,
      });

      close();
    } catch {
      // Handled by toastHandlers in useUpdateInternalPricing
    }
  };

  const basisTitle =
    pricing.title ??
    (pricing.igtBasis === "bidang" ? "Tarif Objek Bidang" : "Tarif Kawasan Ha");

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />
        <Modal.Title>{`Ubah Tarif ${basisTitle}`}</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body p={"md"}>
          <VStack gap={"md"}>
            {/* Input Tarif Satuan */}
            <Field
              label={`Tarif per ${pricing.unit}`}
              w={"full"}
              errorText={errors.price?.message}
            >
              <NumberInput
                w={"full"}
                defaultValue={String(pricing.price)}
                formatOptions={{
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }}
                inputProps={register("price")}
                min={0}
                step={1000}
              />
            </Field>

            {/* Input Minimal Pembelian */}
            <Field
              label={`Minimal Pembelian (${pricing.unit})`}
              w={"full"}
              errorText={errors.minimumPurchase?.message}
            >
              <NumberInput
                w={"full"}
                defaultValue={String(pricing.minimumPurchase)}
                inputProps={register("minimumPurchase")}
                min={1}
                step={100}
              />
            </Field>

            {/* Input Kode PNBP */}
            <Field
              label={"Kode Akun PNBP"}
              w={"full"}
              errorText={errors.pnbpCode?.message}
            >
              <Input
                w={"full"}
                placeholder={"425121"}
                defaultValue={pricing.pnbpCode}
                {...register("pnbpCode")}
              />
            </Field>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <VStack gap={"xs"} w={"full"}>
            <Button
              type={"submit"}
              primary
              w={"full"}
              loading={updateMutation.isPending}
            >
              {"Simpan"}
            </Button>
            <Button type={"button"} w={"full"} onClick={close}>
              {t["action.cancel"]()}
            </Button>
          </VStack>
        </Modal.Footer>
      </form>
    </Modal.Content>
  );
};
