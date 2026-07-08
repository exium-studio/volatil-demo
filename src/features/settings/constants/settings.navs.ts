// src/features/settings/constants/settings.navs.ts

import type { SettingNav } from "@/features/settings/types/settings-navs.type";
import {
  IconAdjustmentsHorizontal,
  IconBell,
  IconClock,
  IconDeviceDesktop,
  IconHelpCircle,
  IconInfoCircle,
  IconLanguage,
  IconLock,
  IconPlug,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";

export const SETTINGS_NAVS = {
  profile: {
    titleKey: "settings.profile.title",
    descriptionKey: "settings.profile.description",
    icon: IconUser,
  },
  account: {
    titleKey: "settings.account.title",
    descriptionKey: "settings.account.description",
    icon: IconUserCircle,
  },
  privacy: {
    titleKey: "settings.privacy.title",
    descriptionKey: "settings.privacy.description",
    icon: IconLock,
  },
  notification: {
    titleKey: "settings.notification.title",
    descriptionKey: "settings.notification.description",
    icon: IconBell,
  },
  appearance: {
    titleKey: "settings.appearance.title",
    descriptionKey: "settings.appearance.description",
    icon: IconDeviceDesktop,
  },
  language: {
    titleKey: "settings.language.title",
    descriptionKey: "settings.language.description",
    icon: IconLanguage,
  },
  datetime: {
    titleKey: "settings.datetime.title",
    descriptionKey: "settings.datetime.description",
    icon: IconClock,
  },
  integration: {
    titleKey: "settings.integration.title",
    descriptionKey: "settings.integration.description",
    icon: IconPlug,
  },
  advanced: {
    titleKey: "settings.advanced.title",
    descriptionKey: "settings.advanced.description",
    icon: IconAdjustmentsHorizontal,
  },
  support: {
    titleKey: "settings.support.title",
    descriptionKey: "settings.support.description",
    icon: IconHelpCircle,
  },
  about: {
    titleKey: "settings.about.title",
    descriptionKey: "settings.about.description",
    icon: IconInfoCircle,
  },
} satisfies Record<string, SettingNav>;
