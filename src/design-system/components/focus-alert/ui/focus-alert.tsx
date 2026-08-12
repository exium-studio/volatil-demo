// src/design-system/components/focus-alert/ui/focus-alert.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { useFocusAlerterStore } from "@/design-system/components/focus-alert/stores/focus-alert.store";
import type {
  FocusAlertItemProps,
  FocusAlertTriggerProps,
  FocusAlertContentProps,
} from "@/design-system/components/focus-alert/types/focus-alert.type";
import { useFocusAlertContext } from "@/design-system/components/focus-alert/ui/focus-alert-key-context";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Circle } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { IconQuestionMark } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

// Animation constants
const CIRCLE_P = [32, 42, 48];
const TRANSITION_DELAY_STEP_MS = 80;
const OVERSHOOT_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const EXIT_DURATION_MS = 250 + TRANSITION_DELAY_STEP_MS * 2;

// Hooks
const useAlertAnimation = (isOpen: boolean) => {
  const [transition, setTransition] = useState(false);

  useFirstMountEffect(
    {
      onUpdate: () => {
        if (isOpen) setTransition(false);
      },
    },
    [isOpen],
  );

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setTransition(true), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  return transition;
};

export const FocusAlertItem = (props: FocusAlertItemProps) => {
  // Props
  const {
    modalKey: modalKeyProp,
    colorPalette = "neutral",
    icon = IconQuestionMark,
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
    <Modal.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <FocusAlertContent
        colorPalette={colorPalette}
        icon={icon}
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
    colorPalette = "neutral",
    icon = IconQuestionMark,
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
    <Modal.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <Modal.Trigger>{children}</Modal.Trigger>

      <FocusAlertContent
        colorPalette={colorPalette}
        icon={icon}
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
  const { colorPalette, icon, title, description, transition, close, onDone } =
    props;

  return (
    <Modal.Content>
      <Modal.Body>
        <VStack
          colorPalette={colorPalette}
          align={"center"}
          justify={"center"}
          gap={SPACING.xl}
          py={PADDING.md}
        >
          <Circle pos={"relative"} my={SPACING.lg}>
            {/* Circle 3 */}
            <Circle
              pos={"absolute"}
              p={transition ? `${CIRCLE_P[2]}px` : 0}
              bg={"colorPalette.solid/25"}
              transition={`padding 250ms ${OVERSHOOT_EASE}`}
              transitionDelay={`${TRANSITION_DELAY_STEP_MS * 2}ms`}
            />

            {/* Circle 2 */}
            <Circle
              pos={"absolute"}
              p={transition ? `${CIRCLE_P[1]}px` : 0}
              bg={"colorPalette.solid/50"}
              transition={`padding 250ms ${OVERSHOOT_EASE}`}
              transitionDelay={`${TRANSITION_DELAY_STEP_MS * 1}ms`}
            />

            {/* Circle 1 */}
            <Circle
              pos={"absolute"}
              p={transition ? `${CIRCLE_P[0]}px` : 0}
              bg={"colorPalette.solid"}
              transition={`padding 250ms ${OVERSHOOT_EASE}`}
            />

            <AppIcon
              icon={icon}
              size={"3xl"}
              color={"colorPalette.contrast"}
              zIndex={2}
            />
          </Circle>

          <VStack gap={SPACING.md} zIndex={2}>
            <P
              fontSize={"lg"}
              fontWeight={"semibold"}
              textAlign={"center"}
              color={"colorPalette.fg"}
            >
              {title}
            </P>

            <P fontSize={"sm"} textAlign={"center"} color={"fg.subtle"}>
              {description}
            </P>
          </VStack>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <Button flex={1} variant={"ghost"} onClick={onDone ?? close}>
          Selesai
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
