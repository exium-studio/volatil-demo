// src/features/mitra/my-data/components/mitra.my-data.edit-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useUpdateMyData } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import { updateMyDataItemSchema } from "@/features/mitra/my-data/types/my-data.schema";
import type {
  MitraMyDataEditModalContentProps,
  MitraMyDataEditTriggerProps,
  UpdateMyDataItemPayload,
} from "@/features/mitra/my-data/types/my-data.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const MitraMyDataEditTrigger = (props: MitraMyDataEditTriggerProps) => {
  // Props
  const {
    modalKey: customModalKey = `my-data-edit-${props.item.id}`,
    item,
    children,
  } = props;

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
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"sm"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      {isMounted && <MitraMyDataEditModalContent item={item} close={close} />}
    </Modal.Root>
  );
};

const MitraMyDataEditModalContent = (
  props: MitraMyDataEditModalContentProps,
) => {
  // Props
  const { item, close } = props;

  // Mutations
  const updateMutation = useUpdateMyData();

  // Form (RHF + Zod)
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateMyDataItemPayload>({
    resolver: zodResolver(updateMyDataItemSchema),
    mode: "onChange",
    defaultValues: {
      label: item.label ?? "",
    },
  });

  // Handlers
  const onSubmit = (values: UpdateMyDataItemPayload) => {
    const formattedLabel = values.label?.trim() ? values.label.trim() : null;
    updateMutation.mutate(
      {
        id: item.id,
        payload: { label: formattedLabel },
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
        <Modal.Title>Ubah Label Data Layer</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>

      <Modal.Body>
        <VStack as={"form"} gap={"md"} id={"my-data-edit-form"}>
          <Fieldset>
            <VStack align={"stretch"} gap={"md"}>
              <VStack
                align={"start"}
                gap={"2xs"}
                w={"full"}
                // px={"md"}
              >
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Nama Layer Asli"}
                </P>

                <P fontSize={"sm"} fontWeight={"medium"}>
                  {item.title || item.id}
                </P>
              </VStack>

              <Field
                variant={"floating"}
                label={"Label Kustom"}
                helperText={
                  "Beri label alias untuk memudahkan identifikasi layer pada daftar data Anda."
                }
                invalid={Boolean(errors.label)}
                errorText={errors.label?.message}
              >
                <Input {...register("label")} size={"lg"} />
              </Field>
            </VStack>
          </Fieldset>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary={true}
            onClick={handleSubmit(onSubmit)}
            loading={updateMutation.isPending}
            disabled={!isDirty || updateMutation.isPending}
          >
            {"Simpan"}
          </Button>

          <Button onClick={close} disabled={updateMutation.isPending}>
            {"Batal"}
          </Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
