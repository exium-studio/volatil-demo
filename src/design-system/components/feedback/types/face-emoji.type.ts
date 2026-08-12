// src/design-system/components/feedback/types/face-emoji.type.ts

export type FaceEmojiVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "question";

export type FaceEmojiProps = {
  variant?: FaceEmojiVariant;
  transition?: boolean;
  colorPalette?: string;
};
