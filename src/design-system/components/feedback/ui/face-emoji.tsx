// src/design-system/components/feedback/ui/face-emoji.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type {
  FaceEmojiProps,
  FaceEmojiVariant,
} from "@/design-system/components/feedback/types/face-emoji.type";
import { Circle } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { SPACING } from "@/design-system/constants/styles";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

const OVERSHOOT_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// ---------------------------------------------------------------------------
// Reusable eye shapes
// ---------------------------------------------------------------------------

const RoundEyes = ({
  color,
  size = "32px",
}: {
  color: string;
  size?: string;
}) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={"36px"}>
    <Circle
      w={size}
      h={size}
      bg={color}
      animation={"blink 4s infinite"}
      transformOrigin={"center"}
    />
    <Circle
      w={size}
      h={size}
      bg={color}
      animation={"blink 4s infinite"}
      transformOrigin={"center"}
    />
  </HStack>
);

const SquareEyes = ({ color }: { color: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={"36px"}>
    <Box
      w={"28px"}
      h={"28px"}
      bg={color}
      rounded={"md"}
      animation={"blink 4s infinite"}
      transformOrigin={"center"}
    />
    <Box
      w={"28px"}
      h={"28px"}
      bg={color}
      rounded={"md"}
      animation={"blink 4s infinite"}
      transformOrigin={"center"}
    />
  </HStack>
);

const BrowEyes = ({ color }: { color: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={"36px"}>
    <Box
      w={"36px"}
      h={"16px"}
      bg={color}
      rounded={"full"}
      animation={"blinkWarning 4s infinite"}
      transformOrigin={"center"}
    />
    <Box
      w={"36px"}
      h={"16px"}
      bg={color}
      rounded={"full"}
      animation={"blinkWarning 4s infinite"}
      transformOrigin={"center"}
    />
  </HStack>
);

const FlatEyes = ({ color }: { color: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={"44px"}>
    <Box
      w={"36px"}
      h={"6px"}
      bg={color}
      rounded={"full"}
      animation={"blinkSlow 6s infinite"}
      transformOrigin={"center"}
    />
    <Box
      w={"36px"}
      h={"6px"}
      bg={color}
      rounded={"full"}
      animation={"blinkSlow 6s infinite"}
      transformOrigin={"center"}
    />
  </HStack>
);

const BigEyes = ({ color }: { color: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={"32px"}>
    <Circle
      w={"40px"}
      h={"40px"}
      bg={color}
      animation={"blinkSlow 5s infinite"}
      transformOrigin={"center"}
    />
    <Circle
      w={"40px"}
      h={"40px"}
      bg={color}
      animation={"blinkSlow 5s infinite"}
      transformOrigin={"center"}
    />
  </HStack>
);

const ArcEye = ({ color }: { color: string }) => (
  <svg viewBox="0 0 32 20" width="32" height="20">
    <path
      d="M 4 16 Q 16 -2 28 16"
      fill="none"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);

const LaughEyes = ({ color }: { color: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={"40px"}>
    <ArcEye color={color} />
    <ArcEye color={color} />
  </HStack>
);

const HeartEye = ({ color }: { color: string }) => (
  <svg viewBox="0 0 32 30" width="32" height="30">
    <path d="M 16 27 C -6 12 4 -4 16 8 C 28 -4 38 12 16 27 Z" fill={color} />
  </svg>
);

const HeartEyes = ({ color }: { color: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={"36px"}>
    <HeartEye color={color} />
    <HeartEye color={color} />
  </HStack>
);

const CrossEye = ({ color }: { color: string }) => (
  <svg viewBox="0 0 28 28" width="28" height="28">
    <path
      d="M 4 4 L 24 24"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M 24 4 L 4 24"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);

const CrossEyes = ({ color }: { color: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={"38px"}>
    <CrossEye color={color} />
    <CrossEye color={color} />
  </HStack>
);

const WinkEyes = ({ color }: { color: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={"38px"}>
    <ArcEye color={color} />
    <Circle
      w={"32px"}
      h={"32px"}
      bg={color}
      animation={"blink 4s infinite"}
      transformOrigin={"center"}
    />
  </HStack>
);

// ---------------------------------------------------------------------------
// Reusable mouth shapes
// ---------------------------------------------------------------------------

const LipArc = ({
  color,
  direction = "up",
  strokeWidth = "7",
}: {
  color: string;
  direction?: "up" | "down";
  strokeWidth?: string;
}) => (
  <Center mt={"-24px"}>
    <svg viewBox="0 0 40 40" width="40" height="40">
      <path
        d={
          direction === "up"
            ? "M 32 18 A 12 12 0 0 1 8 18"
            : "M 32 26 A 12 12 0 0 0 8 26"
        }
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  </Center>
);

const FlatMouth = ({ color, w = "36px" }: { color: string; w?: string }) => (
  <Box
    w={w}
    h={"10px"}
    bg={color}
    rounded={"sm"}
    mt={"12px"}
    animation={"floatMouth 3s ease-in-out infinite"}
  />
);

const OMouth = ({ color, size = "16px" }: { color: string; size?: string }) => (
  <Circle
    w={size}
    h={size}
    bg={color}
    mt={"10px"}
    animation={"floatMouth 3s ease-in-out infinite"}
  />
);

const WideMouth = ({ color }: { color: string }) => (
  <Center mt={"4px"}>
    <svg viewBox="0 0 44 30" width="44" height="30">
      <path d="M 4 4 Q 22 34 40 4 Q 22 20 4 4 Z" fill={color} />
    </svg>
  </Center>
);

const WavyMouth = ({ color }: { color: string }) => (
  <Center mt={"8px"}>
    <svg viewBox="0 0 44 16" width="44" height="16">
      <path
        d="M 4 8 Q 10 2 16 8 T 28 8 T 40 8"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  </Center>
);

const SmirkMouth = ({ color }: { color: string }) => (
  <Center mt={"6px"}>
    <svg viewBox="0 0 40 20" width="40" height="20">
      <path
        d="M 6 8 Q 22 6 34 -2"
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  </Center>
);

// ---------------------------------------------------------------------------
// Decorations
// ---------------------------------------------------------------------------

const TearDrop = ({ color }: { color: string }) => (
  <svg viewBox="0 0 14 20" width="14" height="20">
    <path d="M 7 0 C 12 8 12 14 7 18 C 2 14 2 8 7 0 Z" fill={color} />
  </svg>
);

const ZzzMark = ({ color }: { color: string }) => (
  <Box
    pos={"absolute"}
    top={"4px"}
    right={"16px"}
    color={color}
    fontWeight={"bold"}
    fontSize={"14px"}
    animation={"floatMouth 3s ease-in-out infinite"}
  >
    Z z
  </Box>
);

// ---------------------------------------------------------------------------
// Variant config — deklaratif, expression-based
// ---------------------------------------------------------------------------

const VARIANTS_MAP: Record<
  FaceEmojiVariant,
  {
    colorPalette: string;
    bodyPath: string;
    renderFace: (color: string) => ReactNode;
  }
> = {
  happy: {
    colorPalette: "green",
    bodyPath: "M 10,160 C 10,20 210,20 210,160 Z",
    renderFace: (c) => (
      <>
        <RoundEyes color={c} />
        <LipArc color={c} direction="up" />
      </>
    ),
  },
  sad: {
    colorPalette: "red",
    bodyPath: "M 10,160 C 25,100 80,15 110,15 C 140,15 195,100 210,160 Z",
    renderFace: (c) => (
      <>
        <RoundEyes color={c} />
        <LipArc color={c} direction="down" />
      </>
    ),
  },
  worried: {
    colorPalette: "orange",
    bodyPath: "M 10,160 C 25,100 80,15 110,15 C 140,15 195,100 210,160 Z",
    renderFace: (c) => (
      <>
        <BrowEyes color={c} />
        <FlatMouth color={c} w={"40px"} />
      </>
    ),
  },
  neutral: {
    colorPalette: "neutral",
    bodyPath: "M 10,160 C 10,60 30,30 80,30 L 140,30 C 190,30 210,60 210,160 Z",
    renderFace: (c) => (
      <>
        <SquareEyes color={c} />
        <FlatMouth color={c} w={"36px"} />
      </>
    ),
  },
  confused: {
    colorPalette: "neutral",
    bodyPath: "M 10,160 C 20,25 90,45 130,20 C 170,-5 200,70 210,160 Z",
    renderFace: (c) => (
      <>
        <BrowEyes color={c} />
        <LipArc color={c} direction="down" />
      </>
    ),
  },
  sleepy: {
    colorPalette: "neutral",
    bodyPath: "M 10,160 C 10,60 30,30 80,30 L 140,30 C 190,30 210,60 210,160 Z",
    renderFace: (c) => (
      <>
        <FlatEyes color={c} />
        <OMouth color={c} size={"12px"} />
      </>
    ),
  },
  shocked: {
    colorPalette: "red",
    bodyPath: "M 10,160 C 25,100 80,15 110,15 C 140,15 195,100 210,160 Z",
    renderFace: (c) => (
      <>
        <BigEyes color={c} />
        <OMouth color={c} size={"18px"} />
      </>
    ),
  },
  laughing: {
    colorPalette: "green",
    bodyPath: "M 10,160 C 10,20 210,20 210,160 Z",
    renderFace: (c) => (
      <>
        <LaughEyes color={c} />
        <WideMouth color={c} />
      </>
    ),
  },
  love: {
    colorPalette: "pink",
    bodyPath: "M 10,160 C 10,20 210,20 210,160 Z",
    renderFace: (c) => (
      <>
        <HeartEyes color={c} />
        <LipArc color={c} direction="up" strokeWidth="6" />
      </>
    ),
  },
  dizzy: {
    colorPalette: "red",
    bodyPath: "M 10,160 C 25,100 80,15 110,15 C 140,15 195,100 210,160 Z",
    renderFace: (c) => (
      <>
        <CrossEyes color={c} />
        <WavyMouth color={c} />
      </>
    ),
  },
  winking: {
    colorPalette: "green",
    bodyPath: "M 10,160 C 10,20 210,20 210,160 Z",
    renderFace: (c) => (
      <>
        <WinkEyes color={c} />
        <SmirkMouth color={c} />
      </>
    ),
  },
  crying: {
    colorPalette: "blue",
    bodyPath: "M 10,160 C 25,100 80,15 110,15 C 140,15 195,100 210,160 Z",
    renderFace: (c) => (
      <Box pos={"relative"}>
        <RoundEyes color={c} />
        <Box pos={"absolute"} top={"64px"} left={"70px"}>
          <TearDrop color={c} />
        </Box>
        <Box pos={"absolute"} top={"64px"} right={"70px"}>
          <TearDrop color={c} />
        </Box>
        <LipArc color={c} direction="down" />
      </Box>
    ),
  },
  searching: {
    colorPalette: "neutral",
    bodyPath: "M 10,160 C 20,25 90,45 130,20 C 170,-5 200,70 210,160 Z",
    renderFace: (c) => (
      <>
        <BigEyes color={c} />
        <OMouth color={c} size={"14px"} />
      </>
    ),
  },
  sleeping: {
    colorPalette: "neutral",
    bodyPath: "M 10,160 C 10,60 30,30 80,30 L 140,30 C 190,30 210,60 210,160 Z",
    renderFace: (c) => (
      <Box pos={"relative"} w={"full"}>
        <ZzzMark color={c} />
        <FlatEyes color={c} />
        <FlatMouth color={c} w={"28px"} />
      </Box>
    ),
  },
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const FaceEmoji = (props: FaceEmojiProps) => {
  // Props
  const {
    variant = "neutral",
    transition = true,
    colorPalette: colorPaletteProp,
    size = "md",
    ...restProps
  } = props;

  // Hooks
  const { colorMode } = useColorMode();

  // Resolved Values
  const resolvedVariant = VARIANTS_MAP[variant];
  const activeColorPalette = colorPaletteProp ?? resolvedVariant.colorPalette;
  const faceColor = `${activeColorPalette}.solid`;
  const skinColor = `${activeColorPalette}.emphasized`;
  const resolvedSkinColor = resolveSemanticColor(skinColor, colorMode) || "";
  const resolvedFaceColor = resolveSemanticColor(faceColor, colorMode) || "";

  const baseWidth = 220;
  const baseHeight = 160;

  const SIZES_MAP = {
    sm: { w: 56, h: 40 },
    md: { w: 88, h: 64 },
    lg: { w: 140, h: 102 },
    xl: { w: 220, h: 160 },
  };

  const selectedSize = SIZES_MAP[size] || SIZES_MAP.md;
  const scale = selectedSize.w / baseWidth;

  return (
    <Box
      pos={"relative"}
      w={`${selectedSize.w}px`}
      h={`${selectedSize.h}px`}
      overflow={"hidden"}
      {...restProps}
    >
      <Box
        pos={"absolute"}
        top={0}
        left={0}
        w={`${baseWidth}px`}
        h={`${baseHeight}px`}
        transform={`scale(${scale})`}
        transformOrigin={"top left"}
      >
        <Box
          pos={"absolute"}
          bottom={transition ? "0px" : "-160px"}
          left={0}
          w={`${baseWidth}px`}
          h={`${baseHeight}px`}
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

          <Box pos={"relative"} zIndex={1} w={"full"} h={"full"}>
            <style>{`
              @keyframes blink {
                0%, 90%, 100% { transform: scaleY(1); }
                95% { transform: scaleY(0.1); }
              }
              @keyframes blinkWarning {
                0%, 90%, 100% { transform: scaleY(1); }
                95% { transform: scaleY(0.15); }
              }
              @keyframes blinkSlow {
                0%, 85%, 100% { transform: scaleY(1); }
                92% { transform: scaleY(0.2); }
              }
              @keyframes floatMouth {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(1.5px) scale(0.96); }
              }
            `}</style>

            {resolvedVariant.renderFace(resolvedFaceColor)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
