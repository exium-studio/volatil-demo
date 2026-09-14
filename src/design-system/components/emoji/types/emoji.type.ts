// src/design-system/components/emoji/types/emoji.type.ts

import type { CenterProps } from "@/design-system/components/layout/types/center.type";

export type EmojiKey =
  | "shout"
  | "wicked"
  | "angry"
  | "funny"
  | "speechless"
  | "love"
  | "cool"
  | "laugh"
  | "embarassed"
  | "rollingEyes"
  | "poker"
  | "cry"
  | "happy"
  | "sulk"
  | "thinking"
  | "thumbUp"
  | "scream"
  | "surprised"
  | "sad";

export type EmojiProps = CenterProps & {
  emojiKey?: EmojiKey;
  colorPalette?: string;
  boxSize?: number;
};
