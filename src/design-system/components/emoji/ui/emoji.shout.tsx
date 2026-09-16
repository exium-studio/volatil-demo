// src/design-system/components/emoji/ui/emoji.shout.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiShout = (props: EmojiProps) => {
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
        {/* Eyebrows */}
        <g>
          <path
            fill={solid}
            d={
              "M6.69 4.15c-1.04,0.11 -2.6,-0.12 -3.41,-0.68 0,0 0.05,2.14 1.6,2.25 1.55,0.1 1.81,-1.57 1.81,-1.57z"
            }
          />
          <path
            fill={solid}
            d={
              "M8.78 4.15c1.04,0.11 2.6,-0.12 3.41,-0.68 0,0 -0.05,2.14 -1.6,2.25 -1.55,0.1 -1.81,-1.57 -1.81,-1.57z"
            }
          />
        </g>
        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M5.74 10.04c-0.48,-0.55 -0.01,-4.03 1.99,-4.02 2.01,-0.01 2.47,3.47 1.99,4.02 -0.45,0.52 -3.53,0.52 -3.99,0z"
          }
        />
        {/* Teeth shine */}
        <g>
          <path
            fill={subtle}
            d={
              "M6.79 6.32c-0.04,0.3 -0.17,1.07 -0.17,1.07l-0.27 -0.64c0.13,-0.17 0.28,-0.31 0.44,-0.43z"
            }
          />
          <path
            fill={subtle}
            d={
              "M8.67 6.32c0.04,0.3 0.17,1.07 0.17,1.07l0.27 -0.64c-0.13,-0.17 -0.28,-0.31 -0.44,-0.43z"
            }
          />
        </g>
      </g>
    </svg>
    </Center>
  );
};
