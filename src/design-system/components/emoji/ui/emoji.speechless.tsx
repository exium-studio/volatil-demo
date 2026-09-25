// src\design-system\components\emoji\ui\emoji.speechless.tsx

// src\design-system\components\emoji\ui\emoji.speechless.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiSpeechless = (props: EmojiProps) => {
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
              "M1.89 6.4l4.66 0 0 0.5c0,0.7 -0.57,1.27 -1.27,1.27 -0.7,0 -1.27,-0.57 -1.27,-1.27l-2.12 0 0 -0.5z"
            }
          />
          <path
            fill={solid}
            d={
              "M9.19 6.4l4.66 0 0 0.5c0,0.7 -0.57,1.27 -1.27,1.27 -0.7,0 -1.27,-0.57 -1.27,-1.27l-2.12 0 0 -0.5z"
            }
          />
          {/* Mouth */}
          <path
            fill={solid}
            d={
              "M8.33 11.11c1.08,-0.75 2.38,-1.2 3.79,-1.23 -0.07,-0.16 -0.15,-0.31 -0.25,-0.44 -1.55,0.04 -2.98,0.58 -4.12,1.48 0,0.04 0.01,0.08 0.01,0.12 0.2,0 0.39,0.02 0.57,0.07z"
            }
          />
        </g>
      </svg>
    </Center>
  );
};
