// src/design-system/components/focus-alert/ui/focus-alert.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FocusAlertContentProps,
  FocusAlertItemProps,
  FocusAlertSemanticVariant,
  FocusAlertTriggerProps,
  FocusAlertVariant,
} from "@/design-system/components/focus-alert/types/focus-alert.type";
import { useFocusAlertContext } from "@/design-system/components/focus-alert/ui/focus-alert-key-context";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box, Circle } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { IconInfoCircle } from "@tabler/icons-react";
import type { ComponentType } from "react";
import {
  CheckIcon,
  HeartIcon,
  SparklesIcon,
  TriangleAlertIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";

export const FocusAlertItem = (props: FocusAlertItemProps) => {
  // Props
  const {
    modalKey: modalKeyProp,
    variant = "neutral",
    title,
    description,
    onDone,
  } = props;

  // Context
  const ctx = useFocusAlertContext();
  const modalKey = modalKeyProp ?? ctx?.modalKey ?? "";

  // Hooks
  const { isOpen, open, close } = usePopModal({ modalKey });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      closeOnInteractOutside={false}
      size={"xs"}
    >
      <FocusAlertContent
        variant={variant}
        title={title}
        description={description}
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
    variant = "neutral",
    title,
    description,
  } = props;

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: modalKeyProp,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      closeOnInteractOutside={false}
      size={"xs"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <FocusAlertContent
        variant={variant}
        title={title}
        description={description}
        close={close}
      />
    </Modal.Root>
  );
};

const FocusAlertContent = (props: FocusAlertContentProps) => {
  // Props
  const { variant, title, description, close, onDone } = props;

  // Constants
  const VARIANTS_MAP: Partial<
    Record<FocusAlertVariant, { colorPalette: string; icon: ComponentType }>
  > &
    Record<
      FocusAlertSemanticVariant,
      { colorPalette: string; icon: ComponentType }
    > = {
    // Semantic aliases
    success: {
      colorPalette: "green",
      icon: CheckIcon,
      // emote: "happy",
    },
    error: {
      colorPalette: "red",
      icon: XIcon,
      // emote: "sad",
    },
    danger: {
      colorPalette: "red",
      icon: XIcon,
      // emote: "sad",
    },
    warning: {
      colorPalette: "orange",
      icon: TriangleAlertIcon,
      // emote: "worried",
    },
    info: {
      colorPalette: "neutral",
      icon: IconInfoCircle,
      // emote: "neutral",
    },
    help: {
      colorPalette: "neutral",
      icon: TriangleAlertIcon,
      // emote: "confused",
    },
    neutral: {
      colorPalette: "neutral",
      icon: SparklesIcon,
    },
    celebrate: {
      colorPalette: "green",
      icon: SparklesIcon,
    },

    // Emote variants (EmojiKey)
    poker: {
      colorPalette: "neutral",
      icon: SparklesIcon,
    },
    happy: {
      colorPalette: "green",
      icon: CheckIcon,
    },
    angry: {
      colorPalette: "red",
      icon: XIcon,
    },
    cry: {
      colorPalette: "blue",
      icon: XIcon,
    },
    embarassed: {
      colorPalette: "teal",
      icon: TriangleAlertIcon,
    },
    funny: {
      colorPalette: "orange",
      icon: SparklesIcon,
    },
    cool: {
      colorPalette: "blue",
      icon: SparklesIcon,
    },
    laugh: {
      colorPalette: "orange",
      icon: SparklesIcon,
    },
    love: {
      colorPalette: "pink",
      icon: HeartIcon,
    },
    rollingEyes: {
      colorPalette: "orange",
      icon: IconInfoCircle,
    },
    sad: {
      colorPalette: "red",
      icon: XIcon,
    },
    scream: {
      colorPalette: "blue",
      icon: ZapIcon,
    },
    shout: {
      colorPalette: "purple",
      icon: ZapIcon,
    },
    speechless: {
      colorPalette: "teal",
      icon: IconInfoCircle,
    },
    sulk: {
      colorPalette: "red",
      icon: XIcon,
    },
    surprised: {
      colorPalette: "orange",
      icon: ZapIcon,
    },
    thinking: {
      colorPalette: "yellow",
      icon: IconInfoCircle,
    },
    thumbUp: {
      colorPalette: "pink",
      icon: SparklesIcon,
    },
    wicked: {
      colorPalette: "purple",
      icon: ZapIcon,
    },
  };

  // Resolved Values
  const fallback = VARIANTS_MAP.neutral ?? {
    colorPalette: "neutral",
    icon: SparklesIcon,
  };
  const resolved = (variant ? VARIANTS_MAP[variant] : undefined) ?? fallback;

  return (
    <Modal.Content>
      <Modal.Body pt={"lg"} pb={"md"}>
        <VStack align={"center"} gap={"md"} textAlign={"center"} my={"sm"}>
          <Box
            pos={"relative"}
            display={"inline-flex"}
            alignItems={"center"}
            justifyContent={"center"}
            mb={"md"}
          >
            {/* Outer expanding elegant pulse ripple */}
            <Circle
              pos={"absolute"}
              inset={0}
              size={"48px"}
              bg={`${resolved.colorPalette}.emphasized`}
              opacity={0.35}
              pointerEvents={"none"}
              animation={"ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite"}
            />

            {/* Inner Icon Circle */}
            <Circle
              size={"48px"}
              pos={"relative"}
              bg={`${resolved.colorPalette}.subtle`}
              color={`${resolved.colorPalette}.fg`}
            >
              <AppIcon icon={resolved.icon} size={"lg"} />
            </Circle>
          </Box>

          <Heading size={"md"} fontWeight={"semibold"}>
            {title}
          </Heading>

          {description && (
            <P fontSize={"sm"} color={"fg.muted"} maxW={"260px"}>
              {description}
            </P>
          )}
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <Button flex={1} onClick={onDone ?? close}>
          {"Selesai"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
