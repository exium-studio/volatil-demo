// src/features/settings/types/settings-navs.type.ts

import type { SETTINGS_NAVS_MAP } from "@/features/settings/constants/settings.navs";
import type { TranslationKey } from "@/shared/libs/i18n/type";
import type { NavGroupItem, NavItem } from "@/shared/types/nav.type";

export type GroupTitleKey = Extract<
  TranslationKey,
  `settings.group.${string}.title`
>;

export type TitleKey = Extract<TranslationKey, `settings.${string}.title`>;

export type DescriptionKey = Extract<
  TranslationKey,
  `settings.${string}.description`
>;

export type SettingNavKey = keyof typeof SETTINGS_NAVS_MAP;
export type SettingNav = NavItem<TitleKey, DescriptionKey>;
export type SettingsNavGroupItem = NavGroupItem<SettingNavKey, GroupTitleKey>;
