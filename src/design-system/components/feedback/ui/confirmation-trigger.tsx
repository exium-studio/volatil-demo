// src/design-system/components/feedback/ui/confirmation-trigger.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { ConfirmationTriggerProps } from "@/design-system/components/feedback/types/confirmation-trigger.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { t } from "@/shared/libs/i18n";
import type { MouseEvent, ReactElement } from "react";
import { cloneElement, isValidElement } from "react";

export const ConfirmationTrigger = (props: ConfirmationTriggerProps) => {
  // Props
  const {
    children,
    title,
    desc,
    confirmLabel,
    cancelLabel,
    confirmColorPalette = "red",
    modalKey = "confirmationModal",
    onConfirm,
    onCancel,
  } = props;

  // Hooks (Modal)
  const popModal = usePopModal({
    modalKey,
  });

  // Resolved Values
  const resolvedTitle = title ?? t["action.confirm"]();
  const resolvedDesc =
    desc ?? "Apakah Anda yakin ingin melanjutkan tindakan ini?";
  const resolvedConfirmLabel = confirmLabel ?? t["action.confirm"]();
  const resolvedCancelLabel = cancelLabel ?? t["action.cancel"]();

  // Handlers
  const handleCancel = () => {
    onCancel?.();
    popModal.close();
  };

  const handleConfirm = () => {
    onConfirm?.();
    popModal.close();
  };

  const handleOpen = () => {
    popModal.open();
  };

  // Render Trigger Element
  const renderTrigger = () => {
    if (!children) return null;

    if (isValidElement(children)) {
      const child = children as ReactElement<{
        onClick?: (e: MouseEvent) => void;
      }>;
      return cloneElement(child, {
        onClick: (e: MouseEvent) => {
          child.props.onClick?.(e);
          handleOpen();
        },
      });
    }

    return (
      <Box display={"inline-block"} onClick={handleOpen}>
        {children}
      </Box>
    );
  };

  return (
    <>
      {renderTrigger()}

      <Modal.Root
        modalKey={popModal.modalKey}
        opened={popModal.isOpen}
        open={popModal.open}
        close={popModal.close}
        size={"sm"}
      >
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>{resolvedTitle}</Modal.Title>

            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body>
            <P color={"fg.muted"} textAlign={"center"}>
              {resolvedDesc}
            </P>
          </Modal.Body>

          <Modal.Footer>
            <Button flex={1} variant={"outline"} onClick={handleCancel}>
              {resolvedCancelLabel}
            </Button>

            <Button
              flex={1}
              primary
              colorPalette={confirmColorPalette}
              onClick={handleConfirm}
            >
              {resolvedConfirmLabel}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
