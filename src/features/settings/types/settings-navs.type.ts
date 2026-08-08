// src/features/settings/types/settings-navs.type.ts

import type { SETTINGS_NAVS_MAP } from "@/features/settings/constants/settings.navs";

export type SettingsNavKey = keyof typeof SETTINGS_NAVS_MAP;

// Aliases for compatibility
export type SettingNavKey = SettingsNavKey;
