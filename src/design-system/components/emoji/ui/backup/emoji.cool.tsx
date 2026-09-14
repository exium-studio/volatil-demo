// src/design-system/components/emoji/ui/emoji.cool.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const EmojiCool = ({
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
      viewBox={"0 0 15.46 15.46"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"7.73"} cy={"7.73"} r={"7.73"} fill={emphasized} />
        {/* Sunglasses frame */}
        <path
          fill={solid}
          d={
            "M4.09 2.85c1.48,0 2.71,1.11 2.88,2.55l1.34 0c0.17,-1.44 1.39,-2.55 2.88,-2.55 1.6,0 2.9,1.3 2.9,2.9 0,1.6 -1.3,2.9 -2.9,2.9 -1.6,0 -2.9,-1.3 -2.9,-2.9l0 -0.02 -1.3 0 0 0.02c0,1.6 -1.3,2.9 -2.9,2.9 -1.6,0 -2.9,-1.3 -2.9,-2.9 0,-1.6 1.3,-2.9 2.9,-2.9z"
          }
        />
        {/* Lens shine left */}
        <path
          fill={muted}
          d={
            "M1.49 4.47c-0.19,0.39 -0.3,0.82 -0.3,1.28 0,0.02 0,0.03 0,0.05 1.45,-0.64 3.98,-1.24 5.38,-1.54 -0.28,-0.47 -0.69,-0.85 -1.18,-1.1 -1.44,0.31 -2.96,0.9 -3.9,1.31z"
          }
        />
        {/* Lens shine right */}
        <path
          fill={muted}
          d={
            "M8.58 4.47c-0.19,0.39 -0.3,0.82 -0.3,1.28 0,0.02 0,0.03 0,0.05 1.45,-0.64 3.98,-1.24 5.38,-1.54 -0.28,-0.47 -0.69,-0.85 -1.18,-1.1 -1.44,0.31 -2.96,0.9 -3.9,1.31z"
          }
        />
        {/* Eyebrow lines */}
        <g>
          <polygon
            fill={solid}
            points={"8.67,2.77 10.15,1.46 10.3,1.97 8.97,2.87"}
          />
          <polygon
            fill={solid}
            points={"6.8,2.77 5.31,1.46 5.16,1.97 6.49,2.87"}
          />
        </g>
        {/* Smile */}
        <path
          fill={solid}
          d={
            "M10.53 8.57c-1.21,0.84 -2.66,1.34 -4.23,1.37 0.07,0.18 0.17,0.34 0.28,0.5 1.74,-0.04 3.33,-0.65 4.61,-1.66 -0,-0.05 -0.01,-0.09 -0.01,-0.13 -0.22,-0 -0.43,-0.03 -0.64,-0.08z"
          }
        />
      </g>
    </svg>
  );
};
