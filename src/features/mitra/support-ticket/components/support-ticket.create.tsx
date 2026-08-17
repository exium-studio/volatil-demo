// src/features/mitra/support-ticket/components/support-ticket.create.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Input } from "@/design-system/components/input/ui/input";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { toast } from "@/design-system/components/toast";
import {
  createSupportTicketSchema,
  type CreateSupportTicketFormValues,
  zodResolver,
} from "@/features/mitra/support-ticket/schemas/support-ticket.schema";
import type { CreateSupportTicketTriggerProps } from "@/features/mitra/support-ticket/types/support-ticket.type";
import { Controller, useForm } from "react-hook-form";

export const CreateSupportTicketTrigger = (
  props: CreateSupportTicketTriggerProps,
) => {
  // Props
  const { children, modalKey: customModalKey, onSubmitTicket } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey ?? "createSupportTicketModal",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSupportTicketFormValues>({
    resolver: zodResolver(createSupportTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      files: [],
    },
  });

  // Handlers
  const handleClose = () => {
    reset();
    close();
  };

  const handleFormSubmit = (values: CreateSupportTicketFormValues) => {
    onSubmitTicket?.(values.title.trim(), values.description.trim(), values.files);
    handleClose();
    toast.success("Laporan berhasil dibuat!");
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
                  placeholder={"Contoh: Kendala Sinyal di Titik Pos A"}
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
                label={"Lampiran Dokumen/Foto (Opsional)"}
                invalid={Boolean(errors.files)}
                errorText={errors.files?.message}
              >
                <Controller
                  name={"files"}
                  control={control}
                  render={({ field }) => (
                    <FileInput
                      accept={[".jpg", ".jpeg", ".png", ".pdf", ".docx", ".xlsx"]}
                      maxFiles={10}
                      maxFileSize={15 * 1024 * 1024}
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

export const CreateTicketModal = CreateSupportTicketTrigger;
