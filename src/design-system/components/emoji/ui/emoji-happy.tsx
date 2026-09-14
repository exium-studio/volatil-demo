// src/design-system/components/emoji/ui/emoji-happy.tsx

import { EmojiBase, type EmojiSvgProps } from "@/design-system/components/emoji/ui/emoji-base";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

const EmojiHappySvg = (props: EmojiSvgProps) => {
  const { colorPalette = "neutral", ...rest } = props;
  const solid = `var(--chakra-colors-${colorPalette}-solid, var(--chakra-colors-${colorPalette}-500, #000000))`;
  const emp = `var(--chakra-colors-${colorPalette}-emphasized, var(--chakra-colors-${colorPalette}-300, #e6e6e6))`;
  const sub = `var(--chakra-colors-${colorPalette}-subtle, var(--chakra-colors-${colorPalette}-100, #ffffff))`;

  return (
    <svg viewBox={"0 0 100 100"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"} {...rest}>
      <circle cx={"50"} cy={"50"} r={"48"} fill={sub} stroke={solid} strokeWidth={"3"} />

      {/* Squeezed Happy Eyes (> <) */}
      <path
        d={"M 30 38 L 40 43 L 30 48"}
        fill={"none"}
        stroke={solid}
        strokeWidth={"4"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      />
      <path
        d={"M 70 38 L 60 43 L 70 48"}
        fill={"none"}
        stroke={solid}
        strokeWidth={"4"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      />

      {/* Open Mouth with Tongue */}
      <path d={"M 38 58 Q 50 78 62 58 Z"} fill={solid} />
      <path d={"M 42 66 Q 50 76 58 66 Z"} fill={emp} />
    </svg>
  );
};

export const EmojiHappy = (props: EmojiProps) => {
  return <EmojiBase SvgComponent={EmojiHappySvg} {...props} />;
};
