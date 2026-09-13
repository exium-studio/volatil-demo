// src/design-system/components/feedback/types/face-emoji.type.ts

import type { BoxProps } from "@/design-system/components/layout/types/box.type";

export type FaceEmojiVariant =
  // Exact 23 variants from reference sheet
  | "smile"
  | "happy"
  | "angry"
  | "cry"
  | "embarrassed"
  | "surprised"
  | "wronged"
  | "shout"
  | "flushed"
  | "yummy"
  | "complacent"
  | "drool"
  | "scream"
  | "weep"
  | "speechless"
  | "funnyface"
  | "laughwithtears"
  | "wicked"
  | "facewithrollingeyes"
  | "sulk"
  | "thinking"
  | "lovely"
  | "greedy";

/* Commented out previous variants:
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
  | "sleeping"
*/

export type FaceEmojiSize = "sm" | "md" | "lg" | "xl";

import type { ReactNode } from "react";

export type FaceEmojiConfig = {
  defaultColor: string;
  colorPaletteFallback: string;
  renderFace: (c: string) => ReactNode;
  renderAccessory?: (c: string) => ReactNode;
};

export type FaceEmojiProps = BoxProps & {
  variant?: FaceEmojiVariant;
  transition?: boolean;
  colorPalette?: string;
  size?: FaceEmojiSize;
};
