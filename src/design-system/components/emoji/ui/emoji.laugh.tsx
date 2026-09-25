// src\design-system\components\emoji\ui\emoji.laugh.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import { Center } from "@/design-system/components/layout/ui/center";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiLaugh = (props: EmojiProps) => {
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
        {/* Cheeks */}
        <g>
          <path
            fill={solid}
            d={
              "M12.55 9.07c-0.08,-0.02 -0.66,-0.31 -1.55,-0.31 -0.89,-0.00 -1.71,0.40 -1.71,0.40l-0.44 -0.61c0.00,0.00 0.92,-0.53 2.20,-0.45 1.29,0.08 1.92,0.54 1.92,0.54l-0.42 0.44z"
            }
          />
          <path
            fill={solid}
            d={
              "M2.91 9.07c0.08,-0.02 0.66,-0.31 1.55,-0.31 0.89,-0.00 1.71,0.40 1.71,0.40l0.44 -0.61c0.00,0.00 -0.92,-0.53 -2.20,-0.45 -1.29,0.08 -1.92,0.54 -1.92,0.54l0.42 0.44z"
            }
          />
        </g>
        {/* Eyes */}
        <g>
          <path
            fill={solid}
            d={
              "M12.91 7.65c-0.06,-0.05 -0.39,-0.52 -1.09,-0.89 -0.69,-0.37 -1.50,-0.41 -1.50,-0.41l-0.09 -0.66c0.00,0.00 0.94,-0.04 1.92,0.56 0.97,0.60 1.29,1.22 1.29,1.22l-0.51 0.18z"
            }
          />
          <path
            fill={solid}
            d={
              "M2.55 7.65c0.06,-0.05 0.39,-0.52 1.09,-0.89 0.69,-0.37 1.50,-0.41 1.50,-0.41l0.09 -0.66c0.00,0.00 -0.94,-0.04 -1.92,0.56 -0.97,0.60 -1.29,1.22 -1.29,1.22l0.51 0.18z"
            }
          />
        </g>
        {/* Mouth */}
        <path
          fill={solid}
          d={
            "M3.17 11.68c0.07,1.40 2.08,2.54 4.56,2.54 2.48,0.00 4.49,-1.13 4.56,-2.54l-9.12 0.00z"
          }
        />
        {/* Teeth */}
        <path
          fill={subtle}
          d={
            "M12.01 10.70l-8.56 0.00c-0.18,0.28 -0.28,0.59 -0.28,0.90 0.00,0.03 0.00,0.05 0.00,0.07l9.12 0.00c0.00,-0.02 0.00,-0.05 0.00,-0.07 0.00,-0.31 -0.09,-0.61 -0.28,-0.90z"
          }
        />
        {/* Dimples */}
        <g>
          <path
            fill={subtle}
            d={
              "M2.43 9.37c0.00,0.00 -1.70,0.92 -1.87,1.61 -0.17,0.68 0.78,1.33 1.34,0.82 0.57,-0.50 0.53,-2.43 0.53,-2.43z"
            }
          />
          <path
            fill={subtle}
            d={
              "M13.02 9.37c0.00,0.00 1.70,0.92 1.87,1.61 0.17,0.68 -0.78,1.33 -1.34,0.82 -0.57,-0.50 -0.53,-2.43 -0.53,-2.43z"
            }
          />
        </g>
      </g>
    </svg>
    </Center>
  );
};
