// src\design-system\components\navigation\types\v-navs.type.ts

import type { AppIconProps } from "@/design-system/components/icon/types/app-icon.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { NavGroup, NavItem, NavNode } from "@/shared/types/nav.type";

export type VNavsProps<TNavKey extends string = string> = StackProps & {
  groups: NavGroup<TNavKey>[];
  navs: Record<TNavKey, NavItem>;
  activeKey?: TNavKey;
  expanded?: boolean;
  onNavClick?: (key: TNavKey) => void;
};

export type VNavNodeProps<TNavKey extends string> = {
  node: NavNode<TNavKey>;
  navs: Record<TNavKey, NavItem>;
  activeKey?: TNavKey;
  activePathKeys: Set<TNavKey>;
  expanded: boolean;
  onNavClick?: (key: TNavKey) => void;
  depth?: number;
};

export type VNavIconProps = AppIconProps & {
  nav: NavItem;
};
