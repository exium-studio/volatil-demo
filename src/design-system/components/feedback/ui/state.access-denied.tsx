// src/design-system/components/feedback/ui/state.access-denied.tsx

"use client";

import type { FeedbackStateProps } from "@/design-system/components/feedback/types/feedback-state.type";
import FeedbackState from "@/design-system/components/feedback/ui/feedback-state";
import { t } from "@/shared/libs/i18n";
import { BanIcon } from "lucide-react";

export const AccessDeniedState = (props: FeedbackStateProps) => {
  // Props
  const {
    icon = BanIcon,
    title = t["common.forbidden"](),
    description = t["common.dont_have_access"](),
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
