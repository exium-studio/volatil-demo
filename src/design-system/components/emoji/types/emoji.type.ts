// src/design-system/components/emoji/types/emoji.type.ts

import type { BoxProps } from "@/design-system/components/layout/types/box.type";

export type EmojiSize = "sm" | "md" | "lg" | "xl" | number;

export type EmojiProps = BoxProps & {
  size?: EmojiSize;
  colorPalette?: string;
};
