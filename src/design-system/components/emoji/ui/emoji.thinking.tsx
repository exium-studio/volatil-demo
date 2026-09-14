// src/design-system/components/emoji/ui/emoji.thinking.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiThinking = (props: EmojiProps) => {
  // Props
  const { colorPalette = "gray", boxSize = 24 } = props;

  // Hooks
  const { muted, emphasized, solid } = useEmojiColors(colorPalette);

  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlSpace={"preserve"}
      width={boxSize}
      height={boxSize}
      viewBox={"0 0 16.33 18.05"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"7.73"} cy={"7.73"} r={"7.73"} fill={emphasized} />
        {/* Face overlay */}
        <circle cx={"7.73"} cy={"8.79"} r={"6.67"} fill={muted} />
        {/* Eyes */}
        <circle
          fill={solid}
          transform={
            "matrix(0.991671 0.128796 -0.128796 0.991671 9.31651 5.89866)"
          }
          r={"1.03"}
        />
        <circle
          fill={solid}
          transform={
            "matrix(0.991671 0.128796 -0.128796 0.991671 4.39059 5.19104)"
          }
          r={"1.03"}
        />
        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M4.48 9.04c1.55,0.04 3.25,0.49 4.6,1.45 0.05,-0.2 0.07,-0.4 0.07,-0.6 -0.71,-0.49 -2.39,-1.7 -5.07,-1.42 0.18,0.25 0.25,0.38 0.39,0.57z"
          }
        />
        {/* Details */}
        <path
          fill={solid}
          d={
            "M11.66 4.75c-0.83,-0.28 -1.44,-0.85 -1.98,-1.81 -0.11,0.11 -0.2,0.24 -0.28,0.38 0.29,0.61 0.83,1.44 2.3,1.98 -0.03,-0.24 -0.02,-0.36 -0.04,-0.54z"
          }
        />
        <path
          fill={solid}
          d={
            "M3.21 2.04c0.65,-0.59 1.45,-0.84 2.55,-0.84 -0.05,-0.15 -0.11,-0.3 -0.19,-0.43 -0.68,-0.05 -1.66,0.02 -2.85,1.04 0.22,0.09 0.32,0.16 0.49,0.23z"
          }
        />
        {/* Thought bubble */}
        <path
          fill={emphasized}
          d={
            "M2.31 12.11c0,0 -0.89,1.71 -0.5,3.36 0.39,1.65 1.8,2.54 3.02,2.58 1.22,0.04 4.24,-0.88 4.47,-1.43 0.23,-0.54 -0.06,-1.15 -0.06,-1.15 0,0 0.37,-0.78 0.19,-1.17 -0.17,-0.39 -0.49,-0.68 -0.49,-0.68 0,0 1.71,-1.09 1.54,-1.83 -0.18,-0.74 -1.32,-1.03 -2.72,-0.43 -1.4,0.6 -2.96,1.03 -3.19,0.68 -0.23,-0.35 0.12,-2.47 -0.8,-2.45 -0.91,0.02 -1.47,2.5 -1.47,2.5z"
          }
        />
      </g>
    </svg>
  );
};
