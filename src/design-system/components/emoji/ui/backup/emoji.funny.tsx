// src/design-system/components/emoji/ui/backup/emoji.funny.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const EmojiFunny = ({
  colorPalette = "gray",
  boxSize = 24,
}: EmojiProps) => {
  // Hooks
  const { colorMode } = useColorMode();

  // Colors
  const solid =
    resolveSemanticColor(`${colorPalette}.solid`, colorMode) ?? "#000000";
  const emphasized =
    resolveSemanticColor(`${colorPalette}.emphasized`, colorMode) ?? "#e6e6e6";
  const muted =
    resolveSemanticColor(`${colorPalette}.muted`, colorMode) ?? "#cccccc";

  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlSpace={"preserve"}
      width={boxSize}
      height={boxSize}
      viewBox={"0 0 16.33 16.33"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"8.17"} cy={"8.17"} r={"8.17"} fill={emphasized} />
        {/* Eye */}
        <circle fill={solid} cx={"5"} cy={"3.96"} r={"1.02"} />
        {/* Spinning eye */}
        <polygon
          fill={solid}
          points={
            "11.78,3.35 10.44,4.06 11.89,4.52 11.94,5.04 9.25,4.18 11.64,2.8"
          }
        />
        {/* Mouth */}
        <path
          fill={muted}
          d={
            "M6.2 6.65c-0.46,1.21 -1.57,3 -0.94,4.93 0.65,2.01 2.72,1.59 2.72,1.59 0,0 2.07,0.42 2.72,-1.59 0.63,-1.92 -0.48,-3.72 -0.94,-4.93l-3.55 0z"
          }
        />
        {/* Mouth top line */}
        <rect
          fill={solid}
          x={"5.98"}
          y={"6.23"}
          width={"4.18"}
          height={"0.43"}
        />
      </g>
    </svg>
  );
};
