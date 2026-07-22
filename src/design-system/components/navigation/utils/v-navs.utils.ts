// src/design-system/components/navigation/utils/v-navs.utils.ts

import type { NavItem, NavNode } from "@/shared/types/nav.type";

export function findActivePath<TNavKey extends string>(
  nodes: NavNode<TNavKey>[],
  activeKey: TNavKey | undefined,
): TNavKey[] | null {
  if (!activeKey) return null;

  for (const node of nodes) {
    if (node.key === activeKey) return [node.key];

    if (node.children) {
      const childPath = findActivePath(node.children, activeKey);
      if (childPath) return [node.key, ...childPath];
    }
  }

  return null;
}

export function getNavKeyFromPathname<TNavKey extends string>(
  navsMap: Record<TNavKey, NavItem>,
  pathname: string,
): TNavKey | undefined {
  const entries = Object.entries(navsMap) as [TNavKey, NavItem][];

  const found = entries.find(([, item]) => item.pathname === pathname);

  return found?.[0];
}
