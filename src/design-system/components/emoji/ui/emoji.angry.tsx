// src/design-system/components/emoji/ui/emoji.angry.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiAngry = (props: EmojiProps) => {
  // Props
  const { colorPalette = "gray", boxSize = 24, ...restProps } = props;

  // Hooks
  const { muted, emphasized, solid } = useEmojiColors(colorPalette);

  return (
    <Center {...restProps}>
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
        <circle cx={"7.73"} cy={"8.26"} r={"7.2"} fill={muted} />
        {/* Eyes */}
        <g>
          <path
            fill={solid}
            d={
              "M5.9 9.3c0.05,0.12 0.08,0.25 0.08,0.39 0,0.56 -0.46,1.02 -1.02,1.02 -0.56,0 -1.02,-0.46 -1.02,-1.02 0,-0.28 0.11,-0.53 0.3,-0.72l-1.52 -0.3 0.43 -0.27 3.12 0.68 0.12 0.31 -0.48 -0.09z"
            }
          />
          <path
            fill={solid}
            d={
              "M9.56 9.3c-0.05,0.12 -0.08,0.25 -0.08,0.39 0,0.56 0.46,1.02 1.02,1.02 0.56,0 1.02,-0.46 1.02,-1.02 0,-0.28 -0.11,-0.53 -0.3,-0.72l1.52 -0.3 -0.43 -0.27 -3.12 0.68 -0.12 0.31 0.48 -0.09z"
            }
          />
        </g>
        {/* Mouth */}
        <polygon
          fill={solid}
          points={
            "7.73,11.81 7.12,12.6 6.78,12.37 7.73,11.3 8.68,12.37 8.34,12.6"
          }
        />
        {/* Angry symbol */}
        <g>
          <path
            fill={solid}
            d={
              "M11.13 4.6c0.58,-0.18 0.91,-0.79 0.74,-1.38l-0.13 -0.44c-0.01,-0.02 -0.02,-0.05 -0.03,-0.07l-0.35 0.11c0.01,0.02 0.02,0.05 0.03,0.07l0.13 0.44c0.12,0.39 -0.1,0.8 -0.49,0.92l-0.35 0.11 0.11 0.35 0.35 -0.11z"
            }
          />
          <path
            fill={solid}
            d={
              "M13.53 3.87c-0.58,0.18 -1.2,-0.16 -1.38,-0.74l-0.13 -0.44c-0.01,-0.02 -0.01,-0.05 -0.02,-0.07l0.35 -0.11c0.01,0.02 0.01,0.05 0.02,0.07l0.13 0.44c0.12,0.39 0.53,0.61 0.92,0.49l0.35 -0.11 0.11 0.35 -0.35 0.11z"
            }
          />
          <path
            fill={solid}
            d={
              "M11.2 4.83c0.58,-0.18 1.2,0.16 1.38,0.74l0.13 0.44c0.01,0.02 0.01,0.05 0.02,0.07l-0.35 0.11c-0,-0.03 -0.01,-0.05 -0.02,-0.07l-0.13 -0.44c-0.12,-0.39 -0.53,-0.61 -0.92,-0.49l-0.35 0.11 -0.11 -0.35 0.35 -0.11z"
            }
          />
          <path
            fill={solid}
            d={
              "M13.6 4.1c-0.58,0.18 -0.91,0.79 -0.74,1.38l0.13 0.44c0.01,0.02 0.02,0.05 0.03,0.07l0.35 -0.11c-0.01,-0.02 -0.02,-0.05 -0.03,-0.07l-0.13 -0.44c-0.12,-0.39 0.1,-0.8 0.49,-0.92l0.35 -0.11 -0.11 -0.35 -0.35 0.11z"
            }
          />
        </g>
      </g>
    </svg>
    </Center>
  );
};
