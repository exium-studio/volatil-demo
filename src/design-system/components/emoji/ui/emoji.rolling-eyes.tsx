// src/design-system/components/emoji/ui/emoji.rollingEyes.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const EmojiRollingEyes = ({
  colorPalette = "gray",
  boxSize = 24,
}: EmojiProps) => {
  // Hooks
  const { colorMode } = useColorMode();

  // Colors
  const subtle =
    resolveSemanticColor(`${colorPalette}.subtle`, colorMode) ?? "#ffffff";
  const muted =
    resolveSemanticColor(`${colorPalette}.muted`, colorMode) ?? "#e6e6e6";
  const emphasized =
    resolveSemanticColor(`${colorPalette}.emphasized`, colorMode) ?? "#cccccc";
  const solid =
    resolveSemanticColor(`${colorPalette}.solid`, colorMode) ?? "#000000";

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
        <circle cx={"7.73"} cy={"7.73"} r={"7.73"} fill={emphasized} />
        {/* Face overlay */}
        <circle cx={"7.73"} cy={"8.79"} r={"6.67"} fill={muted} />
        {/* Eyes */}
        <g>
          <g>
            <ellipse
              fill={subtle}
              cx={"4.58"}
              cy={"7.12"}
              rx={"2.2"}
              ry={"2.72"}
            />
            <path
              fill={solid}
              d={
                "M4.58 4.39c0.38,0 0.74,0.12 1.05,0.33 0.06,0.14 0.09,0.29 0.09,0.45 0,0.63 -0.51,1.14 -1.14,1.14 -0.63,0 -1.14,-0.51 -1.14,-1.14 0,-0.16 0.03,-0.31 0.09,-0.45 0.31,-0.21 0.67,-0.33 1.05,-0.33z"
              }
            />
          </g>
          <g>
            <ellipse
              fill={subtle}
              cx={"11.75"}
              cy={"7.12"}
              rx={"2.2"}
              ry={"2.72"}
            />
            <path
              fill={solid}
              d={
                "M11.75 4.39c0.38,0 0.74,0.12 1.05,0.33 0.06,0.14 0.09,0.29 0.09,0.45 0,0.63 -0.51,1.14 -1.14,1.14 -0.63,0 -1.14,-0.51 -1.14,-1.14 0,-0.16 0.03,-0.31 0.09,-0.45 0.31,-0.21 0.67,-0.33 1.05,-0.33z"
              }
            />
          </g>
        </g>
        {/* Mouth */}
        <polygon
          fill={solid}
          points={"6.96,13.51 9.66,13.09 9.96,13.65 6.91,14.22"}
        />
      </g>
    </svg>
  );
};
