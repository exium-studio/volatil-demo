// src/features/mitra/help-center/components/help-center.modal.resolve-reject.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useReplyHelpCenterTicket } from "@/features/mitra/help-center/hooks/use-help-center.query";
import type { HelpCenterStatus } from "@/features/mitra/help-center/types/help-center.type";
import type React from "react";
import { useState } from "react";

export type HelpCenterModalResolveRejectTriggerProps = {
  ticketId: number | string;
  actionType: "resolve" | "reject";
  children: React.ReactNode;
};

export const HelpCenterModalResolveRejectTrigger = (
  props: HelpCenterModalResolveRejectTriggerProps,
) => {
  // Props
  const { ticketId, actionType, children } = props;

  // Stores
  const { theme } = useThemeStore();
  const isResolve = actionType === "resolve";
  const targetStatus: HelpCenterStatus = isResolve ? "resolved" : "rejected";
  const modalKey = `${actionType}HelpCenterModal-${ticketId}`;

  const { isOpen, open, close } = usePopModal({
    modalKey,
  });

  const replyMutation = useReplyHelpCenterTicket(ticketId);

  // States
  const [message, setMessage] = useState<string>("");

  // Handlers
  const handleClose = () => {
    setMessage("");
    close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await replyMutation.mutateAsync({
      message: message.trim(),
      status: targetStatus,
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
            {isResolve ? "Selesaikan Laporan" : "Tolak Laporan"}
          </Modal.Title>

          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body>
          <form id={`form-${modalKey}`} onSubmit={handleSubmit}>
            <VStack gap={SPACING.md} align={"stretch"}>
              <P fontSize={"sm"} color={"fg.muted"}>
                {isResolve
                  ? "Berikan catatan atau penjelasan mengenai penyelesaian kendala ini sebelum menandainya sebagai selesai."
                  : "Berikan alasan penolakan laporan kendala ini agar pelapor memahami keputusannya."}
              </P>

              <Field
                label={isResolve ? "Catatan Penyelesaian" : "Alasan Penolakan"}
                required={true}
              >
                <Textarea
                  placeholder={
                    isResolve
                      ? "Contoh: Kendala data telah berhasil diperbaiki dan diverifikasi..."
                      : "Contoh: Laporan tidak memenuhi kriteria / data tidak lengkap..."
                  }
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
            form={`form-${modalKey}`}
            colorPalette={isResolve ? `${theme.colorPalette}` : "red"}
            loading={replyMutation.isPending}
            disabled={!message.trim()}
            variant={isResolve ? "solid" : "outline"}
          >
            {isResolve ? "Selesaikan" : "Tolak Laporan"}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
