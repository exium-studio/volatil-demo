// src/shared/types/nav.type.ts

import type { ParameterlessTranslationKey } from "@/shared/libs/i18n/translation.type";
import type { ComponentType } from "react";

export type NavItem = {
  icon?: ComponentType;
  titleKey: ParameterlessTranslationKey;
  descriptionKey?: ParameterlessTranslationKey;
  keywords?: string[];
};

export type NavGroupItem<TNavKey extends string = string> = {
  titleKey: ParameterlessTranslationKey;
  list: TNavKey[];
};
