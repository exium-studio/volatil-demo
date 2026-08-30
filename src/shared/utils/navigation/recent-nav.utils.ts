// src/shared/utils/navigation/recent-nav.utils.ts

import { getStorage, setStorage } from "@/shared/utils/client/client.storage";

const RECENT_NAVS_STORAGE_KEY = "volatil_recent_navs";
const MAX_RECENT_NAVS = 3;

export type RecentNavItem = {
  pathname: string;
  titleKey: string;
  visitedAt: number;
};

export const getRecentNavs = (): RecentNavItem[] => {
  const raw = getStorage(RECENT_NAVS_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
};

export const recordRecentNav = (item: {
  pathname: string;
  titleKey: string;
}): void => {
  if (!item.pathname || item.pathname.includes("/welcome")) return;

  const current = getRecentNavs();
  const filtered = current.filter((nav) => nav.pathname !== item.pathname);
  const updated: RecentNavItem[] = [
    {
      pathname: item.pathname,
      titleKey: item.titleKey,
      visitedAt: Date.now(),
    },
    ...filtered,
  ].slice(0, MAX_RECENT_NAVS);

  setStorage(RECENT_NAVS_STORAGE_KEY, JSON.stringify(updated));
};
