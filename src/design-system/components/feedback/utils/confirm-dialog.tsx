import { Button } from "@/design-system/components/button/ui/button";
import type { ConfirmDialogOptions } from "@/design-system/components/feedback/types/confirm-dialog.type";
import { focusAlert } from "@/design-system/components/focus-alert/utils/focus-alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Circle } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { t } from "@/shared/libs/i18n";
import { AlertTriangleIcon } from "lucide-react";
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
    icon,
    confirmButtonProps,
    onConfirm,
    onCancel,
  } = options;

  // Hooks
  const { isOpen, close } = usePopModal({ modalKey });

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
    <Modal.Root modalKey={modalKey} opened={isOpen} close={handleCancel}>
      <Modal.Content>
        <Modal.Header>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body pt={0} pb={"lg"}>
          <VStack align={"center"} gap={"md"} textAlign={"center"}>
            <Circle
              size={"48px"}
              bg={`${colorPalette}.subtle`}
              color={`${colorPalette}.fg`}
              mb={1}
            >
              {icon ? (
                typeof icon === "function" ? (
                  <AppIcon
                    icon={icon as typeof AlertTriangleIcon}
                    size={"md"}
                  />
                ) : (
                  icon
                )
              ) : (
                <AppIcon icon={AlertTriangleIcon} size={"md"} />
              )}
            </Circle>

            <Heading size={"md"} fontWeight={"semibold"}>
              {resolvedTitle}
            </Heading>

            <P fontSize={"sm"} color={"fg.muted"} maxW={"320px"}>
              {resolvedDesc}
            </P>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <VStack gap={"xs"} w={"full"}>
            <Button
              primary
              variant={"solid"}
              colorPalette={colorPalette}
              onClick={handleConfirm}
              loading={isSubmitting}
              {...confirmButtonProps}
            >
              {resolvedConfirmLabel}
            </Button>

            <Button onClick={handleCancel} disabled={isSubmitting}>
              {resolvedCancelLabel}
            </Button>
          </VStack>
        </Modal.Footer>
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
