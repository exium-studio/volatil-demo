// src/design-system/components/feedback/types/face-emoji.type.ts

import type { BoxProps } from "@/design-system/components/layout/types/box.type";

export type FaceEmojiVariant =
  | "happy"
  | "sad"
  | "worried"
  | "neutral"
  | "confused"
  | "sleepy"
  | "shocked"
  | "celebrate"
  | "love"
  | "dizzy"
  | "winking"
  | "crying"
  | "searching"
  | "sleeping";

export type FaceEmojiSize = "sm" | "md" | "lg" | "xl";

export type FaceEmojiProps = BoxProps & {
  variant?: FaceEmojiVariant;
  transition?: boolean;
  colorPalette?: string;
  size?: FaceEmojiSize;
};
