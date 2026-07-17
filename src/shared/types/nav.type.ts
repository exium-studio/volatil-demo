// src/shared/types/nav.type.ts

import type { ComponentType } from "react";

export type NavItem<
  TTitleKey extends string = string,
  TDescriptionKey extends string = string,
> = {
  icon?: ComponentType;
  titleKey: TTitleKey;
  descriptionKey?: TDescriptionKey;
  keywords?: string[];
};

export type NavGroupItem<
  TNavKey extends string = string,
  TTitleKey extends string = string,
> = {
  titleKey?: TTitleKey;
  list: TNavKey[];
};
