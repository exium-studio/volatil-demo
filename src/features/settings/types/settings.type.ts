// src/features/settings/types/settings.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { SettingNavKey } from "@/features/settings/types/settings-navs.type";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export type SettingsActivePageContextValue = {
  activeSettingNavKey: SettingNavKey | undefined;
  setActiveSettingNavKey: Dispatch<SetStateAction<SettingNavKey | undefined>>;
};

export type SettingsSearchTriggerProps = {
  children: ReactNode;
  modalKey: string;
  queryKey: string;
};

export type SettingsNavSearchData = {
  navKey: SettingNavKey;
};

export type AppearanceSettingsPageProps = StackProps;

export type ProfileSettingsPageProps = StackProps;
