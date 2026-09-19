// src/design-system/components/feedback/ui/state.no-result.tsx

"use client";

import type { NoResultStateProps } from "@/design-system/components/feedback/types/feedback-state.type";
import FeedbackState from "@/design-system/components/feedback/ui/feedback-state";
import { P } from "@/design-system/components/typography/ui/p";
import { t } from "@/shared/libs/i18n";
import { IconMoodPuzzled } from "@tabler/icons-react";

export const NoResultState = (props: NoResultStateProps) => {
  // Props
  const {
    icon = IconMoodPuzzled,
    title = t["common.no_results_found_for"](),
    query = "...",
    children,
    ...restProps
  } = props;

  return (
    <FeedbackState icon={icon} title={title} {...restProps}>
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
