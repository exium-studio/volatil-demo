// src/design-system/components/shell/types/app-nav-title.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { NavItem } from "@/shared/types/nav.type";

export type AppNavTitleProps = StackProps & {
  navsMap: Record<string, NavItem>;
};
