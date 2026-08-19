// src/features/mitra/help-center/components/help-center.create.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Input } from "@/design-system/components/input/ui/input";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { HelpCenterTransactionSelect } from "@/features/mitra/help-center/components/help-center.transaction-select";
import { useCreateHelpCenterTicket } from "@/features/mitra/help-center/hooks/use-help-center.query";
import {
  createHelpCenterSchema,
  type CreateHelpCenterFormValues,
  zodResolver,
} from "@/features/mitra/help-center/schemas/help-center.schema";
import type { CreateHelpCenterTriggerProps } from "@/features/mitra/help-center/types/help-center.type";
import { Controller, useForm } from "react-hook-form";

export const CreateHelpCenterTrigger = (
  props: CreateHelpCenterTriggerProps,
) => {
  // Props
  const { children, modalKey: customModalKey, onSubmitTicket } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey ?? "createHelpCenterModal",
  });

  // States
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateHelpCenterFormValues>({
    resolver: zodResolver(createHelpCenterSchema),
    defaultValues: {
      title: "",
      description: "",
      transactionId: "",
      orderNumber: "",
      files: [],
    },
  });

  // Mutations
  const createTicketMutation = useCreateHelpCenterTicket();

  // Handlers
  const handleClose = () => {
    reset();
    close();
  };

  const handleFormSubmit = async (values: CreateHelpCenterFormValues) => {
    try {
      if (onSubmitTicket) {
        await onSubmitTicket(
          values.title.trim(),
          values.description.trim(),
          values.files,
          values.transactionId || undefined,
          values.orderNumber || undefined,
        );
      } else {
        await createTicketMutation.mutateAsync({
          title: values.title.trim(),
          description: values.description.trim(),
          transactionId: values.transactionId || undefined,
          orderNumber: values.orderNumber || undefined,
          files: values.files,
        });
      }
      handleClose();
    } catch {
      // Toast handled by mutation
    }
  };

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={handleClose}
      size={"md"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <Modal.Content>
        <Modal.Header>
          <Modal.Title w={"full"} fontWeight={"semibold"}>
            {"Buat Laporan Baru"}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Modal.Body>
            <VStack gap={4} align={"stretch"}>
              <Field
                label={"Judul Laporan"}
                required={true}
                invalid={Boolean(errors.title)}
                errorText={errors.title?.message}
              >
                <Input
                  placeholder={"Contoh: Payment gagal tapi saldo berkurang"}
                  {...register("title")}
                />
              </Field>

              <Field
                label={"Deskripsi Kendala"}
                required={true}
                invalid={Boolean(errors.description)}
                errorText={errors.description?.message}
              >
                <Textarea
                  placeholder={
                    "Jelaskan secara rinci kendala yang Anda alami..."
                  }
                  rows={4}
                  {...register("description")}
                />
              </Field>

              <Field
                label={"Transaksi Terkait"}
                invalid={Boolean(errors.transactionId)}
                errorText={errors.transactionId?.message}
              >
                <HelpCenterTransactionSelect
                  modalKey={`${modalKey}.selectTransaction`}
                  onValueChange={(val, option) => {
                    setValue("transactionId", val, { shouldValidate: true });
                    if (option?.label) {
                      const matchedOrderNo = option.label.split(" - ")[0];
                      setValue("orderNumber", matchedOrderNo);
                    } else {
                      setValue("orderNumber", "");
                    }
                  }}
                />
              </Field>

              <Field
                label={"Lampiran Dokumen/Foto (Opsional)"}
                invalid={Boolean(errors.files)}
                errorText={errors.files?.message}
              >
                <Controller
                  name={"files"}
                  control={control}
                  render={({ field }) => (
                    <FileInput
                      accept={[
                        ".jpg",
                        ".jpeg",
                        ".png",
                        ".pdf",
                        ".docx",
                        ".xlsx",
                        ".mp4",
                        ".mkv",
                        ".mov",
                        ".webm",
                        ".avi",
                      ]}
                      maxFiles={10}
                      maxFileSize={50 * 1024 * 1024}
                      value={field.value}
                      onFileAccept={(details) => field.onChange(details.files)}
                    />
                  )}
                />
              </Field>
            </VStack>
          </Modal.Body>

          <Modal.Footer>
            <Button flex={1} variant={"outline"} onClick={handleClose}>
              {"Batal"}
            </Button>

            <Button
              flex={1}
              type={"submit"}
              primary={true}
              loading={isSubmitting}
            >
              {"Kirim Laporan"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
};
