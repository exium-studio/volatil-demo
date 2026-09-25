// src\design-system\components\emoji\ui\emoji.embarassed.tsx

// src\design-system\components\emoji\ui\emoji.embarassed.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiEmbarassed = (props: EmojiProps) => {
  // Props
  const { colorPalette = "gray", boxSize = 24, ...restProps } = props;

  // Hooks
  const { subtle, muted, emphasized, solid } = useEmojiColors(colorPalette);

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
        <circle
          fill={solid}
          transform={
            "matrix(0.991671 0.128796 -0.128796 0.991671 2.20651 9.11924)"
          }
          r={"0.97"}
        />
        <circle
          fill={solid}
          transform={
            "matrix(0.991671 0.128796 -0.128796 0.991671 6.79246 9.99092)"
          }
          r={"0.97"}
        />
        {/* Eyebrow left */}
        <path
          fill={solid}
          d={
            "M1.03 7.12c0.04,-0.01 0.42,0.04 0.9,-0.12 0.48,-0.17 0.85,-0.53 0.85,-0.53l0.39 0.32c0,0 -0.44,0.51 -1.15,0.71 -0.71,0.2 -1.22,0.08 -1.22,0.08l0.23 -0.45z"
          }
        />
        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M8.8 7.99c-0.07,-0.02 -0.64,-0.02 -1.32,-0.37 -0.68,-0.35 -1.16,-0.98 -1.16,-0.98l-0.58 0.29c0,0 0.49,0.77 1.52,1.23 1.02,0.45 1.69,0.35 1.69,0.35l-0.14 -0.51z"
          }
        />
        {/* Sweat drop */}
        <path
          fill={solid}
          d={
            "M4.61 11.93c-0.07,0 -1.2,-0.05 -1.2,-0.05l0.56 1.41 -0.47 -0.02 -0.69 -1.87 1.59 0.05 0.21 0.48z"
          }
        />
        {/* Blush */}
        <path
          fill={subtle}
          d={
            "M12.22 3.15c0,0 -1.79,3.27 -1.35,4.55 0.44,1.28 2.64,1.34 3.03,-0.07 0.39,-1.4 -1.68,-4.48 -1.68,-4.48z"
          }
        />
      </g>
    </svg>
    </Center>
  );
};
