// src/features/settings/types/settings-navs.type.ts

import type { SETTINGS_NAVS_MAP } from "@/features/settings/constants/settings.navs";
import type { NavGroupItem } from "@/shared/types/nav.type";

export type SettingNavKey = keyof typeof SETTINGS_NAVS_MAP;

export type SettingsNavGroupItem = NavGroupItem<SettingNavKey>;
