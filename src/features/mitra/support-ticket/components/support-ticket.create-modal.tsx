// src/features/mitra/support-ticket/components/support-ticket.create-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Input } from "@/design-system/components/input/ui/input";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { toast } from "@/design-system/components/toast";
import type { CreateSupportTicketModalProps } from "@/features/mitra/support-ticket/types/support-ticket.type";
import { useState } from "react";

export const CreateSupportTicketModal = (
  props: CreateSupportTicketModalProps,
) => {
  // Props
  const { children, modalKey: customModalKey, onSubmitTicket } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey ?? "createSupportTicketModal",
  });

  // States
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  // Handlers
  const handleClose = () => {
    setTitle("");
    setDescription("");
    setFiles([]);
    close();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Judul dan deskripsi laporan wajib diisi");
      return;
    }

    onSubmitTicket?.(title.trim(), description.trim(), files);

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

        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <VStack gap={4} align={"stretch"}>
              <Field label={"Judul Laporan"} required={true}>
                <Input
                  placeholder={"Contoh: Kendala Sinyal di Titik Pos A"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>

              <Field label={"Deskripsi Kendala"} required={true}>
                <Textarea
                  placeholder={
                    "Jelaskan secara rinci kendala yang Anda alami..."
                  }
                  value={description}
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              <Field label={"Lampiran Dokumen/Foto (Opsional)"}>
                <FileInput
                  accept={[".jpg", ".jpeg", ".png", ".pdf", ".docx", ".xlsx"]}
                  maxFiles={10}
                  maxFileSize={15 * 1024 * 1024}
                  value={files}
                  onFileAccept={(details) => setFiles(details.files)}
                />
              </Field>
            </VStack>
          </Modal.Body>

          <Modal.Footer>
            <Button flex={1} variant={"outline"} onClick={handleClose}>
              {"Batal"}
            </Button>

            <Button flex={1} type={"submit"} primary={true}>
              {"Kirim Laporan"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
};

export const CreateTicketModal = CreateSupportTicketModal;
