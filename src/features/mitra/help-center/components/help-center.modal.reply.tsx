// src/features/mitra/help-center/components/help-center.modal.reply.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useReplyHelpCenterTicket } from "@/features/mitra/help-center/hooks/use-help-center.query";
import type { HelpCenterStatus } from "@/features/mitra/help-center/types/help-center.type";
import { useState } from "react";

export type HelpCenterModalReplyProps = {
  ticketId: number | string;
  trigger: React.ReactNode;
  allowStatusChange?: boolean;
  currentStatus?: HelpCenterStatus;
};

export const HelpCenterModalReply = (props: HelpCenterModalReplyProps) => {
  // Props
  const { ticketId, trigger } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: `replyHelpCenterModal-${ticketId}`,
  });

  const replyMutation = useReplyHelpCenterTicket(ticketId);

  // States
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  // Handlers
  const handleClose = () => {
    setMessage("");
    setFiles([]);
    close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await replyMutation.mutateAsync({
      message: message.trim(),
      files: files.length > 0 ? files : undefined,
    });

    handleClose();
  };

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={handleClose}
      size={"md"}
    >
      <Modal.Trigger>{trigger}</Modal.Trigger>

      <Modal.Content>
        <Modal.Header>
          <Modal.Title w={"full"} fontWeight={"semibold"}>
            {"Kirim Balasan"}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <VStack gap={4}>
              <Field label={"Pesan Balasan"} required={true}>
                <Textarea
                  placeholder={"Tuliskan pesan balasan atau tanggapan Anda..."}
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Field>

              <Field label={"Lampiran Dokumen/Foto (Opsional)"}>
                <FileInput
                  accept={[".jpg", ".jpeg", ".png", ".pdf", ".docx", ".xlsx"]}
                  maxFiles={5}
                  maxFileSize={10 * 1024 * 1024}
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

            <Button
              flex={1}
              type={"submit"}
              primary={true}
              loading={replyMutation.isPending}
              disabled={!message.trim()}
            >
              {"Kirim Balasan"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
};
