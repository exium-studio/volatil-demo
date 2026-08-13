// src/design-system/components/focus-alert/ui/focus-alert.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { FaceEmoji } from "@/design-system/components/feedback/ui/face-emoji";
import { useFocusAlerterStore } from "@/design-system/components/focus-alert/stores/focus-alert.store";
import type {
  FocusAlertContentProps,
  FocusAlertItemProps,
  FocusAlertTriggerProps,
  FocusAlertVariant,
} from "@/design-system/components/focus-alert/types/focus-alert.type";
import { useFocusAlertContext } from "@/design-system/components/focus-alert/ui/focus-alert-key-context";
import { useAlertAnimation } from "@/design-system/components/feedback/hooks/use-alert-animation";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { useEffect, useRef } from "react";

// Animation constants
const TRANSITION_DELAY_STEP_MS = 80;
const EXIT_DURATION_MS = 250 + TRANSITION_DELAY_STEP_MS * 2;

export const FocusAlertItem = (props: FocusAlertItemProps) => {
  // Props
  const {
    modalKey: modalKeyProp,
    variant = "info",
    title,
    description,
    onDone,
  } = props;

  // Context
  const ctx = useFocusAlertContext();
  const modalKey = modalKeyProp ?? ctx?.modalKey ?? "";

  // Stores — stable reference, aman dipakai di effect deps
  const removeAlert = useFocusAlerterStore((s) => s.close);

  // Hooks
  const { isOpen, open, close } = usePopModal({ modalKey });

  // Refs
  const prevIsOpen = useRef(isOpen);

  // Derived Values
  const transition = useAlertAnimation(isOpen);

  useFirstMountEffect(
    {
      onFirstMount: () => {
        if (!isOpen) open();
      },
    },
    [],
  );

  // Remove dari store setelah exit animation selesai
  useEffect(() => {
    if (prevIsOpen.current && !isOpen) {
      const t = setTimeout(() => removeAlert(modalKey), EXIT_DURATION_MS);
      prevIsOpen.current = isOpen;
      return () => clearTimeout(t);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, modalKey, removeAlert]);

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      closeOnInteractOutside={false}
    >
      <FocusAlertContent
        variant={variant}
        title={title}
        description={description}
        transition={transition}
        close={close}
        onDone={onDone}
      />
    </Modal.Root>
  );
};

export const FocusAlertTrigger = (props: FocusAlertTriggerProps) => {
  // Props
  const {
    children,
    modalKey: modalKeyProp,
    variant = "info",
    title,
    description,
  } = props;

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: modalKeyProp,
  });

  // Derived Values
  const transition = useAlertAnimation(isOpen);

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      closeOnInteractOutside={false}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <FocusAlertContent
        variant={variant}
        title={title}
        description={description}
        transition={transition}
        close={close}
      />
    </Modal.Root>
  );
};

const FocusAlertContent = (props: FocusAlertContentProps) => {
  // Props
  const { variant, title, description, transition, close, onDone } = props;

  // Constants
  const VARIANTS_MAP = {
    info: { colorPalette: "neutral" },
    success: { colorPalette: "green" },
    error: { colorPalette: "red" },
    warning: { colorPalette: "orange" },
    question: { colorPalette: "blue" },
  } as Record<FocusAlertVariant, { colorPalette: string }>;

  // Resolved Values
  const resolvedVariant = VARIANTS_MAP[variant ?? "info"];

  return (
    <Modal.Content>
      <Modal.Body>
        <VStack align={"center"} justify={"center"} gap={SPACING.xl}>
          <VStack gap={"40px"} align={"center"} w={"full"}>
            <FaceEmoji variant={variant} transition={transition} />

            <VStack gap={SPACING.md} zIndex={2}>
              <P
                fontSize={"lg"}
                fontWeight={"bold"}
                textAlign={"center"}
                color={`${resolvedVariant.colorPalette}.solid`}
              >
                {title}
              </P>

              <P
                fontSize={"sm"}
                textAlign={"center"}
                color={"fg.subtle"}
                maxW={"240px"}
                mx={"auto"}
                mb={6}
              >
                {description}
              </P>
            </VStack>
          </VStack>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <Button flex={1} onClick={onDone ?? close}>
          Selesai
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
