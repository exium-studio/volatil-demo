// src/design-system/components/emoji/ui/emoji.wicked.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiWicked = (props: EmojiProps) => {
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
      viewBox={"0 0 18.9 19.97"}
    >
      <g>
        {/* Background with horns */}
        <path
          fill={emphasized}
          d={
            "M9.45 2.41c1.86,0 3.59,0.58 5.01,1.57 1.85,-0.36 3.31,-2.26 3.85,-3.99 0,0 0.91,3.5 0.47,5.49 -0.25,1.13 -0.68,2.19 -1.01,2.89 0.3,0.88 0.46,1.83 0.46,2.81 0,4.85 -3.93,8.78 -8.78,8.78 -4.85,0 -8.78,-3.93 -8.78,-8.78 0,-0.98 0.16,-1.93 0.46,-2.81 -0.33,-0.71 -0.76,-1.76 -1.01,-2.89 -0.44,-1.99 0.47,-5.49 0.47,-5.49 0.54,1.73 2,3.63 3.85,3.99 1.42,-0.99 3.15,-1.57 5.01,-1.57z"
          }
        />
        {/* Face overlay */}
        <circle cx={"9.45"} cy={"12.02"} r={"7.95"} fill={muted} />
        {/* Smile */}
        <path
          fill={solid}
          d={
            "M13.09 14.6c-1.37,0.95 -3.02,1.52 -4.81,1.56 0.08,0.2 0.19,0.39 0.31,0.56 1.97,-0.05 3.79,-0.74 5.23,-1.88 -0,-0.05 -0.01,-0.1 -0.01,-0.15 -0.25,-0 -0.49,-0.03 -0.72,-0.09z"
          }
        />
        {/* Eyes */}
        <g>
          <path
            fill={solid}
            d={"M3.62 11.33l5.15 1.06c-1.86,2.57 -4.25,2.09 -5.15,-1.06z"}
          />
          <path
            fill={solid}
            d={"M15.28 11.33l-5.15 1.06c1.86,2.57 4.25,2.09 5.15,-1.06z"}
          />
        </g>
      </g>
    </svg>
    </Center>
  );
};
