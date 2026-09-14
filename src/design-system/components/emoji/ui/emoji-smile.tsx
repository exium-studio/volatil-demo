// src/design-system/components/emoji/ui/emoji-smile.tsx

import { EmojiBase, type EmojiSvgProps } from "@/design-system/components/emoji/ui/emoji-base";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

const EmojiSmileSvg = (props: EmojiSvgProps) => {
  const { colorPalette = "neutral", ...rest } = props;
  const solid = `var(--chakra-colors-${colorPalette}-solid, var(--chakra-colors-${colorPalette}-500, #000000))`;
  const sub = `var(--chakra-colors-${colorPalette}-subtle, var(--chakra-colors-${colorPalette}-100, #ffffff))`;

  return (
    <svg viewBox={"0 0 100 100"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"} {...rest}>
      {/* Background Face Base */}
      <circle cx={"50"} cy={"50"} r={"48"} fill={sub} stroke={solid} strokeWidth={"3"} />

      {/* Eyes */}
      <circle cx={"35"} cy={"40"} r={"5"} fill={solid} />
      <circle cx={"65"} cy={"40"} r={"5"} fill={solid} />

      {/* Curved Smile */}
      <path
        d={"M 36 58 Q 50 72 64 58"}
        fill={"none"}
        stroke={solid}
        strokeWidth={"4"}
        strokeLinecap={"round"}
      />
    </svg>
  );
};

export const EmojiSmile = (props: EmojiProps) => {
  return <EmojiBase SvgComponent={EmojiSmileSvg} {...props} />;
};
