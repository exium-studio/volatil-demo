// src/features/settings/constants/settings.pages.ts

import { AppearanceSettingsPage } from "@/features/settings/pages/appearance/appearance.settings-page";
import { ProfileSettingsPage } from "@/features/settings/pages/profile/profile.settings-page";
import type { SettingNavKey } from "@/features/settings/types/settings-navs.type";
import type { ComponentType } from "react";

export const SETTINGS_PAGES = {
  profile: ProfileSettingsPage,
  account: ProfileSettingsPage,
  privacy: ProfileSettingsPage,
  notification: ProfileSettingsPage,
  appearance: AppearanceSettingsPage,
  language: ProfileSettingsPage,
  datetime: ProfileSettingsPage,
  integration: ProfileSettingsPage,
  advanced: ProfileSettingsPage,
  support: ProfileSettingsPage,
  about: ProfileSettingsPage,
} as const satisfies Record<SettingNavKey, ComponentType>;
