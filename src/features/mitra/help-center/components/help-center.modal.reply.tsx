// src/features/mitra/help-center/components/help-center.modal.reply.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useReplyHelpCenterTicket } from "@/features/mitra/help-center/hooks/use-help-center.query";
import type React from "react";
import { useState } from "react";

export type HelpCenterModalReplyTriggerProps = {
  ticketId: number | string;
  children: React.ReactNode;
};

export const HelpCenterModalReplyTrigger = (
  props: HelpCenterModalReplyTriggerProps,
) => {
  // Props
  const { ticketId, children } = props;

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
      <Modal.Trigger>{children}</Modal.Trigger>

      <Modal.Content>
        <Modal.Header>
          <Modal.Title w={"full"} fontWeight={"semibold"}>
            {"Kirim Balasan"}
          </Modal.Title>

          <Modal.FullscreenButton />
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body>
          <form id={"reply-form"} onSubmit={handleSubmit}>
            <VStack gap={4}>
              <Field label={"Pesan Balasan"}>
                <Textarea
                  placeholder={"Tuliskan pesan balasan atau tanggapan Anda..."}
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Field>

              <Field label={"Lampiran Dokumen/Foto/Video"} optional>
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
                  maxFiles={5}
                  maxFileSize={50 * 1024 * 1024}
                  value={files}
                  onFileAccept={(details) => setFiles(details.files)}
                />
              </Field>
            </VStack>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button flex={1} variant={"outline"} onClick={handleClose}>
            {"Batal"}
          </Button>

          <Button
            flex={1}
            type={"submit"}
            form={"reply-form"}
            primary={true}
            loading={replyMutation.isPending}
            disabled={!message.trim()}
          >
            {"Kirim Balasan"}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
