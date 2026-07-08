// src/features/settings/pages/appearance/appearance.settings-page.tsx

"use client";

import type { StackProps } from "@/design-system/components/layout/types/stack.type";
import { VStack } from "@/design-system/components/layout/ui/stack";

interface AppearanceSettingsPageProps extends StackProps {}

export const AppearanceSettingsPage = (props: AppearanceSettingsPageProps) => {
  // Props
  const { ...restProps } = props;

  return <VStack {...restProps}>Appearance Settings Page</VStack>;
};
