// src/design-system/components/emoji/ui/emoji.love.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiLove = (props: EmojiProps) => {
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
        {/* Heart eyes */}
        <g>
          <path
            fill={solid}
            fillRule={"nonzero"}
            d={
              "M4.27 4.3c0.35,-0.59 0.71,-0.88 1.42,-0.88 0.78,0 1.42,0.53 1.42,1.18 0,1.18 -1.42,2.35 -2.84,3.53 -1.42,-1.18 -2.84,-2.35 -2.84,-3.53 0,-0.65 0.64,-1.18 1.42,-1.18 0.71,0 1.06,0.29 1.42,0.88z"
            }
          />
          <path
            fill={solid}
            fillRule={"nonzero"}
            d={
              "M11.19 4.3c0.35,-0.59 0.71,-0.88 1.42,-0.88 0.78,0 1.42,0.53 1.42,1.18 0,1.18 -1.42,2.35 -2.84,3.53 -1.42,-1.18 -2.84,-2.35 -2.84,-3.53 0,-0.65 0.64,-1.18 1.42,-1.18 0.71,0 1.06,0.29 1.42,0.88z"
            }
          />
        </g>

        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M7.67 9.53c-0.5,0 -0.97,-0.06 -1.38,-0.17 -0.36,-0.1 -0.68,-0.23 -0.93,-0.39 -0.17,0.04 -0.32,0.13 -0.44,0.26 -0.14,0.18 -0.22,0.37 -0.22,0.57 0,0.2 0.08,0.4 0.22,0.57 0.44,0.55 1.51,0.94 2.75,0.94 1.24,0 2.31,-0.39 2.75,-0.94 0.14,-0.18 0.22,-0.37 0.22,-0.57 0,-0.2 -0.08,-0.4 -0.22,-0.57 -0.11,-0.13 -0.26,-0.22 -0.44,-0.26 -0.25,0.16 -0.57,0.29 -0.93,0.39 -0.41,0.11 -0.88,0.17 -1.38,0.17z"
          }
        />
      </g>
    </svg>
    </Center>
  );
};
