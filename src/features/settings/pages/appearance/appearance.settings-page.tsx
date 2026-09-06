// src/features/settings/pages/appearance/appearance.settings-page.tsx

"use client";

import { VStack } from "@/design-system/components/layout/ui/flex-box";
import type { AppearanceSettingsPageProps } from "@/features/settings/types/settings.type";

export const AppearanceSettingsPage = (props: AppearanceSettingsPageProps) => {
  // Props
  const { ...restProps } = props;

  return <VStack {...restProps}>Appearance Settings Page</VStack>;
};
