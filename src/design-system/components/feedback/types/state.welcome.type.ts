// src/design-system/components/feedback/types/state.welcome.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type WelcomeStateProps = StackProps & {
  title?: string;
  subtitle?: string;
};
