// src/design-system/components/focus-alert/ui/focus-alert.tsx

// src\design-system\components\focus-alert\ui\focus-alert.tsx

// src\design-system\components\focus-alert\ui\focus-alert.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Emoji } from "@/design-system/components/emoji/ui/emoji";
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
import { t } from "@/shared/libs/i18n";
import { IconInfoCircle } from "@tabler/icons-react";
import { isValidElement, type ComponentType } from "react";
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
    colorPalette,
    icon,
    emoji,
    title,
    description,
    doneLabel,
    cancelLabel,
    doneButtonProps,
    cancelButtonProps,
    onDone,
    onCancel,
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
      dialogClickOriginAnimation={false}
      size={"xs"}
    >
      <FocusAlertContent
        variant={variant}
        colorPalette={colorPalette}
        icon={icon}
        emoji={emoji}
        title={title}
        description={description}
        doneLabel={doneLabel}
        cancelLabel={cancelLabel}
        doneButtonProps={doneButtonProps}
        cancelButtonProps={cancelButtonProps}
        close={close}
        onDone={onDone}
        onCancel={onCancel}
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
    colorPalette,
    icon,
    emoji,
    title,
    description,
    doneLabel,
    cancelLabel,
    doneButtonProps,
    cancelButtonProps,
    onDone,
    onCancel,
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
      dialogClickOriginAnimation={false}
      size={"xs"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <FocusAlertContent
        variant={variant}
        colorPalette={colorPalette}
        icon={icon}
        emoji={emoji}
        title={title}
        description={description}
        doneLabel={doneLabel}
        cancelLabel={cancelLabel}
        doneButtonProps={doneButtonProps}
        cancelButtonProps={cancelButtonProps}
        close={close}
        onDone={onDone}
        onCancel={onCancel}
      />
    </Modal.Root>
  );
};

const FocusAlertContent = (props: FocusAlertContentProps) => {
  // Props
  const {
    variant,
    colorPalette,
    icon,
    emoji,
    title,
    description,
    doneLabel,
    cancelLabel,
    doneButtonProps,
    cancelButtonProps,
    close,
    onDone,
    onCancel,
  } = props;

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

  // Handlers
  const handleDone = () => {
    onDone?.();
    close();
  };

  const handleCancel = () => {
    onCancel?.();
    close();
  };

  // Resolved Values
  const fallback = VARIANTS_MAP.neutral ?? {
    colorPalette: "neutral",
    icon: SparklesIcon,
  };
  const resolved = (variant ? VARIANTS_MAP[variant] : undefined) ?? fallback;
  const resolvedColorPalette = colorPalette ?? resolved.colorPalette;
  const resolvedDoneLabel = doneLabel ?? t["action.finish"]();
  const hasCancel = Boolean(cancelLabel || onCancel);
  const resolvedCancelLabel = cancelLabel ?? t["action.cancel"]();

  return (
    <Modal.Content
      _open={{
        animation: "scale-up-overshoot",
        animationDuration: "slower",
      }}
    >
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
              size={"76px"}
              bg={`${resolvedColorPalette}.emphasized`}
              opacity={0.35}
              pointerEvents={"none"}
              animation={"ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"}
            />

            {/* Inner Icon / Emoji Circle */}
            <Circle
              size={"76px"}
              pos={"relative"}
              bg={`${resolvedColorPalette}.muted`}
              color={`${resolvedColorPalette}.fg`}
              border={"12px solid"}
              borderColor={`${resolvedColorPalette}.subtle`}
            >
              {icon ? (
                isValidElement(icon) ? (
                  icon
                ) : (
                  <AppIcon icon={icon as ComponentType} size={"lg"} />
                )
              ) : emoji ? (
                <Emoji
                  variant={emoji}
                  colorPalette={resolvedColorPalette}
                  boxSize={28}
                />
              ) : (
                <AppIcon icon={resolved.icon} size={"lg"} />
              )}
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
        {hasCancel ? (
          <VStack gap={"xs"} w={"full"}>
            <Button
              primary
              variant={"solid"}
              colorPalette={resolvedColorPalette}
              onClick={handleDone}
              {...doneButtonProps}
            >
              {resolvedDoneLabel}
            </Button>

            <Button onClick={handleCancel} {...cancelButtonProps}>
              {resolvedCancelLabel}
            </Button>
          </VStack>
        ) : (
          <Button flex={1} onClick={handleDone} {...doneButtonProps}>
            {resolvedDoneLabel}
          </Button>
        )}
      </Modal.Footer>
    </Modal.Content>
  );
};
