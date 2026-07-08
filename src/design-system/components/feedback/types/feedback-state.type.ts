// src/design-system/components/feedback/types/feedback-state.type.ts

import type { StackProps } from "@/design-system/components/layout/types/stack.type";
import type { TablerIcon } from "@tabler/icons-react";

export type FeedbackStateProps = {
  icon?: React.ReactNode;
  tablerIcon?: TablerIcon;
  title?: string;
  description?: string;
} & StackProps;

export type FeedbackNoResultProps = {
  icon?: React.ReactNode;
  tablerIcon?: TablerIcon;
  query?: string;
} & FeedbackStateProps;

export type FeedbackRetryProps = {
  onRetry?: () => void;
} & FeedbackStateProps;
