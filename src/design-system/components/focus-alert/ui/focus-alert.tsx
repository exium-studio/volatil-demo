import { Button } from "@/design-system/components/button/ui/button";
import type {
  FocusAlertContentProps,
  FocusAlertItemProps,
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
import { SPACING } from "@/design-system/constants/styles";
import { IconInfoCircle } from "@tabler/icons-react";
import type { ComponentType } from "react";
import {
  CheckIcon,
  HeartIcon,
  MoonIcon,
  SearchIcon,
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
  const VARIANTS_MAP: Record<
    FocusAlertVariant,
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

    // Emote variants
    happy: {
      colorPalette: "green",
      icon: CheckIcon,
      // emote: "happy",
    },
    celebrate: {
      colorPalette: "green",
      icon: SparklesIcon,
      // emote: "celebrate",
    },
    winking: {
      colorPalette: "green",
      icon: CheckIcon,
      // emote: "winking",
    },
    sad: {
      colorPalette: "red",
      icon: XIcon,
      // emote: "sad",
    },
    shocked: {
      colorPalette: "red",
      icon: ZapIcon,
      // emote: "shocked",
    },
    dizzy: {
      colorPalette: "red",
      icon: XIcon,
      // emote: "dizzy",
    },
    worried: {
      colorPalette: "orange",
      icon: TriangleAlertIcon,
      // emote: "worried",
    },
    neutral: {
      colorPalette: "neutral",
      icon: SparklesIcon,
      // emote: "neutral",
    },
    confused: {
      colorPalette: "neutral",
      icon: TriangleAlertIcon,
      // emote: "confused",
    },
    sleepy: {
      colorPalette: "neutral",
      icon: MoonIcon,
      // emote: "sleepy",
    },
    sleeping: {
      colorPalette: "neutral",
      icon: MoonIcon,
      // emote: "sleeping",
    },
    love: {
      colorPalette: "pink",
      icon: HeartIcon,
      // emote: "love",
    },
    crying: {
      colorPalette: "blue",
      icon: XIcon,
      // emote: "crying",
    },
    searching: {
      colorPalette: "neutral",
      icon: SearchIcon,
      // emote: "searching",
    },
  };

  // Resolved Values
  const resolved = VARIANTS_MAP[variant ?? "neutral"] ?? VARIANTS_MAP.neutral;

  return (
    <Modal.Content>
      <Modal.Body pt={SPACING.lg} pb={SPACING.md}>
        <VStack
          align={"center"}
          gap={SPACING.md}
          textAlign={"center"}
          my={SPACING.sm}
        >
          <Box
            pos={"relative"}
            display={"inline-flex"}
            alignItems={"center"}
            justifyContent={"center"}
            mb={SPACING.md}
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
              p={SPACING.lg}
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
        <Button primary flex={1} onClick={onDone ?? close}>
          {"Selesai"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
