// src/design-system/components/emoji/ui/emoji.sad.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiSad = (props: EmojiProps) => {
  // Props
  const { colorPalette = "gray", boxSize = 24 } = props;

  // Hooks
  const { subtle, muted, emphasized, solid } = useEmojiColors(colorPalette);

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
          <path
            fill={solid}
            d={
              "M12.59 10.3c-0.07,-0.02 -0.67,-0.02 -1.39,-0.39 -0.72,-0.37 -1.23,-1.04 -1.23,-1.04l-0.62 0.3c0,0 0.52,0.82 1.6,1.29 1.08,0.48 1.79,0.37 1.79,0.37l-0.15 -0.54z"
            }
          />
          <path
            fill={solid}
            d={
              "M3.74 10.3c0.07,-0.02 0.67,-0.02 1.39,-0.39 0.72,-0.37 1.23,-1.04 1.23,-1.04l0.62 0.3c0,0 -0.52,0.82 -1.6,1.29 -1.08,0.48 -1.79,0.37 -1.79,0.37l0.15 -0.54z"
            }
          />
        </g>
        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M9.07 13.24c-0.04,-0.06 -0.95,-1.4 -0.95,-1.4l-0.87 1.35 -0.27 -0.42 1.18 -1.74 1.19 1.73 -0.29 0.47z"
          }
        />
        {/* Tear */}
        <path
          fill={subtle}
          d={
            "M11.86 11.05c0,0 -0.92,1.67 -0.69,2.32 0.23,0.65 1.35,0.68 1.54,-0.03 0.2,-0.72 -0.86,-2.29 -0.86,-2.29z"
          }
        />
      </g>
    </svg>
  );
};
