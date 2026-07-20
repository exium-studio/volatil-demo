// src/shared/types/nav.type.ts

import type { ParameterlessTranslationKey } from "@/shared/libs/i18n/translation.type";
import type { ComponentType } from "react";

export type NavItem = {
  icon?: ComponentType;
  titleKey: ParameterlessTranslationKey;
  descriptionKey?: ParameterlessTranslationKey;
  keywords?: string[];
};

export type NavNode<TNavKey extends string = string> = {
  key: TNavKey;
  children?: NavNode<TNavKey>[];
};

export type NavGroup<TNavKey extends string = string> = {
  titleKey: ParameterlessTranslationKey;
  items: NavNode<TNavKey>[];
};
