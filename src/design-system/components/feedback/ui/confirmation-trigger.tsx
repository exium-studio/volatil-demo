import { Button } from "@/design-system/components/button/ui/button";
import type { ConfirmationTriggerProps } from "@/design-system/components/feedback/types/confirmation-trigger.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Circle } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { t } from "@/shared/libs/i18n";
import { AlertTriangleIcon } from "lucide-react";
import { isValidElement, type ComponentType } from "react";

export const ConfirmationTrigger = (props: ConfirmationTriggerProps) => {
  // Props
  const {
    children,
    title,
    desc,
    description,
    confirmLabel,
    cancelLabel,
    colorPalette = "red",
    icon,
    modalKey,
    confirmButtonProps,
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
    description ?? desc ?? "Apakah Anda yakin ingin melanjutkan tindakan ini?";
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

  return (
    <>
      <Modal.Root
        modalKey={popModal.modalKey}
        opened={popModal.isOpen}
        open={popModal.open}
        close={popModal.close}
        size={"sm"}
      >
        <Modal.Trigger>{children}</Modal.Trigger>

        <Modal.Content>
          <Modal.Header>
            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body pt={0} pb={SPACING.lg}>
            <VStack align={"center"} gap={SPACING.md} textAlign={"center"}>
              <Circle
                size={"48px"}
                bg={`${colorPalette}.subtle`}
                color={`${colorPalette}.fg`}
                mb={1}
              >
                {icon ? (
                  isValidElement(icon) ? (
                    icon
                  ) : (
                    <AppIcon
                      icon={icon as ComponentType}
                      size={"md"}
                    />
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
            <HStack gap={SPACING.sm} w={"full"}>
              <Button flex={1} variant={"outline"} onClick={handleCancel}>
                {resolvedCancelLabel}
              </Button>

              <Button
                flex={1}
                primary
                variant={"solid"}
                colorPalette={colorPalette}
                onClick={handleConfirm}
                {...confirmButtonProps}
              >
                {resolvedConfirmLabel}
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
