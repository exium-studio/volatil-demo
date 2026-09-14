// src/design-system/components/emoji/ui/emoji-angry.tsx

import { EmojiBase, type EmojiSvgProps } from "@/design-system/components/emoji/ui/emoji-base";
import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";

const EmojiAngrySvg = (props: EmojiSvgProps) => {
  const { colorPalette = "neutral", ...rest } = props;
  const solid = `var(--chakra-colors-${colorPalette}-solid, var(--chakra-colors-${colorPalette}-500, #000000))`;
  const emp = `var(--chakra-colors-${colorPalette}-emphasized, var(--chakra-colors-${colorPalette}-300, #e6e6e6))`;
  const sub = `var(--chakra-colors-${colorPalette}-subtle, var(--chakra-colors-${colorPalette}-100, #ffffff))`;

  return (
    <svg viewBox={"0 0 100 100"} fill={"none"} xmlns={"http://www.w3.org/2000/svg"} {...rest}>
      <circle cx={"50"} cy={"50"} r={"48"} fill={emp} stroke={solid} strokeWidth={"3"} />

      {/* Slanted Angry Eyebrows */}
      <line x1={"28"} y1={"36"} x2={"44"} y2={"43"} stroke={solid} strokeWidth={"4.5"} strokeLinecap={"round"} />
      <line x1={"72"} y1={"36"} x2={"56"} y2={"43"} stroke={solid} strokeWidth={"4.5"} strokeLinecap={"round"} />

      {/* Eyes */}
      <circle cx={"37"} cy={"46"} r={"4.5"} fill={solid} />
      <circle cx={"63"} cy={"46"} r={"4.5"} fill={solid} />

      {/* Downward Angry Frown */}
      <path d={"M 38 66 Q 50 56 62 66"} fill={"none"} stroke={solid} strokeWidth={"4"} strokeLinecap={"round"} />
    </svg>
  );
};

export const EmojiAngry = (props: EmojiProps) => {
  return <EmojiBase SvgComponent={EmojiAngrySvg} {...props} />;
};
