// src\design-system\components\emoji\types\emoji.type.ts

// src\design-system\components\emoji\types\emoji.type.ts

import type { CenterProps } from "@/design-system/components/layout/types/center.type";

export type EmojiVariant =
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
  variant?: EmojiVariant;
  colorPalette?: string;
  boxSize?: number;
};

