// src/design-system/components/emoji/ui/emoji.funny.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiFunny = (props: EmojiProps) => {
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
      viewBox={"0 0 16.33 16.33"}
    >
      <g>
        {/* Background circle */}
        <circle cx={"7.73"} cy={"7.73"} r={"7.73"} fill={emphasized} />
        {/* Face overlay */}
        <circle cx={"7.73"} cy={"8.79"} r={"6.67"} fill={muted} />
        {/* Eye */}
        <circle fill={solid} cx={"5"} cy={"3.96"} r={"1.02"} />
        {/* Spinning eye */}
        <polygon
          fill={solid}
          points={
            "11.78,3.35 10.44,4.06 11.89,4.52 11.94,5.04 9.25,4.18 11.64,2.8"
          }
        />
        {/* Mouth */}
        <path
          fill={emphasized}
          d={
            "M6.2 6.65c-0.46,1.21 -1.57,3 -0.94,4.93 0.65,2.01 2.72,1.59 2.72,1.59 0,0 2.07,0.42 2.72,-1.59 0.63,-1.92 -0.48,-3.72 -0.94,-4.93l-3.55 0z"
          }
        />
        {/* Mouth top line */}
        <rect
          fill={solid}
          x={"5.98"}
          y={"6.23"}
          width={"4.18"}
          height={"0.43"}
        />
      </g>
    </svg>
  );
};
