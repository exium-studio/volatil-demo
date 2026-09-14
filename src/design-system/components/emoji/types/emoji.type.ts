// src/design-system/components/emoji/types/emoji.type.ts

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
  | "rolling_eyes"
  | "poker"
  | "cry"
  | "happy"
  | "sulk"
  | "thinking"
  | "yummy"
  | "scream"
  | "surprised"
  | "sad";

export type EmojiProps = {
  colorPalette?: string;
  boxSize?: number;
};
