// src/design-system/components/emoji/ui/emoji-happy.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const EmojiHappy = ({
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
        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M5.46 4.98l4.55 0c-0.79,3.4 -0.88,4.22 -2.24,4.23 -1.35,0 -1.58,-0.87 -2.31,-4.23z"
          }
        />
        {/* Eyebrows */}
        <g>
          <polygon
            fill={solid}
            points={"4.39,2.4 5.66,3.08 4.29,3.51 4.24,4 6.78,3.19 4.53,1.89"}
          />
          <polygon
            fill={solid}
            points={
              "11.07,2.4 9.81,3.08 11.17,3.51 11.23,4 8.68,3.19 10.94,1.89"
            }
          />
        </g>
      </g>
    </svg>
  );
};
