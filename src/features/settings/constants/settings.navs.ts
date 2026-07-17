// src/features/settings/constants/settings.navs.ts

import type { SettingNav } from "@/features/settings/types/settings-navs.type";
import {
  Bell,
  Clock,
  HelpCircle,
  Info,
  Languages,
  Lock,
  Monitor,
  Plug,
  SlidersHorizontal,
  User,
  UserCircle,
} from "lucide-react";

export const SETTINGS_NAVS = {
  profile: {
    titleKey: "settings.profile.title",
    descriptionKey: "settings.profile.description",
    icon: User,
  },
  account: {
    titleKey: "settings.account.title",
    descriptionKey: "settings.account.description",
    icon: UserCircle,
  },
  privacy: {
    titleKey: "settings.privacy.title",
    descriptionKey: "settings.privacy.description",
    icon: Lock,
  },
  notification: {
    titleKey: "settings.notification.title",
    descriptionKey: "settings.notification.description",
    icon: Bell,
  },
  appearance: {
    titleKey: "settings.appearance.title",
    descriptionKey: "settings.appearance.description",
    icon: Monitor,
  },
  language: {
    titleKey: "settings.language.title",
    descriptionKey: "settings.language.description",
    icon: Languages,
  },
  datetime: {
    titleKey: "settings.datetime.title",
    descriptionKey: "settings.datetime.description",
    icon: Clock,
  },
  integration: {
    titleKey: "settings.integration.title",
    descriptionKey: "settings.integration.description",
    icon: Plug,
  },
  advanced: {
    titleKey: "settings.advanced.title",
    descriptionKey: "settings.advanced.description",
    icon: SlidersHorizontal,
  },
  support: {
    titleKey: "settings.support.title",
    descriptionKey: "settings.support.description",
    icon: HelpCircle,
  },
  about: {
    titleKey: "settings.about.title",
    descriptionKey: "settings.about.description",
    icon: Info,
  },
} satisfies Record<string, SettingNav>;
