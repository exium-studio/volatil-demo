import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { NavItem, NavNode } from "@/shared/types/nav.type";

export type HNavsProps<TNavKey extends string = string> = StackProps & {
  navs: Record<TNavKey, NavItem>;
  navKeys?: TNavKey[];
  items?: NavNode<TNavKey>[];
  activeKey?: TNavKey | null;
  onNavClick?: (key: TNavKey) => void;
};
