// src/features/settings/pages/profile/profile.settings-page.tsx

"use client";

import { VStack } from "@/design-system/components/layout/ui/flex-box";
import type { ProfileSettingsPageProps } from "@/features/settings/types/settings.type";

export const ProfileSettingsPage = (props: ProfileSettingsPageProps) => {
  // Props
  const { ...restProps } = props;

  return <VStack flex={1} overflowY={"auto"} {...restProps}></VStack>;
};
