// src/design-system/components/emoji/ui/emoji.rolling-eyes.tsx

// src\design-system\components\emoji\ui\emoji.rolling-eyes.tsx

// src\design-system\components\emoji\ui\emoji.rolling-eyes.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiRollingEyes = (props: EmojiProps) => {
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
      viewBox={"0 0 16.33 16.33"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"7.73"} cy={"7.73"} r={"7.73"} fill={emphasized} />
        {/* Face overlay */}
        <circle cx={"7.73"} cy={"8.26"} r={"7.2"} fill={muted} />
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
    </Center>
  );
};
