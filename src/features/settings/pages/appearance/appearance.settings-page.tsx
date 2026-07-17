// src/features/settings/pages/appearance/appearance.settings-page.tsx

"use client";

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";

interface AppearanceSettingsPageProps extends StackProps {}

export const AppearanceSettingsPage = (props: AppearanceSettingsPageProps) => {
  // Props
  const { ...restProps } = props;

  return <VStack {...restProps}>Appearance Settings Page</VStack>;
};
