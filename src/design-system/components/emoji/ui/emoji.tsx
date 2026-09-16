// src/design-system/components/emoji/ui/emoji.tsx

import type {
  EmojiKey,
  EmojiProps,
} from "@/design-system/components/emoji/types/emoji.type";
import type { ComponentType } from "react";
import { EmojiAngry } from "@/design-system/components/emoji/ui/emoji.angry";
import { EmojiCool } from "@/design-system/components/emoji/ui/emoji.cool";
import { EmojiCry } from "@/design-system/components/emoji/ui/emoji.cry";
import { EmojiEmbarassed } from "@/design-system/components/emoji/ui/emoji.embarassed";
import { EmojiFunny } from "@/design-system/components/emoji/ui/emoji.funny";
import { EmojiHappy } from "@/design-system/components/emoji/ui/emoji.happy";
import { EmojiLaugh } from "@/design-system/components/emoji/ui/emoji.laugh";
import { EmojiLove } from "@/design-system/components/emoji/ui/emoji.love";
import { EmojiPoker } from "@/design-system/components/emoji/ui/emoji.poker";
import { EmojiRollingEyes } from "@/design-system/components/emoji/ui/emoji.rolling-eyes";
import { EmojiSad } from "@/design-system/components/emoji/ui/emoji.sad";
import { EmojiScream } from "@/design-system/components/emoji/ui/emoji.scream";
import { EmojiShout } from "@/design-system/components/emoji/ui/emoji.shout";
import { EmojiSpeechless } from "@/design-system/components/emoji/ui/emoji.speechless";
import { EmojiSulk } from "@/design-system/components/emoji/ui/emoji.sulk";
import { EmojiSurprised } from "@/design-system/components/emoji/ui/emoji.surprised";
import { EmojiThinking } from "@/design-system/components/emoji/ui/emoji.thinking";
import { EmojiThumbUp } from "@/design-system/components/emoji/ui/emoji.thumb-up";
import { EmojiWicked } from "@/design-system/components/emoji/ui/emoji.wicked";

// Constants
const EMOJI_COMPONENTS: Record<EmojiKey, ComponentType<EmojiProps>> = {
  poker: EmojiPoker,
  angry: EmojiAngry,
  cool: EmojiCool,
  cry: EmojiCry,
  embarassed: EmojiEmbarassed,
  funny: EmojiFunny,
  happy: EmojiHappy,
  laugh: EmojiLaugh,
  love: EmojiLove,
  rollingEyes: EmojiRollingEyes,
  sad: EmojiSad,
  scream: EmojiScream,
  shout: EmojiShout,
  speechless: EmojiSpeechless,
  sulk: EmojiSulk,
  surprised: EmojiSurprised,
  thinking: EmojiThinking,
  wicked: EmojiWicked,
  thumbUp: EmojiThumbUp,
};

export const Emoji = (props: EmojiProps) => {
  // Props
  const { emojiKey = "poker", colorPalette = "neutral", ...restProps } = props;

  // Derived Values
  const SelectedEmoji = EMOJI_COMPONENTS[emojiKey] ?? EmojiPoker;

  return <SelectedEmoji colorPalette={colorPalette} {...restProps} />;
};
