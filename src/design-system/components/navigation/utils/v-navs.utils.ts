// src/shared/utils/v-navs.ts

import type { NavItem } from "@/shared/types/nav.type";

export function getNavKeyFromPathname<TNavKey extends string>(
  navsMap: Record<TNavKey, NavItem>,
  pathname: string,
): TNavKey | undefined {
  const entries = Object.entries(navsMap) as [TNavKey, NavItem][];

  const found = entries.find(([, item]) => item.pathname === pathname);

  return found?.[0];
}
