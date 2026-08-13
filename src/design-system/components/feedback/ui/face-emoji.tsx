// src/design-system/components/feedback/ui/face-emoji.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type {
  FaceEmojiProps,
  FaceEmojiVariant,
} from "@/design-system/components/feedback/types/face-emoji.type";
import { Circle } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
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
  mt = "36px",
}: {
  color: string;
  size?: string;
  mt?: string;
}) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={mt}>
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

const SquareEyes = ({ color, mt = "36px" }: { color: string; mt?: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={mt}>
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

const BrowEyes = ({ color, mt = "36px" }: { color: string; mt?: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={mt}>
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

// Heavy-lidded eyes — thicker than FlatEyes, for sad/tired
const HeavyEyes = ({ color, mt = "36px" }: { color: string; mt?: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={mt}>
    <Box
      w={"34px"}
      h={"12px"}
      bg={color}
      rounded={"full"}
      animation={"blinkSlow 6s infinite"}
      transformOrigin={"center"}
    />
    <Box
      w={"34px"}
      h={"12px"}
      bg={color}
      rounded={"full"}
      animation={"blinkSlow 6s infinite"}
      transformOrigin={"center"}
    />
  </HStack>
);

const FlatEyes = ({ color, mt = "36px" }: { color: string; mt?: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={mt}>
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

const BigEyes = ({ color, mt = "36px" }: { color: string; mt?: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={mt}>
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
  <svg viewBox={"0 0 32 20"} width={"32"} height={"20"}>
    <path
      d={"M 4 16 Q 16 -2 28 16"}
      fill={"none"}
      stroke={color}
      strokeWidth={"6"}
      strokeLinecap={"round"}
    />
  </svg>
);

const CelebEyes = ({ color, mt = "36px" }: { color: string; mt?: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={mt}>
    <ArcEye color={color} />
    <ArcEye color={color} />
  </HStack>
);

const HeartEye = ({ color }: { color: string }) => (
  <svg viewBox={"0 0 32 30"} width={"32"} height={"30"}>
    <path d={"M 16 27 C -6 12 4 -4 16 8 C 28 -4 38 12 16 27 Z"} fill={color} />
  </svg>
);

const HeartEyes = ({ color, mt = "36px" }: { color: string; mt?: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={mt}>
    <HeartEye color={color} />
    <HeartEye color={color} />
  </HStack>
);

const CrossEye = ({ color }: { color: string }) => (
  <svg viewBox={"0 0 28 28"} width={"28"} height={"28"}>
    <path
      d={"M 4 4 L 24 24"}
      stroke={color}
      strokeWidth={"6"}
      strokeLinecap={"round"}
    />
    <path
      d={"M 24 4 L 4 24"}
      stroke={color}
      strokeWidth={"6"}
      strokeLinecap={"round"}
    />
  </svg>
);

const CrossEyes = ({ color, mt = "36px" }: { color: string; mt?: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={mt}>
    <CrossEye color={color} />
    <CrossEye color={color} />
  </HStack>
);

const WinkEyes = ({ color, mt = "36px" }: { color: string; mt?: string }) => (
  <HStack justify={"center"} gap={SPACING.lg} mt={mt}>
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
// Reusable mouth shapes — all SVG centered
// ---------------------------------------------------------------------------

const SmileMouth = ({ color }: { color: string }) => (
  <Center>
    <svg viewBox={"0 0 80 40"} width={"80"} height={"40"}>
      <path
        d={"M 20 10 A 20 20 0 0 0 60 10"}
        fill={"none"}
        stroke={color}
        strokeWidth={"7"}
        strokeLinecap={"round"}
      />
    </svg>
  </Center>
);

const FrownMouth = ({ color }: { color: string }) => (
  <Center>
    <svg viewBox={"0 0 80 40"} width={"80"} height={"40"}>
      <path
        d={"M 20 28 A 20 20 0 0 1 60 28"}
        fill={"none"}
        stroke={color}
        strokeWidth={"7"}
        strokeLinecap={"round"}
      />
    </svg>
  </Center>
);

const FlatMouth = ({ color }: { color: string }) => (
  <Center>
    <svg viewBox={"0 0 80 20"} width={"80"} height={"20"}>
      <line
        x1={"22"}
        y1={"10"}
        x2={"58"}
        y2={"10"}
        stroke={color}
        strokeWidth={"8"}
        strokeLinecap={"round"}
      />
    </svg>
  </Center>
);

const OMouth = ({ color, size = "16px" }: { color: string; size?: string }) => (
  <Center>
    <Circle
      w={size}
      h={size}
      bg={color}
      animation={"floatMouth 3s ease-in-out infinite"}
    />
  </Center>
);

const BigSmileMouth = ({ color }: { color: string }) => (
  <Center>
    <svg viewBox={"0 0 80 44"} width={"80"} height={"44"}>
      <path
        d={"M 18 8 Q 40 44 62 8"}
        fill={color}
        stroke={color}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      />
    </svg>
  </Center>
);

const WavyMouth = ({ color }: { color: string }) => (
  <Center>
    <svg viewBox={"0 0 80 24"} width={"80"} height={"24"}>
      <path
        d={"M 12 12 Q 22 4 32 12 T 52 12 T 68 12"}
        fill={"none"}
        stroke={color}
        strokeWidth={"6"}
        strokeLinecap={"round"}
      />
    </svg>
  </Center>
);

const SmirkMouth = ({ color }: { color: string }) => (
  <Center>
    <svg viewBox={"0 0 80 24"} width={"80"} height={"24"}>
      <path
        d={"M 18 16 Q 40 14 62 4"}
        fill={"none"}
        stroke={color}
        strokeWidth={"7"}
        strokeLinecap={"round"}
      />
    </svg>
  </Center>
);

// ---------------------------------------------------------------------------
// Decorations — floating elements above the body
// ---------------------------------------------------------------------------

const TearDrop = ({ color }: { color: string }) => (
  <svg viewBox={"0 0 14 20"} width={"14"} height={"20"}>
    <path d={"M 7 0 C 12 8 12 14 7 18 C 2 14 2 8 7 0 Z"} fill={color} />
  </svg>
);

const ActiveTears = ({ color }: { color: string }) => (
  <>
    <Box pos={"absolute"} top={"30px"} left={"50px"}>
      <TearDrop color={color} />
    </Box>
    <Box pos={"absolute"} top={"30px"} right={"50px"}>
      <TearDrop color={color} />
    </Box>
  </>
);

// Floating Zzz — sleeping
const ZzzMark = ({ color }: { color: string }) => (
  <P
    fontSize={"2xl"}
    fontWeight={"bold"}
    pos={"absolute"}
    top={"4px"}
    right={"16px"}
    color={color}
    animation={"floatMouth 3s ease-in-out infinite"}
  >
    Z z
  </P>
);

// Floating ? — confused
const QuestionMark = ({ color }: { color: string }) => (
  <P
    fontSize={"4xl"}
    fontWeight={"bold"}
    pos={"absolute"}
    top={"2px"}
    right={"18px"}
    color={color}
    animation={"floatMouth 2.8s ease-in-out infinite"}
  >
    ?
  </P>
);

// Floating ! — shocked
const ExclamMark = ({ color }: { color: string }) => (
  <P
    fontSize={"4xl"}
    fontWeight={"bold"}
    pos={"absolute"}
    top={"2px"}
    right={"20px"}
    color={color}
    animation={"floatMouth 2s ease-in-out infinite"}
  >
    !
  </P>
);

// ---------------------------------------------------------------------------
// Single base body — same width (220px), same height (160px), flat bottom
// Only the top curve differs per variant
// ---------------------------------------------------------------------------

// Round dome — default friendly shape
const BODY_DOME =
  "M 10,160 L 210,160 C 215,100 200,28 110,22 C 20,28 5,100 10,160 Z";

// Flat top — neutral boxy
const BODY_FLAT_TOP =
  "M 10,160 L 210,160 C 212,140 212,40 190,32 L 30,32 C 8,40 8,140 10,160 Z";

// Asymmetric — right side rises higher than left (original confused shape)
const BODY_ASYM =
  "M 10,160 L 210,160 C 200,70 170,-5 130,20 C 90,45 20,25 10,160 Z";

// Pillow — very wide low arc, barely rises
const BODY_PILLOW =
  "M 5,160 L 215,160 C 220,110 200,52 110,46 C 20,52 0,110 5,160 Z";

// ---------------------------------------------------------------------------
// Variant config
// ---------------------------------------------------------------------------

const VARIANTS_MAP: Record<
  FaceEmojiVariant,
  {
    colorPalette: string;
    bodyPath: string;
    renderFace: (color: string) => ReactNode;
  }
> = {
  // Dome — happy
  happy: {
    colorPalette: "green",
    bodyPath: BODY_DOME,
    renderFace: (c) => (
      <>
        <RoundEyes color={c} mt={"36px"} />
        <SmileMouth color={c} />
      </>
    ),
  },
  // Dome — sad, heavy-lidded + frown, no tears
  sad: {
    colorPalette: "red",
    bodyPath: BODY_DOME,
    renderFace: (c) => (
      <>
        <HeavyEyes color={c} mt={"36px"} />
        <FrownMouth color={c} />
      </>
    ),
  },
  // Dome — worried, brow eyes + flat mouth
  worried: {
    colorPalette: "orange",
    bodyPath: BODY_DOME,
    renderFace: (c) => (
      <>
        <BrowEyes color={c} mt={"36px"} />
        <FlatMouth color={c} />
      </>
    ),
  },
  // Flat top — neutral, square eyes
  neutral: {
    colorPalette: "neutral",
    bodyPath: BODY_FLAT_TOP,
    renderFace: (c) => (
      <>
        <SquareEyes color={c} mt={"42px"} />
        <FlatMouth color={c} />
      </>
    ),
  },
  // Asym — confused, floating ?
  confused: {
    colorPalette: "neutral",
    bodyPath: BODY_ASYM,
    renderFace: (c) => (
      <Box pos={"relative"} w={"full"}>
        <QuestionMark color={c} />
        <BrowEyes color={c} mt={"40px"} />
        <WavyMouth color={c} />
      </Box>
    ),
  },
  // Pillow — sleepy, flat eyes + tiny O
  sleepy: {
    colorPalette: "neutral",
    bodyPath: BODY_PILLOW,
    renderFace: (c) => (
      <>
        <FlatEyes color={c} mt={"50px"} />
        <OMouth color={c} size={"12px"} />
      </>
    ),
  },
  // Dome — shocked, big eyes + big O + floating !
  shocked: {
    colorPalette: "red",
    bodyPath: BODY_DOME,
    renderFace: (c) => (
      <Box pos={"relative"} w={"full"}>
        <ExclamMark color={c} />
        <BigEyes color={c} mt={"36px"} />
        <OMouth color={c} size={"20px"} />
      </Box>
    ),
  },
  // Dome — celebrate, arc eyes + big filled smile
  celebrate: {
    colorPalette: "green",
    bodyPath: BODY_DOME,
    renderFace: (c) => (
      <>
        <CelebEyes color={c} mt={"36px"} />
        <BigSmileMouth color={c} />
      </>
    ),
  },
  // Dome — love, heart eyes + smile
  love: {
    colorPalette: "pink",
    bodyPath: BODY_DOME,
    renderFace: (c) => (
      <>
        <HeartEyes color={c} mt={"36px"} />
        <SmileMouth color={c} />
      </>
    ),
  },
  // Asym — dizzy, cross eyes + wavy mouth (reuses confused body for wobbly feel)
  dizzy: {
    colorPalette: "red",
    bodyPath: BODY_ASYM,
    renderFace: (c) => (
      <>
        <CrossEyes color={c} mt={"38px"} />
        <WavyMouth color={c} />
      </>
    ),
  },
  // Dome — winking, arc + round eye + smirk
  winking: {
    colorPalette: "green",
    bodyPath: BODY_DOME,
    renderFace: (c) => (
      <>
        <WinkEyes color={c} mt={"36px"} />
        <SmirkMouth color={c} />
      </>
    ),
  },
  // Dome — crying, round eyes + active tears just below eyes + frown
  crying: {
    colorPalette: "blue",
    bodyPath: BODY_DOME,
    renderFace: (c) => (
      <Box pos={"relative"} w={"full"} h={"full"}>
        <RoundEyes color={c} mt={"36px"} />
        {/* Tears: top=64px overlaps 4px below eye bottom (36+32=68 → 68-4=64) */}
        <ActiveTears color={c} />
        <FrownMouth color={c} />
      </Box>
    ),
  },
  // Dome — searching, big eyes + tiny O
  searching: {
    colorPalette: "neutral",
    bodyPath: BODY_DOME,
    renderFace: (c) => (
      <>
        <SquareEyes color={c} mt={"32px"} />
        <SmirkMouth color={c} />
      </>
    ),
  },
  // Pillow — sleeping, Zzz + flat eyes + flat mouth
  sleeping: {
    colorPalette: "neutral",
    bodyPath: BODY_PILLOW,
    renderFace: (c) => (
      <Box pos={"relative"} w={"full"}>
        <ZzzMark color={c} />
        <FlatEyes color={c} mt={"55px"} />
        <FlatMouth color={c} />
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
            viewBox={"0 0 220 160"}
            width={"220"}
            height={"160"}
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
