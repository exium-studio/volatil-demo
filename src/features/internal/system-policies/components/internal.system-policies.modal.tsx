import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useUpdateInternalSystemPolicy } from "@/features/internal/system-policies/hooks/use-internal-system-policies";
import type {
  InternalSystemPolicyModalContentProps,
  InternalSystemPolicyModalTriggerProps,
  PolicyFormValues,
} from "@/features/internal/system-policies/types/internal.system-policies.type";
import { t } from "@/shared/libs/i18n";
import { useForm } from "react-hook-form";

export const InternalSystemPolicyModalTrigger = (
  props: InternalSystemPolicyModalTriggerProps,
) => {
  const { policy, children, modalKey: customModalKey } = props;
  const modalKey = customModalKey ?? `system-policy-edit-${policy.key}`;

  const { isOpen, open, close } = usePopModal({
    modalKey,
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
        <InternalSystemPolicyModalContent policy={policy} close={close} />
      )}
    </Modal.Root>
  );
};

const InternalSystemPolicyModalContent = (
  props: InternalSystemPolicyModalContentProps,
) => {
  const { policy, close } = props;

  const updateMutation = useUpdateInternalSystemPolicy();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PolicyFormValues>({
    defaultValues: {
      value: Number(policy.value) || 0,
    },
  });

  const handleFormSubmit = async (values: PolicyFormValues) => {
    try {
      const payloadValue =
        policy.valueType === "number" ? Number(values.value) : values.value;
      await updateMutation.mutateAsync({
        key: policy.key,
        value: payloadValue,
      });
      close();
    } catch {
      // Handled by toastHandlers in hook
    }
  };

  const isPrice =
    policy.unit === "IDR" ||
    policy.unit === "Rupiah" ||
    policy.key.includes("price");

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />
        <Modal.Title>{`Ubah Kebijakan: ${policy.label ?? policy.key}`}</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body p={"md"}>
          <VStack align={"stretch"} gap={"md"}>
            {policy.description && (
              <P color={"fg.subtle"} fontSize={"sm"}>
                {policy.description}
              </P>
            )}

            <Field
              label={`Nilai Parameter (${policy.unit ?? "Satuan"})`}
              w={"full"}
              errorText={errors.value?.message}
            >
              <NumberInput
                w={"full"}
                defaultValue={String(policy.value)}
                formatOptions={
                  isPrice
                    ? {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }
                    : undefined
                }
                inputProps={register("value", {
                  required: "Nilai parameter wajib diisi",
                  min: { value: 0, message: "Nilai tidak boleh negatif" },
                })}
                min={0}
                step={isPrice ? 1000 : 1}
              />
            </Field>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <VStack gap={"xs"} w={"full"}>
            <Button primary type={"submit"} loading={updateMutation.isPending}>
              {"Simpan"}
            </Button>

            <Button onClick={close} disabled={updateMutation.isPending}>
              {t["action.cancel"]()}
            </Button>
          </VStack>
        </Modal.Footer>
      </form>
    </Modal.Content>
  );
};
