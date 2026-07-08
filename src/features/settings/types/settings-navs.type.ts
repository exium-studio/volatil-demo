// src/features/settings/types/settings-navs.type.ts

import type { SETTINGS_NAVS } from "@/features/settings/constants/settings.navs";
import type { TranslationKey } from "@/shared/libs/i18n/type";
import type { TablerIcon } from "@tabler/icons-react";

export type SettingNavKey = keyof typeof SETTINGS_NAVS;

export type GroupTitleKey = Extract<
  TranslationKey,
  `settings.group.${string}.title`
>;

export type TitleKey = Extract<TranslationKey, `settings.${string}.title`>;

export type DescriptionKey = Extract<
  TranslationKey,
  `settings.${string}.description`
>;

export type SettingNav = {
  icon?: TablerIcon;
  titleKey?: TitleKey;
  descriptionKey?: DescriptionKey;
  keywords?: string[];
};

export type SettingsNavGroupItem = {
  titleKey?: GroupTitleKey;
  list: SettingNavKey[];
};
