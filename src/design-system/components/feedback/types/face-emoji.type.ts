// src/design-system/components/feedback/types/face-emoji.type.ts

import type { BoxProps } from "@/design-system/components/layout/types/box.type";

export type FaceEmojiVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "question";

export type FaceEmojiProps = BoxProps & {
  variant?: FaceEmojiVariant;
  transition?: boolean;
  colorPalette?: string;
};
