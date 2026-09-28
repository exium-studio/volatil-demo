// src/design-system/components/emoji/ui/emoji.poker.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiPoker = (props: EmojiProps) => {
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
        <g>
          {/* Eyes */}
          <circle cx={"4.98"} cy={"4.25"} r={"0.97"} fill={solid} />
          <circle cx={"10.48"} cy={"4.25"} r={"0.97"} fill={solid} />
        </g>
        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M5.91 6.22l1.7 0 1.94 0c0.17,0 0.31,0.14 0.31,0.31l0 0c0,0.17 -0.14,0.31 -0.31,0.31l-2 0 -1.64 0c-0.17,0 -0.31,-0.14 -0.31,-0.31l0 0c0,-0.17 0.14,-0.31 0.31,-0.31z"
          }
        />
      </g>
    </svg>
    </Center>
  );
};
