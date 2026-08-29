import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import {
  serviceRateFormSchema,
  zodResolver,
  type ServiceRateFormValues,
} from "@/features/internal/home/schemas/service-rate.schema";
import type { InternalHomeServiceRateItem } from "@/features/internal/home/types/internal.home.service-rate.type";
import { useUpdateInternalPricing } from "@/features/internal/pricing/hooks/use-internal-pricing";
import { t } from "@/shared/libs/i18n";
import type React from "react";
import { Controller, useForm } from "react-hook-form";

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

  // Forms
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ServiceRateFormValues>({
    resolver: zodResolver(serviceRateFormSchema),
    defaultValues: {
      price: rate.price,
      minPurchase: rate.minPurchase,
      kodePnbp: rate.kodePnbp ?? "",
    },
  });

  // Mutations
  const updateMutation = useUpdateInternalPricing();

  const handleFormSubmit = async (values: ServiceRateFormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: rate.id,
        unitPrice: values.price,
        minPurchase: values.minPurchase,
        kodePnbp: values.kodePnbp,
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

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body p={"md"}>
          <VStack align={"stretch"} gap={"md"}>
            {/* Input Tarif Satuan */}
            <Controller
              name={"price"}
              control={control}
              render={({ field }) => (
                <Field
                  label={`Tarif per ${rate.unit}`}
                  w={"full"}
                  errorText={errors.price?.message}
                >
                  <NumberInput
                    w={"full"}
                    value={String(field.value)}
                    formatOptions={{
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }}
                    onValueChange={(val) => field.onChange(val.value)}
                    min={0}
                    step={1000}
                  />
                </Field>
              )}
            />

            {/* Input Minimal Pembelian */}
            <Controller
              name={"minPurchase"}
              control={control}
              render={({ field }) => (
                <Field
                  label={`Minimal Pembelian (${rate.minUnit})`}
                  w={"full"}
                  errorText={errors.minPurchase?.message}
                >
                  <NumberInput
                    w={"full"}
                    value={String(field.value)}
                    onValueChange={(val) => field.onChange(val.value)}
                    min={1}
                    step={100}
                  />
                </Field>
              )}
            />

            {/* Input Kode PNBP */}
            <Field
              label={"Kode Akun PNBP"}
              w={"full"}
              errorText={errors.kodePnbp?.message}
            >
              <Input
                w={"full"}
                placeholder={"PNBP-IGT-01"}
                {...register("kodePnbp")}
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
