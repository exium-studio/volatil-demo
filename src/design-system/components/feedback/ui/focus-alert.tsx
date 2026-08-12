import { Button } from "@/design-system/components/button/ui/button";
import type { FocusAlertTriggerProps } from "@/design-system/components/feedback/types/focus-alert.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Circle } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { IconQuestionMark } from "@tabler/icons-react";

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

  // Derived Values
  const baseColor = `${colorPalette}.solid`;

  return (
    <Modal.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <Modal.Trigger>{children}</Modal.Trigger>

      <Modal.Content>
        <Modal.Body>
          <VStack
            colorPalette={colorPalette}
            align={"center"}
            justify={"center"}
            gap={SPACING.lg}
            minH={"200px"}
            py={PADDING.md}
          >
            {icon && (
              <Circle bg={`${baseColor}/25`} p={5}>
                <Circle bg={`${baseColor}`} p={5} transition={"200ms"}>
                  <Circle bg={"bg.body"} p={5} transition={"200ms"}>
                    <AppIcon
                      icon={icon}
                      size={"3xl"}
                      color={`colorPalette.solid`}
                    />
                  </Circle>
                </Circle>
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
