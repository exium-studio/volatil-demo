// src/features/settings/hooks/use-settings-search-index.ts

import { SETTINGS_NAVS_MAP } from "@/features/settings/constants/settings.navs";
import { t } from "@/shared/libs/i18n";
import type { SearchIndex } from "@/design-system/types/search.type";
import type { SettingNavKey } from "@/features/settings/types/settings-navs.type";
import { useMemo } from "react";
import type { NavItem } from "@/shared/types/nav.type";

export type SettingsNavSearchData = {
  navKey: SettingNavKey;
};

export function useSettingsSearchIndex(): SearchIndex<SettingsNavSearchData> {
  return useMemo(
    () =>
      (Object.entries(SETTINGS_NAVS_MAP) as [SettingNavKey, NavItem][]).map(
        ([navKey, nav]) => ({
          id: navKey,
          title: nav.titleKey
            ? t[nav.titleKey as keyof typeof t]({} as never)
            : navKey,
          description: nav.descriptionKey
            ? t[nav.descriptionKey as keyof typeof t]({} as never)
            : "",
          keywords: nav.keywords,
          data: { navKey },
        }),
      ),
    [],
  );
}
