// src/design-system/components/feedback/utils/confirm-dialog.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { ConfirmDialogOptions } from "@/design-system/components/feedback/types/confirm-dialog.type";
import { FaceEmoji } from "@/design-system/components/feedback/ui/face-emoji";
import { focusAlert } from "@/design-system/components/focus-alert/utils/focus-alert";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { useAlertAnimation } from "@/design-system/hooks/use-alert-animation";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { t } from "@/shared/libs/i18n";
import { useState } from "react";

export const ConfirmDialogModal = (props: {
  modalKey: string;
  options: ConfirmDialogOptions;
}) => {
  // Props
  const { modalKey, options } = props;
  const {
    title,
    desc,
    description,
    confirmLabel,
    cancelLabel,
    colorPalette = "red",
    variant = "confused",
    confirmButtonProps,
    onConfirm,
    onCancel,
  } = options;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const { isOpen, close } = usePopModal({ modalKey });
  const transition = useAlertAnimation(isOpen);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resolved Values
  const resolvedTitle = title ?? t["action.confirm"]();
  const resolvedDesc =
    description ?? desc ?? "Apakah Anda yakin ingin melanjutkan tindakan ini?";
  const resolvedConfirmLabel = confirmLabel ?? t["action.confirm"]();
  const resolvedCancelLabel = cancelLabel ?? t["action.cancel"]();

  // Handlers
  const handleCancel = async () => {
    try {
      await onCancel?.();
    } finally {
      close();
    }
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm?.();
    } finally {
      setIsSubmitting(false);
      close();
    }
  };

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      close={handleCancel}
      size={"xs"}
    >
      <Modal.Backdrop />
      <Modal.Content bg={"transparent"} shadow={"none"}>
        <Modal.Body p={0}>
          <VStack align={"center"} gap={"40px"}>
            <FaceEmoji
              variant={variant}
              transition={transition}
              size={"lg"}
              mb={"-42px"}
            />

            <VStack
              gap={SPACING.md}
              pos={"relative"}
              w={"full"}
              p={SPACING.xl}
              bg={"bg.body"}
              roundedTop={theme.radii.container}
            >
              <Modal.CloseButton />

              <P fontSize={"lg"} textAlign={"center"}>
                {resolvedTitle}
              </P>

              <P
                maxW={"240px"}
                mx={"auto"}
                color={"fg.subtle"}
                textAlign={"center"}
              >
                {resolvedDesc}
              </P>
            </VStack>
          </VStack>

          <HStack
            gap={SPACING.sm}
            p={SPACING.md}
            bg={"bg.body"}
            borderTop={"1px solid"}
            borderColor={"border.subtle"}
          >
            <Button
              flex={1}
              variant={"outline"}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {resolvedCancelLabel}
            </Button>

            <Button
              flex={1}
              primary
              variant={"solid"}
              colorPalette={colorPalette}
              onClick={handleConfirm}
              loading={isSubmitting}
              {...confirmButtonProps}
            >
              {resolvedConfirmLabel}
            </Button>
          </HStack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export function confirmDialog(options: ConfirmDialogOptions) {
  const modalKey = `confirm-dialog-${Date.now()}`;
  focusAlert(modalKey, () => (
    <ConfirmDialogModal modalKey={modalKey} options={options} />
  ));
}
