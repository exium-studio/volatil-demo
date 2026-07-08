// src/design-system/components/feedback/ui/feedback-state.no-data.tsx

"use client";

import type { FeedbackStateProps } from "@/design-system/components/feedback/types/feedback-state.type";
import FeedbackState from "@/design-system/components/feedback/ui/feedback-state";
import { t } from "@/shared/libs/i18n/-typed";
import { IconHourglassEmpty } from "@tabler/icons-react";

export const FeedbackNoData = (props: FeedbackStateProps) => {
  // Props
  const {
    icon,
    tablerIcon = IconHourglassEmpty,
    title = t["common.no_data"](),
    description,
    children,
    ...restProps
  } = props;

  return (
    <FeedbackState
      icon={icon}
      tablerIcon={tablerIcon}
      title={title}
      description={description}
      {...restProps}
    >
      {children}
    </FeedbackState>
  );
};
