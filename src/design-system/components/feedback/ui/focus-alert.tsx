import { Button } from "@/design-system/components/button/ui/button";
import type { FocusAlertTriggerProps } from "@/design-system/components/feedback/types/focus-alert.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Circle } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { IconQuestionMark } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const CIRCLE_P = [32, 42, 48];
const TRANSITION_DELAY_STEP_MS = 80;
const OVERSHOOT_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

export const FocusAlert = (props: FocusAlertTriggerProps) => {
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

  // States
  const [transition, setTransition] = useState<boolean>(false);

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
      setTimeout(() => {
        setTransition(true);
      }, 200);
    }
  }, [isOpen]);

  return (
    <Modal.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <Modal.Trigger>{children}</Modal.Trigger>

      <Modal.Content>
        <Modal.Body>
          <VStack
            colorPalette={colorPalette}
            align={"center"}
            justify={"center"}
            gap={SPACING.xl}
            py={PADDING.md}
          >
            {icon && (
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
            )}

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
          <Button flex={1} variant={"ghost"}>
            Selesai
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
