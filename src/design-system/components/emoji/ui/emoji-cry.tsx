// src/design-system/components/emoji/ui/emoji-cry.tsx

import { EmojiBase, type EmojiSvgProps } from "@/design-system/components/emoji/ui/emoji-base";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

const EmojiCrySvg = (props: EmojiSvgProps) => {
  const { colorPalette = "neutral", ...rest } = props;
  const solid = `var(--chakra-colors-${colorPalette}-solid, var(--chakra-colors-${colorPalette}-500, #000000))`;
  const muted = `var(--chakra-colors-${colorPalette}-muted, var(--chakra-colors-${colorPalette}-200, #cccccc))`;
  const sub = `var(--chakra-colors-${colorPalette}-subtle, var(--chakra-colors-${colorPalette}-100, #ffffff))`;

  return (
    <svg viewBox={"0 0 100 100"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"} {...rest}>
      <circle cx={"50"} cy={"50"} r={"48"} fill={sub} stroke={solid} strokeWidth={"3"} />

      {/* Closed Crying Eyes */}
      <line x1={"30"} y1={"38"} x2={"42"} y2={"38"} stroke={solid} strokeWidth={"4"} strokeLinecap={"round"} />
      <line x1={"58"} y1={"38"} x2={"70"} y2={"38"} stroke={solid} strokeWidth={"4"} strokeLinecap={"round"} />

      {/* Tear Drops */}
      <path d={"M 32 42 C 26 54 26 75 34 86 C 42 75 42 54 40 42 Z"} fill={muted} opacity={0.8} />
      <path d={"M 60 42 C 58 54 58 75 66 86 C 74 75 74 54 68 42 Z"} fill={muted} opacity={0.8} />

      {/* Crying Mouth */}
      <path d={"M 42 56 Q 50 72 58 56 Z"} fill={solid} />
    </svg>
  );
};

export const EmojiCry = (props: EmojiProps) => {
  return <EmojiBase SvgComponent={EmojiCrySvg} {...props} />;
};
