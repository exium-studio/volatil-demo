// src/features/internal/system-policies/components/internal.system-policies.modal.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type { DurationUnit } from "@/design-system/components/input/types/duration-input.type";
import { DurationInput } from "@/design-system/components/input/ui/duration-input";
import { Field } from "@/design-system/components/input/ui/field";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import SelectInput from "@/design-system/components/input/ui/select";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useUpdateInternalSystemPolicy } from "@/features/internal/system-policies/hooks/use-internal-system-policies";
import type {
  InternalSystemPolicyModalContentProps,
  InternalSystemPolicyModalTriggerProps,
  PolicyFormValues,
} from "@/features/internal/system-policies/types/internal.system-policies.type";
import { getSystemPolicyConfig } from "@/features/shared/constants/volatil.ssot-map";
import { t } from "@/shared/libs/i18n";
import { PlusIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export const InternalSystemPolicyModalTrigger = (
  props: InternalSystemPolicyModalTriggerProps,
) => {
  // Props
  const { policy, children, modalKey: customModalKey } = props;

  // Hooks
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
  // Props
  const { policy, close } = props;

  // Hooks
  const updateMutation = useUpdateInternalSystemPolicy();

  // Derived Values
  const config = getSystemPolicyConfig(policy.key);
  const label = config.label;

  const isSyncSchedule = policy.key === "mitra_sync_schedule";
  const isDuration =
    policy.key === "mitra_sync_cycle_days" ||
    policy.unit === "ms" ||
    policy.unit === "milidetik";
  const isPrice =
    policy.unit === "IDR" ||
    policy.unit === "Rupiah" ||
    policy.key.includes("price");

  const parsedSchedule: { unit: string; milestones: number[] } = useMemo(() => {
    if (!isSyncSchedule) {
      return { unit: "minutes", milestones: [2, 5] };
    }
    try {
      const parsed =
        typeof policy.value === "string"
          ? JSON.parse(policy.value)
          : policy.value;
      const unit = parsed?.unit || "minutes";
      const rawMilestones = Array.isArray(parsed?.milestones)
        ? parsed.milestones
        : [];
      const milestones = rawMilestones
        .map((n: unknown) => Number(n))
        .filter((n: number) => !Number.isNaN(n) && n > 0);
      return { unit, milestones };
    } catch {
      return { unit: "minutes", milestones: [2, 5] };
    }
  }, [isSyncSchedule, policy.value]);

  // States
  const [milestonesList, setMilestonesList] = useState<
    Array<{ id: string; value: string }>
  >(() =>
    parsedSchedule.milestones.map((m: number) => ({
      id: crypto.randomUUID(),
      value: String(m),
    })),
  );
  const [milestoneError, setMilestoneError] = useState<string | null>(null);

  const scheduleUnitOptions = useMemo(
    () => [
      { value: "minutes", label: "Menit (Testing)" },
      { value: "days", label: "Hari" },
      { value: "week", label: "Minggu" },
    ],
    [],
  );

  const durationAllowedUnits: DurationUnit[] = useMemo(
    () => ["minute", "day", "week"],
    [],
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PolicyFormValues>({
    defaultValues: {
      value: Number(policy.value) || 0,
      scheduleUnit: parsedSchedule.unit,
    },
  });

  const watchedUnit = useWatch({
    control,
    name: "scheduleUnit",
    defaultValue: parsedSchedule.unit,
  });
  const selectedUnit = watchedUnit || parsedSchedule.unit;
  const unitLabel =
    selectedUnit === "minutes"
      ? "Menit"
      : selectedUnit === "week"
        ? "Minggu"
        : "Hari";

  // Handlers for milestones
  const handleAddMilestone = () => {
    setMilestoneError(null);
    setMilestonesList((prev) => [
      ...prev,
      { id: crypto.randomUUID(), value: "" },
    ]);
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestoneError(null);
    setMilestonesList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMilestoneChange = (id: string, val: string) => {
    setMilestoneError(null);
    setMilestonesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: val } : item)),
    );
  };

  const handleFormSubmit = async (values: PolicyFormValues) => {
    try {
      let payloadValue: number | string =
        policy.valueType === "number"
          ? Number(values.value)
          : String(values.value ?? "");

      if (isSyncSchedule) {
        // Validate items: if there are added items, each must be filled with a valid positive number
        const hasEmpty = milestonesList.some(
          (item) => item.value.trim() === "",
        );
        if (hasEmpty) {
          setMilestoneError(
            "Nilai titik waktu tidak boleh kosong. Isi angka atau hapus item tersebut.",
          );
          return;
        }

        const parsedNums = milestonesList
          .map((item) => Number(item.value.trim()))
          .filter((n) => !Number.isNaN(n) && n > 0);

        payloadValue = JSON.stringify({
          unit: values.scheduleUnit || "minutes",
          milestones: parsedNums,
        });
      }

      await updateMutation.mutateAsync({
        key: policy.key,
        value: payloadValue,
      });
      close();
    } catch {
      // Handled by toastHandlers in hook
    }
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />
        <Modal.Title>{`Ubah Kebijakan: ${label}`}</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body p={"md"}>
          <VStack align={"stretch"} gap={"md"}>
            {isSyncSchedule ? (
              <>
                <Field label={"Satuan Waktu"} w={"full"}>
                  <Controller
                    name={"scheduleUnit"}
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        value={field.value || "minutes"}
                        options={scheduleUnitOptions}
                        clearable={false}
                        onValueChange={(val) => {
                          if (val) field.onChange(val);
                        }}
                      />
                    )}
                  />
                </Field>

                <Field
                  variant={"default"}
                  label={"Jadwal Pembaruan"}
                  w={"full"}
                  errorText={milestoneError ?? undefined}
                  helperText={`Tentukan offset titik ${unitLabel.toLowerCase()} pembaruan data spasial mitra. Jika kosong, tidak ada jadwal otomatis.`}
                >
                  <VStack align={"stretch"} gap={"xs"} w={"full"}>
                    {milestonesList.map((item, idx) => (
                      <HStack
                        key={item.id}
                        gap={"xs"}
                        align={"center"}
                        w={"full"}
                      >
                        <NumberInput
                          id={`milestone-${item.id}`}
                          ids={{ input: `milestone-${item.id}` }}
                          w={"full"}
                          value={item.value}
                          min={1}
                          placeholder={`${idx === 0 ? "15" : idx === 1 ? "30" : "60"}`}
                          onValueChange={(details) =>
                            handleMilestoneChange(
                              item.id,
                              details.formattedValue,
                            )
                          }
                        />

                        <IconButton
                          aria-label={`Hapus ${unitLabel} ke-${idx + 1}`}
                          variant={"outline"}
                          onClick={() => handleRemoveMilestone(item.id)}
                        >
                          <AppIcon icon={XIcon} />
                        </IconButton>
                      </HStack>
                    ))}

                    <Button
                      variant={"outline"}
                      onClick={handleAddMilestone}
                      w={"full"}
                    >
                      <AppIcon icon={PlusIcon} />
                      {`Tambah ${unitLabel}`}
                    </Button>
                  </VStack>
                </Field>
              </>
            ) : isDuration ? (
              <Field
                label={label}
                w={"full"}
                errorText={errors.value?.message}
                helperText={config.helperText}
              >
                <Controller
                  name={"value"}
                  control={control}
                  rules={{
                    required: "Nilai parameter wajib diisi",
                    min: { value: 0, message: "Nilai tidak boleh negatif" },
                  }}
                  render={({ field }) => (
                    <DurationInput
                      w={"full"}
                      value={field.value}
                      onValueChange={(ms) => field.onChange(ms)}
                      allowedUnits={durationAllowedUnits}
                      min={0}
                    />
                  )}
                />
              </Field>
            ) : (
              <Field
                label={`Nilai Parameter (${policy.unit ?? "Satuan"})`}
                w={"full"}
                errorText={errors.value?.message}
                helperText={config.helperText}
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
            )}
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <VStack gap={"xs"} w={"full"}>
            <Button
              primary={true}
              type={"submit"}
              loading={updateMutation.isPending}
            >
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
