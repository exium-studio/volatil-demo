// src/features/settings/constants/settings.navs.ts

import type { NavItem } from "@/shared/types/nav.type";
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

export const SETTINGS_NAVS_MAP = {
  profile: {
    icon: User,
    titleKey: "settings.profile.title",
    descriptionKey: "settings.profile.description",
  },
  account: {
    icon: UserCircle,
    titleKey: "settings.account.title",
    descriptionKey: "settings.account.description",
  },
  privacy: {
    icon: Lock,
    titleKey: "settings.privacy.title",
    descriptionKey: "settings.privacy.description",
  },
  notification: {
    icon: Bell,
    titleKey: "settings.notification.title",
    descriptionKey: "settings.notification.description",
  },
  appearance: {
    icon: Monitor,
    titleKey: "settings.appearance.title",
    descriptionKey: "settings.appearance.description",
  },
  language: {
    icon: Languages,
    titleKey: "settings.language.title",
    descriptionKey: "settings.language.description",
  },
  datetime: {
    icon: Clock,
    titleKey: "settings.datetime.title",
    descriptionKey: "settings.datetime.description",
  },
  integration: {
    icon: Plug,
    titleKey: "settings.integration.title",
    descriptionKey: "settings.integration.description",
  },
  advanced: {
    icon: SlidersHorizontal,
    titleKey: "settings.advanced.title",
    descriptionKey: "settings.advanced.description",
  },
  support: {
    icon: HelpCircle,
    titleKey: "settings.support.title",
    descriptionKey: "settings.support.description",
  },
  about: {
    icon: Info,
    titleKey: "settings.about.title",
    descriptionKey: "settings.about.description",
  },
} as const satisfies Record<string, NavItem>;
