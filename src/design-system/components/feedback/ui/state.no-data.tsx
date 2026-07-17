// src/design-system/components/feedback/ui/state.no-data.tsx

"use client";

import type { FeedbackStateProps } from "@/design-system/components/feedback/types/feedback-state.type";
import FeedbackState from "@/design-system/components/feedback/ui/feedback-state";
import { t } from "@/shared/libs/i18n";
import { WindIcon } from "lucide-react";

export const NoDataState = (props: FeedbackStateProps) => {
  // Props
  const {
    icon = WindIcon,
    title = t["common.no_data"](),
    description,
    children,
    ...restProps
  } = props;

  return (
    <FeedbackState
      icon={icon}
      title={title}
      description={description}
      {...restProps}
    >
      {children}
    </FeedbackState>
  );
};
