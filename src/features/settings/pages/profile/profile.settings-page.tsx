// src/features/settings/pages/profile/profile.settings-page.tsx

"use client";

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";

interface ProfileSettingsPageProps extends StackProps {}

export const ProfileSettingsPage = (props: ProfileSettingsPageProps) => {
  // Props
  const { ...restProps } = props;

  return <VStack flex={1} overflowY={"auto"} {...restProps}></VStack>;
};
