// src/design-system/components/emoji/ui/emoji.surprised.tsx

import { useEmojiColors } from "@/design-system/components/emoji/hooks/use-emoji-colors";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

export const EmojiSurprised = (props: EmojiProps) => {
  // Props
  const { colorPalette = "gray", boxSize = 24 } = props;

  // Hooks
  const { subtle, muted, emphasized, solid } = useEmojiColors(colorPalette);

  return (
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
        <circle cx={"7.73"} cy={"8.79"} r={"6.67"} fill={muted} />
        {/* Mouth */}
        <ellipse fill={solid} cx={"7.73"} cy={"11.3"} rx={"1.42"} ry={"2.06"} />
        {/* Eyebrows */}
        <g transform={"translate(0, 1.35)"}>
          <path
            fill={solid}
            d={
              "M11.3 0.49c0.04,0.02 0.41,0.09 0.81,0.39 0.4,0.31 0.64,0.77 0.64,0.77l0.47 -0.18c0,0 -0.26,-0.62 -0.87,-1.03 -0.61,-0.41 -1.07,-0.45 -1.07,-0.45l0.01 0.49z"
            }
          />
          <path
            fill={solid}
            d={
              "M4.16 0.49c-0.04,0.02 -0.41,0.09 -0.81,0.39 -0.4,0.31 -0.64,0.77 -0.64,0.77l-0.47 -0.18c0,0 0.26,-0.62 0.87,-1.03 0.61,-0.41 1.07,-0.45 1.07,-0.45l-0.01 0.49z"
            }
          />
        </g>
        {/* Eyes */}
        <g>
          <g>
            <ellipse
              fill={subtle}
              cx={"4.46"}
              cy={"6.61"}
              rx={"1.77"}
              ry={"2.73"}
            />
            <ellipse
              fill={solid}
              cx={"4.46"}
              cy={"6.61"}
              rx={"0.63"}
              ry={"0.97"}
            />
          </g>
          <g>
            <ellipse
              fill={subtle}
              cx={"11"}
              cy={"6.61"}
              rx={"1.77"}
              ry={"2.73"}
            />
            <ellipse
              fill={solid}
              cx={"11"}
              cy={"6.61"}
              rx={"0.63"}
              ry={"0.97"}
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
