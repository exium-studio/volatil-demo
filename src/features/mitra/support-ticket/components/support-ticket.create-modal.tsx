// src/features/mitra/support-ticket/components/support-ticket.create-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { toast } from "@/design-system/components/toast";
import type { TicketItem } from "@/features/mitra/support-ticket/types/support-ticket.type";
import { useState } from "react";

export type CreateTicketModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitTicket: (
    newTicket: Omit<TicketItem, "id" | "createdAt" | "status" | "upvotesCount">,
  ) => void;
};

export const CreateTicketModal = (props: CreateTicketModalProps) => {
  // Props
  const { open: openProp, onOpenChange, onSubmitTicket } = props;

  // Stores & Hooks
  const { modalKey, open: openModal, close } = usePopModal({
    modalKey: "createSupportTicketModal",
  });

  // States
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Handlers
  const handleClose = () => {
    onOpenChange(false);
    close();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Judul dan deskripsi laporan wajib diisi");
      return;
    }

    onSubmitTicket({
      authorName: "Pemerintah Semarang",
      isCurrentUser: true,
      title: title.trim(),
      description: description.trim(),
      attachments: [],
    });

    setTitle("");
    setDescription("");
    handleClose();
    toast.success("Laporan berhasil dibuat!");
  };

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={openProp}
      open={openModal}
      close={handleClose}
    >
      <Modal.Content>
        <Modal.Header>
          <Modal.Title w={"full"} fontWeight={"semibold"}>
            {"Buat Laporan Baru"}
          </Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <VStack gap={4} align={"stretch"}>
              <Field label={"Judul Laporan"} required>
                <Input
                  placeholder={"Contoh: Pembayaran Gagal, Saldo Terpotong!"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>

              <Field label={"Deskripsi Kendala"} required>
                <Input
                  placeholder={"Jelaskan secara rinci kendala yang Anda alami..."}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
            </VStack>
          </Modal.Body>

          <Modal.Footer>
            <Button variant={"outline"} onClick={handleClose}>
              {"Batal"}
            </Button>
            <Button type={"submit"} colorPalette={"blue"}>
              {"Kirim Laporan"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
};
