// src/design-system/components/emoji/ui/emoji-thinking.tsx

import { EmojiBase, type EmojiSvgProps } from "@/design-system/components/emoji/ui/emoji-base";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

const EmojiThinkingSvg = (props: EmojiSvgProps) => {
  const { colorPalette = "neutral", ...rest } = props;
  const solid = `var(--chakra-colors-${colorPalette}-solid, var(--chakra-colors-${colorPalette}-500, #000000))`;
  const emp = `var(--chakra-colors-${colorPalette}-emphasized, var(--chakra-colors-${colorPalette}-300, #e6e6e6))`;
  const sub = `var(--chakra-colors-${colorPalette}-subtle, var(--chakra-colors-${colorPalette}-100, #ffffff))`;

  return (
    <svg viewBox={"0 0 100 100"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"} {...rest}>
      <circle cx={"50"} cy={"50"} r={"48"} fill={sub} stroke={solid} strokeWidth={"3"} />

      {/* Upward Looking Eyes & Tilted Brow */}
      <line x1={"30"} y1={"30"} x2={"44"} y2={"33"} stroke={solid} strokeWidth={"3.5"} strokeLinecap={"round"} />
      <circle cx={"37"} cy={"40"} r={"4"} fill={solid} />
      <circle cx={"63"} cy={"40"} r={"4"} fill={solid} />

      {/* Pondering Flat Mouth */}
      <line x1={"40"} y1={"58"} x2={"60"} y2={"55"} stroke={solid} strokeWidth={"3.5"} strokeLinecap={"round"} />

      {/* Thinking Hand Under Chin */}
      <path d={"M 32 72 Q 48 68 64 72"} fill={"none"} stroke={solid} strokeWidth={"4"} strokeLinecap={"round"} />
      <ellipse cx={"65"} cy={"72"} rx={"6"} ry={"4"} fill={emp} stroke={solid} strokeWidth={"2"} />
    </svg>
  );
};

export const EmojiThinking = (props: EmojiProps) => {
  return <EmojiBase SvgComponent={EmojiThinkingSvg} {...props} />;
};
