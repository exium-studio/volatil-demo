// src/design-system/components/emoji/ui/emoji.cry.tsx

// src\design-system\components\emoji\ui\emoji.cry.tsx

// src\design-system\components\emoji\ui\emoji.cry.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiCry = (props: EmojiProps) => {
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
      <defs>
        <clipPath id={"emoji-cry-clip"}>
          <circle cx={"7.73"} cy={"7.73"} r={"7.73"} />
        </clipPath>
      </defs>
      <g clipPath={"url(#emoji-cry-clip)"}>
        {/* Background circle */}
        <circle cx={"7.73"} cy={"7.73"} r={"7.73"} fill={emphasized} />
        {/* Face overlay */}
        <circle cx={"7.73"} cy={"8.26"} r={"7.2"} fill={muted} />
        {/* Eyebrows */}
        <g>
          <path
            fill={solid}
            d={
              "M3.83 3.64c0.06,0 0.53,0.12 1.16,-0.02 0.64,-0.14 1.17,-0.56 1.17,-0.56l0.45 0.47c0,0 -0.63,0.58 -1.57,0.73 -0.94,0.15 -1.57,-0.08 -1.57,-0.08l0.36 -0.54z"
            }
          />
          <path
            fill={solid}
            d={
              "M11.63 3.64c-0.06,0 -0.53,0.12 -1.16,-0.02 -0.64,-0.14 -1.17,-0.56 -1.17,-0.56l-0.45 0.47c0,0 0.63,0.58 1.57,0.73 0.94,0.15 1.57,-0.08 1.57,-0.08l-0.36 -0.54z"
            }
          />
        </g>
        {/* Eyes + mouth */}
        <path
          fill={solid}
          d={
            "M6.49 8.67c-0.31,0.55 -1.64,1 -2.49,0.21 -0.85,-0.79 -0.76,-2.65 0.61,-3.34 1.37,-0.69 2.24,0.29 2.64,0.36 0.19,0.04 0.78,0.04 0.98,0 0.4,-0.07 1.26,-1.05 2.64,-0.36 1.37,0.69 1.46,2.55 0.61,3.34 -0.85,0.79 -2.18,0.35 -2.49,-0.21 -0.38,-0.68 -2.11,-0.68 -2.49,0z"
          }
        />
        {/* Tears */}
        <g>
          <path
            fill={subtle}
            d={
              "M3.47 4.18c0,0 -1.24,1.4 -2.23,3.09 -0.38,0.65 -0.76,1.39 -1.07,2.05 0.35,1.7 1.26,3.19 2.52,4.28 0.04,-1.04 0.19,-2.7 0.75,-4.47 0.07,-0.23 0.15,-0.46 0.23,-0.68 -0.46,-0.9 -0.22,-2.32 0.94,-2.9 0.2,-0.1 0.4,-0.17 0.58,-0.21 0.57,-0.94 1.02,-1.51 1.02,-1.51 -0.28,0.17 -0.68,0.36 -1.17,0.44 -0.94,0.15 -1.57,-0.08 -1.57,-0.08z"
            }
          />
          <path
            fill={subtle}
            d={
              "M12 4.18c0,0 1.24,1.4 2.23,3.09 0.38,0.65 0.76,1.39 1.07,2.05 -0.35,1.7 1.26,3.19 -2.52,4.28 -0.04,-1.04 -0.19,-2.7 -0.75,-4.47 -0.07,-0.23 -0.15,-0.46 -0.23,-0.68 0.46,-0.9 0.22,-2.32 -0.94,-2.9 -0.2,-0.1 -0.4,-0.17 -0.58,-0.21 -0.57,-0.94 -1.02,-1.51 -1.02,-1.51 0.28,0.17 0.68,0.36 1.17,0.44 0.94,0.15 1.57,-0.08 1.57,-0.08z"
            }
          />
        </g>
      </g>
    </svg>
    </Center>
  );
};
