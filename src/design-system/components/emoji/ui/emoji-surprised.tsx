// src/design-system/components/emoji/ui/emoji-surprised.tsx

import { EmojiBase, type EmojiSvgProps } from "@/design-system/components/emoji/ui/emoji-base";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

const EmojiSurprisedSvg = (props: EmojiSvgProps) => {
  const { colorPalette = "neutral", ...rest } = props;
  const solid = `var(--chakra-colors-${colorPalette}-solid, var(--chakra-colors-${colorPalette}-500, #000000))`;
  const sub = `var(--chakra-colors-${colorPalette}-subtle, var(--chakra-colors-${colorPalette}-100, #ffffff))`;

  return (
    <svg viewBox={"0 0 100 100"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"} {...rest}>
      <circle cx={"50"} cy={"50"} r={"48"} fill={sub} stroke={solid} strokeWidth={"3"} />

      {/* High Arched Brows */}
      <path d={"M 30 28 Q 38 20 46 28"} fill={"none"} stroke={solid} strokeWidth={"3.5"} strokeLinecap={"round"} />
      <path d={"M 54 28 Q 62 20 70 28"} fill={"none"} stroke={solid} strokeWidth={"3.5"} strokeLinecap={"round"} />

      {/* Wide Surprised Eyes */}
      <circle cx={"38"} cy={"40"} r={"6"} fill={sub} stroke={solid} strokeWidth={"2"} />
      <circle cx={"38"} cy={"40"} r={"2.5"} fill={solid} />
      <circle cx={"62"} cy={"40"} r={"6"} fill={sub} stroke={solid} strokeWidth={"2"} />
      <circle cx={"62"} cy={"40"} r={"2.5"} fill={solid} />

      {/* "O" Mouth */}
      <ellipse cx={"50"} cy={"62"} rx={"7"} ry={"11"} fill={solid} />
    </svg>
  );
};

export const EmojiSurprised = (props: EmojiProps) => {
  return <EmojiBase SvgComponent={EmojiSurprisedSvg} {...props} />;
};
