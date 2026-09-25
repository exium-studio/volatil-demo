// src\design-system\components\emoji\ui\emoji.sulk.tsx

// src\design-system\components\emoji\ui\emoji.sulk.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiSulk = (props: EmojiProps) => {
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
      viewBox={"0 0 16.33 16.33"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"7.73"} cy={"7.73"} r={"7.73"} fill={emphasized} />
        {/* Face overlay */}
        <circle cx={"7.73"} cy={"8.26"} r={"7.2"} fill={muted} />
        {/* Eyes */}
        <path
          fill={solid}
          d={
            "M9.8 5.37c0,0.03 0,0.06 0,0.1 0,0.97 -1.06,1.76 -2.36,1.76 -1.3,0 -2.36,-0.79 -2.36,-1.76 0,-0.03 0,-0.06 0,-0.1l4.71 0z"
          }
        />
        <path
          fill={solid}
          d={
            "M16.19 5.37c0,0.03 0,0.06 0,0.1 0,0.97 -1.06,1.76 -2.36,1.76 -1.3,0 -2.36,-0.79 -2.36,-1.76 0,-0.03 0,-0.06 0,-0.1l4.71 0z"
          }
        />
        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M9.26 10.59c0,-0.97 -0.35,-1.82 -0.9,-2.37 -0.09,-0.01 -0.18,-0.02 -0.27,-0.02 -0.16,0 -0.32,0.02 -0.48,0.05 0.53,0.55 0.86,1.39 0.86,2.34 0,0.95 -0.34,1.79 -0.86,2.34 0.15,0.03 0.31,0.05 0.48,0.05 0.09,0 0.18,-0.01 0.27,-0.02 0.55,-0.55 0.9,-1.41 0.9,-2.37z"
          }
        />
        <path
          fill={solid}
          d={
            "M10.52 8.7c-0.58,-0 -1.13,0.13 -1.58,0.36 0.1,0.21 0.17,0.43 0.23,0.67 0.4,-0.16 0.87,-0.25 1.35,-0.25 0.92,0 1.75,0.33 2.28,0.85 0.03,-0.15 0.05,-0.31 0.05,-0.47 0,-0.09 -0.01,-0.18 -0.02,-0.27 -0.54,-0.53 -1.37,-0.88 -2.32,-0.88z"
          }
        />
        {/* Hair detail */}
        <path
          fill={solid}
          d={
            "M6.58 2.67c0.47,1.89 2.95,2.52 4.25,1.47 1.17,0.7 3.47,0.67 3.57,-1l-0.31 -0.08c-0.36,1.16 -1.96,1.24 -2.81,0.72 0,0 0.56,-1.09 -0.48,-1.11 -1.04,-0.02 -0.59,1.06 -0.59,1.06 -0.93,0.81 -2.9,0.14 -3.11,-1.18l-0.52 0.11zm4.22 0.97c0,0 -0.36,-0.34 -0.22,-0.48 0.14,-0.14 0.44,-0.06 0.42,0.08 -0.03,0.14 -0.2,0.4 -0.2,0.4z"
          }
        />
      </g>
    </svg>
    </Center>
  );
};
