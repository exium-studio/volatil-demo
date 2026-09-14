// src/design-system/components/emoji/ui/emoji.yummy.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const EmojiYummy = ({
  colorPalette = "gray",
  boxSize = 24,
}: EmojiProps) => {
  // Hooks
  const { colorMode } = useColorMode();

  // Colors
  const muted =
    resolveSemanticColor(`${colorPalette}.muted`, colorMode) ?? "#e6e6e6";
  const emphasized =
    resolveSemanticColor(`${colorPalette}.emphasized`, colorMode) ?? "#ccccc";
  const solid =
    resolveSemanticColor(`${colorPalette}.solid`, colorMode) ?? "#000000";

  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlSpace={"preserve"}
      width={boxSize}
      height={boxSize}
      viewBox={"0 0 15.74 15.6"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"7.73"} cy={"7.73"} r={"7.73"} fill={emphasized} />
        {/* Face overlay */}
        <circle cx={"7.73"} cy={"8.79"} r={"6.67"} fill={muted} />
        {/* Eyebrows */}
        <g>
          <polygon
            fill={solid}
            points={
              "4.51,2.42 5.43,3.11 4.31,3.11 4.31,3.55 5.41,3.55 4.41,3.99 4.36,4.69 6.92,3.54 4.65,1.7"
            }
          />
          <polygon
            fill={solid}
            points={
              "11.37,2.42 10.46,3.11 11.58,3.11 11.58,3.55 10.48,3.55 11.48,3.99 11.53,4.69 8.96,3.54 11.24,1.7"
            }
          />
        </g>
        {/* Mouth line */}
        <path
          fill={solid}
          d={
            "M12.16 5.6c-1.22,0.78 -2.67,1.24 -4.22,1.24 -1.56,0 -3,-0.46 -4.22,-1.24 0.01,0.16 0.03,0.33 0.06,0.48 1.2,0.76 2.63,1.2 4.16,1.2 1.53,0 2.96,-0.44 4.16,-1.2 0.03,-0.16 0.05,-0.32 0.06,-0.48z"
          }
        />
        {/* Tongue */}
        <path
          fill={muted}
          d={
            "M8.54 6.82c0.6,-0.72 0.79,-2.41 2.15,-2.51 0.71,-0.05 0.99,1.15 0.99,1.58 -0.94,0.52 -2.01,0.84 -3.14,0.93z"
          }
        />
        {/* Hand */}
        <path
          fill={emphasized}
          d={
            "M1.42 14.36c-1.83,-1.65 -1.5,-5.42 -1.14,-6.31 0.36,-0.89 -0.82,-3.25 0.64,-3.65 1.46,-0.39 1.98,2.71 2.16,2.86 0.18,0.15 2.36,-0.22 2.61,0.81 0.25,1.02 -0.19,1.58 -0.19,1.58 0,0 0.81,0.24 0.97,0.98 0.16,0.74 -0.44,1.4 -0.44,1.4 0,0 0.56,0.19 0.77,0.75 0.71,1.92 -3.83,2.96 -5.37,1.57z"
          }
        />
      </g>
    </svg>
  );
};
