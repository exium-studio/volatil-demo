// src/design-system/components/emoji/ui/emoji-laugh.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";
import { useColorMode } from "@/design-system/hooks/use-color-mode";

export const EmojiLaugh = ({
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
      viewBox={"0 0 16.33 16.33"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"8.17"} cy={"8.17"} r={"8.17"} fill={emphasized} />
        {/* Cheeks */}
        <g>
          <path
            fill={solid}
            d={
              "M13.26 9.59c-0.08,-0.02 -0.7,-0.33 -1.64,-0.33 -0.94,-0 -1.81,0.42 -1.81,0.42l-0.47 -0.64c0,0 0.97,-0.56 2.33,-0.48 1.36,0.08 2.03,0.57 2.03,0.57l-0.44 0.47z"
            }
          />
          <path
            fill={solid}
            d={
              "M3.08 9.59c0.08,-0.02 0.7,-0.33 1.64,-0.33 0.94,-0 1.81,0.42 1.81,0.42l0.47 -0.64c0,0 -0.97,-0.56 -2.33,-0.48 -1.36,0.08 -2.03,0.57 -2.03,0.57l0.44 0.47z"
            }
          />
        </g>
        {/* Eyes */}
        <g>
          <path
            fill={solid}
            d={
              "M13.64 8.09c-0.06,-0.05 -0.41,-0.55 -1.15,-0.94 -0.73,-0.39 -1.59,-0.43 -1.59,-0.43l-0.1 -0.7c0,0 0.99,-0.04 2.03,0.59 1.03,0.63 1.36,1.29 1.36,1.29l-0.54 0.19z"
            }
          />
          <path
            fill={solid}
            d={
              "M2.7 8.09c0.06,-0.05 0.41,-0.55 1.15,-0.94 0.73,-0.39 1.59,-0.43 1.59,-0.43l0.1 -0.7c0,0 -0.99,-0.04 -2.03,0.59 -1.03,0.63 -1.36,1.29 -1.36,1.29l0.54 0.19z"
            }
          />
        </g>
        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M3.35 12.34c0.07,1.48 2.2,2.68 4.82,2.68 2.62,0 4.75,-1.19 4.82,-2.68l-9.64 0z"
          }
        />
        {/* Teeth */}
        <path
          fill={subtle}
          d={
            "M12.69 11.31l-9.05 0c-0.19,0.3 -0.3,0.62 -0.3,0.95 0,0.03 0,0.05 0,0.07l9.64 0c0,-0.02 0,-0.05 0,-0.07 0,-0.33 -0.1,-0.65 -0.3,-0.95z"
          }
        />
        {/* Dimples */}
        <g>
          <path
            fill={subtle}
            d={
              "M2.57 9.9c0,0 -1.8,0.97 -1.98,1.7 -0.18,0.72 0.82,1.41 1.42,0.87 0.6,-0.53 0.56,-2.57 0.56,-2.57z"
            }
          />
          <path
            fill={subtle}
            d={
              "M13.76 9.9c0,0 1.8,0.97 1.98,1.7 0.18,0.72 -0.82,1.41 -1.42,0.87 -0.6,-0.53 -0.56,-2.57 -0.56,-2.57z"
            }
          />
        </g>
      </g>
    </svg>
  );
};
