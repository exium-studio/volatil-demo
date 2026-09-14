// src/design-system/components/emoji/ui/backup/emoji.surprised.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const EmojiSurprised = ({
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
  const subtle =
    resolveSemanticColor(`${colorPalette}.subtle`, colorMode) ?? "#ffffff";

  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlSpace={"preserve"}
      width={boxSize}
      height={boxSize}
      viewBox={"0 0 15.46 15.75"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"7.73"} cy={"8.02"} r={"7.73"} fill={emphasized} />
        {/* Mouth */}
        <ellipse fill={solid} cx={"7.73"} cy={"11.3"} rx={"1.42"} ry={"2.06"} />
        {/* Eyebrows */}
        <g>
          <path
            fill={solid}
            d={
              "M11.3 0.49c0.04,0.02 0.41,0.09 0.81,0.39 0.4,0.31 0.64,0.77 0.64,0.77l0.47 -0.18c0,0 -0.26,-0.62 -0.87,-1.03 -0.61,-0.41 -1.07,-0.45 -1.07,-0.45l0.01 0.49z"
            }
          />
          <path
            fill={solid}
            d={
              "M4.16 0.49c-0.04,0.02 -0.41,0.09 -0.81,0.39 -0.4,0.31 -0.64,0.77 -0.64,0.77l-0.47 -0.18c0,0 0.26,-0.62 0.87,-1.03 0.61,-0.41 1.07,-0.45 1.07,-0.45l-0.01 0.49z"
            }
          />
        </g>
        {/* Eyes */}
        <g>
          <g>
            <ellipse
              fill={subtle}
              cx={"4.46"}
              cy={"6.61"}
              rx={"1.77"}
              ry={"2.73"}
            />
            <ellipse
              fill={solid}
              cx={"4.46"}
              cy={"6.61"}
              rx={"0.63"}
              ry={"0.97"}
            />
          </g>
          <g>
            <ellipse
              fill={subtle}
              cx={"11"}
              cy={"6.61"}
              rx={"1.77"}
              ry={"2.73"}
            />
            <ellipse
              fill={solid}
              cx={"11"}
              cy={"6.61"}
              rx={"0.63"}
              ry={"0.97"}
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
