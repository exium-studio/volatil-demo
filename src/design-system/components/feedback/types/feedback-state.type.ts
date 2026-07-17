// src/design-system/components/feedback/types/feedback-state.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ComponentType } from "react";

export type FeedbackStateProps = StackProps & {
  icon?: ComponentType;
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

export type FeedbackNoResultProps = NoResultStateProps;
export type FeedbackRetryProps = RetryStateProps;
