import type { EmojiProps } from "@/design-system/components/emoji/types/emoji.type";
import type { ReactNode } from "react";
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
import { EmojiThingking } from "@/design-system/components/emoji/ui/emoji.thinking";
import { EmojiWicked } from "@/design-system/components/emoji/ui/emoji.wicked";
import { EmojiThumbUp } from "@/design-system/components/emoji/ui/emoji.thumb-up";

export const Emoji = (props: EmojiProps) => {
  // Props
  const { emojiKey = "poker", ...restProps } = props;

  const emojis: Record<string, ReactNode> = {
    poker: <EmojiPoker {...restProps} />,
    angry: <EmojiAngry {...restProps} />,
    cool: <EmojiCool {...restProps} />,
    cry: <EmojiCry {...restProps} />,
    embarassed: <EmojiEmbarassed {...restProps} />,
    funny: <EmojiFunny {...restProps} />,
    happy: <EmojiHappy {...restProps} />,
    laugh: <EmojiLaugh {...restProps} />,
    love: <EmojiLove {...restProps} />,
    rollingEyes: <EmojiRollingEyes {...restProps} />,
    sad: <EmojiSad {...restProps} />,
    scream: <EmojiScream {...restProps} />,
    shout: <EmojiShout {...restProps} />,
    speechless: <EmojiSpeechless {...restProps} />,
    sulk: <EmojiSulk {...restProps} />,
    surprised: <EmojiSurprised {...restProps} />,
    thinking: <EmojiThingking {...restProps} />,
    wicked: <EmojiWicked {...restProps} />,
    thumbUp: <EmojiThumbUp {...restProps} />,
  };

  return emojis[emojiKey];
};
