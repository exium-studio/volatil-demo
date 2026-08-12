// src/design-system/components/focus-alert/ui/focus-alert.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import { Button } from "@/design-system/components/button/ui/button";
import { useFocusAlerterStore } from "@/design-system/components/focus-alert/stores/focus-alert.store";
import type {
  FocusAlertContentProps,
  FocusAlertItemProps,
  FocusAlertTriggerProps,
  FocusAlertVariant,
} from "@/design-system/components/focus-alert/types/focus-alert.type";
import { useFocusAlertContext } from "@/design-system/components/focus-alert/ui/focus-alert-key-context";
import type { CenterProps } from "@/design-system/components/layout/types/center.type";
import { Circle } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Box } from "@chakra-ui/react";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { useEffect, useRef, useState } from "react";

// Animation constants
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
    <Modal.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
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
    <Modal.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
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
    info: {
      colorPalette: "neutral",
      bodyPath: "M 10,160 C 20,40 80,10 130,25 C 180,40 200,90 210,160 Z",
    },
    success: {
      colorPalette: "green",
      bodyPath: "M 10,160 C 10,20 210,20 210,160 Z",
    },
    error: {
      colorPalette: "red",
      bodyPath: "M 10,160 C 25,100 80,15 110,15 C 140,15 195,100 210,160 Z",
    },
    warning: {
      colorPalette: "orange",
      bodyPath:
        "M 10,160 C 10,60 30,30 80,30 L 140,30 C 190,30 210,60 210,160 Z",
    },
    question: {
      colorPalette: "blue",
      bodyPath: "M 10,160 C 20,25 90,45 130,20 C 170,-5 200,70 210,160 Z",
    },
  } as Record<
    FocusAlertVariant,
    {
      colorPalette: string;
      bodyPath: string;
    }
  >;

  // Hooks
  const { colorMode } = useColorMode();

  // Resolved Values
  const resolvedVariant = VARIANTS_MAP[variant ?? "info"];
  const faceColor = `${resolvedVariant.colorPalette}.solid`;
  const skinColor = `${resolvedVariant.colorPalette}.emphasized`;
  const resolvedSkinColor = resolveSemanticColor(skinColor, colorMode) || "";

  const renderFaceEmoji = () => {
    switch (variant) {
      case "success":
        return (
          <>
            <HStack justify={"center"} gap={SPACING.lg} mt={"36px"}>
              <Circle
                w={"32px"}
                h={"32px"}
                bg={faceColor}
                animation={"blink 4s infinite"}
                transformOrigin={"center"}
              />
              <Circle
                w={"32px"}
                h={"32px"}
                bg={faceColor}
                animation={"blink 4s infinite"}
                transformOrigin={"center"}
              />
            </HStack>
            <SuccessLipShape
              color={faceColor}
              animation={"floatMouth 3s ease-in-out infinite"}
            />
          </>
        );
      case "error":
        return (
          <>
            <HStack justify={"center"} gap={SPACING.lg} mt={"40px"}>
              <Circle
                w={"32px"}
                h={"32px"}
                bg={faceColor}
                animation={"blink 4s infinite"}
                transformOrigin={"center"}
              />
              <Circle
                w={"32px"}
                h={"32px"}
                bg={faceColor}
                animation={"blink 4s infinite"}
                transformOrigin={"center"}
              />
            </HStack>
            <SadLipShape
              color={faceColor}
              animation={"floatMouth 3s ease-in-out infinite"}
            />
          </>
        );
      case "warning":
        return (
          <>
            <HStack justify={"center"} gap={SPACING.lg} mt={"36px"}>
              <Box
                w={"36px"}
                h={"16px"}
                bg={faceColor}
                rounded={"full"}
                animation={"blinkWarning 4s infinite"}
                transformOrigin={"center"}
              />
              <Box
                w={"36px"}
                h={"16px"}
                bg={faceColor}
                rounded={"full"}
                animation={"blinkWarning 4s infinite"}
                transformOrigin={"center"}
              />
            </HStack>
            <Box
              w={"40px"}
              h={"12px"}
              bg={faceColor}
              rounded={"full"}
              mt={"12px"}
              animation={"floatMouth 3s ease-in-out infinite"}
            />
          </>
        );
      case "question":
        return (
          <>
            <HStack justify={"center"} gap={SPACING.lg} mt={"36px"}>
              <Box
                w={"36px"}
                h={"16px"}
                bg={faceColor}
                rounded={"full"}
                animation={"blinkWarning 4s infinite"}
                transformOrigin={"center"}
              />
              <Box
                w={"36px"}
                h={"16px"}
                bg={faceColor}
                rounded={"full"}
                animation={"blinkWarning 4s infinite"}
                transformOrigin={"center"}
              />
            </HStack>
            <SadLipShape
              color={faceColor}
              animation={"floatMouth 3s ease-in-out infinite"}
            />
          </>
        );
      case "info":
      default:
        return (
          <>
            <HStack justify={"center"} gap={SPACING.lg} mt={"36px"}>
              <Circle
                w={"32px"}
                h={"32px"}
                bg={faceColor}
                animation={"blink 4s infinite"}
                transformOrigin={"center"}
              />
              <Circle
                w={"32px"}
                h={"32px"}
                bg={faceColor}
                animation={"blink 4s infinite"}
                transformOrigin={"center"}
              />
            </HStack>
            <Box
              w={"36px"}
              h={"8px"}
              bg={faceColor}
              rounded={"full"}
              mt={"12px"}
              animation={"floatMouth 3s ease-in-out infinite"}
            />
          </>
        );
    }
  };

  return (
    <Modal.Content>
      <Modal.Body>
        <VStack
          align={"center"}
          justify={"center"}
          gap={SPACING.xl}
          py={PADDING.md}
        >
          <VStack gap={"40px"} align={"center"} w={"full"}>
            <Box pos={"relative"} w={"220px"} h={"160px"} overflow={"hidden"}>
              <Box
                pos={"absolute"}
                bottom={transition ? "0px" : "-160px"}
                left={0}
                w={"220px"}
                h={"160px"}
                transition={`300ms ${OVERSHOOT_EASE}`}
              >
                <svg
                  viewBox="0 0 220 160"
                  width="220"
                  height="160"
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  <path d={resolvedVariant.bodyPath} fill={resolvedSkinColor} />
                </svg>

                <VStack
                  pos={"relative"}
                  zIndex={1}
                  align={"center"}
                  w={"full"}
                  h={"full"}
                >
                  <style>{`
                    @keyframes blink {
                      0%, 90%, 100% { transform: scaleY(1); }
                      95% { transform: scaleY(0.1); }
                    }
                    @keyframes blinkWarning {
                      0%, 90%, 100% { transform: scaleY(1); }
                      95% { transform: scaleY(0.15); }
                    }
                    @keyframes floatMouth {
                      0%, 100% { transform: translateY(0) scale(1); }
                      50% { transform: translateY(1.5px) scale(0.96); }
                    }
                  `}</style>

                  {renderFaceEmoji()}
                </VStack>
              </Box>
            </Box>

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
                // color={`${resolvedVariant.colorPalette}.solid/50`}
                color={"fg.subtle"}
                maxW={"240px"}
                mx={"auto"}
              >
                {description}
              </P>
            </VStack>
          </VStack>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <Button
          flex={1}
          // variant={"solid"}
          // colorPalette={resolvedVariant.colorPalette}
          onClick={onDone ?? close}
        >
          Selesai
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};

const SuccessLipShape = (props: CenterProps) => {
  // Props
  const { color, ...restProps } = props;

  // Hooks
  const { colorMode } = useColorMode();

  // Resolved Values
  const resolvedColor = resolveSemanticColor(color as string, colorMode);

  return (
    <Center {...restProps}>
      <Center mt={"-24px"}>
        <svg viewBox="0 0 40 40" width="40" height="40">
          <path
            d="M 32 18 A 12 12 0 0 1 8 18"
            fill="none"
            stroke={resolvedColor || ""}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      </Center>
    </Center>
  );
};

const SadLipShape = (props: CenterProps) => {
  // Props
  const { color, ...restProps } = props;

  // Hooks
  const { colorMode } = useColorMode();

  // Resolved Values
  const resolvedColor = resolveSemanticColor(color as string, colorMode);

  return (
    <Center {...restProps}>
      <Center mt={"-24px"}>
        <svg viewBox="0 0 40 40" width="40" height="40">
          <path
            d="M 32 26 A 12 12 0 0 0 8 26"
            fill="none"
            stroke={resolvedColor || ""}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      </Center>
    </Center>
  );
};
