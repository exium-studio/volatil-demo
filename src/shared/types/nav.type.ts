// src/shared/types/nav.type.ts

import type { NavLinkProps } from "@/design-system/components/navigation/types/link.type";
import type { ParameterlessTranslationKey } from "@/shared/libs/i18n/translation.type";
import type { ComponentType } from "react";

export type NavItem = {
  icon?: ComponentType;
  title?: string;
  titleKey?: ParameterlessTranslationKey;
  descriptionKey?: ParameterlessTranslationKey;
  keywords?: string[];
  pathname?: NavLinkProps["to"];
};

export type NavNode<TNavKey extends string = string> = {
  key: TNavKey;
  children?: NavNode<TNavKey>[];
};

export type NavGroup<TNavKey extends string = string> = {
  title?: string;
  titleKey?: ParameterlessTranslationKey;
  items: NavNode<TNavKey>[];
};
