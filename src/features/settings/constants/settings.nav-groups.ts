// src/features/settings/constants/settings.nav-groups.ts

import type { SettingNavKey } from "@/features/settings/types/settings-navs.type";
import type { NavGroup } from "@/shared/types/nav.type";

export const SETTINGS_NAV_GROUPS: NavGroup<SettingNavKey>[] = [
  {
    titleKey: "settings.group.account.title",
    items: [
      { key: "profile" },
      { key: "account" },
      { key: "privacy" },
      { key: "notification" },
    ],
  },

  {
    titleKey: "settings.group.preferences.title",
    items: [{ key: "appearance" }, { key: "language" }, { key: "datetime" }],
  },

  {
    titleKey: "settings.group.system.title",
    items: [{ key: "integration" }, { key: "advanced" }],
  },

  {
    titleKey: "settings.group.help.title",
    items: [{ key: "support" }, { key: "about" }],
  },
];
