import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type WelcomeStateProps = StackProps & {
  title?: string;
  subtitle?: string;
  badgeLabel?: string;
};
