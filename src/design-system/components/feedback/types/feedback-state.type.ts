// src/design-system/components/feedback/types/feedback-state.type.ts

import type { AppIconProps } from "@/design-system/components/icon/types/app-icon.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ComponentType } from "react";

export type FeedbackStateProps = StackProps & {
  icon?: ComponentType;
  iconProps?: AppIconProps;
  title?: string;
  description?: string;
};

export type NoResultStateProps = FeedbackStateProps & {
  icon?: ComponentType;
  query?: string;
};

export type RetryStateProps = FeedbackStateProps & {
  onRetry?: () => void;
};
