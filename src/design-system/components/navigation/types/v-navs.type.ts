// src/design-system/components/navigation/types/vnavs.type.ts

import type { VScrollContainerProps } from "@/design-system/components/layout/types/scroll-container.type";
import type { NavGroup, NavItem, NavNode } from "@/shared/types/nav.type";

export type VNavsProps<TNavKey extends string = string> = Omit<
  VScrollContainerProps,
  "children"
> & {
  groups: NavGroup<TNavKey>[];
  navs: Record<TNavKey, NavItem>;
  activeKey?: TNavKey;
  defaultActiveKey?: TNavKey;
  expanded?: boolean;
  onNavClick?: (key: TNavKey) => void;
};

export type VNavNodeProps<TNavKey extends string> = {
  node: NavNode<TNavKey>;
  navs: Record<TNavKey, NavItem>;
  activeKey?: TNavKey;
  expanded: boolean;
  onNavClick?: (key: TNavKey) => void;
  depth?: number;
};
