// src/design-system/components/feedback/ui/confirmation-trigger.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { ConfirmationTriggerProps } from "@/design-system/components/feedback/types/confirmation-trigger.type";
import { FaceEmoji } from "@/design-system/components/feedback/ui/face-emoji";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { useAlertAnimation } from "@/design-system/hooks/use-alert-animation";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { t } from "@/shared/libs/i18n";

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
  const transition = useAlertAnimation(popModal.isOpen);

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
        size={"xs"}
      >
        <Modal.Trigger>{children}</Modal.Trigger>

        <Modal.Content bg={"transparent"} shadow={"none"}>
          <Modal.Body p={0}>
            <VStack align={"center"} gap={"40px"}>
              <FaceEmoji
                variant={"confused"}
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
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
