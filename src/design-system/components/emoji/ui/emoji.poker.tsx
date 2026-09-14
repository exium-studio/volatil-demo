// src/design-system/components/emoji/ui/emoji.poker.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const EmojiPoker = ({
  colorPalette = "gray",
  boxSize = 24,
}: EmojiProps) => {
  // Hooks
  const { colorMode } = useColorMode();

  // Colors
  const muted =
    resolveSemanticColor(`${colorPalette}.muted`, colorMode) ?? "#e6e6e6";
  const emphasized =
    resolveSemanticColor(`${colorPalette}.emphasized`, colorMode) ?? "#e6e6e6";
  const solid =
    resolveSemanticColor(`${colorPalette}.solid`, colorMode) ?? "#000000";

  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlSpace={"preserve"}
      width={boxSize}
      height={boxSize}
      viewBox={"0 0 15.46 15.46"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"7.73"} cy={"7.73"} r={"7.73"} fill={emphasized} />
        {/* Face overlay */}
        <circle cx={"7.73"} cy={"8.79"} r={"6.67"} fill={muted} />
        <g>
          {/* Eyes */}
          <circle cx={"4.98"} cy={"4.25"} r={"0.97"} fill={solid} />
          <circle cx={"10.48"} cy={"4.25"} r={"0.97"} fill={solid} />
        </g>
        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M5.91 6.22l1.7 0 1.94 0c0.17,0 0.31,0.14 0.31,0.31l0 0c0,0.17 -0.14,0.31 -0.31,0.31l-2 0 -1.64 0c-0.17,0 -0.31,-0.14 -0.31,-0.31l0 0c0,-0.17 0.14,-0.31 0.31,-0.31z"
          }
        />
      </g>
    </svg>
  );
};
