// src/design-system/components/feedback/ui/confirmation-trigger.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { ConfirmationTriggerProps } from "@/design-system/components/feedback/types/confirmation-trigger.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Circle } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
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
    colorPalette,
    icon,
    modalKey,
    confirmButtonProps,
    onConfirm,
    onCancel,
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks (Modal)
  const popModal = usePopModal({
    modalKey,
  });

  // Resolved Values
  const resolvedColorPalette = colorPalette ?? theme.colorPalette;
  const resolvedTitle = title ?? t["action.confirm"]();
  const resolvedDesc =
    description ?? desc ?? "Tindakan ini akan diproses pada sistem.";
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
      >
        <Modal.Trigger>{children}</Modal.Trigger>

        <Modal.Content>
          <Modal.Header>
            <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body pt={0} pb={"lg"}>
            <VStack align={"center"} gap={"md"}>
              {/* Inner Icon / Emoji Circle */}
              <Circle
                size={"76px"}
                pos={"relative"}
                bg={`${resolvedColorPalette}.muted`}
                color={`${resolvedColorPalette}.fg`}
                border={"12px solid"}
                borderColor={`${resolvedColorPalette}.subtle`}
                mb={"md"}
              >
                {icon ? (
                  isValidElement(icon) ? (
                    icon
                  ) : (
                    <AppIcon icon={icon as ComponentType} size={"lg"} />
                  )
                ) : (
                  <AppIcon icon={AlertTriangleIcon} size={"lg"} />
                )}
              </Circle>

              <Heading size={"md"} fontWeight={"semibold"} textAlign={"center"}>
                {resolvedTitle}
              </Heading>

              <P
                fontSize={"sm"}
                color={"fg.muted"}
                textAlign={"center"}
                maxW={"260px"}
              >
                {resolvedDesc}
              </P>
            </VStack>
          </Modal.Body>

          <Modal.Footer>
            <VStack gap={"xs"} w={"full"}>
              <Button
                primary
                variant={"solid"}
                colorPalette={resolvedColorPalette}
                onClick={handleConfirm}
                {...confirmButtonProps}
              >
                {resolvedConfirmLabel}
              </Button>

              <Button onClick={handleCancel}>{resolvedCancelLabel}</Button>
            </VStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
