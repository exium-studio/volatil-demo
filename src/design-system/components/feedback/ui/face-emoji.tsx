// src/design-system/components/feedback/ui/face-emoji.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type {
  FaceEmojiProps,
  FaceEmojiVariant,
} from "@/design-system/components/feedback/types/face-emoji.type";
import type { CenterProps } from "@/design-system/components/layout/types/center.type";
import { Circle } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SPACING } from "@/design-system/constants/styles";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { Box } from "@chakra-ui/react";

const OVERSHOOT_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

export const FaceEmoji = (props: FaceEmojiProps) => {
  // Props
  const {
    variant = "info",
    transition = false,
    colorPalette: colorPaletteProp,
  } = props;

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
      colorPalette: "neutral",
      bodyPath: "M 10,160 C 20,25 90,45 130,20 C 170,-5 200,70 210,160 Z",
    },
  } as Record<
    FaceEmojiVariant,
    {
      colorPalette: string;
      bodyPath: string;
    }
  >;

  // Hooks
  const { colorMode } = useColorMode();

  // Resolved Values
  const resolvedVariant = VARIANTS_MAP[variant];
  const activeColorPalette = colorPaletteProp ?? resolvedVariant.colorPalette;
  const faceColor = `${activeColorPalette}.solid`;
  const skinColor = `${activeColorPalette}.emphasized`;
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
