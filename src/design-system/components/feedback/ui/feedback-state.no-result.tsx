// src/design-system/components/feedback/ui/feedback-state.no-result.tsx

"use client";

import type { FeedbackNoResultProps } from "@/design-system/components/feedback/types/feedback-state.type";
import FeedbackState from "@/design-system/components/feedback/ui/feedback-state";
import { P } from "@/design-system/components/typography/ui/p";
import { t } from "@/shared/libs/i18n/-typed";
import { IconMoodPuzzled } from "@tabler/icons-react";

export const FeedbackNoResult = (props: FeedbackNoResultProps) => {
  // Props
  const {
    icon = IconMoodPuzzled,
    title = t["common.no_results_found_for"](),
    query = "...",
    children,
    ...restProps
  } = props;

  return (
    <FeedbackState
      icon={icon}
      title={title}
      {...restProps}
    >
      <P
        textAlign={"center"}
        fontWeight={"semibold"}
        color={"fg.muted"}
        mt={-2}
      >
        {`"${query}"`}
      </P>

      {children}
    </FeedbackState>
  );
};
